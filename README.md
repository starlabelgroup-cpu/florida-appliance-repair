# Florida Appliance Repair — Landing Page

A single-page landing site for **Florida Appliance Repair**
(floridappliancerepair.com), operated by **Top Speed Appliance**.

One page (`/`) carries the whole offer:

| Section | Contents |
| --- | --- |
| Header | Sun-and-bolt brand mark, "Operated by Top Speed Appliance", call CTA |
| Hero | "Appliance repair in Florida, run like a system." + the booking form |
| Services | The 10 standard repair services with short factual blurbs |
| How it works | Tell us the problem → we confirm by phone → a technician is dispatched through Service OS |
| Areas served | The 16 Broward County cities in the Top Speed service area |
| FAQ | Booking, pricing confirmation, what happens after submitting, who operates the brand |
| Footer | Phone, email, operator credit, canonical domain note |

## Brand facts

- Brand: **Florida Appliance Repair**, operated by **Top Speed Appliance**,
  based in Broward County, Florida.
- Phone: **(954) 931-7997** (`tel:+19549317997`)
- Email: **service@topspeedappliance.net**
- Palette: deep sea navy `#07304D`, aqua `#1FB6C9`, coral accent `#FF7A59`,
  off-white background `#F7FAFB`. System font stack only — no external fonts.

## Booking — Top Speed Service OS intake

The booking form really submits into Top Speed Service OS using the same
Speedy booking intake as the Total Home Appliance Repair company site's
live form:

- **Endpoint:** `POST https://top-speed-service-os.vercel.app/api/v1/speedy/book`
- **Payload:** `customer{name, phone}`, `city`, `zip`, `appliance` (the
  service name), `issue` (`"<problem> (Appliance: <service name>)"`),
  `preferredWindow`, `source: "WEB_FORM"`, `via: "floridappliancerepair.com"`,
  the landing `page` path, and first-touch attribution
  (`utmSource`/`utmMedium`/`utmCampaign` + `gclid`/`fbclid`/`msclkid`)
  captured from the URL when present.
- **Success rule:** the submission counts as successful only when the
  response JSON carries `data.referenceCode`. The customer then sees a
  success panel with that reference and a note that the team confirms by
  phone. Any other outcome shows an error panel with the call option
  (954) 931-7997 — nothing is presented as booked that was not recorded.
- A human Service Setter confirms every booking by phone before a
  technician is dispatched; pricing is confirmed at booking.

## Honesty rules (enforced in content, audited in source)

- No prices or dollar amounts anywhere — pricing is confirmed by the
  setter at booking time.
- No business hours, street addresses, ratings, review counts,
  technician counts, guarantees, or same-day promises.
- Only contact facts: phone **954-931-7997**, email
  **service@topspeedappliance.net**.

## Build & deploy

```bash
npm install
npm run dev     # local dev server
npm run build   # tsc + vite build → dist/ (incl. sitemap.xml, robots.txt)
npm run preview # serve the production build locally
```

- **Stack:** React 18 + TypeScript + Vite 5.
- **Vercel settings:** Framework Vite, Root Directory `./`, Output `dist`.
  `vercel.json` rewrites everything except assets/sitemap/robots to the
  SPA entry (`/index.html`).
- **SEO:** `index.html` sets the title and the canonical link
  (`https://floridappliancerepair.com/`) directly. A Vite plugin emits
  `dist/sitemap.xml` with exactly one URL (the canonical root) and
  `dist/robots.txt` at build time.
- **Domain note:** floridappliancerepair.com's DNS currently sits on
  Squarespace nameservers. For the custom domain to serve this site, the
  domain must be added to the Vercel project and its DNS pointed at
  Vercel (the records Vercel shows for the project) — until then the
  site is reachable on its `*.vercel.app` address only.
