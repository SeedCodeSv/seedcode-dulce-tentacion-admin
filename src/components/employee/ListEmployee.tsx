import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useEmployeeStore } from "../../store/employee.store";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  ChevronLeft,
  ChevronRight,
  EditIcon,
  Phone,
  PlusIcon,
  SearchIcon,
  Store,
  TrashIcon,
} from "lucide-react";
import { Employee } from "../../types/employees.types";
import ModalGlobal from "../global/ModalGlobal";
import AddEmployee from "./AddEmployee";
import { ThemeContext } from "../../hooks/useTheme";

function ListEmployee() {
  const { theme } = useContext(ThemeContext);

  const { getEmployeesPaginated, employee_paginated } = useEmployeeStore();

  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [limit, setLimit] = useState(8);

  const modalAdd = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  const changePage = (page: number) => {
    getEmployeesPaginated(page, limit, fullName, branch, phone);
  };

  useEffect(() => {
    getEmployeesPaginated(1, limit, fullName, branch, phone);
  }, [limit, fullName, branch, phone]);

  const columns = [
    {
      name: "NO.",
      key: "id",
      sortable: false,
    },
    {
      name: "Nombre",
      key: "name",
      sortable: false,
    },
    {
      name: "Sucursal",
      key: "branch",
      sortable: false,
    },
    {
      name: "Teléfono",
      key: "phone",
      sortable: false,
    },
    {
      name: "Acciones",
      key: "actions",
      sortable: false,
    },
  ];

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:mt-4">
          <Input
            classNames={{
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por nombre..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
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
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por teléfono..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
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
              base: "w-full bg-white",
              inputWrapper: "border-1 h-10",
            }}
            placeholder="Buscar por sucursal..."
            size="sm"
            startContent={<SearchIcon size={20} className="text-default-300" />}
            variant="bordered"
            name="searchAddress"
            id="searchAddress"
            value={branch}
            autoComplete="search"
            onChange={(e) => setBranch(e.target.value)}
            isClearable
            onClear={() => setBranch("")}
          />
          <div className="flex justify-end w-full col-span-1 md:col-span-3 lg:col-span-1">
            <Button
              className="h-10 max-w-72 "
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
              endContent={<PlusIcon />}
              size="sm"
              onClick={() => {
                modalAdd.onOpen();
                setSelectedEmployee(undefined);
              }}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between 2xl:mt-6 2xl:mb-6">
          <span className="text-xs sm:text-small text-default-400 ">
            Total {employee_paginated.employees.length} productos
          </span>
          <label className="flex items-center text-xs text-default-400 sm:text-small">
            Productos por pagina
            <select
              defaultValue={limit.toString()}
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(e) => {
                setLimit(Number(e.target.value));
              }}
            >
              <option value="5">5</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [employee_paginated]);

  const bottomContent = useMemo(() => {
    if (employee_paginated.total === 0) {
      return <div>No se encontraron resultados</div>;
    }
    return (
      <div className="mt-10 mb-20 lg:mb-0">
        <Pagination
          total={employee_paginated.totalPag}
          initialPage={employee_paginated.currentPag}
          page={employee_paginated.currentPag}
          showControls
          showShadow
          boundaries={2}
          color="primary"
          onChange={(page) => changePage(page)}
          classNames={{
            cursor: "cursor-pagination",
            next: "cursor-pagination",
            prev: "cursor-pagination",
          }}
        />
      </div>
    );
  }, [employee_paginated, employee_paginated.employees]);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50">
        <style>{` .cursor-pagination { background: ${theme.colors.dark}; color: ${theme.colors.primary} } `}</style>
        <div className="hidden w-full p-5 bg-white rounded shadow lg:flex">
          <Table
            isHeaderSticky
            bottomContentPlacement="outside"
            topContentPlacement="outside"
            topContent={topContent}
            bottomContent={bottomContent}
            classNames={{
              wrapper: "max-h-[450px] 2xl:max-h-[600px]",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="font-semibold"
                  align={column.key === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={employee_paginated.employees}
              className="overflow-y-auto h-96 max-h-96"
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "id" && item.id}
                      {columnKey === "name" && item.fullName}
                      {columnKey === "branch" && item.branch.name}
                      {columnKey === "phone" && item.phone}
                      {columnKey === "actions" && (
                        <div className="flex gap-3">
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
                          <DeletePopover employee={item} />
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
          <div className="w-full col-span-1 sm:col-span-2 md:col-span-3">
            {topContent}
          </div>
          <div className="grid w-full grid-cols-1 col-span-3 gap-5 my-3 sm:grid-cols-2 md:grid-cols-3">
            {employee_paginated.employees.map((employee) => (
              <CardItem
                key={employee.id}
                employee={employee}
                setOpenModal={modalAdd.onOpen}
                setEmployee={setSelectedEmployee}
              />
            ))}
          </div>

          <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
            <div className="hidden sm:flex">{bottomContent}</div>
            <div className="flex items-center justify-between pb-10 sm:hidden">
              <Button
                isIconOnly
                className="bg-coffee-brown"
                disabled={employee_paginated.currentPag === 1}
                onClick={() => changePage(employee_paginated.currentPag - 1)}
              >
                <ChevronLeft color="white" />
              </Button>
              <p className="text-sm font-semibold text-gray-600">
                {employee_paginated.currentPag} de {employee_paginated.totalPag}
              </p>
              <Button
                isIconOnly
                className="bg-coffee-brown"
                disabled={
                  employee_paginated.currentPag === employee_paginated.totalPag
                }
                onClick={() => changePage(employee_paginated.currentPag + 1)}
              >
                <ChevronRight color="white" />
              </Button>
            </div>
          </div>
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteEmployee } = useEmployeeStore();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
      <PopoverTrigger>
        <Button
          onClick={onOpen}
          isIconOnly
          style={{
            backgroundColor: theme.colors.danger,
          }}
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
              onClick={handleDelete}
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
  );
};

interface CardProps {
  employee: Employee;
  setEmployee: Dispatch<SetStateAction<Employee | undefined>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export const CardItem = ({
  employee,
  setEmployee,
  setOpenModal,
}: CardProps) => {
  return (
    <Card isBlurred isPressable>
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">
              {employee.fullName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="flex ml-3 text-sm font-semibold text-gray-700">
          <Store size={25} className="text-default-400" />
          <p className="ml-3">{employee.branch.name}</p>
        </p>
        <p className="flex mt-3 ml-3 text-sm font-semibold text-gray-700">
          <Phone size={25} className="text-default-400" />
          <p className="ml-3">{employee.phone}</p>
        </p>
      </CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setEmployee(employee);
              setOpenModal(true);
            }}
            isIconOnly
            className="bg-coffee-green"
          >
            <EditIcon className="text-white" size={20} />
          </Button>
          <DeletePopover employee={employee} />
        </div>
      </CardHeader>
    </Card>
  );
};
