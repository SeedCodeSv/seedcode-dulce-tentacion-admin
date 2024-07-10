import { IGetStatusEmployeePaginated } from '../../types/statusEmployee.types';

export interface IStatusEmployeeStore {
  paginated_status_employee: IGetStatusEmployeePaginated;
  loading_status_employee: boolean;
  limit_filter: number;
  getPaginatedStatusEmployee: (page: number, limit: number, name: string, isActive?: number) => void;
  postStatusEmployee: (name: string) => void;
  patchStatusEmployee: (name: string, id: number) => void;
  deleteStatuEmployee: (id: number) => Promise<boolean>;
  activateStatusEmployee: (id: number) => Promise<void>;
}
