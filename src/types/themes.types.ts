export interface ThemePayload {
  name: string;
  context: 'light' | 'dark';
  colors: Color[];
}

export interface Color {
  color: string;
  name: string;
}

export interface ColorTheme {
  id: number;
  name: string;
  color: string;
  isActive: boolean;
  themeId: number;
}

export interface Theme {
  id: number;
  name: string;
  context: "dark" | "light";
  isActive: boolean;
  colors: ColorTheme[];
}

export interface IGetPaginatedThemes {
  ok: boolean;
  themes: Theme[];
  total: number;
  totalPag: number;
  currentPag: number;
  nextPag: number;
  prevPag: number;
  status: number;
}
