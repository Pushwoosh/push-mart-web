// The onsite API ships with WebSDK 3.79+; on an older CDN build the blocks simply stay hidden.
const withSdk = () => new Promise((resolve) => {
  window.Pushwoosh = window.Pushwoosh || [];
  window.Pushwoosh.push(() => resolve(window.Pushwoosh.recommendations || null));
});

export async function fetchRecommendations(request) {
  const api = await withSdk();
  if (!api) {
    return { items: [], strategy: 'none' };
  }
  return api.fetch(request);
}

export function trackRecommendationClick(click) {
  withSdk().then((api) => api && api.trackClick(click)).catch(() => {});
}
