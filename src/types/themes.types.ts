import { IPagination } from "./global.types";

export interface ThemePayload {
  name: string;
  context: 'light' | 'dark';
  colors: Color[];
  transmitterId?: number;
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
  context: 'dark' | 'light';
  isActive: boolean;
  colors: ColorTheme[];
}

export interface findOne {
  ok: boolean;
  message: string;
  themes: Theme[];
  status: number;
}

// New theme system
export interface Menu {
  textColor: string;
  background: string;
}

export interface Button {
  error: string;
  success: string;
  warning: string;
  primary: string;
  info: string;
  secondary: string;
  default: string;
}

export interface Context {
  background: string;
  textColor: string;
  menu: Menu;
  table: {
    background: string;
    textColor: string;
  };
  buttons: {
    colors: Button;
    textColor: string;
    textDefaultColor: string;
  };
}

export interface Menu {
  textColor: string;
  background: string;
}

export interface Color {
  light:  Context;
  dark: Context;
}

export interface ITheme {
  name: string;
  colors: Color;
}

export enum Colors {
  Error = 'error',
  Success = 'success',
  Warning = 'warning',
  Primary = 'primary',
  Info = 'info',
  Secondary = 'secondary',
  Default = 'default',
}

export interface ThemeData {
  id: number;
  transmitterId: number;
  theme: ITheme;
}

export interface IGetPaginationThemes  extends IPagination{
  themes: ThemeData[];
}
