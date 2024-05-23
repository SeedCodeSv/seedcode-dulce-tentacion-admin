import { Role } from '../../types/roles.types';

export interface IUseRolesStore {
  roles_list: Role[];
  getRolesList: () => void;
}
