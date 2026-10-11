// Build-time pages from the catalog: one static HTML per product (GitHub Pages answers 200,
// not the 404 of the SPA fallback) and a Google Merchant feed for Pushwoosh Product Catalog.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const catalog = require('../src/data/products.json');

const SITE_ORIGIN = 'https://pushon.pushwoosh.com';
const CURRENCY = 'USD';
const TITLE = 'PushMart Online Shop';

const products = catalog.flatMap(({ title, items }) => (
  items.map((item) => ({ ...item, category: title }))
));

const describe = ({ textLocal }) => (Array.isArray(textLocal) ? textLocal.join(' • ') : textLocal);

const xml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const productUrl = (id) => `${SITE_ORIGIN}/product/${id}/`;
const imageUrl = (product) => `${SITE_ORIGIN}${product.img}.jpg`;

function productPages(template) {
  return products.map((product) => new HtmlWebpackPlugin({
    template,
    chunks: ['main'],
    filename: `product/${product.id}/index.html`,
    title: `${product.nameLocal} — ${TITLE}`,
    meta: {
      'og:title': { property: 'og:title', content: product.nameLocal },
      'og:description': { property: 'og:description', content: describe(product) },
      'og:image': { property: 'og:image', content: imageUrl(product) },
      'og:url': { property: 'og:url', content: productUrl(product.id) },
    },
  }));
}

function feedXml() {
  const items = products.map((p) => `    <item>
      <g:id>${xml(p.id)}</g:id>
      <g:title>${xml(p.nameLocal)}</g:title>
      <g:description>${xml(describe(p))}</g:description>
      <g:link>${xml(productUrl(p.id))}</g:link>
      <g:image_link>${xml(imageUrl(p))}</g:image_link>
      <g:price>${xml(p.price)} ${CURRENCY}</g:price>
      <g:availability>in_stock</g:availability>
      <g:product_type>${xml(p.category)}</g:product_type>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${TITLE}</title>
    <link>${SITE_ORIGIN}</link>
    <description>Pushwoosh demo shop catalog</description>
${items}
  </channel>
</rss>
`;
}

function productFeedPlugin(compiler) {
  const { Compilation, sources } = compiler.webpack;
  compiler.hooks.thisCompilation.tap('ProductFeedPlugin', (compilation) => {
    compilation.hooks.processAssets.tap(
      { name: 'ProductFeedPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
      () => compilation.emitAsset('feed.xml', new sources.RawSource(feedXml())),
    );
  });
}

module.exports = {
  TITLE,
  productPages: (srcDir) => productPages(path.join(srcDir, 'index.html')),
  productFeedPlugin,
};
