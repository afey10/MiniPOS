# MiniKart — Marketing Website

A simple, static 4-page website (Home, Features, Pricing, Contact) for selling MiniKart as a product.
No build step needed — it's plain HTML/CSS/JS. Uses your real MiniKart logo and real screenshots
of the app (dashboard, checkout, orders, inventory, purchases, expenses, reports).

Animation, inspired by the "animated agency" style of site (staggered hero text, a looping
feature marquee, screenshots that wipe into view, magnetic buttons, live counters, a custom
cursor on desktop): a few deliberate moments rather than motion on everything. All of it respects
a visitor's "reduce motion" accessibility setting automatically.

## Before you publish this

1. The contact form now sends to `info@minikart.com` (set in `assets/script.js`, and shown as the listed email in `contact.html`). If that's not the right inbox, update it in both places.
2. Open `contact.html` and replace the placeholder phone number text.
3. Open `pricing.html` and replace the placeholder "MVR 0" prices with your real prices.
4. The screenshots throughout the site are real captures of your app, still showing your
   "ARH Fill in the Blank" demo data (product names, sale totals, etc). That's normal for a demo
   account and fine to publish as-is, but if you'd rather show a clean/empty account, set one up,
   take fresh screenshots, and swap the files in `assets/screenshot-*.png` (same filenames).
5. `assets/minikart-wordmark-on-blue.png` (the horizontal logo lockup on a blue background) isn't
   used on the pages themselves — it's there if you want it for a social-media profile picture or
   a link preview image later.

## How to publish it (same GitHub + Vercel workflow you already used)

1. Go to https://github.com/new and create a **new, separate** repository (for example `minikart-website`). Don't upload this into your existing POS app repo — this is a different project.
2. On the new repo's page, click **Add file → Upload files**, then drag in every file and folder from this zip (`index.html`, `features.html`, `pricing.html`, `contact.html`, `README.md`, and the whole `assets` folder), keeping the same folder structure.
3. Commit the upload.
4. Go to https://vercel.com, click **Add New → Project**, and import that new GitHub repository.
5. Leave all the build settings as default (this site has no framework/build step — Vercel will serve the files as-is) and click **Deploy**.
6. Vercel will give you a URL like `minikart-website.vercel.app`. You can later connect a custom domain (e.g. `minikart.com` or similar) from the project's Settings → Domains tab.

That's it — no separate account or chat needed for any of this; it all works the same way your POS app deployment did.
