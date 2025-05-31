import OrdenProducionComponent from "@/components/reporters/order_production_report/OrderProductionComponentReport";
import Layout from "@/layout/Layout";

export default function OrdenProductionReport () {

    return(
        <Layout title="Reporte ordenes de producción">
         <OrdenProducionComponent/>
        </Layout>
    )

}