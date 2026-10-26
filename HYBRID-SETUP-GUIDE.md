# Oreone Hybrid Website — Setup Guide

## Supabase project created
- Project: `oreone-website`
- Project ref: `rspmbmnjcpynnbtkmhun`
- Region: London (`eu-west-2`)
- Project creation cost quoted by Supabase: $0/month (usage beyond free allowances may still be subject to Supabase terms/limits).
- Insights database schema and Row Level Security policies have been applied.
- `supabase-config.js` is preconfigured with the project URL and public publishable key. The publishable key is safe for browser use; never expose a secret/service-role key.

## Create the first editor account
1. Open the Supabase dashboard for project `oreone-website`.
2. Go to Authentication → Users → Add user, and create an account using the email address that should administer Oreone Insights. Use a strong password.
3. Copy that user's UUID from the Users list.
4. In SQL Editor, run this statement after replacing the placeholder with the actual UUID:

```sql
insert into public.oreone_admins (user_id)
values ('PASTE-AUTH-USER-UUID-HERE')
on conflict (user_id) do nothing;
```

Only add trusted editors to `public.oreone_admins`. Public visitors can read published articles only. Drafts and write actions require an authorised, authenticated editor.

## Vercel environment variables
In Project → Settings → Environment Variables, add these for Production (and Preview if needed):
- `SUPABASE_URL` = `https://rspmbmnjcpynnbtkmhun.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_2AQ_bp4cL9WxruguGWcBxA_Wm0WJtmc`
- `SITE_URL` = the final public website origin, without a trailing slash (set after deciding the Vercel URL or custom domain).
Then redeploy so the server-side article renderer and dynamic sitemap can read published articles.

## Test the CMS
1. Deploy the updated package.
2. Open `/admin.html`, sign in with the editor account, create a draft, and confirm it does not appear publicly.
3. Publish a test article and confirm it appears on `/insights` and loads at `/insights/test-article-slug`.
4. Confirm the article URL is in `/sitemap.xml`, then unpublish/delete the test article.
5. Confirm a logged-out visitor cannot create, update or delete articles.

## Contact email integration
The contact page can prepare an email in the visitor's email app. To receive enquiries directly from the website without relying on the visitor's email app, create a form with your chosen form provider, set notifications to `support.oreoneinc@gmail.com`, configure the provider endpoint in the contact form/config as documented in the project, and submit a real test. Do not claim delivery until verified.

## Notes
- The Supabase schema has already been applied to the new project. Do not re-run migrations unnecessarily.
- Keep service-role/secret keys out of HTML, JavaScript, GitHub and public Vercel variables. The current design uses the public publishable key plus RLS.
