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

export interface ConfigurationPayload {
  logo: string;
  ext: string;
  name: string;
  themeId: number;
  transmitterId: number;
}

export interface IGetConfiguration extends ICreacteConfiguaration {
  file?: File | Blob | null | undefined;
}

export interface pachConfigurationName {
  name: string;
  wantPrint: number | boolean;
}

export interface ICreacteConfiguaration {
  name: string;
  theme: string;
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
