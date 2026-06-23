# NubHub — SEO & AIO Authority Plan
**Goal:** Become *the* authority for nub theory / early gender prediction and grow organic clicks + average position as fast as possible.
**Prepared:** 22 June 2026 · Domain: `https://www.nubhub.baby`

---

## 1. Where we are starting (the honest baseline)

- **Google Search Console (checked 22 Jun 2026):** the `sc-domain:nubhub.baby` property is verified but every report says *"Processing data, check again in a day or so."* **No impressions, clicks, or indexed-page data yet.** This is a true greenfield — there is no historical query data to optimise; the entire opportunity is to build presence from zero.
- **March 2026 audit confirmed** zero indexed pages, a canonical pointing at the wrong domain (since fixed), and effectively no content. The homepage on-page basics were decent.
- **Since March, fixed already:** canonical now `https://www.nubhub.baby`; `robots.ts` and `sitemap.ts` exist; metadata `robots: index,follow`.
- **Was still broken (fixed in this work):** Google Analytics shipped a literal `GA_MEASUREMENT_ID` placeholder (broken request, no tracking); no structured data anywhere; the `/blog` page was a non-functional placeholder (6 fake cards, no article pages) using a different design system; homepage `<h1>` ("Just upload. that's it.") carried no keyword.

### Strategic thesis
Two research findings shape everything:
1. **AI Overviews / answer engines cite E-E-A-T authority + study-backed pages, not sales pages.** Across nub-theory queries, Google's AI Overview pulls from Healthline, TheBump, MadeForMums, NHS, WebMD and PubMed — *not* from the commercial tools (TheGenderExperts, SneakPeek, the app-store AI tools). **To win citations we must be the most trustworthy, best-structured, study-cited answer — and then convert that authority into our product.**
2. **Only ~38% of AI-Overview-cited pages rank in the top 10.** A small site can be cited by being the cleanest extractable answer. That is the wedge.

So the plan is: **authoritative, honest, study-cited educational content** (to earn rankings + AI citations) → **a tight topic cluster with strong internal links** (to build topical authority) → **a clear product path** (AI + specialist nub reading) on every page.

---

## 2. Keyword & topic-cluster map

**Pillar (hub):** `/nub-theory` — "What is nub theory?" targets the head term and links to every supporting page.

**Supporting cluster (spokes):**
| Page | Path | Primary intent | Key targets |
|------|------|----------------|-------------|
| Accuracy hub | `/blog/nub-theory-accuracy` | Informational/commercial | nub theory accuracy, is nub theory reliable, accuracy by week |
| Boy vs girl | `/blog/nub-theory-boy-vs-girl` | High-intent informational | nub theory boy vs girl, stacking, girl/boy nub angle |
| How to read your scan | `/blog/how-to-read-12-week-scan` | Top-of-funnel | how to read 12 week scan, find the nub |
| Methods compared | `/blog/nub-theory-vs-ramzi-vs-skull` | Comparison | nub vs ramzi vs skull, most accurate method |
| Can you tell at 12 weeks | `/blog/can-you-tell-gender-at-12-weeks` | High-volume bridge | can you tell gender at 12 weeks, 12 week scan gender |
| AI gender prediction hub | `/how-our-ai-works` | Commercial/whitespace | AI gender prediction ultrasound, AI nub theory |
| FAQ magnet | `/faq` | Long-tail / PAA | 28 question-keywords + FAQPage schema |

**Two whitespace territories competitors have ceded (highest opportunity):**
- **Editorial authority on *AI* gender prediction.** That SERP is wall-to-wall thin app-store listings with no real explainer. NubHub is itself an AI tool, so it can own both the answer *and* the product. → `/how-our-ai-works` is written to own this.
- **A curated, labelled "confirmed examples" gallery.** `nub theory examples` is dominated by scattered UGC (Facebook, Pinterest, Mumsnet) — no authority owns a clean annotated gallery. → **Phase 2** (needs real, consented annotated images).

**Two structural wins no top competitor uses:** data **tables** and **FAQPage schema**. Both are implemented across the new content.

---

## 3. What shipped in this build (Phase 1)

**Technical foundation**
- `lib/site.ts` — single source of truth for brand facts, price, URLs, author/reviewer.
- `lib/schema.ts` + `components/seo/JsonLd.tsx` — server-rendered JSON-LD: **Organization + WebSite** sitewide; **Product/Offer** on the homepage; **Article + BreadcrumbList + FAQPage** on every article. (Deliberately **no fabricated AggregateRating** — see risks.)
- `layout.tsx` — added `metadataBase`; **GA now env-gated** via `NEXT_PUBLIC_GA_ID` (set it to your real `G-XXXX` id to enable tracking; the broken placeholder is gone); sitewide JSON-LD injected.
- Homepage — keyword-bearing `<h1>` (accessible hidden "Baby gender prediction at 12 weeks" prefix, clay hero preserved); Product schema.
- `robots.ts` — welcomes AI answer-engine crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot, etc.) and Googlebot; blocks `/admin`, `/api`, `/result`; declares sitemap + host.
- Dynamic `sitemap.ts` — generated from the content registry so new posts auto-appear.

**Content architecture** (scalable, centralised rendering)
- `content/types.ts` (the `Post` model), `content/index.ts` (registry + helpers), `content/posts/*` (one file per article).
- `components/article/ArticleLayout.tsx` — clay-styled long-form renderer: breadcrumbs, key-takeaways box, table of contents, answer-first prose, FAQ accordion, references, CTA, related posts, YMYL disclaimer — and it emits all the structured data.
- Shared clay `SiteHeader` / `SiteFooter` (server components) → sitewide internal linking + crawl depth.

**Content (8 pages, all study-cited, answer-first, AEO-structured)**
- Pillar `/nub-theory` (~2,500 words) + 5 blog guides + AI hub + FAQ (28 Q&As). Every page: a 40–60-word direct answer first, question headings, comparison tables, "key takeaways," FAQPage schema, peer-reviewed citations (Efrat 1999/2006, Manzanares 2016, the 2,314-pregnancy review, JAMA cfDNA, the 2024 deep-learning study), honest accuracy framing, and a clear CTA.

**Rebuilt `/blog`** index in the clay design, linking to the real articles.

---

## 4. AEO / AI-Overview tactics baked in (verified, 2026)

- **No special "AIO markup" exists** — Google confirmed you just need to be indexed, snippet-eligible, and genuinely helpful. We optimise for *extractability + trust*.
- **Answer-first blocks** (40–60 words) directly under question-style headings → snippet + AIO citation.
- **Tables + ordered lists** (disproportionately extracted) on every comparison/how-to.
- **FAQPage schema** kept despite losing its Google rich result — it's still parsed by Google and is a primary Q&A source for ChatGPT/Perplexity/Gemini.
- **Skipped** (deprecated/no value): HowTo schema, Speakable, sitelinks searchbox.
- **E-E-A-T**: outbound citations to primary studies, "reviewed by" attribution, visible *updated* dates, a medical disclaimer, an honest accuracy range.

---

## 5. The biggest lever you must pull next (E-E-A-T) — owner actions

These need a human and will materially raise rankings for this YMYL-adjacent niche:

1. **Add a real, named, credentialed reviewer** (a sonographer / OB-GYN / midwife) with a bio and a link to verifiable credentials, and by-line the content to them. Generic "editorial team" attribution underperforms in YMYL. The code already supports a `reviewer` — swap in a real person in `lib/site.ts` and the About page.
2. **Resolve the accuracy-claim contradiction.** The homepage/About say **94%**, but the Contact page FAQ says **"75–85%"**. Pick one defensible number and make it consistent everywhere (the new content uses the honest, study-backed ~85–90% real-world range and frames 94% as NubHub's verified service rate). Inconsistent claims hurt trust and are an advertising-compliance risk.
3. **Verify or replace the About-page "team."** The named personas (e.g. "Dr. Sarah Mitchell," "former Google AI researcher") read as placeholders. If they aren't real, replace them — fabricated credentialed people are a Google-spam and trust risk (which is why they were deliberately kept *out* of the structured data here).
4. **Wire real reviews into Product schema.** You're already collecting reviews (Telegram bot). Once you have verifiable ratings, add `aggregateRating`/`review` to `productSchema()` for star rich-results (high CTR). Do **not** invent them.

---

## 6. Off-page & brand

- **Name-collision risk:** `thenubhub.com` ("The Nub Hub — Gender Analytics") already exists doing the *exact* same AI-nub service. Expect brand/SERP confusion. Consider a sharper brand modifier in titles ("NubHub.baby") and prioritise building the `nubhub.baby` entity (Organization schema, consistent NAP, social profiles in `SAME_AS`).
- **Backlinks / digital PR:** pitch the *AI angle* (genuinely novel) to pregnancy/parenting outlets (TheBump, What to Expect, MadeForMums) and offer the annotated-examples gallery as a linkable asset.
- **Add real social profiles** to `SAME_AS` in `lib/site.ts` for entity confirmation.

---

## 7. Measurement (KPIs & cadence)

- **Submit the sitemap** in GSC and use *URL Inspection → Request indexing* on the pillar + each new page now (fastest path out of "no data").
- **Set the real `NEXT_PUBLIC_GA_ID`** env var so analytics actually records.
- **Track (GSC, weekly):** indexed-page count, total impressions, total clicks, average position, and per-query position for the cluster terms. Watch for AI-Overview / PAA appearances.
- **30/60/90-day targets:** 30d → all pages indexed, first impressions on long-tail FAQ terms; 60d → first page-1/PAA appearances for low-competition terms (nub vs ramzi, "what is stacking"); 90d → ranking + occasional AI-Overview citation for the pillar/accuracy pages and rising clicks.

---

## 8. Phase 2 backlog (after this ships & indexes)

1. **Confirmed-examples gallery** with real, consented, annotated boy/girl nub images (the defensible content moat) + `ImageObject` data.
2. **Per-week timing cluster:** `/blog/nub-theory-at-11-weeks` … `-13-weeks` (cheap templated pages, each with its own demand).
3. **NIPT vs nub theory** and **gender reveal ideas** posts (funnel breadth).
4. **Named author/reviewer profile pages** with `Person` schema.
5. **Migrate `/about` and `/contact`** to the clay design for consistency.
6. **Real reviews → AggregateRating**; Core Web Vitals pass (next/image on hero, verify LCP/INP/CLS).

---

*Sources behind this plan: Google Search Central (AI features, Search Gallery), Search Engine Land/Journal, and primary medical literature (Efrat 1999/2006, Manzanares 2016, the 2,314-pregnancy first-trimester review, Devaney/Bianchi JAMA 2011, and the 2024 deep-learning fetal-sex study). Full citations appear inline on the published pages.*
