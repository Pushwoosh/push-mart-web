const API_PATH = '/json/1.3/';
const ALLOWED_DOMAINS = ['pushwoosh.com', 'pushwoosh.us'];

// A link may point the SDK at another Pushwoosh region, e.g. ?apiurl=api.pushwoosh.us.
// Only https Pushwoosh hosts are accepted, so a crafted link cannot send visitor data elsewhere.
export default function parseApiUrl(raw) {
  if (!raw) {
    return null;
  }

  let value;
  try {
    value = decodeURIComponent(raw).trim();
  } catch (e) {
    return null;
  }

  if (value === 'default') {
    return '';
  }

  let url;
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`);
  } catch (e) {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const allowed = ALLOWED_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
  if (url.protocol !== 'https:' || !allowed) {
    return null;
  }

  const path = url.pathname === '/' ? API_PATH : url.pathname.replace(/\/?$/, '/');
  return `${url.origin}${path}`;
}
