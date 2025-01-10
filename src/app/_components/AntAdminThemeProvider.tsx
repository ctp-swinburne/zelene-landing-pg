// _components/AntAdminThemeProvider.tsx
"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "~/theme/adminTheme";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => console.warn("ThemeContext not yet initialized"),
});

export const useTheme = () => useContext(ThemeContext);

export function AntAdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider
        theme={{
          ...(isDark ? darkTheme : lightTheme),
          algorithm: isDark
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        }}
      >
        <div className={isDark ? "dark" : ""}>{children}</div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
