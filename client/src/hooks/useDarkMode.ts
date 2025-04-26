import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

export const useDarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_KEY) || 'light'
  );
  const colorTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme, colorTheme]);

  return {
    switchTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    theme,
    darkSide: theme === 'dark',
  };
};
