import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import {
  EditIcon,
  ShoppingBag,
  ClipboardList,
  Barcode,
  DollarSign,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { Product } from "../../types/products.types";
import { useProductsStore } from "../../store/products.store";

interface Props {
  layout: "grid" | "list";
  DeletePopover: ({ product }: { product: Product }) => JSX.Element;
  openEditModal: (product: Product) => void;
  actions: string[]
}

function MobileView({ layout, openEditModal, DeletePopover, actions }: Props) {
  const { paginated_products } = useProductsStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_products.products}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(customer) =>
          gridItem(customer, layout, openEditModal,actions, DeletePopover)
        }
        emptyMessage="No customers found"
      />
    </div>
  );
}

const gridItem = (
  product: Product,
  layout: "grid" | "list",
  openEditModal: (product: Product) => void,
  actions: string[],
  deletePopover: ({ product }: { product: Product }) => JSX.Element
) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl"
          )}
          key={product.id}
        >
          <div className="flex w-full gap-2">
            <ShoppingBag
              className="dark:text-gray-400 text-[#274c77]"
              size={33}
            />
            {product.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ClipboardList
              className="dark:text-gray-400 text-[#00bbf9]"
              size={33}
            />
            {product.categoryProduct.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className="dark:text-gray-400 text-[#006d77]" size={33} />
            {product.code}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <DollarSign
              className="dark:text-gray-400 text-[#006d77]"
              size={33}
            />
            {product.price}
          </div>
          <div className="flex justify-between mt-5 w-ful">
           {actions.includes("Editar") &&  <Button
              onClick={() => openEditModal(product)}
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              size="lg"
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>}
            {actions.includes("Eliminar") && deletePopover({ product: product })}
          </div>
        </div>
      ) : (
        <ListItem
          product={product}
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = ({
  product,
  openEditModal,
  deletePopover,
  actions
}: {
  product: Product;
  openEditModal: (product: Product) => void;
  actions: string[],
  deletePopover: ({ product }: { product: Product }) => JSX.Element;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ShoppingBag
              className="dark:text-gray-400 text-[#274c77]"
              size={33}
            />
            {product.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ClipboardList
              className="dark:text-gray-400 text-[#00bbf9]"
              size={33}
            />
            {product.categoryProduct.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Barcode className="dark:text-gray-400 text-[#006d77]" size={33} />
            {product.code}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <DollarSign
              className="dark:text-gray-400 text-[#006d77]"
              size={33}
            />
            {product.price}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
        {actions.includes("Editar") &&  <Button
              onClick={() => openEditModal(product)}
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              size="lg"
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>}
            {actions.includes("Eliminar") && deletePopover({ product: product })}
        </div>
      </div>
    </>
  );
};

export default MobileView;
