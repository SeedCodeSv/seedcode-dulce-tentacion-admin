import {
  Input,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useEffect, useState, useContext, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  EditIcon,
  SearchIcon,
  TrashIcon,
  List,
  CreditCard,
  Table as ITable,
  Filter,
} from "lucide-react";
import AddButton from "../global/AddButton";
import { Paginator } from "primereact/paginator";
import { useProductsStore } from "../../store/products.store";
import Pagination from "../global/Pagination";
import { Product } from "../../types/products.types";
import ModalGlobal from "../global/ModalGlobal";
import AddProducts from "./AddProducts";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import { ButtonGroup } from "@nextui-org/react";
import { paginator_styles } from "../../styles/paginator.styles";
import { CategoryProduct } from "../../types/categories.types";
import MobileView from "./MobileView";
import { formatCurrency } from "../../utils/dte";
import { filterActions } from "../../utils/filters";
import { ActionsContext } from "../../hooks/useActions";
import { Drawer } from "vaul";
import { global_styles } from "../../styles/global.styles";
import classNames from "classnames";
import UpdateProduct from "./UpdateProduct";

function ListProducts() {
  const { theme, context } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const { getPaginatedProducts, paginated_products } = useProductsStore();
  const [openVaul, setOpenVaul] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(5);
  const [view, setView] = useState<"table" | "grid" | "list">("table");
  const [page, serPage] = useState(1);
  useEffect(() => {
    getPaginatedProducts(1, limit, category, search);
  }, [limit]);

  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      limit,
      searchParam ?? category,
      searchParam ?? search
    );
  };

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  const { roleActions } = useContext(ActionsContext);

  const actions_role_view = useMemo(() => {
    if (roleActions) {
      return filterActions("Productos", roleActions)?.actions.map(
        (re) => re.name
      );
    }
    return undefined;
  }, [roleActions]);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="w-full hidden gap-5 md:flex">
            <div className="flex w-full justify-between items-end gap-3">
              <Input
                startContent={<SearchIcon />}
                className="w-full dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="Nombre"
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
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(
                      key as string
                    ) as CategoryProduct;
                    setCategory(branchSelected.name);
                  }
                }}
                className="w-full dark:text-white"
                label="Categoría producto"
                labelPlacement="outside"
                placeholder="Selecciona la categoría"
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
                size="lg"
                value={category}
                clearButtonProps={{
                  onClick: () => setCategory(""),
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
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
          <div className="flex flex-col mt-4 justify-between w-full gap-5 xl:flex-row xl:gap-0">
            <div className="flex w-full items-end justify-between gap-10 mt lg:justify-end">
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
                            <Input
                              startContent={<SearchIcon />}
                              className="w-full dark:text-white"
                              variant="bordered"
                              labelPlacement="outside"
                              label="Nombre"
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
                              }}
                            />
                            <Autocomplete
                              onSelectionChange={(key) => {
                                if (key) {
                                  const branchSelected = JSON.parse(
                                    key as string
                                  ) as CategoryProduct;
                                  setCategory(branchSelected.name);
                                }
                              }}
                              className="w-full dark:text-white"
                              label="Categoría producto"
                              labelPlacement="outside"
                              placeholder="Selecciona la categoría"
                              variant="bordered"
                              classNames={{
                                base: "font-semibold  text-gray-500 text-sm",
                              }}
                              size="lg"
                              value={category}
                              clearButtonProps={{
                                onClick: () => setCategory(""),
                              }}
                            >
                              {list_categories.map((bra) => (
                                <AutocompleteItem
                                  value={bra.name}
                                  key={JSON.stringify(bra)}
                                >
                                  {bra.name}
                                </AutocompleteItem>
                              ))}
                            </Autocomplete>

                            <Button
                              style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.primary,
                              }}
                              className="font-semibold"
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
              <div className="flex justify-end w-full">
                {actions_role_view && actions_role_view.includes("Agregar") && (
                  <AddButton
                    onClick={() => {
                      modalAdd.onOpen();
                      setSelectedProduct(undefined);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full mb-5">
            <Select
              className="w-44 dark:text-white"
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
              DeletePopover={DeletePopover}
              openEditModal={(product) => {
                setSelectedProduct(product);
                modalAdd.onOpen();
              }}
              layout={view as "grid" | "list"}
            />
          )}
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
                field="code"
                header="Código"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="price"
                header="Precio"
                body={(rowData) => formatCurrency(Number(rowData.price))}
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                   
                        <Button
                          onClick={() => {
                            setSelectedProduct(item);
                           
                            setIsOpenModalUpdate(true);
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
                     
                    {actions_role_view &&
                      actions_role_view?.includes("Eliminar") && (
                        <DeletePopover product={item} />
                      )}
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
                    serPage(page);
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
          size="w-full md:w-[900px]"
          isOpen={modalAdd.isOpen}
        >
          <AddProducts
            onCloseModal={modalAdd.onClose}
            product={selectedProduct}
          />
        </ModalGlobal>

        <ModalGlobal
          title={"Editar producto"}
          onClose={() => {
            setIsOpenModalUpdate(false);
          }}
          size="w-full md:w-[900px]"
          isOpen={isOpenModalUpdate}
        >
          <UpdateProduct
            onCloseModal={() => setIsOpenModalUpdate(false)}
            product={selectedProduct}
          />
        </ModalGlobal>
      </div>
    </>
  );
}

export default ListProducts;

interface PopProps {
  product: Product;
}

export const DeletePopover = ({ product }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteProducts } = useProductsStore();

  const handleDelete = async () => {
    await deleteProducts(product.id);
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
          <p className="font-semibold text-gray-600">Eliminar {product.name}</p>
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
  );
};
