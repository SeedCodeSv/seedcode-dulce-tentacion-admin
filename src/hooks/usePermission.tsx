import { get_role_actions } from '@/storage/localStorage';
import { IRoleAction } from '@/types/actions_rol.types';
import { createContext, useState } from 'react';
import { IPermissionContext } from './types/actions.types';

export const PermissionContext = createContext<IPermissionContext>({
  roleActions: get_role_actions(),
  setRoleActions: () => {},
});

interface Props {
  children: React.ReactNode;
}

export default function PermissionProvider({ children }: Props) {
  const [roleActions, setRoleActions] = useState<IRoleAction | undefined>(get_role_actions());

  const handleSetRoleActions = (roleActions: IRoleAction) => {
    setRoleActions(roleActions);
  };

  return (
    <PermissionContext.Provider
      value={{
        roleActions: roleActions,
        setRoleActions: (roleActions) => handleSetRoleActions(roleActions),
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}
