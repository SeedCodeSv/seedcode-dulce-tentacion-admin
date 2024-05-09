import { useContext } from "react";
import { Button } from "@nextui-org/react";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { EditIcon, ScrollIcon, DollarSign, ClipboardPenLine } from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { useExpenseStore } from "../../store/expenses.store";
import { IExpense } from "../../types/expenses.types";

interface Props {
  layout: "grid" | "list";
  deletePopover: ({ expenses }: { expenses: IExpense }) => JSX.Element;
  handleEdit: (expenses: IExpense) => void;
}

function MobileView({ layout, deletePopover, handleEdit }: Props) {
  const { expenses_paginated } = useExpenseStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={expenses_paginated.expenses}
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
          gridItem(cat, layout as "grid" | "list", deletePopover, handleEdit)
        }
        emptyMessage="No se encontraron gastos"
      />
    </div>
  );
}

export default MobileView;

const gridItem = (
  expenses: IExpense,
  layout: "grid" | "list",
  deletePopover: ({ expenses }: { expenses: IExpense }) => JSX.Element,
  handleEdit: (expenses: IExpense) => void
) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg p-8 rounded-2xl"
          )}
          key={expenses.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon color={"#274c77"} size={35} />
            {expenses.categoryExpense.name}
          </div>
          <div className="flex w-full gap-2">
            <DollarSign color={"#274c77"} size={32} />
            {expenses.total}
          </div>
          <div className="flex w-full gap-2">
            <ClipboardPenLine color={"#274c77"} size={32} />
            {expenses.description}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => handleEdit(expenses)}
              isIconOnly
              size="lg"
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>
            {deletePopover({ expenses: expenses })}
          </div>
        </div>
      ) : (
        <ListItem
          expenses={expenses}
          deletePopover={deletePopover}
          handleEdit={handleEdit}
        />
      )}
    </>
  );
};

const ListItem = ({
  expenses,
  deletePopover,
  handleEdit,
}: {
  expenses: IExpense;
  deletePopover: ({ expenses }: { expenses: IExpense }) => JSX.Element;
  handleEdit: (expenses: IExpense) => void;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon color={"#274c77"} size={35} />
            {expenses.categoryExpense.name}
          </div>
          <div className="flex items-center w-full gap-2">
            <DollarSign color={"#274c77"} size={32} />
            {expenses.total}
          </div>
          <div className="flex items-center w-full gap-2">
            <ClipboardPenLine color={"#274c77"} size={32} />
            {expenses.description}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          <Button
            onClick={() => handleEdit(expenses)}
            isIconOnly
            size="lg"
            style={{
              backgroundColor: theme.colors.secondary,
            }}
          >
            <EditIcon style={{ color: theme.colors.primary }} size={20} />
          </Button>
          {deletePopover({ expenses: expenses })}
        </div>
      </div>
    </>
  );
};
