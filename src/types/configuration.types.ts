import { ITheme } from "./themes.types";

export interface IConfiguration {
  id?: number;
  logo: string;
  ext: string;
  name: string;
  themeName: number;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: number | boolean;
  salesForm: string;
  isActive?: boolean;
  themeId:number
}

export interface pachConfigurationName {
  name: string;
  wantPrint: number | boolean;
  salesForm: string;
}

export interface ICreacteConfiguaration {
  name: string;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: number | boolean;
  salesForm: string;
  file?: File | Blob | null;
}

export interface GetByTransmitter {
  personalization: IConfiguration;
  ok: boolean;
  messages: string;
}

// for theme by transmitter
export interface IGetTheme {
  ok: boolean
  personalization: Personalization
  status: number
}

export interface Personalization {
  id: number
  name: string
  context: string
  colors: Color
  theme: ITheme
}

interface Color {
  danger: string
  primary: string
  secondary: string
  third: string
  warning: string
  dark: string
}