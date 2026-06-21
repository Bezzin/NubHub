// Clay asset generator — uses Gemini image models via REST.
// Reads GEMINI_API_KEY from .env.local internally; never prints the key.
// Usage: node scripts/genclay.mjs [jobsFile]   (default: _gen/jobs.json)
// Each job: { out, prompt, in?(input image for img2img), model? }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '..');

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const t = fs.readFileSync(path.join(APP_DIR, '.env.local'), 'utf8');
    const m = t.match(/^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
  return null;
}

const KEY = loadKey();
if (!KEY) { console.error('ERROR: no GEMINI_API_KEY found'); process.exit(1); }

const MODELS = (process.env.GENCLAY_MODELS ||
  'gemini-2.5-flash-image,gemini-2.5-flash-image-preview,gemini-2.0-flash-preview-image-generation'
).split(',').map((s) => s.trim()).filter(Boolean);

const jobsPath = process.argv[2] || path.join(APP_DIR, '_gen', 'jobs.json');
const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

function pngColorType(buf) {
  // PNG signature(8) + IHDR length(4)+type(4)+ width(4)+height(4)+bitdepth(1)+colortype(1)
  if (buf.length > 25 && buf[0] === 0x89 && buf[1] === 0x50) return buf[25];
  return -1;
}

async function genOne(job) {
  const parts = [{ text: job.prompt }];
  if (job.in) {
    const abs = path.resolve(APP_DIR, job.in);
    const b64 = fs.readFileSync(abs).toString('base64');
    const mime = abs.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    parts.push({ inlineData: { mimeType: mime, data: b64 } });
  }
  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };
  const models = job.model ? [job.model] : MODELS;
  let lastErr = '';
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) { lastErr = `fetch failed: ${e.message}`; continue; }
    const txt = await res.text();
    if (!res.ok) { lastErr = `${model} HTTP ${res.status}: ${txt.slice(0, 240)}`; continue; }
    let json;
    try { json = JSON.parse(txt); } catch { lastErr = `${model}: non-JSON response`; continue; }
    const cand = json?.candidates?.[0];
    const part = cand?.content?.parts?.find((p) => p.inlineData?.data || p.inline_data?.data);
    const data = part?.inlineData?.data || part?.inline_data?.data;
    if (!data) {
      lastErr = `${model}: no image. finish=${cand?.finishReason} parts=${JSON.stringify(cand?.content?.parts?.map((p) => Object.keys(p)) || [])}`;
      continue;
    }
    const outAbs = path.resolve(APP_DIR, job.out);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(outAbs, buf);
    return { ok: true, model, out: job.out, bytes: buf.length, colorType: pngColorType(buf) };
  }
  return { ok: false, out: job.out, error: lastErr };
}

for (const job of jobs) {
  const r = await genOne(job);
  if (r.ok) console.log(`ok   ${r.out}  (${r.model}, ${r.bytes}b, pngColorType=${r.colorType}${r.colorType === 6 ? ' RGBA' : ''})`);
  else console.log(`FAIL ${r.out}  ${r.error}`);
}
