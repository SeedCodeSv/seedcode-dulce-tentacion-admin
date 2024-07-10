import { IGetContractTypePaginated } from '../../types/contarctType.types';

export interface IContractTypeStore {
  paginated_contract_type: IGetContractTypePaginated;
  loading_contract_type: boolean;
  limit_filter: number;
  getPaginatedContractType: (page: number, limit: number, name: string, isActive?: number) => void;
  postContractType: (name: string) => void;
  patchContratType: (name: string, id: number) => void;
  deleteContractType: (id: number) => Promise<boolean>;
  activateContractType: (id: number) => Promise<void>;
}
