# PushMart Online Shop

A demo web shop that shows the [Pushwoosh Web SDK](https://docs.pushwoosh.com/developer/pushwoosh-sdk/web-push-notifications/) in action: web push subscription, in-app messages and Inbox, tags, events and purchases.

**Live:** https://pushon.pushwoosh.com

## Try it

1. Open https://pushon.pushwoosh.com/?appcode=5854E-296FF — `5854E-296FF` is the Pushwoosh demo app.
   Want pushes from your own app instead? Pass its code: `?appcode=XXXXX-XXXXX`, or enter it on the start screen.
2. Click **Subscribe** and allow notifications in the browser prompt. Use a regular desktop browser (Chrome, Firefox, Edge, Safari); incognito and headless browsers can't receive pushes.
3. Play with the shop — the SDK reports what you do:

   | Action | Sent to Pushwoosh |
   |---|---|
   | Add a product to the cart | event `ProductAdd` (`id`) |
   | Empty the cart | event `CartCleared` |
   | Add or remove a wishlist item | tag `WishList` |
   | Checkout | `setPurchase` per product + event `CheckoutSuccess` |
   | Set a user ID on the products page | `registerUser` |

4. Send a push from the [Pushwoosh Control Panel](https://app.pushwoosh.com) of the app you subscribed with — target all subscribers, your user ID, or an audience built from the tags and events above. The notification arrives even when the tab is closed.

Query parameters:

- `appcode=XXXXX-XXXXX` — application code to initialize the SDK with.
- `autoSubscribe=1` — show the browser permission prompt right after the SDK initializes.

## Run locally

Requires Node.js 22.

```sh
npm ci
npm start          # dev server on http://localhost:3000
```

`localhost` counts as a secure context, so the service worker and push subscription work locally too.

Other scripts:

```sh
npm run build      # production build into build/
npm run server     # serve build/ on http://localhost:8080
npm run lint
npm run analyze    # bundle analyzer
```

## How it works

- The SDK is loaded from the CDN (`https://cdn.pushwoosh.com/webpush/v3/pushwoosh-web-notifications.js`, see `src/index.html`) and initialized in `src/HoC/withCartTracking.js`.
- `public/pushwoosh-service-worker.js` imports the Pushwoosh service worker from the CDN. It must be served from the site root, so its scope covers the whole site.
- It's a single-page app (React + react-router). The build also emits `404.html` as a copy of `index.html`, so direct links like `/products/` work on GitHub Pages.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`). The custom domain comes from `public/CNAME` (`pushon.pushwoosh.com`, DNS CNAME → `pushwoosh.github.io`), and HTTPS is enforced in the Pages settings.

To ship a change: open a PR to `main` and merge it — the deploy runs automatically (Actions → *Deploy to GitHub Pages*).
