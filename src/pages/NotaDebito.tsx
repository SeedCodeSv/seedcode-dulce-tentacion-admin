import { useParams } from "react-router";
import Layout from "../layout/Layout";
import { useSalesStore } from "../store/sales.store";
import { useContext, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../hooks/useTheme";
import { Input } from "@nextui-org/react";
import { formatCurrency } from "../utils/dte";
import { calculateDiscountedTotal } from "../utils/filters";
import { toast } from "sonner";

function NotaDebito() {
  const { id } = useParams();
  const { getSaleDetails, sale_details, updateSaleDetails } = useSalesStore();

  useEffect(() => {
    getSaleDetails(Number(id));
  }, [id]);

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  }

  const updatePrice = (price: number, id: number) => {
    const items = sale_details?.details;

    if (items) {
      const item = items.find((i) => i.id === id);
      if (item) {
        if (price < item.branchProduct.price) {
          toast.error("El precio no puede ser menor al precio de venta");
          item.branchProduct.newPrice = item.branchProduct.price;
          item.newTotalItem = item.branchProduct.price * item.newCantidadItem;

          const edited = items.map((i) => (i.id === id ? item : i));

          updateSaleDetails({
            ...sale_details,
            isEdited: true,
            details: edited,
          });
          return;
        }

        const discount = calculateDiscountedTotal(
          price,
          Number(item.porcentajeDescuento)
        );

        item.newMontoDescu = discount.discountAmount * item.newCantidadItem;
        item.newTotalItem = discount.discountedTotal * item.newCantidadItem;
        item.branchProduct.newPrice = price;

        const edited = items.map((i) => (i.id === id ? item : i));

        updateSaleDetails({ ...sale_details, isEdited: true, details: edited });
      }
    }
  };

  const updateQuantity = (quantity: number, id: number) => {
    const items = sale_details?.details;

    if (items) {
      const item = items.find((i) => i.id === id);
      if (item) {
        item.newCantidadItem = quantity;

        const discount = calculateDiscountedTotal(
          item.branchProduct.newPrice,
          Number(item.porcentajeDescuento)
        );

        item.newMontoDescu = discount.discountAmount * item.newCantidadItem;
        item.newTotalItem = discount.discountedTotal * item.newCantidadItem;
        const edited = items.map((i) => (i.id === id ? item : i));
        updateSaleDetails({ ...sale_details, isEdited: true, details: edited });
      }
    }
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
          <p className="text-lg font-semibold py-8">Productos</p>
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
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    defaultValue={rowData.branchProduct.product.name}
                    onChange={(e) => {
                      updateSaleDetails({
                        ...sale_details,
                        details: sale_details?.details?.map((item) => {
                          if (item.id === rowData.id) {
                            return {
                              ...item,
                              branchProduct: {
                                ...item.branchProduct,
                                product: {
                                  ...item.branchProduct.product,
                                  name: e.target.value,
                                },
                              },
                            };
                          }
                          return item;
                        }),
                      });
                    }}
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="cantidadItem"
                header="Cantidad"
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    className="w-32"
                    defaultValue={rowData.cantidadItem}
                    min={Number(rowData.cantidadItem)}
                    type="number"
                    onChange={(e) =>
                      updateQuantity(Number(e.target.value), rowData.id)
                    }
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                body={(rowData) =>
                  formatCurrency(Number(rowData.newMontoDescu))
                }
                header="Codigo"
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
                body={(rowData) => (
                  <Input
                    variant="bordered"
                    className="w-64"
                    defaultValue={rowData.branchProduct.newPrice}
                    min={Number(rowData.branchProduct.price)}
                    type="number"
                    startContent="$"
                    isInvalid={
                      rowData.branchProduct.newPrice <
                      rowData.branchProduct.price
                    }
                    errorMessage="El precio no puede ser menor al precio de venta"
                    onChange={(e) =>
                      updatePrice(
                        Number(e.target.value),
                        rowData.id
                      )
                    }
                    endContent={
                      <span>
                        {rowData.branchProduct.newPrice !==
                        rowData.branchProduct.price ? (
                          <s>${rowData.branchProduct.price}</s>
                        ) : (
                          ""
                        )}
                      </span>
                    }
                  />
                )}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="newTotalItem"
                header="Total"
                body={(rowData) => formatCurrency(Number(rowData.newTotalItem))}
              />
            </DataTable>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default NotaDebito;
