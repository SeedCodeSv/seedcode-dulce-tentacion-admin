import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { EditIcon, RefreshCcw, ScrollIcon } from "lucide-react";
import { useCategoriesStore } from "../../store/categories.store";
import { global_styles } from "../../styles/global.styles";
import { GridProps, MobileViewProps } from "./types/mobile_view.types";
import TooltipGlobal from "../global/TooltipGlobal";

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;
  const { paginated_categories, loading_categories } = useCategoriesStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_categories.categoryProducts}
        gutter
        loading={loading_categories}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-transparent  pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            category={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            actions={actions}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No category found"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const {
    category,
    layout,
    deletePopover,
    handleEdit,
    actions,
    handleActive,
  } = props;
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow hover:shadow-lg border dark:border-white p-8 dark:border dark:border-gray-600 rounded-2xl"
          )}
          key={category.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon
              className=" dark:text-blue-300"
              size={20}
            />
            <p className="w-full dark:text-white">{category.name}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes("Editar") && (
              <TooltipGlobal text="Editar">
                <Button
                  onClick={() => handleEdit(category)}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon size={20} />
                </Button>
              </TooltipGlobal>
            )}
            {actions.includes("Eliminar") && (
              <>
                {category.isActive ? (
                  deletePopover({ category })
                ) : (
                  <TooltipGlobal text="Activar">
                    <Button
                      onClick={() => handleActive(category.id)}
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
        </div>
      ) : (
        <ListItem
          handleActive={handleActive}
          category={category}
          layout="list"
          deletePopover={deletePopover}
          handleEdit={handleEdit}
          actions={actions}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { category, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      <div className="flex w-full border dark:border-white p-5 border shadow dark:border-gray-600 rounded-2xl">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon
              className=" dark:text-blue-300"
              size={20}
            />
            <p className="w-full dark:text-white">{category.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes("Editar") && (
            <TooltipGlobal text="Editar">
              <Button
                onClick={() => handleEdit(category)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            </TooltipGlobal>
          )}
          {actions.includes("Eliminar") && (
            <>
              {category.isActive ? (
                deletePopover({ category })
              ) : (
                <TooltipGlobal text="Activar">
                  <Button
                    onClick={() => handleActive(category.id)}
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
      </div>
    </>
  );
};
