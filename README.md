# Oreone International Limited — hybrid static website

Public company pages are static HTML/CSS for fast delivery. Insights uses Supabase as its CMS/database, with authenticated admin access and Row Level Security; Vercel functions render individual published article pages and generate a dynamic sitemap. Contact enquiries need a configured email form provider for direct delivery; the mail-app fallback is not the same as server-side delivery.

## Deployment
1. Upload the contents of this folder to the root of the GitHub repository connected to Vercel.
2. In Vercel use Root Directory `./` and Framework Preset `Other`. The project includes `vercel.json` rewrites and `/api` functions.
3. Add the environment variables listed in `HYBRID-SETUP-GUIDE.md`, then redeploy.
4. Create the first Supabase Auth user and add their UUID to `public.oreone_admins` as described in the guide.
5. Test draft privacy, publishing, public article rendering, sitemap and contact delivery before launch.

Do not add Supabase secret/service-role keys to browser files or GitHub.
