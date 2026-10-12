# Oreone International website — Vercel-ready static site

This project contains eight static HTML pages and shared CSS/JavaScript. It is responsive and can be deployed on Vercel without a paid domain.

## Preview locally
Run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Deploy to Vercel (no domain purchase required)
1. Upload this folder's contents to a new GitHub repository named `oreone-international-website`. Keep `index.html`, `styles.css`, `script.js`, `vercel.json`, `robots.txt`, `sitemap.xml` and the other HTML pages at the repository root.
2. Sign in at https://vercel.com/ and choose **Add New → Project**.
3. Import the GitHub repository.
4. For a plain static site, select **Other** if asked for a framework preset. Leave Build Command and Output Directory blank; Root Directory should be `./`.
5. Click **Deploy**. Vercel will provide a `*.vercel.app` URL.
6. Replace `YOUR-VERCEL-URL` in `sitemap.xml` and `robots.txt` with the exact project hostname, then commit/push the changes. Add canonical tags to each page using the real Vercel URL after it is known.

## Important limitations before public launch
- The contact form opens the visitor's email application with a pre-filled draft; it does not send/store the enquiry by itself. Test it on a device with an email handler. For direct submissions, connect a form backend/service and configure spam protection.
- Background photography currently uses external Unsplash image URLs, so an internet connection is needed to load those images. Review image licensing and replace with approved assets if desired.
- The logo is a CSS text treatment as requested.
- The Insights page is a framework for future articles; do not publish fabricated articles or research claims.
- Review the privacy notice and all copy before launch.
- Confirm Vercel's current plan terms are appropriate for a public business website before relying on free hosting.

## Pages
Home, About, What We Do, Who We Serve, Partnerships, Insights, Contact, Privacy Notice.
