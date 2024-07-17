import {  useEffect } from "react";
import Layout from "../layout/Layout";
import ListPurchasesOrders from "../components/list_purchase/ListPurchasesOrders";
import { useViewsStore } from '@/store/views.store';

function PurchaseOrders() {
  const { OnGetViewasAction } = useViewsStore();

  // const purchaseOrdersView = viewasAction.find((view) => view.view.name === 'Productos');
  // const actions = purchaseOrdersView?.actions?.name || [];
    useEffect(() => {
      OnGetViewasAction();
    }, []);
  return (
    <Layout title="Ordenes de Compra">
      
        <ListPurchasesOrders />
    
     
    </Layout>
  );
}

export default PurchaseOrders;
