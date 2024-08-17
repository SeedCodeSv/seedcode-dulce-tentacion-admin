export interface IConfiguration {
  id?: number;
  logo: string;
  ext: string;
  name: string;
  themeId: number;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: number;
  isActive?: boolean;
}

export interface pachConfigurationName {
  name: string;
  wantPrint: number | boolean;
}

export interface ICreacteConfiguaration {
  name: string;
  themeName: string | number;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: number;
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

interface Personalization {
  id: number
  name: string
  context: string
  colors: Color
}

interface Color {
  danger: string
  primary: string
  secondary: string
  third: string
  warning: string
  dark: string
}