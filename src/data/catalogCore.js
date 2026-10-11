// CommonJS on purpose: the app imports it and the build (build-tools/catalogPages.js) requires it.
const catalog = require('./products.json');

const SITE_ORIGIN = 'https://pushon.pushwoosh.com';
const CURRENCY = 'USD';

const products = catalog.flatMap(({ title, items }) => (
  items.map((item) => ({ ...item, category: title }))
));

const productPath = (id) => `/product/${id}/`;
const productUrl = (id) => `${SITE_ORIGIN}${productPath(id)}`;
const imageUrl = (product) => `${SITE_ORIGIN}${product.img}.jpg`;
const describe = ({ textLocal }) => (Array.isArray(textLocal) ? textLocal.join(' • ') : textLocal);

module.exports = {
  SITE_ORIGIN, CURRENCY, products, productPath, productUrl, imageUrl, describe,
};
