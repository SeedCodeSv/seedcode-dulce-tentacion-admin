import { useContext, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../router";
import { router_seller } from "../router_seller";
import { SessionContext } from "../hooks/useSession";
import Auth from "./Auth";
import { useAuthStore } from "../store/auth.store";
import { useActionsRolStore } from "../store/actions_rol.store";
import { ActionsContext } from "../hooks/useActions";
function Main() {
  const { isAuth, mode } = useContext(SessionContext);
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
  return (
    <>
      {isAuth ? (
        mode !== "" ? (
          <RouterProvider router={router_seller()} />
        ) : (
          <RouterProvider router={router()} />
        )
      ) : (
        <Auth />
      )}
    </>
  );
}

export default Main;
