(() => {
  const measurementId = 'G-8WM4JZKBNR';
  const placeholderId = 'G-XXXXXXXXXX';

  if (!measurementId || measurementId === placeholderId || window.__FOOTHIVE_GA_INITIALIZED__) {
    return;
  }

  window.__FOOTHIVE_GA_INITIALIZED__ = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
})();