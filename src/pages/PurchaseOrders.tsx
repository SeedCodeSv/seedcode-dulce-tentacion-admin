import {  useEffect } from "react";
import Layout from "../layout/Layout";
import ListPurchasesOrders from "../components/list_purchase/ListPurchasesOrders";
import { useViewsStore } from '@/store/views.store';

function PurchaseOrders() {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const purchaseOrdersView = viewasAction.find((view) => view.view.name === 'Productos');
  // const actions = purchaseOrdersView?.actions?.name || [];
    useEffect(() => {
      OnGetViewasAction();
    }, []);
  return (
    <Layout title="Ordenes de Compra">
      {purchaseOrdersView ? (
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
