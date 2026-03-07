# Current repo audit notes

These are the concrete issues found in the uploaded GitHub Pages version:

1. **Source + generated output are mixed together.**
   - The repo contains both `.md` source files and checked-in `.html` output files.
   - That makes content drift very likely.

2. **The sidebar is hard-coded.**
   - `_layouts/docs.html` only lists these directories:
     - `wordpress`
     - `python`
     - `prompts`
     - `guides`
     - `apps-script`
     - `ssh-bash`
   - New folders do not automatically show up.

3. **Some markdown files are not represented by matching HTML pages.**
   - `GFM (Markdown) Guide.md`
   - `apps-script/GAP-Quick-Tools.md`
   - `guides/MarkupGo.md`
   - `ssh-bash/VPS-Hardening.md`
   - `wordpress/plugins/front-end-post.md`

4. **There is at least one filename case mismatch.**
   - `guides/MarkupGo.md`
   - `guides/MarkUpGo.html`
   - This can break links on case-sensitive hosting.

5. **There is an empty section landing file.**
   - `apps-script/index.md` is blank.

## Migration recommendation

Use the new `content/` + Next.js App Router setup in this starter and remove the checked-in HTML artifacts after you verify the new site.
