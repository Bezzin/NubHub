<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/public (Static Assets)

## Purpose

This directory holds static files served directly by Next.js without processing (except image optimization). Includes branded illustrations (clay mascot art), photography (team), hero images, video, and landing-page mockups. All files are committed to git and served with far-future cache headers in production.

## Key Files

| File | Description |
|------|-------------|
| `chart.jpg` | Performance/accuracy chart graphic — used in marketing sections |
| `hero-headline.webp` | Large hero image for landing page — clay aesthetic, pregnancy-related visual |
| **clay/** | 11 clay-styled mascot/illustration PNGs (see below) |
| **clay/mascot.png** | Primary NubHub mascot — cute, rounded, clay-textured character used in headers |
| **clay/ai.png** | AI-themed mascot variant — used in "How our AI works" section |
| **clay/gift-clay.png** | Gift box illustration — used in pricing/value prop section |
| **clay/headline.png** | Decorative headline illustration |
| **clay/m-human.png** | Human figure illustration (side profile, pregnancy-related) |
| **clay/m-profile.png** | Profile figure illustration |
| **clay/m-reading.png** | Reading figure illustration — used in guides/blog sections |
| **clay/result.png** | Result screen mockup — shows prediction result UI |
| **clay/review.png** | Review/testimonial illustration |
| **clay/scan.png** | Ultrasound scan illustration (stylized clay version) |
| **clay/sparkle-clay.png** | Sparkle/shine decorative element — used as accent |
| **mockups/** | 4 landing-page design mockups (PNG) — reference designs, not rendered dynamically |
| **mockups/nubhub-landing-mockup.png** | Original landing-page mockup |
| **mockups/nubhub-landing-mockup-v2-awwwards.png** | V2 mockup (Awwwards-style) |
| **mockups/nubhub-landing-mockup-v3-pastel-pregnancy.png** | V3 mockup (pastel pregnancy aesthetic) |
| **mockups/nubhub-sonogram-keepsake-hero.png** | Keepsake result image mockup — shows how prediction result is rendered for customers |
| **team/** | 1 team photo |
| **team/ivy.jpg** | Photo of Ivy (EDITORIAL.reviewer in `app/lib/site.ts`) — rendered in article author/reviewer credentials |
| **video/** | 1 video file |
| **video/baby-stork.mp4** | Short promotional/cute video — embedded in landing page sections (autoplay, muted) |

## Subdirectories

(All assets are files; no subdirectories beyond clay/, mockups/, team/, video/)

## For AI Agents

### Working In This Directory

- **Static Only.** These files are not processed by the application at runtime. They are served by Next.js with far-future cache headers (1 year) in production. Do not add dynamic assets or files that depend on runtime state.
- **Image Optimization.** Next.js automatically optimizes `.png`, `.jpg`, `.webp` via `next/image`. When used in components, import the image and pass to `<Image>` component for automatic srcset generation and responsive sizing.
- **Gitignored Screenshot Dirs.** The `screenshots/` directory (if present) is gitignored and should not be committed. Use it for temporary testing assets only.
- **Reference Only.** The mockups (*.png) are design references used by the team — they are not rendered by the app dynamically. They document the intended visual direction.

### Testing Requirements

- **File Size:** Verify WebP and JPEG files are compressed. Use `next/image` to serve optimal formats (WebP on supported browsers, fallback to PNG/JPEG).
- **Video Playback:** Test `baby-stork.mp4` on major browsers. Verify autoplay + muted works (required by most browsers for autoplay without user interaction).
- **Image Loading:** Test lazy loading on slow connections (Chrome DevTools throttling). Verify responsive images via `srcSet`.

### Common Patterns

- **Use `next/image` for Optimization:** Always use `import { Image } from 'next/image'` and import the asset file. Avoid raw `<img src="/public/...">` which bypasses optimization.
- **WebP with Fallback:** Serve WebP to browsers that support it; fallback to PNG/JPEG. Next.js `<Image>` handles this automatically.
- **File Naming:** Use kebab-case (e.g., `baby-stork.mp4`). Include file extension. Keep names short and descriptive.

## Dependencies

### Internal

- `app/lib/site` — EDITORIAL.reviewer.image points to `/public/team/ivy.jpg`
- `app/components/` — components import and use clay illustrations (e.g., `ClayArt.tsx` imports mascot variants)

### External

- None — static files have no external dependencies

<!-- MANUAL: -->
