// Names and attributes follow the Magento/WooCommerce plugins' contract (integration-woocommerce
// docs/events.md), so the recommender and journeys built for those stores work here too.
import {
  CURRENCY, describe, findProduct, imageUrl, productUrl,
} from '../data/catalog';

export const PRODUCT_VIEW = 'PW_ProductView';
export const ABANDONED_CART = 'PW_AbandonedCart';
export const ABANDONED_CART_UPDATE = 'PW_AbandonedCartUpdate';
export const ORDER_CREATED = 'PW_OrderCreated';

// Resolves when Pushwoosh accepted the event, so callers know it was delivered.
const postEvent = (event, attributes) => new Promise((resolve, reject) => {
  window.Pushwoosh.push((api) => api.postEvent(event, attributes).then(resolve, reject));
});

const fireEvent = (event, attributes) => postEvent(event, attributes).catch(() => {});

// What a beacon needs and the page cannot read synchronously while it unloads.
let beaconBase = null;

export function prepareBeacon() {
  window.Pushwoosh.push(async (api) => {
    const [entrypoint, hwid, deviceType] = await Promise.all([
      api.data.getApiEntrypoint(), api.data.getHwid(), api.data.getDeviceType(),
    ]);
    beaconBase = { url: `${entrypoint}postEvent`, hwid, deviceType };
  });
}

// Same request as the SDK's postEvent, sent with sendBeacon so it outlives the page.
export function beaconEvent({ event, attributes }, { application, userId }) {
  if (!beaconBase || !navigator.sendBeacon) {
    return false;
  }
  const now = new Date();
  const timestampUTC = Math.floor(now.getTime() / 1000);
  const request = {
    application,
    hwid: beaconBase.hwid,
    userId: userId || beaconBase.hwid,
    device_type: beaconBase.deviceType,
    event,
    attributes,
    timestampUTC,
    timestampCurrent: timestampUTC - now.getTimezoneOffset() * 60,
  };
  const body = new Blob([JSON.stringify({ request })], { type: 'text/plain;charset=UTF-8' });
  return navigator.sendBeacon(beaconBase.url, body);
}

export const deliverEvent = ({ event, attributes }) => postEvent(event, attributes);

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const normalizeUserId = (value) => {
  const trimmed = (value || '').trim();
  return isEmail(trimmed) ? trimmed.toLowerCase() : trimmed;
};

const contact = (userId) => {
  const email = isEmail(userId) ? userId : '';
  return { email, customerId: email || userId };
};

const pad = (n) => String(Math.abs(n)).padStart(2, '0');

// ISO-8601 with the browser's offset, as the plugins send the store's.
export const isoLocal = (date) => {
  const offset = -date.getTimezoneOffset();
  const local = new Date(date.getTime() + offset * 60000).toISOString().slice(0, 19);
  return `${local}${offset >= 0 ? '+' : '-'}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`;
};

const money = (value) => Math.round(value * 100) / 100;

const lineItems = (cart) => cart
  .map(({ id, quantity }) => ({ product: findProduct(id), quantity }))
  .filter(({ product }) => product)
  .map(({ product, quantity }) => ({
    productId: product.id,
    sku: product.id,
    name: product.nameLocal,
    description: describe(product),
    price: Number(product.price),
    quantity,
    imageUrl: imageUrl(product),
    productUrl: productUrl(product.id),
    category: product.category,
  }));

const totals = (items) => {
  const totalPrice = money(items.reduce((sum, { price, quantity }) => sum + price * quantity, 0));
  return {
    totalPrice, shippingAmount: 0, taxAmount: 0, discountAmount: 0, currency: CURRENCY,
  };
};

export function postProductView(product) {
  fireEvent(PRODUCT_VIEW, {
    productId: product.id,
    name: product.nameLocal,
    price: Number(product.price),
    currency: CURRENCY,
    category: product.category,
    productUrl: productUrl(product.id),
    imageUrl: imageUrl(product),
  });
}

export function cartEvent(event, {
  cartId, createdAt, cart, userId, orderUrl,
}) {
  const items = lineItems(cart);
  return {
    event,
    attributes: {
      orderId: cartId,
      source: 1,
      ...contact(userId),
      items,
      createdDate: isoLocal(createdAt),
      abandonedDate: isoLocal(new Date()),
      ...totals(items),
      orderUrl,
    },
  };
}

export function postOrderCreated({ orderId, cart, userId }) {
  const items = lineItems(cart);
  const now = isoLocal(new Date());
  fireEvent(ORDER_CREATED, {
    orderId,
    orderNumber: orderId,
    source: 1,
    ...contact(userId),
    items,
    createdDate: now,
    updatedDate: now,
    shippingMethod: 'Free shipping',
    ...totals(items),
    status: 'pending',
  });
}
