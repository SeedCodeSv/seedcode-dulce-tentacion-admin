// import { useContext, useEffect } from "react";
// import {router} from "./router/index"
// import { useAuthStore } from "./store/auth.store";
// import { useActionsRolStore } from "./store/actions_rol.store";
// import { ActionsContext } from "./hooks/useActions";

// function MainContent() {
//     const {user} = useAuthStore();

//     const {OnGetActionsByRoleReturn} = useActionsRolStore();
//     const {setRoleActions} = useContext(ActionsContext);
//     useEffect(() => {
//         if (user) {
//             OnGetActionsByRoleReturn(user.roleId).then((data) => {
//                 setRoleActions(data)
//             })
//         }
//     }, []);
//     return router
// }
// export default MainContent;
