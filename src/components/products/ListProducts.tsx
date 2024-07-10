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
  Switch,
} from "@nextui-org/react";
import { useEffect, useState, useContext } from "react";
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
  RefreshCcw,
} from "lucide-react";
import AddButton from "../global/AddButton";
import { useProductsStore } from "../../store/products.store";
import Pagination from "../global/Pagination";
import { Product } from "../../types/products.types";
import ModalGlobal from "../global/ModalGlobal";
import AddProducts from "./AddProducts";
import { useCategoriesStore } from "../../store/categories.store";
import { ThemeContext } from "../../hooks/useTheme";
import { ButtonGroup } from "@nextui-org/react";
import { CategoryProduct } from "../../types/categories.types";
import MobileView from "./MobileView";
// import { Drawer } from "vaul";
import { global_styles } from "../../styles/global.styles";
import UpdateProduct from "./UpdateProduct";
import { limit_options } from "../../utils/constants";
import SmPagination from "../global/SmPagination";
import useWindowSize from "../../hooks/useWindowSize";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Select as UISelect,
  SelectContent,
  SelectItem as UISelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  actions: string[];
}
function ListProducts({ actions }: Props) {
  const { theme, context } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const {
    getPaginatedProducts,
    paginated_products,
    activateProduct,
    loading_products,
  } = useProductsStore();
  const [openVaul, setOpenVaul] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(5);
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<"table" | "grid" | "list">(
    windowSize.width < 768 ? "grid" : "table"
  );
  const [page, serPage] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getPaginatedProducts(1, limit, category, search, active ? 1 : 0);
  }, [limit, active]);

  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      limit,
      searchParam ?? category,
      searchParam ?? search,
      active ? 1 : 0
    );
  };

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts(1, limit, "", "", active ? 1 : 0);
    });
  };
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="hidden w-full gap-5 md:flex">
            <div className="flex items-end justify-between w-full gap-3">
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
                value={category}
                clearButtonProps={{
                  onClick: () => setCategory(""),
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem
                    value={bra.name}
                    key={JSON.stringify(bra)}
                    className="dark:text-white"
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
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full gap-5 mt-4 xl:flex-row xl:gap-0">
            <div className="flex items-end justify-between w-full gap-10 mt lg:justify-end">
              <ButtonGroup>
                <Button
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
                  {/* <Drawer.Root
                    shouldScaleBackground
                    open={openVaul}
                    onClose={() => setOpenVaul(false)}
                  >
                    <Drawer.Trigger asChild>
                      <Button
                        style={global_styles().thirdStyle}
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
                          <Drawer.Title className="mb-4 font-medium dark:text-white">
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
                              placeholder="Escribe para buscar..."
                              isClearable
                              onClear={() => {
                                setSearch("");
                              }}
                            />
                            <Input
                              startContent={<SearchIcon />}
                              className="w-full dark:text-white"
                              variant="bordered"
                              labelPlacement="outside"
                              label="Categoria"
                              classNames={{
                                label: "font-semibold text-gray-700",
                                inputWrapper: "pr-0",
                              }}
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              placeholder="Escribe para buscar..."
                              isClearable
                              onClear={() => {
                                setCategory("");
                              }}
                            />
                            <Button
                              style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.primary,
                              }}
                              className="font-semibold"
                              color="primary"
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
                  </Drawer.Root> */}
                  <Drawer open={openVaul} onClose={() => setOpenVaul(false)}>
                    <DrawerTrigger asChild>
                      <Button
                        style={global_styles().thirdStyle}
                        isIconOnly
                        type="button"
                        onClick={() => setOpenVaul(true)}
                      >
                        <Filter />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Filtros disponibles</DrawerTitle>
                      </DrawerHeader>
                      <DrawerFooter>
                        <label htmlFor="">Categoría</label>
                        <UISelect
                          value={category}
                          onValueChange={(value) =>
                            setCategory(value === "TODAS" ? "" : value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todas las categorías" />
                          </SelectTrigger>
                          <SelectContent>
                            <UISelectItem value={"TODAS"}>
                              MOSTRAR TODAS
                            </UISelectItem>
                            {list_categories.map((item) => (
                              <UISelectItem key={item.id} value={item.name}>
                                {item.name}
                              </UISelectItem>
                            ))}
                          </SelectContent>
                        </UISelect>
                        <Input
                          placeholder="Escribe para buscar..."
                          label="Nombre"
                          labelPlacement="outside"
                          variant="bordered"
                        ></Input>
                        <Button
                          onClick={() => {
                            handleSearch(undefined);
                            setOpenVaul(false);
                          }}
                          className="w-full mb-10"
                        >
                          Aplicar filtros
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
              <div className="flex justify-end w-full">
                {actions.includes("Agregar") && (
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
          <div className="flex items-end justify-end w-full gap-5 pt-4 mb-5">
            <Select
              className="max-w-44 dark:text-white"
              variant="bordered"
              label="Mostrar"
              labelPlacement="outside"
              defaultSelectedKeys={["5"]}
              classNames={{
                label: "font-semibold",
              }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value !== "" ? e.target.value : "5"));
              }}
            >
              {limit_options.map((limit) => (
                <SelectItem
                  key={limit}
                  value={limit}
                  className="dark:text-white"
                >
                  {limit}
                </SelectItem>
              ))}
            </Select>
            <div className="flex items-center">
              <Switch
                onValueChange={(active) => setActive(active)}
                isSelected={active}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {active ? "inactivos" : "activos"}
                </span>
              </Switch>
            </div>
          </div>
          {(view === "grid" || view === "list") && (
            <MobileView
              DeletePopover={DeletePopover}
              openEditModal={(product) => {
                setSelectedProduct(product);
                setIsOpenModalUpdate(true);
              }}
              layout={view as "grid" | "list"}
              actions={actions}
              handleActivate={handleActivate}
            />
          )}
          {view === "table" && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={paginated_products.products}
              tableStyle={{ minWidth: "50rem" }}
              loading={loading_products}
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
              {/* <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="price"
                header="Precio"
                body={(rowData) => formatCurrency(Number(rowData.price))}
              /> */}
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    {actions.includes("Editar") && (
                      <Button
                        onClick={() => {
                          setSelectedProduct(item);

                          setIsOpenModalUpdate(true);
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
                    )}
                    {actions.includes("Eliminar") && (
                      <>
                        {item.isActive ? (
                          <DeletePopover product={item} />
                        ) : (
                          <Button
                            onClick={() => handleActivate(item.id)}
                            isIconOnly
                            style={global_styles().thirdStyle}
                          >
                            <RefreshCcw />
                          </Button>
                        )}
                      </>
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
                <SmPagination
                  handleNext={() => {
                    serPage(paginated_products.nextPag);
                    getPaginatedProducts(
                      paginated_products.nextPag,
                      limit,
                      category,
                      search
                    );
                  }}
                  handlePrev={() => {
                    serPage(paginated_products.prevPag);
                    getPaginatedProducts(
                      paginated_products.prevPag,
                      limit,
                      category,
                      search
                    );
                  }}
                  currentPage={paginated_products.currentPag}
                  totalPages={paginated_products.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <ModalGlobal
          title={selectedProduct ? "Editar producto" : "Nuevo producto"}
          onClose={modalAdd.onClose}
          size="w-full md:w-[90vw] lg:w-[80vw]"
          isOpen={modalAdd.isOpen}
          isMaximizable
          isFull
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
          size="w-full md:w-[900px] lg:w-[1000px] xl:w-[1200px]"
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
        <div className="flex flex-col items-center justify-center w-full p-5">
          <p className="font-semibold text-gray-600 dark:text-white">
            Eliminar {product.name}
          </p>
          <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="flex justify-center mt-4">
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
