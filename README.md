# Inari Build Trading, Inc. — Landing Page

Static marketing site for a Cebu-based scaffolding sales and rental company.
No frameworks, no build step, no backend.

## Stack

HTML5 · CSS3 · Vanilla JavaScript. Zero dependencies. One webfont (Archivo, Google Fonts).

## Structure

```
index.html      All sections, SEO meta, Open Graph, JSON-LD LocalBusiness schema
style.css       Design system + all component styles (numbered sections in the file)
script.js       stickyNav · mobileMenu · activeNav · scrollReveal · counters · quoteForm
assets/         Vector imagery (SVG) + favicon
```

## Deploy to Vercel

```bash
npx vercel          # from this folder — no framework preset, no build command
```

Or drag the folder into the Vercel dashboard, or push to Git and import the repo.
Any static host works the same way (Netlify, Cloudflare Pages, GitHub Pages, S3).

## Editing

| What | Where |
|---|---|
| Colours, spacing, type scale | `style.css` → `:root` tokens at the top |
| Accent colour | `--accent` (currently safety orange `#FF6A13`) |
| Phone number | Search `0966 411 2900` and `+639664112900` in `index.html` |
| Address | Contact section + footer + JSON-LD block in `index.html` |
| Services | Cards in `#services`; the form's `<select>` options mirror them |
| Google rating | Hero trust line, About badge, stats, reviews section, JSON-LD |

## Images

`assets/*.svg` are lightweight vector illustrations of scaffolding elevations
(≈3–11 KB each), generated so the demo ships fast and stays sharp at any size.
Swap them for real site photography when it's available — keep the same file
names and the layout is unchanged. If you switch to JPG/WebP, keep the
`loading="lazy"` and `width`/`height` attributes on each `<img>` so the page
still reserves space and defers off-screen loads.

## The enquiry form

Frontend only. It validates name, phone, service and project details in the
browser and shows a success state — nothing is sent anywhere. To make it live,
point the `<form>` at a handler (Vercel serverless function, Formspree, Web3Forms)
and replace the `form.hidden = true` branch in `script.js` with a `fetch()` POST.

## Notes on content

The rating (4.8 from 6 Google reviews), address, phone and service list are the
only business facts used. No project counts, years in business, client numbers,
customer names or review quotes have been invented — the reviews section states
the verified rating and nothing more.

## Accessibility

Semantic landmarks, skip link, labelled form fields with inline error messages,
visible focus states, `aria-expanded` on the mobile menu, descriptive alt text,
and a full `prefers-reduced-motion` fallback.
