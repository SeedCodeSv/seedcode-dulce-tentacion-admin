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
  context: "light" | "dark";
  colors: Color;
}
interface ThemeContextType {
  theme: Theme;
  toggleTheme: (themeName: Theme) => void;
  navbar: string;
  toggleNavBar: (themeName: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: {} as Theme,
  toggleTheme: () => {},
  navbar: "",
  toggleNavBar: () => {},
});

function ThemeProvider(props: Props) {
  const themeConfigured = localStorage.getItem("theme");

  const [theme, setTheme] = React.useState(
    themeConfigured ? JSON.parse(themeConfigured) : THEMES.themes[0]
  );

  const [navbar, setNavbar] = React.useState("sidebar");

  const toggleNavBar = (barType: string) => {
    setNavbar(barType);
  };

  const toggleTheme = (themeName: Theme) => {
    setTheme(themeName);
    localStorage.setItem("theme", JSON.stringify(themeName));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, navbar, toggleNavBar }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
