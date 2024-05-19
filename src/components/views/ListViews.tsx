import { useContext, useEffect, useMemo, useState } from "react";
import { useViewsStore } from "../../store/views.store";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../../hooks/useTheme";
import { ActionsContext } from "../../hooks/useActions";
import { filterActions } from "../../utils/filters";
import { Button, ButtonGroup, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import { Table as ITable, CreditCard, List, TrashIcon } from "lucide-react";
import AddButton from "../global/AddButton";
import ModalGlobal from "../global/ModalGlobal";
import AddViews from "./AddViews";
import { IView } from "../../types/view.types";

function ListViews() {
  const { theme } = useContext(ThemeContext);
  const { getViews, views_list } = useViewsStore();
  const modalAdd = useDisclosure();

  useEffect(() => {
    getViews();
  }, []);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const { roleActions } = useContext(ActionsContext);

  const actions_role_view = useMemo(() => {
    if (roleActions) {
      return filterActions("Modulos", roleActions)?.actions.map(
        (re) => re.name
      );
    }
    return undefined;
  }, [roleActions]);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-end w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end justify-between gap-10 lg:justify-end">
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
            {/* {actions_role_view && actions_role_view?.includes("Agregar") && (
                <AddButton onClick={() => modalAdd.onOpen()}/>
            )} */}
            <AddButton onClick={() => modalAdd.onOpen()}/>
          </div>
          </div>
          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={views_list}
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
                field="name"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                header="Nombre"
                body={(item) => (
                    <div className="flex w-full gap-5">
                        <DeleteView views={item}/>
                    </div>
                )}
              />
            </DataTable>
          )}
        </div>
        <ModalGlobal
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            title="Agregar nuevo modulo"
            size="w-full sm:w-[500px]"
        >
            <AddViews onClose={modalAdd.onClose}/>
        </ModalGlobal>
      </div>
    </>
  );
}

export default ListViews;

interface Props {
    views: IView;
}

const DeleteView = ({views} : Props) => {
    const {theme} = useContext(ThemeContext);
    const {OnDeleteView, getViews} = useViewsStore();
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        getViews()
    }, [getViews])

    const handleDelete = () => {
        OnDeleteView(views.id);
        getViews()
        onClose();
    }

    return (
        <>
            <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
                <PopoverTrigger>
                    <Button
                        onClick={onOpen}
                        isIconOnly
                        style={{
                            backgroundColor: theme.colors.danger,
                        }}
                        size="lg"
                    >
                        <TrashIcon 
                            style={{
                                color: theme.colors.primary,
                            }}
                            size={20}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="w-full p-5">
                        <p className="font-semibold text-gray-600 w-72">
                            Eliminar {views.name}
                        </p>
                        <p className="mt-3 text-center text-gray-600 w-72">
                            ¿Estas seguro de eliminar este registro?
                        </p>
                        <div className="mt-4">
                            <Button onClick={onClose}>No, cancelar</Button>
                            <Button
                                onClick={() => {
                                    handleDelete();
                                    getViews();
                                }}
                                className="ml-5"
                                style={{
                                    backgroundColor: theme.colors.danger,
                                    color: theme.colors.primary,
                                }}
                            >
                                Si, eliminar
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}
