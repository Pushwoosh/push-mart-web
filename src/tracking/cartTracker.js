import store from '../store';
import { SITE_ORIGIN } from '../data/catalog';
import {
  ABANDONED_CART, ABANDONED_CART_UPDATE, beaconEvent, cartEvent, deliverEvent, prepareBeacon,
} from './pwEvents';

const STORAGE_KEY = 'pwCart';
const DEBOUNCE_MS = 2000;
const RETRY_MS = 1000;

const signature = (cart) => cart.map(({ id, quantity }) => `${id}:${quantity}`).sort().join(',');

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    return null;
  }
};

// Storage can be full or blocked; the cart then lives for this page only.
const save = (session) => {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    // keep the in-memory session
  }
};

const newCartId = () => (window.crypto && window.crypto.randomUUID
  ? window.crypto.randomUUID()
  : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);

const MAX_QUANTITY = 99;

const toPairs = (cart) => cart.map(({ id, quantity }) => [id, quantity]);

export const encodeCart = (cart) => btoa(JSON.stringify(toPairs(cart)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

// The link is user-editable: unknown shapes are dropped, repeated ids merged, quantities clamped.
export const decodeCart = (value) => {
  let pairs;
  try {
    pairs = JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (e) {
    return [];
  }
  if (!Array.isArray(pairs)) {
    return [];
  }

  const quantities = new Map();
  pairs.filter((pair) => Array.isArray(pair) && typeof pair[0] === 'string').forEach(([id, qty]) => {
    const quantity = Math.floor(Number(qty)) || 1;
    quantities.set(id, Math.min(MAX_QUANTITY, (quantities.get(id) || 0) + Math.max(1, quantity)));
  });
  return [...quantities].map(([id, quantity]) => ({ id, quantity }));
};

const recoveryUrl = (code, cart) => `${SITE_ORIGIN}/cart/?appcode=${code}&restore=${encodeCart(cart)}`;

// One cart is one Pushwoosh cart id: the first change of a cart is PW_AbandonedCart,
// later ones PW_AbandonedCartUpdate. Deciding that it is abandoned is the journey's job.
let session = load();
let last = signature(store.getState().cart);
let timer = null;
let inFlight = false;

const schedule = (ms) => {
  clearTimeout(timer);
  timer = setTimeout(send, ms); // eslint-disable-line no-use-before-define
};

// A cart counts as notified only once Pushwoosh accepted its PW_AbandonedCart:
// an event lost on the way is sent again as the first one, not as an update.
function send({ unloading = false } = {}) {
  timer = null;
  const { cart, app } = store.getState();
  if (!session || !app.code) {
    return;
  }
  if (!session.notified && cart.length === 0) {
    session = null;
    save(null);
    return;
  }
  if (inFlight && !session.notified && !unloading) {
    schedule(RETRY_MS);
    return;
  }

  const userId = app.registeredUserId || '';
  const cartId = session.id;
  const payload = cartEvent(session.notified ? ABANDONED_CART_UPDATE : ABANDONED_CART, {
    cartId,
    createdAt: new Date(session.createdAt),
    cart,
    userId,
    orderUrl: recoveryUrl(app.code, cart),
  });
  if (cart.length === 0) {
    session = null;
    save(null);
  }

  const markNotified = () => {
    if (session && session.id === cartId && !session.notified) {
      session = { ...session, notified: true };
      save(session);
    }
  };

  if (unloading && beaconEvent(payload, { application: app.code, userId })) {
    markNotified();
    return;
  }
  inFlight = true;
  deliverEvent(payload).then(markNotified, () => {}).finally(() => {
    inFlight = false;
  });
}

window.Pushwoosh = window.Pushwoosh || [];
prepareBeacon();

// The first event of a cart may have died with the previous page.
if (session && !session.notified && store.getState().cart.length) {
  schedule(DEBOUNCE_MS);
}

store.subscribe(() => {
  const { cart } = store.getState();
  const next = signature(cart);
  if (next === last) {
    return;
  }
  last = next;

  if (!session) {
    if (cart.length === 0) {
      return;
    }
    session = {
      id: newCartId(),
      createdAt: new Date().toISOString(),
      notified: false,
    };
    save(session);
  }
  schedule(DEBOUNCE_MS);
});

// Leaving the page would drop the debounced event; a beacon outlives the page.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && timer) {
    clearTimeout(timer);
    send({ unloading: true });
  }
});

// The cart became an order: nothing is left to abandon.
export function completeOrder() {
  clearTimeout(timer);
  timer = null;
  session = null;
  save(null);
}

// The cart tag lands on whoever sent the event, so a new user needs it again.
// A pending send already reads the new user; a first event still on its way is followed up.
export function resendCart() {
  if (!session || timer) {
    return;
  }
  if (session.notified) {
    send();
  } else {
    schedule(RETRY_MS);
  }
}
