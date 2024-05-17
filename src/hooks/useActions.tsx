import { ReactNode, createContext, useState } from "react";
import { RoleViewAction } from "../types/actions_rol.types";

export interface IActionsContext {
    roleActions: RoleViewAction | undefined;
    setRoleActions: (role_actions: RoleViewAction | undefined) => void;
}

export const ActionsContext = createContext<IActionsContext>({
    roleActions: undefined,
    setRoleActions: () => {},
})

export default function ActionsProvider({children} : {children: ReactNode}) {
    const [roleActions, setRoleActions] = useState<RoleViewAction>();

    return (
        <ActionsContext.Provider 
            value={{
                roleActions,
                setRoleActions: (roleActions) => setRoleActions(roleActions)
            }}
        >
            {children}
        </ActionsContext.Provider>
    )
}