export type ThemeMode = 'light' | 'dark' | 'system';

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set theme-color meta tag
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', isDark ? '#060708' : '#F8F9FA');
  }
}

export function initThemeWatcher(onThemeChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = () => {
    onThemeChange();
  };
  mediaQuery.addEventListener('change', listener);
  return () => mediaQuery.removeEventListener('change', listener);
}
