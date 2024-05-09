import React from "react";
import { defaultTheme } from "../utils/constants";

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
  context: "light" | "dark";
  toggleContext: (context: "light" | "dark") => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: {} as Theme,
  toggleTheme: () => {},
  navbar: "",
  toggleNavBar: () => {},
  context: "light",
  toggleContext: () => {},
});

function ThemeProvider(props: Props) {
  const themeConfigured = localStorage.getItem("theme");

  const [theme, setTheme] = React.useState(
    themeConfigured ? JSON.parse(themeConfigured) : defaultTheme as Theme
  );

  const [navbar, setNavbar] = React.useState("sidebar");

  const toggleNavBar = (barType: string) => {
    setNavbar(barType);
  };

  const toggleTheme = (themeName: Theme) => {
    setTheme(themeName);
    localStorage.setItem("theme", JSON.stringify(themeName));
  };

  const [context, setContext] = React.useState<"light" | "dark">(
    localStorage.getItem("context") as "light" | "dark"
  );

  const toggleContext = (context: "light" | "dark") => {
    setContext(context);
    localStorage.setItem("context", context);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, navbar, toggleNavBar, context, toggleContext }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
