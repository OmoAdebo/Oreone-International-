# Oreone deployment checklist

## Vercel static/hybrid setup
- Project name: `oreone-international`
- Root Directory: `./`
- Framework Preset: `Other`
- Build Command: blank
- Output Directory: blank
- Confirm `index.html`, `styles.css`, `script.js`, `vercel.json`, `supabase-config.js`, and `api/` are at repository root.
- Set production `SITE_URL` to the exact production origin.

## Supabase CMS setup
- [ ] Confirm/create a dedicated Oreone Supabase project.
- [ ] Run `supabase-schema.sql` in SQL Editor.
- [ ] Configure the project URL and publishable/anon key in `supabase-config.js`.
- [ ] Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (or legacy `SUPABASE_ANON_KEY`) in Vercel.
- [ ] Create admin user in Supabase Authentication and add that UUID to `public.oreone_admins`.
- [ ] Redeploy and sign in at `/admin`.
- [ ] Save draft and verify it is private.
- [ ] Publish a test article and verify `/insights`, `/insights/<slug>`, metadata, Article JSON-LD, and `/sitemap.xml`.
- [ ] Return the test article to draft; verify public list and sitemap no longer include it and the article URL returns 404.
- [ ] Test with a non-admin account: it must not access drafts or write/delete articles.

## Contact enquiry setup
- [ ] Create the real Formspark form and set notifications to `support.oreoneinc@gmail.com`.
- [ ] Configure `formsparkEndpoint` in `supabase-config.js`.
- [ ] Submit a real test; verify delivery in inbox/spam.
- [ ] Test provider failure and the unconfigured mailto fallback.

## Production QA
- [ ] Test mobile (375px), tablet (768px) and desktop.
- [ ] Check the navigation, links, and contact details.
- [ ] Open `/robots.txt` and `/sitemap.xml`.
- [ ] Confirm all custom-domain URLs are canonical and contain no `.html`.
- [ ] Review privacy notice and image licensing.
