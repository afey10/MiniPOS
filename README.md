# MiniPOS — Marketing Website

A simple, static 4-page website (Home, Features, Pricing, Contact) for selling MiniPOS as a product.
No build step needed — it's plain HTML/CSS/JS.

## Before you publish this

1. Open `assets/script.js` and replace `REPLACE_WITH_YOUR_EMAIL@example.com` with your real business email.
2. Open `contact.html` and replace the placeholder email and phone number text.
3. Open `pricing.html` and replace the placeholder "MVR 0" prices with your real prices.
4. Once you have real screenshots of the app, replace the mock dashboard preview in the hero section of `index.html` with an actual screenshot — it'll help you sell far more than made-up numbers.
5. The logo mark (`assets/logo-mark.png`) is a simple placeholder "M" icon so this site doesn't reuse your ARH Fill in the Blanks branding for a different product. Swap it for a real MiniPOS logo whenever you have one designed.

## How to publish it (same GitHub + Vercel workflow you already used)

1. Go to https://github.com/new and create a **new, separate** repository (for example `arh-pos-website`). Don't upload this into your existing POS app repo — this is a different project.
2. On the new repo's page, click **Add file → Upload files**, then drag in every file and folder from this zip (`index.html`, `features.html`, `pricing.html`, `contact.html`, `README.md`, and the whole `assets` folder), keeping the same folder structure.
3. Commit the upload.
4. Go to https://vercel.com, click **Add New → Project**, and import that new GitHub repository.
5. Leave all the build settings as default (this site has no framework/build step — Vercel will serve the files as-is) and click **Deploy**.
6. Vercel will give you a URL like `minipos-website.vercel.app`. You can later connect a custom domain (e.g. `minipos.com` or similar) from the project's Settings → Domains tab.

That's it — no separate account or chat needed for any of this; it all works the same way your POS app deployment did.
