import { IConfiguration, IGetConfiguration } from "../../types/configuration.types";

export interface IConfigurationStore {
    personalization: IConfiguration[];
    OnCreateConfiguration: (payload: IGetConfiguration) => void;
    GetConfigurationByTransmitter: (id: number) => Promise<void>;
}