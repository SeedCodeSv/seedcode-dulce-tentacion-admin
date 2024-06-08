import { useParams } from "react-router";
import Layout from "../layout/Layout";
import { useSalesStore } from "../store/sales.store";
import { useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../hooks/useTheme";

function NotaDebito() {
  const { id } = useParams();
  const { getSaleDetails, sale_details } = useSalesStore();

  useEffect(() => {
    getSaleDetails(Number(id));
  }, [id]);

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  return (
    <Layout title="Nota de débito">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <p className="text-lg font-semibold">Detalles</p>
          <div className="grid grid-cols-2 gap-5">
            <p className="font-semibold">
              Código Generación:{" "}
              <span className="font-normal">
                {sale_details?.codigoGeneracion}
              </span>
            </p>
            <p className="font-semibold">
              Sello recepción:{" "}
              <span className="font-normal">{sale_details?.selloRecibido}</span>
            </p>
            <p className="font-semibold">
              Numero control:{" "}
              <span className="font-normal">{sale_details?.numeroControl}</span>
            </p>
            <p className="font-semibold">
              Fecha hora:{" "}
              <span className="font-normal">
                {sale_details?.fecEmi} - {sale_details?.horEmi}
              </span>
            </p>
          </div>
          <p>Productos</p>
          {sale_details?.details && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={sale_details?.details}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branchProduct.product.name"
                header="Nombre"
              />
               <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="cantidadItem"
                header="Cantidad"
              />
               <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branchProduct.product.code"
                header="Codigo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branchProduct.price"
                header="Precio"
              />
               <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="totalItem"
                header="Total"
              />
            </DataTable>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default NotaDebito;
