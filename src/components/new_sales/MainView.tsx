import {
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Barcode,
  CreditCard,
  List,
  Search,
  Table as ITable,
  Plus,
  Minus,
  Trash,
  Send,
} from "lucide-react";
import { EventHandler, useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useBranchProductStore } from "../../store/branch_product.store";
import { return_branch_id } from "../../storage/localStorage";
import { BranchProduct, ICartProduct } from "../../types/branch_products.types";
import Pagination from "../global/Pagination";
import { limit_options } from "../../utils/constants";
import { global_styles } from "../../styles/global.styles";
import CartProducts from "./CartProducts";
import ModalGlobal from "../global/ModalGlobal";
import FormMakeSale from "./FormMakeSale";
import useEventListener from "../../hooks/useEventListeners";
import { useAuthStore } from "../../store/auth.store";
import { toast } from "sonner";

const MainView = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [limit, setLimit] = useState<number>(5);
  const modalAdd = useDisclosure();

  const {
    branch_products,
    pagination_branch_products,
    getPaginatedBranchProducts,
    addProductCart,
    getProductByCode,
    cart_products,
  } = useBranchProductStore();

  useEffect(() => {
    getPaginatedBranchProducts(
      Number(return_branch_id()),
      1,
      limit,
      code,
      name
    );
  }, [limit]);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const priceBodyTemplate = (product: BranchProduct) => {
    return formatCurrency(Number(product.price));
  };

  const nameBodyTemplate = (product: BranchProduct) => {
    const name =
      product.product.name.length > 20
        ? `${product.product.name.substring(0, 20)}...`
        : product.product.name;
    return (
      <>
        {product.product.name.length > 20 ? (
          <Tooltip content={product.product.name} showArrow>
            <span>{name}</span>
          </Tooltip>
        ) : (
          <span>{name}</span>
        )}
      </>
    );
  };

  const handleSearch = () => {
    getPaginatedBranchProducts(
      Number(return_branch_id()),
      1,
      limit,
      name,
      code
    );
  };

  const { user } = useAuthStore();

  let barcode = "";
  let interval: NodeJS.Timeout | undefined;

  const handler = (evt: KeyboardEvent) => {
    if (interval) clearInterval(interval);
    if (evt.code === "Enter") {
      if (barcode)
        getProductByCode(user?.employee.branch.transmitterId ?? 0, barcode);
      barcode = "";
      return;
    }
    if (evt.key !== "Shift") barcode += evt.key;
    interval = setInterval(() => (barcode = ""), 200000);
  };

  useEventListener("keydown", handler as any);

  const total = useMemo(() => {
    const total = cart_products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
    return formatCurrency(total);
  }, [cart_products]);

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full h-full overflow-y-auto p-4 flex flex-col">
          <div className="w-full h-[75%] pb-5">
            <CartProducts />
          </div>
          <div className="w-full h-[25%]  pt-10">
            <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-5">
              <div className="grid grid-cols-2 w-full">
                <p className="text-lg font-semibold dark:text-white">
                  Total: <span className="font-normal">{total}</span>
                </p>
                <p className="text-lg font-semibold dark:text-white">
                  Descuento: <span className="font-normal">$0</span>
                </p>
              </div>
              <div className="flex items-end justify-end w-full mt-5">
                <Button
                  style={global_styles().thirdStyle}
                  className="ml-5"
                  isIconOnly
                  size="lg"
                  onClick={() => {
                    cart_products.length > 0
                      ? modalAdd.onOpen()
                      : toast.error("No tienes productos agregados");
                  }}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto p-4">
          <Input
            variant="bordered"
            placeholder="Escribe para buscar..."
            label="Buscar por nombre"
            labelPlacement="outside"
            className="dark:text-white"
            classNames={{
              label: "text-sm font-semibold",
              inputWrapper: "pr-0",
            }}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            startContent={<Search size={20} />}
            endContent={
              <Button
                onClick={handleSearch}
                size="lg"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
              >
                Buscar
              </Button>
            }
          />
          <Input
            variant="bordered"
            placeholder="Escribe para buscar..."
            label="Buscar por código"
            labelPlacement="outside"
            className="dark:text-white pt-4"
            classNames={{
              label: "text-sm font-semibold",
              inputWrapper: "pr-0",
            }}
            size="lg"
            startContent={<Barcode size={20} />}
            onChange={(e) => setCode(e.target.value)}
            endContent={
              <Button
                onClick={handleSearch}
                size="lg"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
              >
                Buscar
              </Button>
            }
          />
          <div className="w-full mt-5 flex justify-between">
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
              {limit_options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-full mt-5 p-5 bg-gray-100 dark:bg-gray-900 overflow-y-auto rounded">
            <h1 className="text-lg font-semibold dark:text-white">
              Lista de productos
            </h1>
            <DataTable
              className="w-full shadow mt-5"
              emptyMessage="No se encontraron resultados"
              value={branch_products}
              tableStyle={{ minWidth: "50rem" }}
              size="small"
              scrollable
              // scrollHeight="400px"
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style }}
                field="product.name"
                body={nameBodyTemplate}
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="price"
                body={priceBodyTemplate}
                header="Precio"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="product.categoryProduct.name"
                header="Categoría"
              />
              <Column
                headerStyle={{ ...style }}
                header="Acciones"
                frozen={true}
                alignFrozen="right"
                body={(item) => (
                  <div className="flex gap-6">
                    <Button
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                      size="lg"
                      isIconOnly
                      onClick={() => {
                        addProductCart(item);
                      }}
                    >
                      <Plus className="text-white" />
                    </Button>
                  </div>
                )}
              />
            </DataTable>
            {pagination_branch_products.totalPag > 1 && (
              <div className="w-full mt-5">
                <Pagination
                  totalPages={pagination_branch_products.totalPag}
                  currentPage={pagination_branch_products.currentPag}
                  previousPage={pagination_branch_products.prevPag}
                  nextPage={pagination_branch_products.nextPag}
                  onPageChange={(page) => {
                    getPaginatedBranchProducts(
                      Number(return_branch_id()),
                      page,
                      limit,
                      name,
                      code
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Nueva venta"
        size="w-full md:w-[500px] lg:w-[600px]"
      >
        <FormMakeSale />
      </ModalGlobal>
    </div>
  );
};

export default MainView;
