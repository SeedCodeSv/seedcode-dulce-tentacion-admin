import { IConfiguration, IGetConfiguration } from "../../types/configuration.types";

export interface IConfigurationStore {
    personalization: IConfiguration[];
    logo_name: { logo: string, name: string };
    OnCreateConfiguration: (payload: IGetConfiguration) => void;
    GetConfigurationByTransmitter: (id: number) => Promise<void>;
}