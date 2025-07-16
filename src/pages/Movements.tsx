import { useContext, useMemo } from "react";

import ListMovements from "@/components/movements/ListMovements"
import { PermissionContext } from "@/hooks/usePermission";

const Movements = () => {
  const { roleActions } = useContext(PermissionContext);

  const actions = useMemo(() => {
    if (roleActions) {
      const viewActions = roleActions.views.find((view) => view.view.name === 'Movimientos');

      return viewActions ? viewActions.view.actions.map((action) => action.name) : [];
    }

    return [];
  }, [roleActions]);

  return (
    <>
        <ListMovements actions={actions}/>
    </>
  )
}

export default Movements