import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useCustomerStore } from "../../store/customers.store";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  EditIcon,
  MailIcon,
  Phone,
  PlusIcon,
  Repeat,
  TrashIcon,
  Search,
  List,
  CreditCard,
  Table as ITable,
} from "lucide-react";
import ModalGlobal from "../global/ModalGlobal";
import AddClientNormal from "./AddClientNormal";
import AddClientContributor from "./AddClientContributor";
import { ButtonGroup } from "@nextui-org/react";
import {
  Customer,
  CustomerDirection,
  PayloadCustomer,
} from "../../types/customers.types";
import { ThemeContext } from "../../hooks/useTheme";
import MobileView from "./MobileView"
const ListClients = () => {
  const { theme } = useContext(ThemeContext);

  const { getCustomersPagination, customer_pagination } = useCustomerStore();
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  // const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [typeClient, setTypeClient] = useState("normal");
  // const handleSearch = (searchParam: string | undefined) => {
  //   getCustomersPagination(
  //     1,
  //     limit,
  //     searchParam ?? search,
  //     searchParam ?? email
  //   );
  //   useEffect(() => {
  //     if (search !== "") {
  //       getCustomersPagination(1, limit, search, email);
  //     } else {
  //       getCustomersPagination(1, limit, "", email);
  //     }
  //   }, [search, limit, email]);
  // }
  useEffect(() => {
    getCustomersPagination(1, limit, search, email);
  }, []);
  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const handleSearch = (searchParam: string | undefined) => {
    getCustomersPagination(1, limit, searchParam ?? search, searchParam ?? email);
  };

  const modalAdd = useDisclosure();
  const modalUpdate = useDisclosure();
const clearModal = () => {
modalAdd.onClose
handleChangeCustomer({} as Customer, "")
}
  const [selectedCustomer, setSelectedCustomer] = useState<PayloadCustomer>();
  const [selectedCustomerDirection, setSelectedCustomerDirection] =
    useState<CustomerDirection>();
  const [selectedId, setSelectedId] = useState<number>(0);

  const handleChangeCustomer = (customer: Customer, type = "edit") => {
    const payload_customer: PayloadCustomer = {
      nombre: customer.nombre,
      correo: customer.correo,
      telefono: customer.telefono,
      numDocumento: customer.numDocumento,
      nombreComercial: customer.nombreComercial,
      nrc: customer.nrc,
      nit: customer.nit,
      tipoDocumento: "13",
      bienTitulo: "05",
      codActividad: customer.codActividad,
      descActividad: customer.descActividad,
      esContribuyente: customer.esContribuyente ? 1 : 0,
    };

    const payload_direction: CustomerDirection = {
      id: customer.direccion?.id ?? 0,
      municipio: customer.direccion?.municipio ?? "",
      nombreMunicipio: customer.direccion?.nombreMunicipio ?? "",
      departamento: customer.direccion?.departamento ?? "",
      nombreDepartamento: customer.direccion?.nombreDepartamento ?? "",
      complemento: customer.direccion?.complemento ?? "",
      active: customer.direccion?.active ?? false,
    };

    setSelectedCustomer(payload_customer);
    setSelectedCustomerDirection(payload_direction);
    setSelectedId(customer.id);

    if (type === "edit") {
      if (customer.esContribuyente) {
        setTypeClient("contribuyente");
      } else {
        setTypeClient("normal");
      }
      modalAdd.onOpen();
      return;
    }

    if (customer.esContribuyente) {
      setTypeClient("normal");
    } else {
      setTypeClient("contribuyente");
    }
    modalAdd.onOpen();
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="lg"
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  // handleSearch("");
                  setSearch("");
                }}
              />
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  // handleSearch("");
                  setEmail("");
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
              <div className="flex justify-end w-full">
                <BottomAdd
                  setTypeClient={setTypeClient}
                  openModal={modalAdd.onOpen}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full">
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
              layout={view as "grid" | "list"}
            />
          )}
          <div className="flex justify-end w-full py-3 bg-first-300"></div>

          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={customer_pagination.customers}
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
                field="nombre"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="telefono"
                header="Teléfono"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="correo"
                header="Correo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="esContribuyente"
                body={(item) => (item.esContribuyente ? "Si" : "No")}
                header="Contribuyente"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <Button
                      onClick={() => handleChangeCustomer(item, "edit")}
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
                    <Button
                      onClick={() => handleChangeCustomer(item, "change")}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.third,
                      }}
                    >
                      <Repeat
                        style={{ color: theme.colors.primary }}
                        size={20}
                      />
                    </Button>
                    <DeletePopover customers={item} />
                  </div>
                )}
              />
            </DataTable>
          )}
          {/* <Table
          isHeaderSticky
          bottomContentPlacement="outside"
          topContentPlacement="outside"
          topContent={
            <>
              <div className="flex flex-col w-full gap-4">
                <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-3 md:flex-row 2xl:mt-4">
                  <Input
                    aria-label="input-search"
                    classNames={{
                      base: "w-full bg-white",
                      inputWrapper: "border-1 h-10",
                    }}
                    placeholder="Buscar por nombre..."
                    size="sm"
                    startContent={
                      <SearchIcon size={20} className="text-default-300" />
                    }
                    variant="bordered"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Input
                    aria-label="input-search"
                    classNames={{
                      base: "w-full bg-white",
                      inputWrapper: "border-1 h-10",
                    }}
                    placeholder="Buscar por correo..."
                    size="sm"
                    startContent={
                      <MailIcon size={20} className="text-default-300" />
                    }
                    variant="bordered"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex justify-end w-full">
                    <BottomAdd
                      setTypeClient={setTypeClient}
                      openModal={modalAdd.onOpen}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between 2xl:mt-6 2xl:mb-6">
                  <span className="text-xs sm:text-small text-default-400 ">
                    Total {customer_pagination.customers.length} clientes
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
            </>
          }
          bottomContent={bottomContent}
          classNames={{
            wrapper: "max-h-[450px] 2xl:max-h-[600px]",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={"font-semibold"}
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
            items={customer_pagination.customers}
            className="overflow-y-auto h-96 max-h-96"
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "id" && item.id}
                    {columnKey === "name" && item.nombre}
                    {columnKey === "phone" && item.telefono}
                    {columnKey === "email" && item.correo}
                    {columnKey === "tribute" && (
                      <p>{item.esContribuyente ? "Si" : "No"}</p>
                    )}
                    {columnKey === "actions" && (
                      <>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleChangeCustomer(item, "edit")}
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
                          <Button
                            onClick={() => handleChangeCustomer(item, "change")}
                            isIconOnly
                            style={{
                              backgroundColor: theme.colors.third,
                            }}
                          >
                            <Repeat
                              style={{ color: theme.colors.primary }}
                              size={20}
                            />
                          </Button>
                          <DeletePopover customer={item} />
                        </div>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table> */}
        </div>
        {/* <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
          <div className="w-full col-span-1 sm:col-span-2 md:col-span-3">
            <div className="flex flex-col w-full gap-4">
              <div className="grid items-end grid-cols-1 gap-3 sm:grid-cols-3 md:flex-row 2xl:mt-4">
                <Input
                  aria-label="input-search"
                  classNames={{
                    base: "w-full bg-white",
                    inputWrapper: "border-1 h-10",
                  }}
                  placeholder="Buscar por nombre..."
                  size="sm"
                  startContent={
                    <SearchIcon size={20} className="text-default-300" />
                  }
                  variant="bordered"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Input
                  aria-label="input-search"
                  classNames={{
                    base: "w-full bg-white",
                    inputWrapper: "border-1 h-10",
                  }}
                  placeholder="Buscar por correo..."
                  size="sm"
                  startContent={
                    <MailIcon size={20} className="text-default-300" />
                  }
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-end w-full">
                  <BottomAdd
                    setTypeClient={setTypeClient}
                    openModal={modalAdd.onOpen}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between 2xl:mt-6 2xl:mb-6">
                <span className="text-xs sm:text-small text-default-400 ">
                  Total {customer_pagination.customers.length} clientes
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
          </div>
          <div className="grid w-full grid-cols-1 col-span-3 gap-5 my-3 sm:grid-cols-2 md:grid-cols-3">
            {customer_pagination.customers.map((customer) => (
              <CardItem
                key={customer.id}
                customer={customer}
                handleChange={handleChangeCustomer}
              />
            ))}
          </div>
          <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
            <div className="hidden sm:flex">{bottomContent}</div>
            <div className="flex items-center justify-between pb-10 sm:hidden">
              <Button
                isIconOnly
                className="bg-coffee-brown"
                disabled={customer_pagination.currentPag === 1}
                onClick={() => changePage(customer_pagination.currentPag - 1)}
              >
                <ChevronLeft color="white" />
              </Button>
              <p className="text-sm font-semibold text-gray-600">
                {customer_pagination.currentPag} de{" "}
                {customer_pagination.totalPag}
              </p>
              <Button
                isIconOnly
                className="bg-coffee-brown"
                disabled={
                  customer_pagination.currentPag ===
                  customer_pagination.totalPag
                }
                onClick={() => changePage(customer_pagination.currentPag + 1)}
              >
                <ChevronRight color="white" />
              </Button>
            </div>
          </div>
        </div> */}
        <ModalGlobal
          title="Nuevo cliente"
          isOpen={modalAdd.isOpen}
          onClose={clearModal}
          size={typeClient === "contribuyente" ? "2xl" : "lg"}
          isDismissable={false}
          
        >
          <>
            {typeClient === "normal" && (
              <AddClientNormal
                closeModal={modalAdd.onClose}
                customer={selectedCustomer}
                customer_direction={selectedCustomerDirection}
                id={selectedId}
              />
            )}
            {typeClient === "contribuyente" && (
              <AddClientContributor
                closeModal={modalAdd.onClose}
                customer={selectedCustomer}
                customer_direction={selectedCustomerDirection}
                id={selectedId}
              />
            )}
          </>
        </ModalGlobal>
      </div>
    </>
  );
};
export default ListClients;

interface PopProps {
  customers: Customer;
}

export const DeletePopover = ({ customers }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteCustomer } = useCustomerStore();

  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
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
            Eliminar {customers.nombre}
          </p>
          <p className="mt-3 text-center text-gray-600 w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete(customers.id)}
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
  customer: Customer;
  handleChange: (item: Customer, type: string) => void;
}

export const CardItem = ({ customer, handleChange }: CardProps) => {
  return (
    <Card isBlurred isPressable>
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">
              {customer.nombre}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="flex ml-3 text-sm font-semibold text-gray-700">
          <MailIcon size={25} className="text-default-400" />
          <p className="ml-3">{customer.correo}</p>
        </p>
        <p className="flex mt-3 ml-3 text-sm font-semibold text-gray-700">
          <Phone size={25} className="text-default-400" />
          <p className="ml-3">{customer.telefono}</p>
        </p>
      </CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => handleChange(customer, "edit")}
            isIconOnly
            className="bg-coffee-green"
          >
            <EditIcon className="text-white" size={20} />
          </Button>
          <Button
            onClick={() => handleChange(customer, "change")}
            isIconOnly
            className="bg-[#E8751A]"
          >
            <Repeat className="text-white" size={20} />
          </Button>
          <DeletePopover customers={customer} />
        </div>
      </CardHeader>
    </Card>
  );
};

interface PopoverAddProps {
  setTypeClient: Dispatch<SetStateAction<string>>;
  openModal: () => void;
}

export const BottomAdd = ({ setTypeClient, openModal }: PopoverAddProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Popover
      aria-labelledby="popover-title"
      aria-describedby="popover-id"
      showArrow
      onClose={onClose}
      isOpen={isOpen}
      backdrop="blur"
    >
      <PopoverTrigger>
        <Button
          className="h-10 max-w-72"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          endContent={<PlusIcon />}
          onClick={() => (isOpen ? onClose() : onOpen())}
          size="sm"
        >
          Agregar nuevo
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title">
        <div className="flex flex-col gap-5 p-3">
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient("normal");
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Cliente normal
          </Button>
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient("contribuyente");
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Cliente contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
