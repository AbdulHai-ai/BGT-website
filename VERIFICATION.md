# Verification

Checked in Chromium using Playwright. One focused verification pass identified and fixed missing arrow glyphs, repeated SVG IDs, and illustration heading order. UI icons are now SVGs, logo IDs are unique, and illustration labels do not interrupt the document heading hierarchy.

## Checks completed

- All six pages fit 375, 768, 1024, and 1440px viewport widths without horizontal overflow.
- All local page, script, style, favicon, and fragment links resolve on an ordinary static HTTP server.
- All four service routes are actual pages. Their consultation links preselect the correct homepage service option.
- Every requested service capability is present on its corresponding page.
- The directory contains exactly the 57 supplied names in their original spelling, capitalisation, and order.
- Name search, live result count, empty state, and clear-search focus return work.
- Contact anchors resolve to the supplied email, phone, and WhatsApp destinations.
- Mobile navigation opens by keyboard, closes with Escape, returns focus to its trigger, and moves focus to same-page destinations. Desktop/mobile resizing resets menu state.
- Enquiry validation focuses the first invalid field. Budget is optional. The six-field request payload is retained.
- Mocked HTTP 500, aborted-network, HTML-fallback, and JSON-rejection responses show an error and preserve values. A pending request blocks duplicate submissions.
- A mocked successful HTTP 200 response announces success and resets the form. No messages were actually sent.
- All six pages retain visible content and usable navigation without JavaScript; all 57 names remain available. Email anchors work without assembly code.
- Embedded SVG logos remain visible when image requests are blocked. No external fonts, libraries, or media are needed at runtime.
- Reduced-motion, increased-contrast, and reduced-transparency preferences are supported and were exercised in the browser.
- FAQ disclosure works with the keyboard.
- Each page has one H1, a unique title and description, and unique element IDs.
- No browser JavaScript errors or missing local resources were observed during the full interaction checks.

The full interaction/layout suite passed 183 assertions. Axe-core reported zero violations for WCAG 2 A/AA, WCAG 2.1 AA, and its best-practice rules across all six pages at 375px and 1440px after the heading fixes. Final semantic changes were also checked at all four target widths. Desktop and mobile screenshots were visually reviewed.

## Limits

Automated accessibility checks are not a full accessibility certification. Testing used Chromium; Safari, Firefox, real touch devices, and screen-reader sessions were not available in this pass. Direct `file:` navigation was blocked by the managed browser's administrator policy, so browser verification used local HTTP hosting. There is no live backend in the supplied materials: end-to-end enquiry delivery remains unverified and requires `/api/contact` to be connected.
