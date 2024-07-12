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
  RefreshCcw,
} from "lucide-react";
import AddButton from "../global/AddButton";
import { useProductsStore } from "../../store/products.store";
import Pagination from "../global/Pagination";
import { Product } from "../../types/products.types";
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
  Select as UISelect,
  SelectContent,
  SelectItem as UISelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeadlessModal from "../global/HeadlessModal";
import classNames from "classnames";
import TooltipGlobal from "../global/TooltipGlobal";
import { useSubCategoryStore } from "@/store/sub-category";
import { useNavigate } from "react-router";
import BottomDrawer from "../global/BottomDrawer";
import { useSubCategoriesStore } from "@/store/sub-categories.store";

interface Props {
  actions: string[];
}
function ListProducts({ actions }: Props) {
  const { sub_categories, getSubCategoriesList } = useSubCategoryStore();
  const { getSubcategories, subcategories } = useSubCategoriesStore();

  // console.log("listado de sub-Categories",sub_categories)
  const { theme } = useContext(ThemeContext);
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
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [subCategory, setSubCategory] = useState("");
  const [limit, setLimit] = useState(5);
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<"table" | "grid" | "list">(
    windowSize.width < 768 ? "grid" : "table"
  );
  const [page, serPage] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getPaginatedProducts(
      1,
      limit,
      category,
      subCategory,
      search,
      code,
      active ? 1 : 0
    );
  }, [limit, active]);

  useEffect(() => {
    getSubcategories(categoryId);
  }, [categoryId]);

  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getListCategories();
    getSubCategoriesList();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      limit,
      searchParam ?? category,
      searchParam ?? subCategory,
      searchParam ?? search,
      searchParam ?? code,
      active ? 1 : 0
    );
  };

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts(1, limit, "", "", "", "", active ? 1 : 0);
    });
  };

  const navigate = useNavigate();

  const itemSubCategories = useMemo(() => {
    if (subcategories.length > 0) return subcategories;
    return sub_categories;
  }, [sub_categories, subcategories]);

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-4 gap-3">
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
              <Input
                startContent={<SearchIcon />}
                className="w-full dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="Código"
                classNames={{
                  label: "font-semibold text-gray-700",
                  inputWrapper: "pr-0",
                }}
                value={search}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  // handleSearch("");
                  setCode("");
                }}
              />
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(
                      key as string
                    ) as CategoryProduct;
                    setCategory(branchSelected.name);
                    setCategoryId(branchSelected.id);
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
                  onClick: () => {
                    setCategory("");
                    setCategoryId(0);
                  },
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

              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(
                      key as string
                    ) as CategoryProduct;
                    setSubCategory(branchSelected.name);
                  }
                }}
                className="w-full dark:text-white"
                label="Sub Categoría"
                labelPlacement="outside"
                placeholder="Selecciona la sub categoría"
                variant="bordered"
                classNames={{
                  base: "font-semibold text-gray-500 text-sm",
                }}
                value={category}
                items={
                  subcategories.length > 0 || categoryId > 0
                    ? subcategories
                    : sub_categories
                }
                clearButtonProps={{
                  onClick: () => {
                    setSubCategory("");
                  },
                }}
              >
                {(item) => (
                  <AutocompleteItem
                    value={item.name}
                    key={JSON.stringify(item)}
                    className="dark:text-white"
                  >
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
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
                  <TooltipGlobal text="Filtros disponibles" color="primary">
                    <Button
                      style={global_styles().thirdStyle}
                      isIconOnly
                      type="button"
                      onClick={() => setOpenVaul(true)}
                    >
                      <Filter />
                    </Button>
                  </TooltipGlobal>
                  <BottomDrawer
                    title="Filtros disponibles"
                    open={openVaul}
                    onClose={() => setOpenVaul(false)}
                  >
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
                    <Input
                      startContent={<SearchIcon />}
                      className="w-full dark:text-white"
                      variant="bordered"
                      labelPlacement="outside"
                      label="Código"
                      classNames={{
                        label: "font-semibold text-gray-700",
                        inputWrapper: "pr-0",
                      }}
                      value={search}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Escribe para buscar..."
                      isClearable
                      onClear={() => {
                        // handleSearch("");
                        setCode("");
                      }}
                    />
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const branchSelected = JSON.parse(
                            key as string
                          ) as CategoryProduct;
                          setCategory(branchSelected.name);
                          setCategoryId(branchSelected.id);
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
                      defaultSelectedKey={category}
                      clearButtonProps={{
                        onClick: () => {
                          setCategory("");
                          setCategoryId(0);
                        },
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

                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const branchSelected = JSON.parse(
                            key as string
                          ) as CategoryProduct;
                          setSubCategory(branchSelected.name);
                        }
                      }}
                      className="w-full dark:text-white"
                      label="Sub Categoría"
                      labelPlacement="outside"
                      placeholder="Selecciona la sub categoría"
                      variant="bordered"
                      classNames={{
                        base: "font-semibold text-gray-500 text-sm",
                      }}
                      
                      defaultSelectedKey={subCategory}
                      clearButtonProps={{
                        onClick: () => {
                          setSubCategory("");
                        },
                      }}
                    >
                      {itemSubCategories.map((item) => (
                        <AutocompleteItem
                          value={item.name}
                          key={JSON.stringify(item)}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    <Button
                      onClick={() => {
                        handleSearch(undefined);
                        setOpenVaul(false);
                      }}
                      className="w-full mt-5"
                    >
                      Aplicar filtros
                    </Button>
                  </BottomDrawer>
                </div>
              </div>
              <div className="flex justify-end w-full gap-10">
                {actions.includes("Agregar") && (
                  <AddButton
                    onClick={() => {
                      navigate("/add-product");
                    }}
                  />
                )}
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                  }}
                  className="hidden font-semibold md:flex"
                  color="primary"
                  endContent={<SearchIcon size={15} />}
                  onClick={() => handleSearch(undefined)}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between w-full gap-5 pt-4 mb-5">
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
                classNames={{
                  thumb: classNames(active ? "bg-blue-500" : "bg-gray-400"),
                  wrapper: classNames(active ? "!bg-blue-300" : "bg-gray-200"),
                }}
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
              className="shadow dark:text-white"
              emptyMessage="No se encontraron resultados"
              value={paginated_products.products}
              tableStyle={{ minWidth: "50rem" }}
              loading={loading_products}
            >
              <Column
                headerClassName="text-sm font-semibold"
                bodyClassName={"dark:text-white"}
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                bodyClassName={"dark:text-white"}
                headerStyle={style}
                field="name"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                bodyClassName={"dark:text-white"}
                headerStyle={style}
                field="code"
                header="Código"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                bodyClassName={"dark:text-white"}
                // field="price"
                header="Sub categoría"
                body={(rowData) => rowData.subCategory.name}
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    {actions.includes("Editar") && (
                      <TooltipGlobal text="Editar">
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
                      </TooltipGlobal>
                    )}
                    {actions.includes("Eliminar") && (
                      <>
                        {item.isActive ? (
                          <DeletePopover product={item} />
                        ) : (
                          <TooltipGlobal text="Activar">
                            <Button
                              onClick={() => handleActivate(item.id)}
                              isIconOnly
                              style={global_styles().thirdStyle}
                            >
                              <RefreshCcw />
                            </Button>
                          </TooltipGlobal>
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
                    getPaginatedProducts(
                      page,
                      limit,
                      category,
                      subCategory,
                      search,
                      code
                    );
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
                      subCategory,
                      search,
                      code
                    );
                  }}
                  handlePrev={() => {
                    serPage(paginated_products.prevPag);
                    getPaginatedProducts(
                      paginated_products.prevPag,
                      limit,
                      category,
                      subCategory,
                      search,
                      code
                    );
                  }}
                  currentPage={paginated_products.currentPag}
                  totalPages={paginated_products.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          title={selectedProduct ? "Editar producto" : "Nuevo producto"}
          onClose={modalAdd.onClose}
          size="w-full md:w-[90vw] lg:w-[80vw]"
          isOpen={modalAdd.isOpen}
          // isFull
        >
          <AddProducts
            onCloseModal={modalAdd.onClose}
            product={selectedProduct}
          />
        </HeadlessModal>

        <HeadlessModal
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
        </HeadlessModal>
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
          <TooltipGlobal text="Eliminar el producto" color="primary">
            <TrashIcon
              style={{
                color: theme.colors.primary,
              }}
              size={20}
            />
          </TooltipGlobal>
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
