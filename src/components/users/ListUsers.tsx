import { useContext, useEffect, useMemo, useState } from "react";
import { useUsersStore } from "../../store/users.store";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ModalGlobal from "../global/ModalGlobal";
import AddUsers from "./AddUsers";
import UpdateUsers from "./UpdateUsers";
import {
  Key,
  User2,
  Table as ITable,
  CreditCard,
  TrashIcon,
  List,
  EditIcon,
  Filter,
} from "lucide-react";
import UpdatePassword from "./UpdatePassword";
import { ThemeContext } from "../../hooks/useTheme";
import { ButtonGroup } from "@nextui-org/react";
import MobileView from "./MobileView";
import AddButton from "../global/AddButton";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import Pagination from "../global/Pagination";
import { User } from "../../types/users.types";
import { ActionsContext } from "../../hooks/useActions";
import { filterActions } from "../../utils/filters";
import { Drawer } from "vaul";
import { global_styles } from "../../styles/global.styles";
import classNames from "classnames";

function ListUsers() {
  const { theme, context } = useContext(ThemeContext);
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated } = useUsersStore();
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    getUsersPaginated(1, limit, "");
  }, [limit]);

  const modalAdd = useDisclosure();
  const modalUpdate = useDisclosure();
  const modalChangePassword = useDisclosure();

  const [selectId, setSelectedId] = useState(0);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const [userName, setUserName] = useState("");

  const handleSearch = (searchParam: string | undefined) => {
    getUsersPaginated(1, limit, searchParam ?? userName);
  };

  const { roleActions } = useContext(ActionsContext);

  const actions_role_view = useMemo(() => {
    if (roleActions) {
      return filterActions("Usuarios", roleActions)?.actions.map(
        (re) => re.name
      );
    }
    return undefined;
  }, [roleActions]);

  const [openVaul, setOpenVaul] = useState(false);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="hidden w-full gap-5 md:flex">
              <div className="w-1/2">
                <Input
                  startContent={<User2 />}
                  className=" dark:text-white"
                  variant="bordered"
                  labelPlacement="outside"
                  label="Nombre"
                  classNames={{
                    label: "font-semibold text-gray-700",
                    inputWrapper: "pr-0",
                  }}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  size="lg"
                  placeholder="Escribe para buscar..."
                  isClearable
                  onClear={() => {
                    setUserName("");
                    handleSearch("");
                  }}
                />
              </div>
              <div className="w-1/2 mt-6">
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
              </div>
            </div>
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
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                  <Drawer.Root
                    shouldScaleBackground
                    open={openVaul}
                    onClose={() => setOpenVaul(false)}
                  >
                    <Drawer.Trigger asChild>
                      <Button
                        style={global_styles().thirdStyle}
                        size="lg"
                        isIconOnly
                        onClick={() => setOpenVaul(true)}
                        type="button"
                      >
                        <Filter />
                      </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay
                        className="fixed inset-0 bg-black/40 z-[60]"
                        onClick={() => setOpenVaul(false)}
                      />
                      <Drawer.Content
                        className={classNames(
                          "bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0",
                          context === "dark" ? "dark" : ""
                        )}
                      >
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-400 mb-8" />
                          <Drawer.Title className="mb-4 dark:text-white font-medium">
                            Filtros disponibles
                          </Drawer.Title>

                          <div className="flex flex-col gap-3">
                            <div className="w-full">
                              <Input
                                startContent={<User2 />}
                                className=" dark:text-white"
                                variant="bordered"
                                labelPlacement="outside"
                                label="Nombre"
                                classNames={{
                                  label: "font-semibold text-gray-700",
                                  inputWrapper: "pr-0",
                                }}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                size="lg"
                                placeholder="Escribe para buscar..."
                                isClearable
                                onClear={() => {
                                  setUserName("");
                                  handleSearch("");
                                }}
                              />
                            </div>
                            <Button
                              style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.primary,
                              }}
                              className="mb-10 font-semibold"
                              color="primary"
                              size="lg"
                              onClick={() => {
                                handleSearch(undefined);
                                setOpenVaul(false);
                              }}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>
                </div>
              </div>
              {actions_role_view && actions_role_view?.includes("Agregar") && (
                <AddButton onClick={() => modalAdd.onOpen()} />
              )}
            </div>
          </div>
          <div className="flex justify-end w-full mb-1">
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
          {(view === "grid" || view === "list") && (
            <MobileView
              deletePopover={DeletePopUp}
              openEditModal={(user) => {
                setUser(user);
                modalUpdate.onOpen();
              }}
              openKeyModal={(user) => {
                setSelectedId(user.id);
                modalChangePassword.onOpen();
              }}
              layout={view as "grid" | "list"}
            />
          )}
          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={users_paginated.users}
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
                field="employee.fullName"
                header="Empleado"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="userName"
                header="Nombre de usuario"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="role.name"
                header="Rol"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    {actions_role_view &&
                      actions_role_view?.includes("Editar") && (
                        <Button
                          onClick={() => {
                            setUser(item);
                            modalUpdate.onOpen();
                          }}
                          isIconOnly
                          style={{
                            backgroundColor: theme.colors.secondary,
                          }}
                          size="lg"
                        >
                          <EditIcon
                            style={{ color: theme.colors.primary }}
                            size={20}
                          />
                        </Button>
                      )}
                    <Button
                      size="lg"
                      onClick={() => {
                        setSelectedId(item.id);
                        modalChangePassword.onOpen();
                      }}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.warning,
                      }}
                    >
                      <Key color={theme.colors.primary} size={20} />
                    </Button>
                    {actions_role_view &&
                      actions_role_view?.includes("Eliminar") && (
                        <DeletePopUp user={item} />
                      )}
                  </div>
                )}
              />
            </DataTable>
          )}
          {users_paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={users_paginated.prevPag}
                  nextPage={users_paginated.nextPag}
                  currentPage={users_paginated.currentPag}
                  totalPages={users_paginated.totalPag}
                  onPageChange={(page) => {
                    getUsersPaginated(page, limit, userName);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <Paginator
                  pt={paginator_styles(1)}
                  className="flex justify-between w-full"
                  first={(users_paginated.currentPag - 1) * limit}
                  rows={limit}
                  totalRecords={users_paginated.total}
                  template={{
                    layout: "PrevPageLink CurrentPageReport NextPageLink",
                  }}
                  currentPageReportTemplate="{currentPage} de {totalPages}"
                  onPageChange={(e) => {
                    getUsersPaginated(e.page + 1, limit, userName);
                  }}
                />
              </div>
            </>
          )}
        </div>
        <ModalGlobal
          isOpen={modalAdd.isOpen}
          onClose={modalAdd.onClose}
          title="Agregar usuario"
          size="w-full sm:w-[500px]"
        >
          <AddUsers onClose={modalAdd.onClose} />
        </ModalGlobal>
        <ModalGlobal
          isOpen={modalChangePassword.isOpen}
          onClose={modalChangePassword.onClose}
          title="Actualizar contraseña"
          size="w-full sm:w-[500px]"
        >
          <UpdatePassword
            id={selectId}
            closeModal={modalChangePassword.onClose}
          />
        </ModalGlobal>
        <ModalGlobal
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
          title="Editar usuario"
          size="w-full sm:w-[500px]"
        >
          <UpdateUsers onClose={modalUpdate.onClose} user={user} />
        </ModalGlobal>
      </div>
    </>
  );
}

export default ListUsers;

interface Props {
  user: User;
}

const DeletePopUp = ({ user }: Props) => {
  const { theme } = useContext(ThemeContext);
  const { deleteUser } = useUsersStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    deleteUser(user.id);
    onClose();
  };

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
            <p className="font-semibold text-gray-600">
              Eliminar {user.userName}
            </p>
            <p className="mt-3 text-center text-gray-600 w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4">
              <Button onClick={onClose}>No, cancelar</Button>
              <Button
                onClick={() => handleDelete()}
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
  );
};
