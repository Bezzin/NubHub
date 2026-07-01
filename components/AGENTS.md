<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-30 -->

# app/components (React Components)

## Purpose

This directory contains all reusable React components organized into 5 subdirectories. Components are designed with the clay/kawaii aesthetic (soft 3D claymorphism, pastel colors) and follow shadcn-style Radix UI patterns (unstyled, fully composable, Tailwind-styled).

## Key Files

| Subdir | File | Description |
|--------|------|-------------|
| **ui/** | button.tsx | Base Button component — variants (primary, secondary, ghost, outline), sizes (sm, md, lg), shadcn-style |
| | card.tsx | Card wrapper — provides spacing, border, shadow for content containers |
| | input.tsx | Text input field — file input compatible, Tailwind-styled |
| | label.tsx | Form label — pairs with input via htmlFor attribute |
| | dialog.tsx | Modal dialog — Radix Dialog underneath, keyboard accessible, backdrop |
| | table.tsx | Data table — thead, tbody, tr, td elements for structured data (admin predictions list) |
| | badge.tsx | Small label/tag — variants (primary, secondary, warning) |
| | alert.tsx | Alert box — success/warning/error messages, dismissible |
| | tabs.tsx | Tabbed interface — Radix Tabs underneath, for FAQ and feature comparisons |
| | textarea.tsx | Multi-line input — for message/feedback forms |
| **marketing/** | ExitIntent.tsx | Exit-intent modal — triggers when user moves to close tab, offers discount code |
| | Testimonials.tsx | Customer testimonials carousel — uses embla-carousel-react, animated counters (react-countup) |
| | SocialProof.tsx | Trust badges + review stats — "94% accuracy", "1000+ happy parents", etc. |
| | Comparison.tsx | Method comparison table — nub theory vs. Ramzi vs. skull theory, accuracy rates |
| | FAQ.tsx | FAQ accordion — uses Tabs component, expandable Q&A |
| | TrustBadges.tsx | Security/guarantee badges — Stripe secure, expert sonographer, money-back guarantee |
| | CheckoutButtonWrapper.tsx | Checkout CTA button with referral code persistence — wraps CheckoutButton, manages localStorage |
| | CheckoutButton.tsx | "Get Prediction" button — routes to `/checkout` page, shows loading state, persists referral code |
| | ClayArt.tsx | Exported clay mascot components — HeartMascot, AI mascot, etc. for headers/footers |
| **layout/** | Header.tsx | Marketing page header — logo, nav links (About, How It Works, Reviews, FAQ, Contact), mobile menu, scroll-based backdrop blur, CTA button. **Client component (uses useState, useEffect, framer-motion animations).** |
| | Footer.tsx | Marketing page footer — brand info, product/company/legal links, trust badges, dark background. **Client component.** |
| | SiteHeader.tsx | Content/article page header — server component, clay-styled, internal nav (Nub Theory, Guides, How our AI works, FAQ), logo, CTA. Links provided statically for crawler crawl depth. |
| | SiteFooter.tsx | Content/article page footer — server component, clay-styled, 9-pillar pregnancy topic links (Week by week, Symptoms, Scans & tests, Nutrition, Mental health, Complications, Lifestyle, Relationships, Baby prep), T&Cs, support email. **IMPORTANT: Header/Footer pair (above) vs. SiteHeader/SiteFooter pair (here) — two distinct implementations.** |
| **seo/** | JsonLd.tsx | Renders JSON-LD schema objects as `<script type="application/ld+json">` — server component, used for article/org/website structured data |
| **article/** | ArticleLayout.tsx | Wrapper for hand-authored blog posts — renders metadata, breadcrumbs, JSON-LD (article + breadcrumb + FAQ), content, related posts, author/reviewer info. Server component. |
| | LibraryArticle.tsx | Wrapper for markdown-library articles — same layout as ArticleLayout but sources content from `app/content/library/loader.ts`, trusts markdown body as HTML. Server component. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `ui/` | 10 shadcn-style unstyled Radix-based primitives (button, input, dialog, table, tabs, etc.) — use across all pages |
| `marketing/` | 8 marketing/landing-page sections (testimonials, social proof, FAQ, comparison, trust badges, CTAs) |
| `layout/` | **4 header/footer components — IMPORTANT: Header/Footer for marketing pages vs. SiteHeader/SiteFooter for article/content pages. Each pair serves a distinct purpose.** |
| `seo/` | 1 JSON-LD schema renderer for structured data |
| `article/` | 2 layout wrappers for blog/library articles — ArticleLayout for hand-authored, LibraryArticle for markdown |

## For AI Agents

### Working In This Directory

- **Header/Footer vs. SiteHeader/SiteFooter Distinction:** The codebase has two header/footer implementations. **Header & Footer** are for the landing page and marketing routes — use client-side state (scroll detection, mobile menu toggle), feature branding, promo banners, and CTAs. **SiteHeader & SiteFooter** are for editorial/content routes — server components, clay-styled, link to internal pillar pages (9 pregnancy topics in footer) and content guides. They serve the same visual role but with different information architecture and implementations. Both are intentional; neither is dead code.
- **Tailwind + Clay Design System:** All components use custom CSS variables from `globals.css` (`--clay-*`, `--pastel-*`). Colors: lavender (`#b9a3ec`), pink (`#ff9ec4`), blue (`#9cd0f5`), mint (`#a7e8cf`), peach (`#ffc9a8`), butter (`#ffe08a`). Shadows use layered insets + drops for depth. Border radius uses `--clay-r-*` scale (40px, 32px, 24px, 18px).
- **UI Components Are Unstyled.** Radix UI provides a11y logic; Tailwind provides styling. Each component exports a render function accepting `className` for composition. This allows subcomponents (CardContent, DialogHeader, etc.) to combine and override styles via class merging (`clsx`, `tailwind-merge`).
- **Marketing Components Are Client-Heavy.** Testimonials carousel, FAQ accordion, ExitIntent modal all use client-side state (Framer Motion animations, carousels). Keep these small and far from data-fetching logic. Use `'use client'` at the component level, not pages.
- **Article Layouts Are Server Components.** ArticleLayout and LibraryArticle fetch metadata, build schemas, and render markdown as trusted HTML. They should NOT have `'use client'`. If interactivity is needed (e.g., copy-code button in a code block), extract a small `'use client'` wrapper component.

### Testing Requirements

- **Component Rendering:** Test that each component renders without errors. Verify props are applied (e.g., button variant affects className).
- **A11y:** Test keyboard navigation (Tab, Enter, Escape in dialogs), ARIA labels, focus management. Use axe or Lighthouse.
- **Responsive Design:** Test on mobile (375px), tablet (768px), desktop (1920px) viewports. Verify mobile menu appears/disappears.
- **Animations:** Verify Framer Motion animations don't cause layout shifts (use `layoutId` to stabilize). Test reduced-motion media query support.
- **JSON-LD Validation:** Use Google's Structured Data Testing Tool to validate rendered JSON-LD (article, organization, website schemas).

### Common Patterns

- **Variant-Based Styling:** Use `class-variance-authority` (CVA) for component variants. Example: `button({ variant: 'primary', size: 'lg' })` generates correct className.
- **Composition Over Inheritance:** Build complex layouts by composing small components. Example: CardHeader + CardTitle + CardContent + CardFooter.
- **Props Spreading:** Pass remaining props to underlying HTML elements via `{ ...props }`. Example: `<input {...props} />` allows consumers to add `disabled`, `aria-label`, etc.
- **Default Styling with Overrides:** Provide sensible defaults (e.g., `className="..."`) but allow consumers to pass additional classes. Use `clsx` and `tailwind-merge` to avoid conflicts.
- **Server vs. Client:** Prefer Server Components (no `'use client'`) unless state is needed. Server components are smaller and faster.

## Dependencies

### Internal

- `app/lib/site` — EDITORIAL, SITE_URL, PRICE constants for article layouts
- `app/lib/schema` — JSON-LD schema builders (articleSchema, breadcrumbSchema, faqSchema, etc.)
- `app/content/` — article loader for ArticleLayout and LibraryArticle

### External

- `@radix-ui/*` — Dialog, Tabs, Avatar (unstyled primitives)
- `framer-motion` — animations (Header slide-in, mobile menu, testimonial carousel)
- `embla-carousel-react` — testimonial carousel
- `react-countup` — animated number counters
- `lucide-react` — icons (Menu, X, Heart, Sparkles, ArrowRight, Loader2, etc.)
- `tailwindcss` — utility CSS, clay color tokens
- `class-variance-authority` — component variant generation
- `tailwind-merge` — merge Tailwind classes without conflicts
- `clsx` — class name utility

<!-- MANUAL: -->
