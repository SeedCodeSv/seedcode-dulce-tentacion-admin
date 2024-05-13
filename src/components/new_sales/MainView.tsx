import { Button, ButtonGroup, Input, Tooltip } from "@nextui-org/react";
import {
  Barcode,
  CreditCard,
  List,
  Search,
  Table as ITable,
  Plus,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useBranchProductStore } from "../../store/branch_product.store";
import { return_branch_id } from "../../storage/localStorage";
import { BranchProduct } from "../../types/branch_products.types";

const MainView = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<"table" | "grid" | "list">("table");

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const {
    branch_products,
    pagination_branch_products,
    getPaginatedBranchProducts,
  } = useBranchProductStore();

  useEffect(() => {
    getPaginatedBranchProducts(Number(return_branch_id()), 1, 5, name, code);
  }, [name, code]);

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

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>1</div>
        <div>
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
            size="lg"
            startContent={<Search size={20} />}
            endContent={
              <Button
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
            endContent={
              <Button
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
          <div className="w-full mt-5 flex justify-end">
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
          </div>
          <div className="w-full mt-5 p-5 bg-gray-100 dark:bg-gray-900 h-full overflow-y-auto rounded">
            <h1 className="text-lg font-semibold dark:text-white">
              Lista de productos
            </h1>
            <DataTable
              className="w-full shadow"
              emptyMessage="No se encontraron resultados"
              value={branch_products}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
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
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex gap-6">
                    <Button
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                      size="lg"
                      isIconOnly
                    >
                      <Plus className="text-white" />
                    </Button>
                  </div>
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainView;
