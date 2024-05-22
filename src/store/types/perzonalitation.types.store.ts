import { IConfiguration, IGetConfiguration, pachConfigurationName } from "../../types/configuration.types";

export interface IConfigurationStore {
    personalization: IConfiguration[];
    config: IConfiguration
    // logo_name: { logo: string, name: string };
    OnCreateConfiguration: (payload: IGetConfiguration) => void;
    GetConfigurationByTransmitter: (id: number) => Promise<void>;
    UpdateConfigurationName: (payload: pachConfigurationName, id: number) => Promise<boolean>;
    GetConfiguration: (id: number) => void
}