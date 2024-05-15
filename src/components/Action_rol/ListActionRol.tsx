import {
  Button,
  ButtonGroup,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table as ITable,
  CreditCard,
  List,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import AddButton from "../global/AddButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ModalGlobal from "../global/ModalGlobal";
import AddActionRol from "./AddActionRol";
import { useActionsRolStore } from "../../store/actions_rol.store";
const ListActionRol = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<"table" | "grid" | "list">("table");
  const [limit, setLimit] = useState(8);
  const modalAdd = useDisclosure();
  const [idCounter] = useState(1);
  const {OnGetActionsRoleList, actions_roles_grouped} = useActionsRolStore()
  useEffect(() => {
    OnGetActionsRoleList()
  }, [])

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-end gap-3">
              {/* <div className="flex items-end gap-3">
              <Input
                startContent={<Search />}
                className="w-full xl:w-96"
                variant="bordered"
                labelPlacement="outside"
                label="Buscar"
                classNames={{
                  label: "font-semibold text-gray-700",
                  inputWrapper: "pr-0",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="lg"
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  setSearch("");
                  handleSearch("");
                }}
              />
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="font-semibold"
                color="primary"
                size="lg"
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div> */}
            </div>
            <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
              <ButtonGroup>
                <Button
                  size="lg"
                  isIconOnly
                  color="secondary"
                  style={{
                    backgroundColor:
                      view === "table" ? theme.colors.third : "#e5e5e5",
                    color: view === "table" ? theme.colors.primary : "#3e3e3e",
                  }}
                  onClick={() => setView("table")}
                >
                  <ITable />
                </Button>
                <Button
                  size="lg"
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor:
                      view === "grid" ? theme.colors.third : "#e5e5e5",
                    color: view === "grid" ? theme.colors.primary : "#3e3e3e",
                  }}
                  onClick={() => setView("grid")}
                >
                  <CreditCard />
                </Button>
                <Button
                  size="lg"
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor:
                      view === "list" ? theme.colors.third : "#e5e5e5",
                    color: view === "list" ? theme.colors.primary : "#3e3e3e",
                  }}
                  onClick={() => setView("list")}
                >
                  <List />
                </Button>
              </ButtonGroup>
              <AddButton
                onClick={() => {
                  modalAdd.onOpen();
                }}
              />
            </div>
          </div>
          <div className="flex justify-end w-full mb-5">
            <Select
              className="w-44"
              variant="bordered"
              size="lg"
              label="Mostrar"
              labelPlacement="outside"
              classNames={{
                label: "font-semibold",
              }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value !== "" ? e.target.value : "5"));
              }}
            >
              <SelectItem key={"5"}>5</SelectItem>
              <SelectItem key={"10"}>10</SelectItem>
              <SelectItem key={"20"}>20</SelectItem>
              <SelectItem key={"30"}>30</SelectItem>
              <SelectItem key={"40"}>40</SelectItem>
              <SelectItem key={"50"}>50</SelectItem>
              <SelectItem key={"100"}>100</SelectItem>
            </Select>
          </div>
          {view === "table" && (
            <DataTable
              className="w-full shadow"
              emptyMessage="No se encontraron resultados"
              value={actions_roles_grouped}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                body={(rowData) => {
                  const actionId = idCounter + actions_roles_grouped.indexOf(rowData)
                  return actionId;
                }}
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="role"
                header="Rol"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="view"
                header="Modulo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                body={(rowData) => (
                  <div>
                    {rowData.action.map((action: any, index: number) => (
                      <div key={index} className="text-slate-950">
                        • {action}
                      </div>
                    ))}
                  </div>
                )}
                header="Permisos"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                // body={(item) => (
                //   <div className="flex gap-6">
                //     <Button
                //       // onClick={() => handleEdit(item)}
                //       isIconOnly
                //       size="lg"
                //       style={{
                //         backgroundColor: theme.colors.secondary,
                //       }}
                //     >
                //       <EditIcon
                //         style={{ color: theme.colors.primary }}
                //         size={20}
                //       />
                //     </Button>
                //     {/* <DeletePopUp categoryExpenses={item} /> */}
                //   </div>
                // )}
              />
            </DataTable>
          )}
        </div>
      </div>
      <ModalGlobal
        title={"Asignar nuevas acciones"}
        onClose={modalAdd.onClose}
        size="w-full md:w-[500px]"
        isOpen={modalAdd.isOpen}
      >
        <AddActionRol closeModal={modalAdd.onClose} />
      </ModalGlobal>
    </>
  );
};

export default ListActionRol;
