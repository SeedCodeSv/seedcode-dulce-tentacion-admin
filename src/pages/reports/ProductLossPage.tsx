import ProductLossComponent from "@/components/reporters/productLoss/productLossComponent";
import { useViewsStore } from "@/store/views.store";

export default function ProductLossPage() {

    const { actions } = useViewsStore();
    const categoriasView = actions.find((view) => view.view.name === 'Producto Perdido');
    const actionView = categoriasView?.actions?.name || [];

    return (
        <ProductLossComponent actions={actionView} />
    )
}