/* eslint-disable no-unused-vars */
import React from 'react';

import defaultTheme from '@/themes/default-theme.json';
import { ITheme } from '@/types/themes.types';

interface Props {
  children: React.ReactNode;
}
interface ThemeContextType {
  theme: ITheme;
  toggleTheme: (themeName: ITheme) => void;
  navbar: string;
  toggleNavBar: (themeName: string) => void;
  context: 'light' | 'dark';
  toggleContext: (context: 'light' | 'dark') => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: defaultTheme as ITheme,
  toggleTheme: () => {},
  navbar: '',
  toggleNavBar: () => {},
  context: 'light',
  toggleContext: () => {},
});

function ThemeProvider(props: Props) {
  const themeConfigured = localStorage.getItem('theme');

  const [theme, setTheme] = React.useState(
    themeConfigured ? JSON.parse(themeConfigured) : (defaultTheme as ITheme)
  );

  const [navbar, setNavbar] = React.useState('sidebar');

  const toggleNavBar = (barType: string) => {
    setNavbar(barType);
  };

  const [context, setContext] = React.useState<'light' | 'dark'>(
    (localStorage.getItem('context') as 'light' | 'dark') ?? 'light'
  );

  const toggleTheme = (themeName: ITheme) => {
    window.document.body.style.backgroundColor = themeName.colors[context].background;
    window.document.body.style.color = themeName.colors[context].textColor;

    setTheme(themeName);
    localStorage.setItem('theme', JSON.stringify(themeName));
  };

  const toggleContext = (context: 'light' | 'dark') => {
    setContext(context);
    localStorage.setItem('context', context);
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

export const useTheme = () => React.useContext(ThemeContext);