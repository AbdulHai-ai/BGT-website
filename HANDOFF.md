# Developer handoff

## Contact endpoint still needed

The supplied files contained a frontend request to `/api/contact`, but no backend implementation or live endpoint was available. This delivery retains that endpoint without adding a database, CRM, analytics, or other collection service.

The browser sends a same-origin JSON POST with these six keys:

```json
{
  "name": "Example name",
  "email": "name@example.com",
  "company": "",
  "service": "ai-systems-automation",
  "budget": "",
  "message": "The project brief"
}
```

`company` and `budget` are optional. Existing budget ranges are unchanged. Service values are listed in README.md. Validate the request on the backend and return a successful HTTP response only after actually accepting the enquiry. A suitable contract is HTTP 200 with `{"success":true}`; HTTP 204 is also supported. Rejections should use a non-2xx status, optionally `{"success":false}`. A 200 JSON body with `success:false` or `ok:false` is treated as a rejection; an HTML fallback is also rejected.

The frontend prevents duplicate submissions while pending, times out after 20 seconds, preserves values on failure, and announces validation, sending, success, or failure. A timeout reports that receipt could not be confirmed. Static HTTP previews and direct file previews offer explicit email and WhatsApp alternatives. No receipt is simulated. Successful responses were tested with browser request mocks, not with a live mail backend.

The no-JavaScript form uses a normal form POST. To support that submission path, the eventual backend should also accept `application/x-www-form-urlencoded` and return an accessible response page, or visitors can use the permanently available contact links.

Contact destinations remain:

- `mailto:bighawktechnologies@gmail.com`
- `tel:+923213392689`
- `https://wa.me/923213392689`

The source's chunk-based contact assembly is retained in JavaScript. Real anchor destinations are also present for reliable navigation, accessibility, and operation without JavaScript.

## Evidence and media

The staff management feature uses only the documented scope: staff scheduling, role permissions, attendance logs, and an operations portal. It is anonymous. The source's “Ilyas Salon” attribution is not equated with the directory's “Ilyas by Bin Zaka.” Confirm that relationship and permission before attributing the project.

No verified outcomes, testimonials, production screenshots, creative footage, photography, or client logo assets were supplied. None have been invented. Add approved assets and verified evidence when available. Interface illustrations and fictional data are labelled; the AI-video and media compositions are typographic artwork, not showreels.

The exact supplied hawk geometry and original wordmark have been preserved as SVG. The Archivo wordmark was outlined for self-contained rendering; no font software is distributed. Interface typography uses the requested system stack. There are no missing image dependencies.
