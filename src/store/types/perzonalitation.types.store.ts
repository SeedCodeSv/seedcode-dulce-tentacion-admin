import {
  IConfiguration,
  ICreacteConfiguaration,
  pachConfigurationName,
} from '../../types/configuration.types';

export interface IConfigurationStore {
  personalization: IConfiguration[];
  config: IConfiguration;
  // logo_name: { logo: string, name: string };
  OnCreateConfiguration: (payload: ICreacteConfiguaration) => void;
  GetConfigurationByTransmitter: (id: number) => Promise<void>;
  UpdateConfigurationName: (payload: pachConfigurationName, id: number) => Promise<boolean>;
  GetConfiguration: (id: number) => void;
}
