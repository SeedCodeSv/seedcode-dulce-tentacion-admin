import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { EditIcon, ScrollIcon } from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { useCategoriesStore } from "../../store/categories.store";
import { CategoryProduct } from "../../types/categories.types";

interface Props {
  layout: "grid" | "list";
  deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element;
  handleEdit: (category: CategoryProduct) => void;
  actions: string[];
}

function MobileView({ layout, deletePopover, handleEdit, actions }: Props) {
  const { paginated_categories } = useCategoriesStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_categories.categoryProducts}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(cat, layout) =>
          gridItem(
            cat,
            layout as "grid" | "list",
            deletePopover,
            handleEdit,
            actions
          )
        }
        emptyMessage="No category found"
      />
    </div>
  );
}

export default MobileView;

const gridItem = (
  category: CategoryProduct,
  layout: "grid" | "list",
  deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element,
  handleEdit: (category: CategoryProduct) => void,
  actions: string[]
) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl"
          )}
          key={category.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon color={"#274c77"} size={35} />
            {category.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes("Editar") && (
              <Button
                onClick={() => handleEdit(category)}
                isIconOnly
                size="lg"
                style={{
                  backgroundColor: theme.colors.secondary,
                }}
              >
                <EditIcon style={{ color: theme.colors.primary }} size={20} />
              </Button>
            )}
            {actions.includes("Eliminar") &&
              deletePopover({ category: category })}
          </div>
        </div>
      ) : (
        <ListItem
          category={category}
          deletePopover={deletePopover}
          handleEdit={handleEdit}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = ({
  category,
  deletePopover,
  handleEdit,
  actions,
}: {
  category: CategoryProduct;
  deletePopover: ({ category }: { category: CategoryProduct }) => JSX.Element;
  handleEdit: (category: CategoryProduct) => void;
  actions: string[];
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon color={"#274c77"} size={35} />
            {category.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes("Editar") && (
            <Button
              onClick={() => handleEdit(category)}
              isIconOnly
              size="lg"
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>
          )}
          {actions.includes("Eliminar") &&
            deletePopover({ category: category })}
        </div>
      </div>
    </>
  );
};
