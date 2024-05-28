import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import {
  ScrollIcon,
  DollarSign,
  NotepadText,
} from "lucide-react";
import { useExpenseStore } from "../../store/expenses.store";
import { GridProps, IMobileView } from "./types/mobile-view.types";
import { global_styles } from "../../styles/global.styles";

function MobileView(props: IMobileView) {
  const { layout, deletePopover, handleDescription } = props;
  const { expenses } = useExpenseStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={expenses}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            expenses={cat}
            layout={layout}
            deletePopover={deletePopover}
            handleDescription={handleDescription}
          />
        )}
        emptyMessage="No se encontraron gastos"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const { layout, expenses, deletePopover, handleDescription } = props;
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg dark:border dark:border-gray-600 p-8 rounded-2xl"
          )}
          key={expenses.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon
              className="text-[#274c77] dark:text-gray-400"
              size={35}
            />
            {expenses.categoryExpense.name}
          </div>
          <div className="flex w-full gap-2">
            <DollarSign
              className="text-[#274c77] dark:text-gray-400"
              size={35}
            />
            {expenses.total}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => handleDescription(expenses)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <NotepadText size={20} />
            </Button>
            {deletePopover({ expenses: expenses })}
          </div>
        </div>
      ) : (
        <ListItem
          layout="list"
          expenses={expenses}
          deletePopover={deletePopover}
          handleDescription={handleDescription}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { expenses, deletePopover, handleDescription } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon
              className="text-[#274c77] dark:text-gray-400"
              size={35}
            />
            {expenses.categoryExpense.name}
          </div>
          <div className="flex items-center w-full gap-2">
            <DollarSign
              className="text-[#274c77] dark:text-gray-400"
              size={35}
            />
            {expenses.total}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          <Button
            onClick={() => handleDescription(expenses)}
            isIconOnly
            style={global_styles().secondaryStyle}
          >
            <NotepadText size={20} />
          </Button>
          {deletePopover({ expenses: expenses })}
        </div>
      </div>
    </>
  );
};
