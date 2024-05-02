import { useContext, useEffect, useRef, useState } from "react";
import { useUsersStore } from "../../store/users.store";
import {
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ModalGlobal from "../global/ModalGlobal";
import AddUsers from "./AddUsers";
import {
  Key,
  Search,
  Table as ITable,
  CreditCard,
  TrashIcon,
  List,
} from "lucide-react";
import UpdatePassword from "./UpdatePassword";
import { ThemeContext } from "../../hooks/useTheme";
import { ButtonGroup } from "@nextui-org/react";
import MobileView from "./MobileView";
import { ConfirmPopup } from "primereact/confirmpopup";
import AddButton from "../global/AddButton";
import { Paginator } from "primereact/paginator";
import { paginator_styles } from "../../styles/paginator.styles";
import Pagination from "../global/Pagination";

function ListUsers() {
  const { theme } = useContext(ThemeContext);
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated } = useUsersStore();

  useEffect(() => {
    getUsersPaginated(1, limit, "");
  }, [limit]);

  const modalAdd = useDisclosure();
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

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-end gap-3">
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
            <div className="flex items-end justify-between gap-10 mt lg:justify-end">
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
              <AddButton onClick={() => modalAdd.onOpen()} />
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
                    <DeletePopUp id={item.id} />
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
                  first={users_paginated.currentPag}
                  rows={limit}
                  totalRecords={users_paginated.total}
                  template={{
                    layout: "PrevPageLink CurrentPageReport NextPageLink",
                  }}
                  currentPageReportTemplate="{currentPage} de {totalPages}"
                />
              </div>
            </>
          )}
        </div>
        <ModalGlobal
          isOpen={modalAdd.isOpen}
          onClose={modalAdd.onClose}
          title="Agregar usuario"
          size="lg"
        >
          <AddUsers onClose={modalAdd.onClose} />
        </ModalGlobal>
        <ModalGlobal
          isOpen={modalChangePassword.isOpen}
          onClose={modalChangePassword.onClose}
          title="Actualizar contraseña"
          size="lg"
        >
          <UpdatePassword
            id={selectId}
            closeModal={modalChangePassword.onClose}
          />
        </ModalGlobal>
      </div>
    </>
  );
}

export default ListUsers;

interface Props {
  id: number;
}

const DeletePopUp = ({ id }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>();

  const { theme } = useContext(ThemeContext);
  const { deleteUser } = useUsersStore();

  const [visible, setVisible] = useState(false);

  const handleDelete = () => {
    deleteUser(id)
  };

  return (
    <>
      <Button
        ref={buttonRef as any}
        style={{
          backgroundColor: theme.colors.danger,
          color: theme.colors.primary,
        }}
        size="lg"
        isIconOnly
        onClick={() => setVisible(!visible)}
      >
        <TrashIcon size={20} />
      </Button>
      <ConfirmPopup
        visible={visible}
        onHide={() => setVisible(false)}
        target={buttonRef.current}
        message="¿Deseas eliminar este usuario?"
        content={({ message, acceptBtnRef, rejectBtnRef }) => (
          <>
            <div className="p-5 border border-gray-100 shadow-2xl rounded-xl">
              <p className="text-lg font-semibold text-center">{message}</p>
              <div className="flex justify-between gap-5 mt-5">
                <Button
                  ref={acceptBtnRef}
                  size="lg"
                  className="font-semibold"
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
                <Button size="lg" ref={rejectBtnRef}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};
