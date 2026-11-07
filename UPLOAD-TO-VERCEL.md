# Update your existing Vercel website

1. Download and extract this ZIP on your computer.
2. Open the extracted folder. It must contain `index.html`, `clients.html`, `assets`, and `services` together.
3. Open your GitHub repository: https://github.com/AbdulHai-ai/BGT-website
4. Choose **Add file → Upload files**.
5. Drag `index.html`, `clients.html`, the complete **assets folder**, and the complete **services folder** onto the upload page. You can also include the Markdown handoff files.
6. Commit the changes to `main`. GitHub will replace matching files. Vercel should automatically deploy the new commit.
7. Wait until the latest Vercel deployment is **Ready**, then open your website and refresh with **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac).

Do not select the individual files inside `assets` or `services` and place them at the repository root. Drag the folders intact so their paths are preserved, including the nested `assets/vendor` folder.

Required structure:

```text
index.html
clients.html
assets/
  base.css
  experience.css
  site.js
  experience.js
  hawk-scene.js
  hawk.svg
  logo.svg
  favicon.svg
  vendor/
    three.module.js
    SVGLoader.js
    RoomEnvironment.js
    THREE-LICENSE.txt
services/
  ai-systems-automation.html
  custom-software-erp.html
  ai-video-production.html
  media-creative-production.html
```

The site uses ordinary static HTML files and relative paths. No build command, framework, or rewrite rules are needed. Keep the Vercel root directory at the directory containing `index.html`.

If the design does not load, open `/assets/experience.css` on your live domain; it must return CSS rather than 404. If the 3D emblem uses its flat fallback, check `/assets/vendor/three.module.js`, `/assets/hawk-scene.js`, and `/assets/hawk.svg`. All three must be present. A browser or device without WebGL will use the fallback intentionally.

For full 3D motion, use the HTTP/HTTPS preview. Local `file:` URLs may block JavaScript module loading.

The enquiry form needs a real `/api/contact` backend before it can deliver enquiries. Email, phone, and WhatsApp are already linked; no receipt is simulated in a static preview.
