import core from './catalogCore';

export const {
  SITE_ORIGIN, CURRENCY, products, productPath, productUrl, imageUrl, describe,
} = core;

export const findProduct = (id) => products.find((product) => product.id === id);
