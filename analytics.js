(function () {
  'use strict';

  // Set this to the verified /count URL supplied by the owner's GoatCounter account.
  // Empty means disabled: no analytics script or requests are sent.
  const goatCounterEndpoint = '';

  if (!goatCounterEndpoint || location.hostname !== 'denisukranian.github.io' ||
      !location.pathname.startsWith('/carve-values/')) return;

  let endpoint;
  try { endpoint = new URL(goatCounterEndpoint); } catch { return; }
  if (endpoint.protocol !== 'https:' ||
      !/^[a-z0-9][a-z0-9-]*\.goatcounter\.com$/.test(endpoint.hostname) ||
      endpoint.pathname !== '/count' || endpoint.search || endpoint.hash ||
      endpoint.username || endpoint.password || endpoint.port) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', endpoint.href);
  script.setAttribute('data-goatcounter-settings', JSON.stringify({
    path: '/carve-values/',
    title: 'Carve Values',
    referrer: '',
    no_events: true
  }));
  document.head.appendChild(script);
}());
