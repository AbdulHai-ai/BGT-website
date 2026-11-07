# Version 2 verification

Checked with Chromium and Playwright. The full site regression suite passed 220 assertions. The new experience passed 24 additional interaction checks. Axe-core reported zero violations for WCAG 2 A/AA, WCAG 2.1 AA, and best-practice rules across all six pages at 375px and 1440px after corrections.

## Site checks

- Six pages tested at 375, 768, 1024, and 1440px with no horizontal overflow.
- All local page, stylesheet, script, image, and fragment links resolve on static HTTP hosting.
- Every service capability remains present; all four service links reach their dedicated pages.
- All service consultation links preselect the correct option in the homepage form.
- The client directory contains exactly the supplied 57 names, preserving spelling and order. Search, result count, empty state, and clear-search focus return work.
- Email, phone, and WhatsApp destinations match the supplied contacts.
- Mobile navigation works by keyboard, closes with Escape, returns focus appropriately, and resets on desktop/mobile resizing.
- Enquiry validation, optional budget, announced status, and duplicate-submission prevention work.
- Mocked HTTP 500, network failure, HTML fallback, and application rejection preserve entered values and never show success. A mocked successful response shows success and resets the form.
- Essential content and navigation remain available without JavaScript. There is one H1 and unique metadata per page, and no duplicate IDs.
- No unhandled browser JavaScript errors or missing local resources were observed in the full regression pass.

## New experience checks

- The actual original hawk geometry renders in WebGL. A deliberately unavailable WebGL context correctly displays the original SVG fallback and leaves the hero usable.
- Pause motion freezes ambient layers. Reduced motion removes floating animation; reduced transparency produces a solid navigation surface.
- All four scroll stages advance in order. The workflow tabs also support direct selection, arrow keys, Home, and End.
- A sample appointment time can be selected, and it carries into the illustrative CRM summary.
- People, Branches, and Payroll dashboard views work, including keyboard tab switching.
- The procedural motion study plays, its clock advances, pause retains position, and offscreen playback pauses automatically. Landscape, square, and portrait controls work.
- Desktop and mobile screenshots were visually reviewed, including the service hero and enquiry area. A browser walkthrough records the real implementation.

## Corrections made during the pass

Removed a decorative glow's mobile overflow, corrected the illustration heading hierarchy, increased contrast in two light-surface labels, and reduced idle WebGL rendering so the scroll-driven interface stays responsive. WebGL now renders on demand to settle pointer movement; CSS handles ambient floating.

## Limits

These automated checks are not accessibility certification. Safari, Firefox, real touch devices, and screen-reader sessions were not tested. Cross-device WebGL performance varies; the SVG fallback and motion preferences are included for that reason. Browser verification used local HTTP hosting. No Vercel or GitHub deployment was made by the assistant, and the existing live site is not the new version until its files are replaced.

No live `/api/contact` backend was supplied. Successful form responses were mocked during testing; actual delivery of enquiries remains unverified. No real messages or appointments were created.
