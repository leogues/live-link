import { createContext, useEffect, useState } from "react";

interface ThemeValue {
  theme: string;
  switchTheme: () => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export const ThemeContext = createContext<ThemeValue>({
  theme: "",
  switchTheme: () => {},
});

export const ThemeProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  const switchTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
