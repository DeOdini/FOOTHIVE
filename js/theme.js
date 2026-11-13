(() => {
  const storageKey = 'foothive-theme';
  const root = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  let mediaPreference;

  try {
    if (typeof window.matchMedia === 'function') {
      mediaPreference = window.matchMedia('(prefers-color-scheme: dark)');
    }
  } catch (error) {
    mediaPreference = undefined;
  }

  let explicitPreference;

  try {
    const savedPreference = window.localStorage.getItem(storageKey);

    if (savedPreference === 'light' || savedPreference === 'dark') {
      explicitPreference = savedPreference;
    }
  } catch (error) {
    explicitPreference = undefined;
  }

  let hasExplicitPreference = explicitPreference === 'light' || explicitPreference === 'dark';
  let currentTheme = hasExplicitPreference
    ? explicitPreference
    : mediaPreference?.matches
      ? 'dark'
      : 'light';
  let toggle;
  let icons = [];

  const syncToggle = () => {
    if (!toggle) {
      return;
    }

    toggle.setAttribute('aria-pressed', String(currentTheme === 'dark'));
    icons.forEach((icon) => {
      if (icon.getAttribute('data-theme-icon') === currentTheme) {
        icon.removeAttribute('hidden');
      } else {
        icon.setAttribute('hidden', '');
      }
    });
  };

  const applyTheme = (theme) => {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);

    if (themeColorMeta) {
      themeColorMeta.content = theme === 'dark' ? '#111311' : '#FAF8F4';
    }

    syncToggle();
  };

  applyTheme(currentTheme);

  if (mediaPreference) {
    const handlePreferenceChange = (event) => {
      if (!hasExplicitPreference) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof mediaPreference.addEventListener === 'function') {
      mediaPreference.addEventListener('change', handlePreferenceChange);
    } else if (typeof mediaPreference.addListener === 'function') {
      mediaPreference.addListener(handlePreferenceChange);
    }
  }

  const initializeToggle = () => {
    toggle = document.querySelector('[data-theme-toggle]');

    if (!toggle) {
      return;
    }

    icons = [...toggle.querySelectorAll('[data-theme-icon]')];
    syncToggle();

    toggle.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      hasExplicitPreference = true;
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch (error) {
        // Keep the current choice for this page session when storage is unavailable.
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeToggle, { once: true });
  } else {
    initializeToggle();
  }
})();
