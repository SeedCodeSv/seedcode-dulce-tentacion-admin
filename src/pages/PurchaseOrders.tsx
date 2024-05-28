import { useContext, useMemo } from "react";
import Layout from "../layout/Layout";
import { ActionsContext } from "../hooks/useActions";
import { filterActions } from "../utils/filters";
import ListPurchasesOrders from "../components/list_purchase/ListPurchasesOrders";

function PurchaseOrders() {
  const { roleActions } = useContext(ActionsContext);

  const actions_role_view = useMemo(() => {
    if (roleActions) {
      const actions = filterActions("Productos", roleActions)?.actions.map(
        (re) => re.name
      );
      return actions;
    }
    return undefined;
  }, [roleActions]);
  return (
    <Layout title="Ordenes de Compra">
      {actions_role_view ? (
        <ListPurchasesOrders />
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PurchaseOrders;
