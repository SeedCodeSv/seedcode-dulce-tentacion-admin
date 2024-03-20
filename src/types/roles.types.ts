export interface Role {
  id: number;
  name: string;
  isActive: boolean;
}

export interface IGetRoleList {
  ok: boolean;
  message: string;
  roles: Role[];
}
