import { useContext, useMemo } from "react";

import ListMovements from "@/components/movements/ListMovements"
import { PermissionContext } from "@/hooks/usePermission";
import Layout from "@/layout/Layout"

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
    <Layout title="Movimientos">
        <ListMovements actions={actions}/>
    </Layout>
  )
}

export default Movements