import { Button, Input, useDisclosure } from "@nextui-org/react";
import FullDialog from "../global/FullDialog";
import AddPurchaseOrders from "./AddPurchaseOrders";
import AddButton from "../global/AddButton";
import { formatDate } from "../../utils/dates";
import { useContext, useEffect, useState } from "react";
import { usePurchaseOrdersStore } from "../../store/purchase_orders.store";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../../hooks/useTheme";
import { formatCurrency } from "../../utils/dte";
import Pagination from "../global/Pagination";
import EditMode from "./EditMode";
import { PurchaseOrder } from "../../types/purchase_orders.types";
import { ClipboardCheck, Eye } from "lucide-react";
import { global_styles } from "../../styles/global.styles";
function ListPurchasesOrders() {
  const modalAdd = useDisclosure();
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [limit, setLimit] = useState(5);
  const [mode, setMode] = useState("show");

  const {
    getPurchaseOrders,
    purchase_orders,
    pagination_purchase_orders,
  } = usePurchaseOrdersStore();

  useEffect(() => {
    getPurchaseOrders(startDate, endDate, 1, limit);
  }, [startDate, endDate, limit]);

  const { theme } = useContext(ThemeContext);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const reload = () => {
    setLimit(5);
    getPurchaseOrders(startDate, endDate, 1, limit);
  };

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>();

  const handleSelectEdit = (purchase: PurchaseOrder) => {
    setSelectedOrder(purchase);
    setMode("edit");
  };

  return (
    <>
      {mode === "show" && (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <div className="w-full flex justify-between">
              <p className="text-lg font-semibold dark:text-white">
                Listado de ordenes de compra
              </p>
              <AddButton onClick={modalAdd.onOpen} />
            </div>
            <div className="grid grid-cols-2 gap-5 mt-5">
              <div>
                <Input
                  type="date"
                  variant="bordered"
                  label="Fecha inicial"
                  labelPlacement="outside"
                  classNames={{
                    label: "font-semibold",
                  }}
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
              </div>
              <div>
                <Input
                  type="date"
                  variant="bordered"
                  label="Fecha final"
                  labelPlacement="outside"
                  classNames={{
                    label: "font-semibold",
                  }}
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>
            </div>
            <DataTable
              className="shadow mt-6"
              emptyMessage="No se encontraron resultados"
              value={purchase_orders}
              scrollable
              scrollHeight="40rem"
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
                field="date"
                header="Fecha"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="supplier.nombre"
                header="Proveedor"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branch.name"
                header="Sucursal"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branch.name"
                header="Total"
                body={(item) => formatCurrency(Number(item.total))}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex gap-5">
                    <Button isIconOnly style={global_styles().thirdStyle}>
                      <Eye />
                    </Button>
                    <Button
                      onClick={() => handleSelectEdit(item)}
                      isIconOnly
                      style={global_styles().secondaryStyle}
                    >
                      <ClipboardCheck />
                    </Button>
                  </div>
                )}
              />
            </DataTable>
            <div className="mt-4">
              <Pagination
                nextPage={pagination_purchase_orders.nextPag}
                previousPage={pagination_purchase_orders.prevPag}
                currentPage={pagination_purchase_orders.currentPag}
                totalItems={pagination_purchase_orders.total}
                totalPages={pagination_purchase_orders.totalPag}
                onPageChange={(page) => {
                  getPurchaseOrders(startDate, endDate, page, limit);
                }}
              />
            </div>
          </div>
          <FullDialog
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            title="Nueva orden de compra"
          >
            <AddPurchaseOrders reload={reload} closeModal={modalAdd.onClose} />
          </FullDialog>
        </div>
      )}
      {mode === "edit" && selectedOrder && (
        <EditMode
          returnMode={() => {
            setMode("show");
          }}
          purchase_order={selectedOrder}
        />
      )}
    </>
  );
}

export default ListPurchasesOrders;
