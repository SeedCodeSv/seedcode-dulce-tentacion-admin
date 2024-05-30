import { Input, useDisclosure } from "@nextui-org/react";
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
function ListPurchasesOrders() {
  const modalAdd = useDisclosure();
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const {
    getPurchaseOrders,
    purchase_orders
  } = usePurchaseOrdersStore();

  useEffect(() => {
    getPurchaseOrders(startDate, endDate);
  }, [startDate, endDate]);

  const {theme} = useContext(ThemeContext);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const reload = () => {
    getPurchaseOrders(startDate, endDate);
  };

  return (
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
          {/* <div>
            <Input variant="bordered" />
          </div> */}
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
          {/* <Column
            headerStyle={{ ...style, borderTopRightRadius: "10px" }}
            header="Acciones"
            body={(item) => (
              <div className="flex w-full gap-5">
                {actions.includes("Editar") && (
                  <Button
                    onClick={() => {
                      setSelectedEmployee(item);
                      modalAdd.onOpen();
                    }}
                    isIconOnly
                    style={{
                      backgroundColor: theme.colors.secondary,
                    }}
                  >
                    <EditIcon
                      style={{ color: theme.colors.primary }}
                      size={20}
                    />
                  </Button>
                )}
                {actions.includes("Eliminar") && (
                  <>
                    {item.isActive ? (
                      <DeletePopover employee={item} />
                    ) : (
                      <Button
                        onClick={() => handleActivate(item.id)}
                        isIconOnly
                        style={global_styles().thirdStyle}
                      >
                        <RefreshCcw />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          /> */}
        </DataTable>
      </div>
      <FullDialog
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Nueva orden de compra"
      >
        <AddPurchaseOrders reload={reload} closeModal={modalAdd.onClose} />
      </FullDialog>
    </div>
  );
}

export default ListPurchasesOrders;
