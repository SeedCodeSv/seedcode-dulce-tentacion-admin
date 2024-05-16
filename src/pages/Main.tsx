import { useContext, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../router";
import { SessionContext } from "../hooks/useSession";
import Auth from "./Auth";
import { useAuthStore } from "../store/auth.store";
import { useActionsRolStore } from "../store/actions_rol.store";
import { ActionsContext } from "../hooks/useActions";

function Main() {
  const { isAuth } = useContext(SessionContext);
  const {user} = useAuthStore();
  const {OnGetActionsByRoleReturn} = useActionsRolStore();
  const {setRoleActions} = useContext(ActionsContext);
    useEffect(() => {
        if (user) {
            OnGetActionsByRoleReturn(user.roleId).then((data) => {
                setRoleActions(data)
            })
        }
    }, []);

  return isAuth ? <RouterProvider router={router()} />  : <Auth />
}

export default Main;
