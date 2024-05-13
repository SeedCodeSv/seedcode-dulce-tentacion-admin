export interface IConfiguration {
  id?: number;
  logo: string;
  ext: string;
  name: string;
  themeId: number;
  transmitterId: number;
  isActive?: boolean;
}

export interface ConfigurationPayload {
  logo: string;
  ext: string;
  name: string;
  themeId: number;
  transmitterId: number;
}

export interface IGetConfiguration extends ConfigurationPayload {
    file?: File | Blob | null | undefined;
  }
