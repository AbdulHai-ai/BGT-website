# Big Hawk Technologies — Intelligence in motion

Version 2 is a complete six-page website with a dimensional Big Hawk emblem, floating interface layers, a scroll-led automation demonstration, an interactive operations dashboard, and an original typographic motion study.

## Preview

Use a static HTTP server or your Vercel project to see the full experience. From this folder:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. There is no npm install or build step. Opening `index.html` directly also displays the site, but browsers may block local JavaScript modules; the SVG emblem remains available in place of WebGL.

## Upload to your existing Vercel-connected repository

Read `UPLOAD-TO-VERCEL.md`. Keep `assets/`, its `vendor/` subfolder, and `services/` intact. `index.html` must be at the repository root.

## What is interactive

- The original hawk geometry is extruded into a reflective 3D object. Pointer movement changes its viewing angle. WebGL redraws only when needed to settle an interaction; ambient floating uses compositor-friendly CSS.
- The homepage automation interface advances through four stages as you scroll on desktop. All four stages are also accessible through keyboard-operable tabs. Mobile visitors use the tabs directly.
- The illustrative appointment times are selectable, and the selected time carries into the illustrative CRM summary. These controls do not make real appointments.
- The operations dashboard switches between People, Branches, and Payroll views.
- The motion study has working play/pause, elapsed time, and landscape/square/portrait format controls. It is original typographic concept artwork, not a client showreel.
- Client search filters the authoritative list of 57 supplied names.
- Service consultation links preselect the matching enquiry option.

The homepage includes a Pause motion control. Operating-system reduced-motion, increased-contrast, and reduced-transparency preferences are supported. Motion stops when a relevant visual leaves the viewport or the tab is hidden. The core content and contact anchors remain available without JavaScript. The hawk has an SVG fallback when WebGL cannot be created.

## Files

- `index.html`, `clients.html`, and the four HTML files in `services/`.
- `assets/base.css` — shared foundations, forms, navigation, and content structures.
- `assets/experience.css` — the new art direction, interface compositions, materials, responsive design, and motion preferences.
- `assets/site.js` — navigation, client search, service preselection, validation, and honest enquiry handling.
- `assets/experience.js` — interactive demonstrations, scroll stages, media controls, and motion preferences.
- `assets/hawk-scene.js` — the isolated 3D renderer.
- `assets/hawk.svg`, `assets/logo.svg`, `assets/favicon.svg` — preserved brand geometry and vector wordmark.
- `assets/vendor/` — self-hosted Three.js 0.160.1, SVGLoader, RoomEnvironment, and the MIT license. There are no CDN requests or downloaded web fonts at runtime.

## Content and maintenance

The complete list in `clients.html` is the canonical client directory. Homepage names are a subset of those same 57 names. The directory searches existing HTML instead of maintaining a second JavaScript list.

All original required service capabilities, FAQs, related services, and grounded project information are retained. The staff management project remains anonymous. Interface data and concept visuals are labelled as illustrative.

The contact endpoint is still `/api/contact`; no backend is bundled. Read `HANDOFF.md` for the contract and missing evidence. `VERIFICATION.md` records checks actually performed.
