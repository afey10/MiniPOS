# MiniKart — Marketing Website

A simple, static 4-page website (Home, Features, Pricing, Contact) for selling MiniKart as a product.
No build step needed — it's plain HTML/CSS/JS. Uses your real MiniKart logo and real screenshots
of the app (dashboard, checkout, orders, inventory, purchases, expenses, reports).

Animation, inspired by the "animated agency" style of site — a few deliberate moments rather than
motion on everything:

- **Intro** — the first page someone opens in a browser session shows a short (~1s) MiniKart logo
  intro that lifts away to reveal the page. It doesn't replay as they click around, and any click,
  key or scroll skips it.
- **Hero** — the headline rises in word by word, followed by the rest of the hero; the dashboard
  screenshot starts tilted back in 3D and flattens as you scroll into it.
- **Product tour (home page, desktop)** — the screenshot pins in place while you scroll through the
  four features, swapping screens as each one comes into focus. On phones it's a normal stacked list.
- **Screenshots** elsewhere reveal with a blue curtain wipe; section headings rise in word by word.
- Small details: magnetic buttons, a cursor dot on desktop, a header that tucks away when you
  scroll down and comes back when you scroll up, an animated mobile menu, counting stats, and a
  soft cross-fade between pages in browsers that support it.

All of it respects a visitor's "reduce motion" setting (content simply fades in), and nothing
depends on the animation code to be visible: if `assets/script.js` fails to load, the page shows
everything normally.

**Adding new content:** put `data-reveal` on an element to fade it in on scroll,
`data-reveal="words"` on a heading for the word-by-word rise, or `data-reveal="media"` on a
screenshot box (with the image inside `<span class="wipe">`) for the curtain wipe.

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
