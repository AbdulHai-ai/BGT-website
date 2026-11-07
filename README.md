# Big Hawk Technologies

A complete, standalone static website. Open `index.html` in a browser, or serve this folder with any static web server. No framework, package installation, build step, external fonts, analytics, or third-party runtime is required. Nothing has been deployed.

## Files

- `index.html` — homepage and project enquiry form.
- `clients.html` — authoritative directory of all 57 supplied clients, with progressive name search.
- `services/ai-systems-automation.html`
- `services/custom-software-erp.html`
- `services/ai-video-production.html`
- `services/media-creative-production.html`
- `assets/styles.css` — shared design system and responsive layouts.
- `assets/site.js` — shared navigation, assembled contact URLs, search, service preselection, validation, and form submission.
- `assets/logo.svg` and `assets/favicon.svg` — preserved hawk artwork; the original wordmark is converted to vector outlines. Header and footer logos are also embedded directly in the HTML for resilience.
- `HANDOFF.md` — endpoint contract and remaining evidence/assets.
- `VERIFICATION.md` — checks performed and their limits.

Keep the directory structure intact. All page links are relative and include `.html`; no rewrite rules are needed. The intended contact endpoint is the origin-root path `/api/contact`.

For a local HTTP preview, from this folder run:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`. This static server does not implement the enquiry endpoint. Email and WhatsApp links work independently of it.

## Editing

Edit the HTML directly; shared presentation and behaviour live in the two asset files. Essential content, navigation, client names, and contact links are present before JavaScript runs. The six pages use the same navigation, footer, and service layout pattern.

The full list in `clients.html` is the canonical client directory. The homepage displays 12 names selected from that list. Search filters the existing HTML; it does not maintain a second JavaScript client list. Preserve the supplied spelling and capitalisation when editing.

Service CTA URLs use one of these values in `?service=…#contact`: `ai-systems-automation`, `custom-software-erp`, `ai-video-production`, or `media-creative-production`. The additional form option is `help-me-choose`.
