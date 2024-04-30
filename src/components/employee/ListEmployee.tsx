import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useEmployeeStore } from "../../store/employee.store";
import {
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  ButtonGroup,
} from "@nextui-org/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  Edit,
  Search,
  Phone,
  Truck,
  Filter,
} from "lucide-react";
import { Employee } from "../../types/employees.types";
import AddButton from "../global/AddButton";
import { ConfirmPopup } from "primereact/confirmpopup";
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
  const [limit, setLimit] = useState(8);
  const [view, setView] = useState<"table" | "grid" | "list">("table");
  const [openVaul, setOpenVaul] = useState(false);

  const modalAdd = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  const changePage = () => {
    getEmployeesPaginated(1, limit, fullName, branch, phone);
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  useEffect(() => {
    getEmployeesPaginated(1, 8, "", "", "");
  }, []);
  const filters = useMemo(() => {
    return (
      <>
        <Input
          classNames={{
            label: "font-semibold text-gray-700",
            inputWrapper: "pr-0",
          }}
          className="w-full xl:w-96"
          placeholder="Buscar por nombre..."
          size="lg"
          startContent={<Search />}
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
                    <DeletePopover employee={item} />
                    <Button
                      size="lg"
                      onClick={() => {
                        setSelectedEmployee(item);
                        modalAdd.onOpen();
                      }}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.dark,
                      }}
                    >
                      <Edit color={theme.colors.primary} size={20} />
                    </Button>
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
  const buttonRef = useRef<HTMLButtonElement>();

  const { deleteEmployee } = useEmployeeStore();
  const [visible, setVisible] = useState(false);

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
  };

  return (
    <>
      <Button
        ref={buttonRef as any}
        style={{
          backgroundColor: theme.colors.warning,
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
                  onPress={handleDelete}
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

//   const bottomContent = useMemo(() => {
//     if (employee_paginated.total === 0) {
//       return <div>No se encontraron resultados</div>;
//     }
//     return (
//       <div className="mt-10 mb-20 lg:mb-0">
//         <Pagination
//           total={employee_paginated.totalPag}
//           initialPage={employee_paginated.currentPag}
//           page={employee_paginated.currentPag}
//           showControls
//           showShadow
//           boundaries={2}
//           color="primary"
//           onChange={(page) => changePage(page)}
//           classNames={{
//             cursor: "cursor-pagination",
//             next: "cursor-pagination",
//             prev: "cursor-pagination",
//           }}
//         />
//       </div>
//     );
//   }, [employee_paginated, employee_paginated.employees]);

//   return (
//     <>
//       <div className="w-full h-full p-5 bg-gray-50">
//         <style>{` .cursor-pagination { background: ${theme.colors.dark}; color: ${theme.colors.primary} } `}</style>
//         <div className="hidden w-full p-5 bg-white rounded shadow lg:flex">
//           <Table
//             isHeaderSticky
//             bottomContentPlacement="outside"
//             topContentPlacement="outside"
//             topContent={topContent}
//             bottomContent={bottomContent}
//             classNames={{
//               wrapper: "max-h-[450px] 2xl:max-h-[600px]",
//             }}
//           >
//             <TableHeader columns={columns}>
//               {(column) => (
//                 <TableColumn
//                   key={column.key}
//                   className="font-semibold"
//                   align={column.key === "actions" ? "center" : "start"}
//                   allowsSorting={column.sortable}
//                   style={{
//                     backgroundColor: theme.colors.dark,
//                     color: theme.colors.primary,
//                   }}
//                 >
//                   {column.name}
//                 </TableColumn>
//               )}
//             </TableHeader>
//             <TableBody
//               items={employee_paginated.employees}
//               className="overflow-y-auto h-96 max-h-96"
//             >
//               {(item) => (
//                 <TableRow key={item.id}>
//                   {(columnKey) => (
//                     <TableCell>
//                       {columnKey === "id" && item.id}
//                       {columnKey === "name" && item.fullName}
//                       {columnKey === "branch" && item.branch.name}
//                       {columnKey === "phone" && item.phone}
//                       {columnKey === "actions" && (
//                         <div className="flex gap-3">
//                           <Button
//                             onClick={() => {
//                               setSelectedEmployee(item);
//                               modalAdd.onOpen();
//                             }}
//                             isIconOnly
//                             style={{
//                               backgroundColor: theme.colors.secondary,
//                             }}
//                           >
//                             <EditIcon
//                               style={{ color: theme.colors.primary }}
//                               size={20}
//                             />
//                           </Button>
//                           <DeletePopover employee={item} />
//                         </div>
//                       )}
//                     </TableCell>
//                   )}
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
//           <div className="w-full col-span-1 sm:col-span-2 md:col-span-3">
//             {topContent}
//           </div>
//           <div className="grid w-full grid-cols-1 col-span-3 gap-5 my-3 sm:grid-cols-2 md:grid-cols-3">
//             {employee_paginated.employees.map((employee) => (
//               <CardItem
//                 key={employee.id}
//                 employee={employee}
//                 setOpenModal={modalAdd.onOpen}
//                 setEmployee={setSelectedEmployee}
//               />
//             ))}
//           </div>

//           <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
//             <div className="hidden sm:flex">{bottomContent}</div>
//             <div className="flex items-center justify-between pb-10 sm:hidden">
//               <Button
//                 isIconOnly
//                 className="bg-coffee-brown"
//                 disabled={employee_paginated.currentPag === 1}
//                 onClick={() => changePage(employee_paginated.currentPag - 1)}
//               >
//                 <ChevronLeft color="white" />
//               </Button>
//               <p className="text-sm font-semibold text-gray-600">
//                 {employee_paginated.currentPag} de {employee_paginated.totalPag}
//               </p>
//               <Button
//                 isIconOnly
//                 className="bg-coffee-brown"
//                 disabled={
//                   employee_paginated.currentPag === employee_paginated.totalPag
//                 }
//                 onClick={() => changePage(employee_paginated.currentPag + 1)}
//               >
//                 <ChevronRight color="white" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ModalGlobal
//         isOpen={modalAdd.isOpen}
//         onClose={modalAdd.onClose}
//         title={selectedEmployee ? "Editar Empleado" : "Agregar Empleado"}
//         size="lg"
//       >
//         <AddEmployee
//           closeModal={modalAdd.onClose}
//           employee={selectedEmployee}
//         />
//       </ModalGlobal>
//     </>
//   );
// }

// export default ListEmployee;

// interface PopProps {
//   employee: Employee;
// }

// export const DeletePopover = ({ employee }: PopProps) => {
//   const { theme } = useContext(ThemeContext);
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const { deleteEmployee } = useEmployeeStore();

//   const handleDelete = async () => {
//     await deleteEmployee(employee.id);
//     onClose();
//   };

//   return (
//     <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
//       <PopoverTrigger>
//         <Button
//           onClick={onOpen}
//           isIconOnly
//           style={{
//             backgroundColor: theme.colors.danger,
//           }}
//         >
//           <TrashIcon
//             style={{
//               color: theme.colors.primary,
//             }}
//             size={20}
//           />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent>
//         <div className="w-full p-5">
//           <p className="font-semibold text-gray-600">
//             Eliminar {employee.fullName}
//           </p>
//           <p className="mt-3 text-center text-gray-600 w-72">
//             ¿Estas seguro de eliminar este registro?
//           </p>
//           <div className="mt-4">
//             <Button onClick={onClose}>No, cancelar</Button>
//             <Button
//               onClick={handleDelete}
//               className="ml-5"
//               style={{
//                 backgroundColor: theme.colors.danger,
//                 color: theme.colors.primary,
//               }}
//             >
//               Si, eliminar
//             </Button>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// interface CardProps {
//   employee: Employee;
//   setEmployee: Dispatch<SetStateAction<Employee | undefined>>;
//   setOpenModal: Dispatch<SetStateAction<boolean>>;
// }

// export const CardItem = ({
//   employee,
//   setEmployee,
//   setOpenModal,
// }: CardProps) => {
//   return (
//     <Card isBlurred isPressable>
//       <CardHeader>
//         <div className="flex">
//           <div className="flex flex-col">
//             <p className="ml-3 text-sm font-semibold text-gray-600">
//               {employee.fullName}
//             </p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardBody>
//         <p className="flex ml-3 text-sm font-semibold text-gray-700">
//           <Store size={25} className="text-default-400" />
//           <p className="ml-3">{employee.branch.name}</p>
//         </p>
//         <p className="flex mt-3 ml-3 text-sm font-semibold text-gray-700">
//           <Phone size={25} className="text-default-400" />
//           <p className="ml-3">{employee.phone}</p>
//         </p>
//       </CardBody>
//       <CardHeader>
//         <div className="flex gap-3">
//           <Button
//             onClick={() => {
//               setEmployee(employee);
//               setOpenModal(true);
//             }}
//             isIconOnly
//             className="bg-coffee-green"
//           >
//             <EditIcon className="text-white" size={20} />
//           </Button>
//           <DeletePopover employee={employee} />
//         </div>
//       </CardHeader>
//     </Card>
//   );
