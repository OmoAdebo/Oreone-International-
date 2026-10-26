# Supabase CMS security and functionality test plan

Perform these tests after setup in the real project. This package deliberately does not contain a Supabase secret key or claim that live tests passed before the project is configured.

| Test | Expected result |
|---|---|
| Unauthenticated public SELECT on `insights` | Published rows only |
| Unauthenticated SELECT for a known draft slug | Zero rows / article route 404 |
| Authenticated ordinary user SELECT on drafts | No draft rows |
| Authenticated ordinary user INSERT/UPDATE/DELETE | Rejected by RLS |
| Listed admin user SELECT all articles | Drafts and published rows visible in `/admin` |
| Listed admin user INSERT/UPDATE/DELETE | Allowed |
| Remove admin membership and refresh session | Admin operations denied by database RLS |
| Publish via `/admin` | `published_at` populated and public list/article/sitemap updated |
| Unpublish an article | Removed from public list/sitemap, article route returns 404 |

When using Supabase CLI with a local/test database, add pgTAP checks under `supabase/tests/` and run `supabase test db`. For the first setup, use the dashboard and manual checks above.
