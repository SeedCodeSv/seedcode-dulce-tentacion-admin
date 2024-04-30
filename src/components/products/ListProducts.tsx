import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useMemo, useState, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  ChevronLeft,
  ChevronRight,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  List,
  CreditCard,
  Table as ITable,
} from "lucide-react";
import AddButton from "../global/AddButton";
import { Paginator } from "primereact/paginator";
// import ReturnImageCategory from "../global/ReturnImageCategory";
import { useProductsStore } from "../../store/products.store";
import Pagination from "../global/Pagination";

// import ReturnAvatarImage from "../global/ReturnAvatarImage";
import { Product } from "../../types/products.types";
import ModalGlobal from "../global/ModalGlobal";
import AddProducts from "./AddProducts";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import { ButtonGroup } from "@nextui-org/react";
import { paginator_styles } from "../../styles/paginator.styles";


// import ReturnImgCategory from "../global/ReturnImgCategory";

function ListProducts() {
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const { getPaginatedProducts, paginated_products } = useProductsStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(8);
  const [view, setView] = useState<"table" | "grid" | "list">("table");

  useEffect(() => {
    getPaginatedProducts(1, 8, "", "");
  }, []);

  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const changePage = (page: number) => {
    getPaginatedProducts(page, 8, category, search);
  };

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-end gap-3">
             <Input
                startContent={<SearchIcon />}
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
              <Select
                aria-labelledby="select-label"
                className="bg-white"
                placeholder="Buscar por categoría..."
                size="sm"
                startContent={
                  <SearchIcon size={20} className="text-default-300" />
                }
                variant="bordered"
                onChange={(e) => {
                  if (e.target.value) {
                    setCategory(e.target.value);
                  } else {
                    setCategory("");
                  }
                }}
              >
                {list_categories.map((list) => (
                  <SelectItem key={list.name} textValue={list.name}>
                    <div className="flex items-center gap-2">
                      {/* <ReturnImgCategory category={list.name} /> */}
                      <div className="flex flex-col">
                        <span className="text-small">{list.name}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="font-semibold"
                color="primary"
                size="lg"
                // onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
              {/* <div className="flex justify-end w-full">
                <Button
                  className="h-10 max-w-72 bg-coffee-green text-background"
                  endContent={<PlusIcon />}
                  size="sm"
                  onClick={() => modalAdd.onOpen()}
                >
                  Agregar nuevo
                </Button>
              </div> */}
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
                {/* <BottomAdd
                  setTypeClient={setTypeClient}
                  openModal={modalAdd.onOpen}
                /> */}
                 <AddButton
                  onClick={() => {
                    modalAdd.onOpen();
                  }}
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
          <div className="flex justify-end w-full py-3 bg-first-300"></div>
          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={paginated_products.products}
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
                field="type"
                header="Tipo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="code"
                header="Código"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="price"
                header="Precio"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <Button
                      // onClick={() => handleChangeCustomer(item, "edit")}
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
                    <DeletePopover product={item} />
                  </div>
                )}
              />
            </DataTable>
          )}
          {paginated_products.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={paginated_products.prevPag}
                  nextPage={paginated_products.nextPag}
                  currentPage={paginated_products.currentPag}
                  totalPages={paginated_products.totalPag}
                  onPageChange={(page) => {
                    getPaginatedProducts(page, limit, category, search);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <Paginator
                  pt={paginator_styles(1)}
                  className="flex justify-between w-full"
                  first={paginated_products.currentPag}
                  rows={limit}
                  totalRecords={paginated_products.total}
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
          title={selectedProduct ? "Editar producto" : "Nuevo producto"}
          onClose={modalAdd.onClose}
          size="lg"
          isOpen={modalAdd.isOpen}
        >
          <AddProducts
            onCloseModal={modalAdd.onClose}
            product={selectedProduct}
          />
        </ModalGlobal>
      </div>
    </>
    //   );

    // const bottomContent = useMemo(() => {
    //   if (paginated_products.total === 0) {
    //     return <div>No se encontraron resultados</div>;
    //   }
    //   return (
    //     <div className="mt-10 mb-20 lg:mb-0">
    //       <Pagination
    //         total={paginated_products.totalPag}
    //         initialPage={paginated_products.currentPag}
    //         page={paginated_products.currentPag}
    //         showControls
    //         showShadow
    //         boundaries={2}
    //         color="primary"
    //         onChange={(page) => changePage(page)}
    //         classNames={{
    //           cursor: "bg-[#65451F] shadow shadow-[#65451F] font-semibold",
    //           next: "bg-[#65451F] text-white",
    //           prev: "bg-[#65451F] text-white",
    //         }}
    //       />
    //     </div>
    //   );
    // }, [paginated_products, paginated_products.products]);

    // return (
    //   <div className="w-full h-full p-5 bg-gray-50">
    //     <div className="hidden p-5 bg-white rounded lg:flex">
    //       <Table
    //         topContent={topContent}
    //         bottomContentPlacement="outside"
    //         topContentPlacement="outside"
    //         bottomContent={bottomContent}
    //         isHeaderSticky={true}
    //         classNames={{
    //           wrapper: "max-h-[450px] 2xl:max-h-[600px]",
    //         }}
    //       >
    //         <TableHeader columns={columns}>
    //           {(column) => (
    //             <TableColumn
    //               key={column.key}
    //               className="font-semibold text-white bg-coffee-brown"
    //               align={column.key === "actions" ? "center" : "start"}
    //               allowsSorting={column.sortable}
    //             >
    //               {column.name}
    //             </TableColumn>
    //           )}
    //         </TableHeader>
    //         <TableBody items={paginated_products.products}>
    //           {(item) => (
    //             <TableRow key={item.id}>
    //               {(columnKey) => (
    //                 <TableCell>
    //                   {columnKey === "id" && item.id}
    //                   {columnKey === "name" && (
    //                     <>
    //                       {/* <ReturnImageCategory
    //                         category={item.categoryProduct.name}
    //                         product_name={item.name}
    //                         description={item.description}
    //                       /> */}
    //                     </>
    //                   )}
    //                   {columnKey === "price" && "$" + item.price}
    //                   {columnKey === "code" && item.code}
    //                   {columnKey === "category" && item.categoryProduct.name}
    //                   {columnKey === "actions" && (
    //                     <>
    //                       <div className="flex gap-3">
    //                         <Button
    //                           onClick={() => {
    //                             setSelectedProduct(item);
    //                             modalAdd.onOpen();
    //                           }}
    //                           isIconOnly
    //                           className="bg-coffee-green"
    //                         >
    //                           <EditIcon className="text-white" size={20} />
    //                         </Button>
    //                         <PopoverDelete product={item} />
    //                       </div>
    //                     </>
    //                   )}
    //                 </TableCell>
    //               )}
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </div>
    //     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
    //       <div className="col-span-1 sm:col-span-2 md:col-span-3 ">
    //         {topContent}
    //       </div>
    //       {paginated_products.products.map((product) => (
    //         <Card key={product.id} isPressable isBlurred>
    //           <CardHeader>
    //             <div className="flex">
    //               {/* <ReturnAvatarImage category={product.categoryProduct.name} /> */}
    //               <div className="flex flex-col">
    //                 <p className="ml-3 text-sm font-semibold text-gray-600">
    //                   {product.name}
    //                 </p>
    //                 <p className="ml-3 text-sm text-gray-600">
    //                   {product.description}
    //                 </p>
    //               </div>
    //             </div>
    //           </CardHeader>
    //           <CardBody>
    //             <p className="text-sm font-semibold text-gray-600">
    //               Precio: <span className="font-normal">${product.price}</span>
    //             </p>
    //             <p className="text-sm font-semibold text-gray-600">
    //               Categoría:{" "}
    //               <span className="font-normal">
    //                 {product.categoryProduct.name}
    //               </span>
    //             </p>
    //           </CardBody>
    //           <CardHeader>
    //             <div className="flex gap-3">
    //               <Button
    //                 onClick={() => {
    //                   setSelectedProduct(product);
    //                   modalAdd.onOpen();
    //                 }}
    //                 isIconOnly
    //                 className="bg-coffee-green"
    //               >
    //                 <EditIcon className="text-white" size={20} />
    //               </Button>
    //               <PopoverDelete product={product} />
    //             </div>
    //           </CardHeader>
    //         </Card>
    //       ))}
    //       <div className="col-span-1 mb-10 sm:col-span-2 md:col-span-3 lg:mb-0">
    //         <div className="hidden sm:flex">{bottomContent}</div>
    //         <div className="flex items-center justify-between sm:hidden">
    //           <Button
    //             isIconOnly
    //             className="bg-coffee-brown"
    //             disabled={paginated_products.currentPag === 1}
    //             onClick={() => changePage(paginated_products.currentPag - 1)}
    //           >
    //             <ChevronLeft color="white" />
    //           </Button>
    //           <p className="text-sm font-semibold text-gray-600">
    //             {paginated_products.currentPag} de {paginated_products.totalPag}
    //           </p>
    //           <Button
    //             isIconOnly
    //             className="bg-coffee-brown"
    //             disabled={
    //               paginated_products.currentPag === paginated_products.totalPag
    //             }
    //             onClick={() => changePage(paginated_products.currentPag + 1)}
    //           >
    //             <ChevronRight color="white" />
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
  );
}

export default ListProducts;

interface PopProps {
  product: Product;
}

export const DeletePopover = ({ product }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { } = useProductsStore();

  const handleDelete = async (id: number) => {
    // await deleteCustomer(id);
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
            Eliminar
          </p>
          <p className="mt-3 text-center text-gray-600 w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              // onClick={() => handleDelete(customers.id)}
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
