import { IRoleAction } from '@/types/actions_rol.types';

export interface IPermissionContext {
  roleActions: IRoleAction | undefined;
  setRoleActions: (roleActions: IRoleAction) => void;
  returnActionsByView: (viewName: string) => string[];
}
