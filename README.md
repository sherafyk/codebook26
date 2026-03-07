# Codebook Next.js + Vercel starter

This is a cleaned-up migration target for your current codebook.

## What changed

- **Hosting model:** GitHub stays as the source of truth, Vercel handles deploys.
- **Content model:** every markdown file inside `content/` becomes a page.
- **No checked-in HTML builds:** the old `*.html` duplicates are gone.
- **Automatic routes:** filenames become clean URLs.
- **Automatic sidebar:** folders and files are detected from the filesystem.
- **Search + copy buttons:** included for faster snippet use.
- **Markdown-friendly:** supports GFM tables, code fences, footnotes, and trusted inline HTML.

## Folder rules

- `content/index.md` → `/`
- `content/guides/MarkupGo.md` → `/guides/markup-go`
- `content/apps-script/openai/chat-completions.md` → `/apps-script/openai/chat-completions`
- `content/ssh-bash/index.md` → `/ssh-bash`

## Optional front matter

You do **not** need front matter, but you can add it when useful:

```md
---
title: VPS Hardening
description: A practical hardening checklist for Debian VPS servers.
order: 10
---
```

## Local development

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Vercel will build on every push and create preview deployments for PRs/branches.
4. Add `codebook.sherafy.com` in Vercel Project Settings → Domains.
5. Set `NEXT_PUBLIC_SITE_URL` to your production URL.

## Suggested cleanup in your live repo

- Delete old generated `*.html` files.
- Delete Jekyll-specific `_layouts/` and `_config.yml` once the new site is live.
- Keep only markdown content plus the Next.js app.
- Use lowercase, hyphenated file names for the cleanest URLs.

## Why this is the best fit here

You said you want a system where adding a markdown file is the main workflow. This starter keeps that promise without forcing a pile of separate HTML pages, docs config files, or manual sidebar edits.
