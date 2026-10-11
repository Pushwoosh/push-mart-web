# PushMart Online Shop

A demo web shop that shows the [Pushwoosh Web SDK](https://docs.pushwoosh.com/developer/pushwoosh-sdk/web-push-notifications/) in action: web push subscription, in-app messages and Inbox, tags and e-commerce events.

**Live:** https://pushon.pushwoosh.com

## Try it

1. Open https://pushon.pushwoosh.com/?appcode=5854E-296FF — `5854E-296FF` is the Pushwoosh demo app.
   Want pushes from your own app instead? Pass its code: `?appcode=XXXXX-XXXXX`, or enter it on the start screen.
2. Click **Subscribe** and allow notifications in the browser prompt. Use a regular desktop browser (Chrome, Firefox, Edge, Safari); incognito and headless browsers can't receive pushes.
3. Play with the shop — the SDK reports what you do. Event names and attributes are the ones the
   Pushwoosh Magento and WooCommerce plugins send, so the product recommender (Products block, cart
   block) and journeys built for those stores work here too:

   | Action | Sent to Pushwoosh |
   |---|---|
   | Open a product page | event `PW_ProductView` (`productId`, `name`, `price`, `category`, …) |
   | First change of a cart | event `PW_AbandonedCart` (`orderId` = cart id, `items[]`, `totalPrice`, `orderUrl`, …) |
   | Every later change of that cart, emptying it, or setting an email | event `PW_AbandonedCartUpdate` |
   | Checkout | event `PW_OrderCreated` (`orderId`, `items[]`, `totalPrice`, `status`, …) + `CheckoutSuccess` |
   | Add or remove a wishlist item | tag `WishList` |
   | Set an email or user ID (products page or cart) | `registerUser`; an email also gets `registerEmail` |

   Cart events are sent 2 s after the last change, or at once with `sendBeacon` when the page is left. Whether a cart counts as abandoned is decided by
   the journey (e.g. *wait 30 min → no `PW_OrderCreated` → send the cart email*): the shop has no
   backend to run a timer. `orderUrl` restores the cart in any browser.

4. Send a push from the [Pushwoosh Control Panel](https://app.pushwoosh.com) of the app you subscribed with — target all subscribers, your user ID, or an audience built from the tags and events above. The notification arrives even when the tab is closed.

### Product catalog

Every product has its own page, `https://pushon.pushwoosh.com/product/<id>/`, and the build publishes
a Google Merchant feed of the whole catalog: `https://pushon.pushwoosh.com/feed.xml`. To get product
recommendations for your app, put the feed URL into Control Panel → Content → Product Catalog.
The catalog syncs hourly, or right away with Sync.

Query parameters:

- `appcode=XXXXX-XXXXX` — application code to initialize the SDK with. Works on any page, so links
  from emails (product pages, the cart recovery link) open in a fresh browser too.
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
- Product pages and `feed.xml` are generated at build time from `src/data/products.json` (`build-tools/catalogPages.js`), so product links answer 200, not the 404 of the SPA fallback.
- Pushwoosh events are built in `src/tracking/`: `pwEvents.js` holds the payloads, `cartTracker.js` follows the cart in the Redux store.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`). The custom domain comes from `public/CNAME` (`pushon.pushwoosh.com`, DNS CNAME → `pushwoosh.github.io`), and HTTPS is enforced in the Pages settings.

To ship a change: open a PR to `main` and merge it — the deploy runs automatically (Actions → *Deploy to GitHub Pages*).
