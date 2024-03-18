import React from "react";
import THEMES from "../themes.json";

interface Props {
  children: React.ReactNode;
}
export interface Color {
  danger: string;
  primary: string;
  secondary: string;
  third: string;
  warning: string;
  dark: string;
}

export interface Theme {
  name: string;
  colors: Color;
}
interface ThemeContextType {
  theme: Theme;
  toggleTheme: (themeName: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: {} as Theme,
  toggleTheme: () => {},
});

function ThemeProvider(props: Props) {
  const themeConfigured = localStorage.getItem("theme");

  const [theme, setTheme] = React.useState(
    themeConfigured ? JSON.parse(themeConfigured) : THEMES.themes[0]
  );

  const toggleTheme = (themeName: Theme) => {
    setTheme(themeName);
    localStorage.setItem("theme", JSON.stringify(themeName));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
