import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import {
  EditIcon,
  ShoppingBag,
  ClipboardList,
  Barcode,
  RefreshCcw,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { useProductsStore } from "../../store/products.store";
import { global_styles } from "../../styles/global.styles";
import { GridProps, IMobileView } from "./types/mobile-view.types";

function MobileView(props: IMobileView) {
  const { paginated_products } = useProductsStore();
  const {
    layout,
    openEditModal,
    DeletePopover,
    actions,
    handleActivate,
  } = props;
  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_products.products}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(customer) => (
          <GridItem
            product={customer}
            layout={layout}
            openEditModal={openEditModal}
            actions={actions}
            DeletePopover={DeletePopover}
            handleActivate={handleActivate}
          />
        )}
        emptyMessage="No se encontraron productos"
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const {
    product,
    layout,
    openEditModal,
    actions,
    DeletePopover,
    handleActivate,
  } = props;

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
              size={20}
            />
            {product.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <ClipboardList
              className="dark:text-gray-400 text-[#00bbf9]"
              size={20}
            />
            {product.subCategory.categoryProduct.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Barcode className="dark:text-gray-400 text-[#006d77]" size={20} />
            {product.code}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes("Editar") && (
              <Button
                onClick={() => openEditModal(product)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            )}
            {actions.includes("Eliminar") && (
              <>
                {product.isActive ? (
                  DeletePopover({ product: product })
                ) : (
                  <Button
                    onClick={() => handleActivate(product.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          layout="list"
          product={product}
          openEditModal={openEditModal}
          DeletePopover={DeletePopover}
          actions={actions}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const {
    product,
    openEditModal,
    DeletePopover,
    actions,
    handleActivate,
  } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ShoppingBag
              className="dark:text-gray-400 text-[#274c77]"
              size={20}
            />
            {product.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <ClipboardList
              className="dark:text-gray-400 text-[#00bbf9]"
              size={20}
            />
            {product.subCategory.categoryProduct.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Barcode className="dark:text-gray-400 text-[#006d77]" size={20} />
            {product.code}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          {actions.includes("Editar") && (
            <Button
              onClick={() => openEditModal(product)}
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>
          )}
          {actions.includes("Eliminar") && (
            <>
              {product.isActive ? (
                DeletePopover({ product: product })
              ) : (
                <Button
                  onClick={() => handleActivate(product.id)}
                  isIconOnly
                  style={global_styles().thirdStyle}
                >
                  <RefreshCcw />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
