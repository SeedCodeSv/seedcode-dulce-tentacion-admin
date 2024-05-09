import { useContext, useEffect, useMemo, useState } from "react";
import { useEmployeeStore } from "../../store/employee.store";
import {
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  EditIcon,
  User,
  Phone,
  Truck,
  Filter,
} from "lucide-react";
import { Employee } from "../../types/employees.types";
import AddButton from "../global/AddButton";
import Pagination from "../global/Pagination";
import { Paginator } from "primereact/paginator";
import { ThemeContext } from "../../hooks/useTheme";
import { paginator_styles } from "../../styles/paginator.styles";
import MobileView from "./MobileView";
import ModalGlobal from "../global/ModalGlobal";
import AddEmployee from "./AddEmployee";
import { Drawer } from "vaul";
import { global_styles } from "../../styles/global.styles";

function ListEmployee() {
  const { theme } = useContext(ThemeContext);

  const { getEmployeesPaginated, employee_paginated } = useEmployeeStore();

  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [limit, setLimit] = useState(5);
  const [view, setView] = useState<"table" | "grid" | "list">("table");
  const [openVaul, setOpenVaul] = useState(false);

  const modalAdd = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  const changePage = () => {
    getEmployeesPaginated(1, limit, fullName, fullName, phone);
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  useEffect(() => {
    getEmployeesPaginated(1, limit, fullName, fullName, phone);
  }, [limit]);
  const filters = useMemo(() => {
    return (
      <>
        <Input
          classNames={{
            label: "font-semibold text-gray-700",
            inputWrapper: "pr-0",
          }}
          labelPlacement="outside"
          label="Nombre"
          className="w-full xl:w-96"
          placeholder="Buscar por nombre..."
          size="lg"
          startContent={<User />}
          variant="bordered"
          name="searchName"
          id="searchName"
          value={fullName}
          autoComplete="search"
          onChange={(e) => setFullName(e.target.value)}
          isClearable
          onClear={() => setFullName("")}
        />
        <Input
          classNames={{
            label: "font-semibold text-gray-700",
            inputWrapper: "pr-0",
          }}
          labelPlacement="outside"
          label="Teléfono"
          placeholder="Buscar por teléfono..."
          size="lg"
          startContent={<Phone size={20} />}
          className="w-full xl:w-96"
          variant="bordered"
          name="searchPhone"
          value={phone}
          id="searchPhone"
          onChange={(e) => setPhone(e.target.value)}
          isClearable
          onClear={() => setPhone("")}
        />
        <Input
          classNames={{
            label: "font-semibold text-gray-700",
            inputWrapper: "pr-0",
          }}
          labelPlacement="outside"
          label="Sucursal"
          placeholder="Buscar por sucursal..."
          size="lg"
          startContent={<Truck size={20} />}
          className="w-full xl:w-96"
          variant="bordered"
          name="searchAddress"
          id="searchAddress"
          value={branch}
          autoComplete="search"
          onChange={(e) => setBranch(e.target.value)}
          isClearable
          onClear={() => setBranch("")}
        />
      </>
    );
  }, [fullName, setFullName, phone, setPhone, branch, setBranch]);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="hidden w-full grid-cols-3 gap-5 mb-4 md:grid ">
            {filters}
          </div>
          <div className="grid w-full grid-cols-1 gap-5 mb-4 md:grid-cols-2">
            <div className="hidden md:flex">
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="w-full xl:w-72 "
                color="primary"
                size="lg"
                onClick={() => changePage()}
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
                      >
                        <Filter />
                      </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay
                        className="fixed inset-0 bg-black/40 z-[60]"
                        onClick={() => setOpenVaul(false)}
                      />
                      <Drawer.Content className="bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0">
                        <div className="p-4 bg-white rounded-t-[10px] flex-1">
                          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                          <Drawer.Title className="mb-4 font-medium">
                            Filtros disponibles
                          </Drawer.Title>
                          <div className="flex flex-col gap-3">
                            {filters}
                            <Button
                              style={global_styles().secondaryStyle}
                              className="mb-10 font-semibold"
                              size="lg"
                              onClick={() => {
                                changePage();
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
                <AddButton
                  onClick={() => {
                    modalAdd.onOpen();
                    setSelectedEmployee(undefined);
                  }}
                />
              </div>
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
          {(view === "grid" || view === "list") && (
            <MobileView
              deletePopover={DeletePopover}
              openEditModal={(employee) => {
                setSelectedEmployee(employee);
                modalAdd.onOpen();
              }}
              layout={view as "grid" | "list"}
            />
          )}
          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={employee_paginated.employees}
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
                field="fullName"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="phone"
                header="Teléfono"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="branch.name"
                header="Sucursal"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <Button
                      size="lg"
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
                    <DeletePopover employee={item} />
                  </div>
                )}
              />
            </DataTable>
          )}
          {employee_paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={employee_paginated.prevPag}
                  nextPage={employee_paginated.nextPag}
                  currentPage={employee_paginated.currentPag}
                  totalPages={employee_paginated.totalPag}
                  onPageChange={(page) => {
                    getEmployeesPaginated(page, limit, fullName, branch, phone);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <Paginator
                  pt={paginator_styles(1)}
                  className="flex justify-between w-full"
                  first={employee_paginated.currentPag}
                  rows={limit}
                  totalRecords={employee_paginated.total}
                  template={{
                    layout: "PrevPageLink CurrentPageReport NextPageLink",
                  }}
                  currentPageReportTemplate="{currentPage} de {totalPages}"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title={selectedEmployee ? "Editar Empleado" : "Agregar Empleado"}
        size="lg"
      >
        <AddEmployee
          closeModal={modalAdd.onClose}
          employee={selectedEmployee}
        />
      </ModalGlobal>
    </>
  );
}
export default ListEmployee;

interface PopProps {
  employee: Employee;
}

export const DeletePopover = ({ employee }: PopProps) => {
  const { theme } = useContext(ThemeContext);

  const { deleteEmployee } = useEmployeeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
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
              Eliminar {employee.fullName}
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
