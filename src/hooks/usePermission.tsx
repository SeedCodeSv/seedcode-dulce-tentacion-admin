import { createContext, useContext, useState } from 'react';

import { IPermissionContext } from './types/actions.types';

import { get_role_actions } from '@/storage/localStorage';
import { IRoleAction } from '@/types/actions_rol.types';

export const PermissionContext = createContext<IPermissionContext>({
  roleActions: get_role_actions(),
  setRoleActions: () => {},
  returnActionsByView: () => [],
});

interface Props {
  children: React.ReactNode;
}

export default function PermissionProvider({ children }: Props) {
  const [roleActions, setRoleActions] = useState<IRoleAction | undefined>(get_role_actions());

  const handleSetRoleActions = (roleActions: IRoleAction) => {
    setRoleActions(roleActions);
  };

  const returnActionsByView = (viewName: string) => {
    return roleActions?.views.find((v) => v.view.name === viewName)?.view.actions.map((a) => a.name) || [];
  };

  return (
    <PermissionContext.Provider
      value={{
        roleActions: roleActions,
        setRoleActions: (roleActions) => handleSetRoleActions(roleActions),
        returnActionsByView: (viewName) => returnActionsByView(viewName),
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  return useContext(PermissionContext);
}
