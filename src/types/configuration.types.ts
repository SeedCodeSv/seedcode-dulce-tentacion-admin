export interface IConfiguration {
  id?: number;
  logo: string;
  ext: string;
  name: string;
  themeId: number;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: boolean;
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
}

export interface ICreacteConfiguaration {
  name: string;
  themeId: number;
  transmitterId: number;
  selectedTemplate: string;
  wantPrint: false | true;
  file?: File | Blob | null;
}

export interface GetByTransmitter {
  personalization: IConfiguration;
  ok: boolean;
  messages: string;
}
