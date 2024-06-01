import { useContext, useEffect, useMemo } from "react";
import { usePurchaseOrdersStore } from "../../store/purchase_orders.store";
import { PurchaseOrder } from "../../types/purchase_orders.types";
import { formatCurrency } from "../../utils/dte";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../../hooks/useTheme";
import PurchaseOrders from "../invoice/PurchaseOrders";
import { pdf } from "@react-pdf/renderer";
import print from "print-js";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { ArrowLeft, Plus, Printer, Trash } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
import AddProduct from "./AddProduct";

interface Props {
  purchase_order: PurchaseOrder;
  returnMode: () => void;
}

function EditMode(props: Props) {
  const {
    getPurchaseOrderDetail,
    details_order_purchase,
    updateOrderProduct,
    updatePurchaseOrder,
    updateQuantityOrder,
    updatePriceOrder,
  } = usePurchaseOrdersStore();

  useEffect(() => {
    getPurchaseOrderDetail(props.purchase_order.id);
  }, []);

  const { theme } = useContext(ThemeContext);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const handlePrint = async (supplierName: string) => {
    const total = details_order_purchase
      .map((p) => Number(p.total))
      .reduce((a, b) => a + b, 0);
    const blob = await pdf(
      <PurchaseOrders
        supplier={supplierName}
        total={total}
        dark={theme.colors.dark}
        primary={theme.colors.primary}
        items={details_order_purchase.map((p) => ({
          qty: p.quantity,
          name: p.name,
          price: p.price,
          total: Number(p.total),
        }))}
      />
    ).toBlob();

    const URL_PDF = URL.createObjectURL(blob);

    print({
      printable: URL_PDF,
      type: "pdf",
      showModal: false,
    });
  };

  const total = useMemo(() => {
    return details_order_purchase
      .map((p) => Number(p.total))
      .reduce((a, b) => a + b, 0);
  }, [details_order_purchase]);

  const modalAddProduct = useDisclosure();

  const handleUpdate = () => {
    const items = details_order_purchase.map((p) => ({
      productId: p.isNew ? p.productId : p.orderId,
      quantity: p.quantity,
      unitPrice: p.price,
      isNew: p.isNew,
    }));
    updatePurchaseOrder(props.purchase_order.id, items);

    props.returnMode();
  };

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div>
          <button
            onClick={props.returnMode}
            className="flex bg-transparent border-0  items-center gap-2"
          >
            <ArrowLeft /> Atrás
          </button>
          <p className="text-xl mt-5 font-semibold dark:text-white">
            Completar orden
          </p>
        </div>
        <div className="w-full grid grid-cols-2 mt-4">
          <p className="text-lg font-semibold">
            Proveedor:{" "}
            <span className="font-normal">
              {props.purchase_order.supplier.nombre}
            </span>
          </p>
          <p className="text-lg font-semibold">
            Total: <span className="font-normal">{formatCurrency(total)}</span>
          </p>
          <p className="text-lg font-semibold">
            Fecha:{" "}
            <span className="font-normal">{props.purchase_order.date}</span>
          </p>
          <p className="text-lg font-semibold">
            Hora:{" "}
            <span className="font-normal">{props.purchase_order.time}</span>
          </p>
        </div>
        <div className="mt-5">
          <Button
            style={global_styles().warningStyles}
            onClick={() => handlePrint(props.purchase_order.supplier.nombre)}
          >
            <Printer />
          </Button>
        </div>
        <div className="mt-5">
          <div className="py-4 w-full flex justify-end">
            <Button
              onClick={modalAddProduct.onOpen}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <Plus />
            </Button>
            <AddProduct
              isOpen={modalAddProduct.isOpen}
              onClose={modalAddProduct.onClose}
              branchName={props.purchase_order.branch.name}
              supplierName={props.purchase_order.supplier.nombre}
            />
          </div>
          <DataTable
            className="shadow mt-6"
            emptyMessage="No se encontraron resultados"
            value={details_order_purchase}
            scrollable
            scrollHeight="40rem"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
              field="orderId"
              header="No."
              body={(_, row_props) => {
                return <p>{row_props.rowIndex + 1}</p>;
              }}
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              header="Precio"
              body={(item) => (
                <Input
                  className="w-32"
                  variant="bordered"
                  defaultValue={Number(item.price).toString()}
                  type="number"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  step={0.01}
                  onChange={(e) => {
                    if (item.isNew) {
                      updatePriceOrder(item.productId, Number(e.target.value));
                    } else {
                      updateOrderProduct(
                        item.orderId,
                        Number(e.target.value),
                        ""
                      );
                    }
                  }}
                />
              )}
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="quantity"
              header="Cantidad"
              body={(item) => (
                <Input
                  className="w-32"
                  variant="bordered"
                  defaultValue={item.quantity.toString()}
                  type="number"
                  lang="es"
                  onChange={(e) => {
                    if (item.isNew) {
                      updateQuantityOrder(
                        item.productId,
                        Number(e.target.value)
                      );
                    } else {
                      updateOrderProduct(
                        item.orderId,
                        "",
                        Number(e.target.value)
                      );
                    }
                  }}
                />
              )}
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="total"
              header="Total"
              body={(item) => formatCurrency(Number(item.total))}
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopRightRadius: "10px" }}
              header="Acciones"
              body={() => (
                <div className="flex gap-5">
                  <Button isIconOnly style={global_styles().dangerStyles}>
                    <Trash />
                  </Button>
                </div>
              )}
            />
          </DataTable>
        </div>
        <div className="mt-5 w-full">
          <Button
            className="px-16"
            style={global_styles().thirdStyle}
            onClick={handleUpdate}
          >
            Completar orden
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditMode;
