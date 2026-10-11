import catalog from './products';

export const SITE_ORIGIN = 'https://pushon.pushwoosh.com';
export const CURRENCY = 'USD';

export const products = catalog.flatMap(({ title, items }) => (
  items.map((item) => ({ ...item, category: title }))
));

export const findProduct = (id) => products.find((product) => product.id === id);

export const productPath = (id) => `/product/${id}/`;

export const productUrl = (id) => `${SITE_ORIGIN}${productPath(id)}`;

export const imageUrl = (product) => `${SITE_ORIGIN}${product.img}.jpg`;

export const describe = ({ textLocal }) => (Array.isArray(textLocal) ? textLocal.join(' • ') : textLocal);
