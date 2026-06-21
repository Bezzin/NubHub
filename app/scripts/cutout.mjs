// Remove a near-white background from generated clay images -> transparent RGBA PNG.
// Edge flood-fill so interior white highlights are preserved. Then crop to content.
// Usage: node scripts/cutout.mjs <inDir> <outDir> [tolerance]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jimp } from 'jimp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '..');

const inDir = path.resolve(APP_DIR, process.argv[2] || '_gen/raw');
const outDir = path.resolve(APP_DIR, process.argv[3] || '_gen/cut');
const TOL = Number(process.argv[4] || 38); // euclidean tolerance to the key color
// key color (background to remove): default white; pass r g b to override (e.g. 0 177 64 for green)
const KEY = [
  Number(process.argv[5] ?? 255),
  Number(process.argv[6] ?? 255),
  Number(process.argv[7] ?? 255),
];

fs.mkdirSync(outDir, { recursive: true });

async function cutFile(file) {
  const img = await Jimp.read(path.join(inDir, file));
  const { width: w, height: h, data } = img.bitmap;
  const idx = (x, y) => (y * w + x) * 4;
  // Auto-detect background color from the image corners (robust for white OR green screens).
  // Manual override: pass r g b args.
  const manual = process.argv[5] !== undefined;
  const cornerKey = (() => {
    const pts = [];
    const S = 8;
    for (const [cx, cy] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) {
      for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
        const x = Math.min(w - 1, Math.max(0, cx === 0 ? dx : cx - dx));
        const y = Math.min(h - 1, Math.max(0, cy === 0 ? dy : cy - dy));
        const i = idx(x, y); pts.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
    return [0, 1, 2].map((k) => Math.round(pts.reduce((s, p) => s + p[k], 0) / pts.length));
  })();
  const KEYC = manual ? KEY : cornerKey;
  const distKey = (i) => {
    const dr = KEYC[0] - data[i], dg = KEYC[1] - data[i + 1], db = KEYC[2] - data[i + 2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };
  const isBg = (x, y) => distKey(idx(x, y)) <= TOL;

  const visited = new Uint8Array(w * h);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isBg(x, y)) stack.push(p);
  };
  // seed from all border pixels
  for (let x = 0; x < w; x++) { pushIf(x, 0); pushIf(x, h - 1); }
  for (let y = 0; y < h; y++) { pushIf(0, y); pushIf(w - 1, y); }

  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p - x) / w;
    data[idx(x, y) + 3] = 0; // transparent
    pushIf(x + 1, y); pushIf(x - 1, y); pushIf(x, y + 1); pushIf(x, y - 1);
  }

  // light feather: soften alpha on kept pixels that are near-white and touch a transparent pixel
  const transparentNeighbor = (x, y) => (
    (x > 0 && data[idx(x - 1, y) + 3] === 0) ||
    (x < w - 1 && data[idx(x + 1, y) + 3] === 0) ||
    (y > 0 && data[idx(x, y - 1) + 3] === 0) ||
    (y < h - 1 && data[idx(x, y + 1) + 3] === 0)
  );
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y);
      if (data[i + 3] === 0) continue;
      if (transparentNeighbor(x, y)) {
        const dist = distKey(i);
        if (dist < TOL * 2) data[i + 3] = Math.min(data[i + 3], Math.round((dist / (TOL * 2)) * 255));
      }
    }
  }

  // crop to non-transparent bounding box (with small padding)
  let minX = w, minY = h, maxX = 0, maxY = 0, any = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[idx(x, y) + 3] > 8) {
        any = true;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (any) {
    const pad = 6;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
    img.crop({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
  }

  const outPath = path.join(outDir, file.replace(/\.[^.]+$/, '.png'));
  await img.write(outPath);
  const a = img.bitmap;
  return `${file} -> ${path.basename(outPath)} (${a.width}x${a.height})`;
}

const files = fs.readdirSync(inDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
for (const f of files) {
  try { console.log('cut  ' + (await cutFile(f))); }
  catch (e) { console.log(`FAIL ${f}: ${e.message}`); }
}
