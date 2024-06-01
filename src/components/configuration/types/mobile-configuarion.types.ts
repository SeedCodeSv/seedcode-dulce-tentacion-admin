import { IConfiguration } from "../../../types/configuration.types";

export interface MovileViewProps {
    layout: 'grid' | 'list'
    handleEdit: (configuration: IConfiguration) => void;
}

export interface GridProps extends MovileViewProps {
    configuration: IConfiguration
}