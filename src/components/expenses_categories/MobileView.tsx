import { useContext } from 'react';
import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import classNames from 'classnames';
import { EditIcon, ClipboardCheck } from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import { useCategoriesExpenses } from '../../store/categories_expenses.store';
import { CategoryExpense } from '../../types/categories_expenses.types';

/* eslint-disable no-unused-vars */
interface Props {
  layout: 'grid' | 'list';
  deletePopover: ({ categoryExpenses }: { categoryExpenses: CategoryExpense }) => JSX.Element;
  handleEdit: (categoryExpenses: CategoryExpense) => void;
}
/* eslint-enable no-unused-vars */
const MobileView = ({ layout, deletePopover, handleEdit }: Props) => {
  const { paginated_categories_expenses } = useCategoriesExpenses();

  return (
    <div className="w-full pb-10">
      <DataView
        value={paginated_categories_expenses.categoryExpenses}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(cat, layout) =>
          gridItem(cat, layout as 'grid' | 'list', deletePopover, handleEdit)
        }
        emptyMessage="No se encontraron categorías de gastos"
      />
    </div>
  );
};
export default MobileView;
/* eslint-disable no-unused-vars */
const gridItem = (
  categoryExpenses: CategoryExpense,
  layout: 'grid' | 'list',
  deletePopover: ({ categoryExpenses }: { categoryExpenses: CategoryExpense }) => JSX.Element,
  handleEdit: (categoryExpenses: CategoryExpense) => void
) => {
  /* eslint-enable no-unused-vars */

  /* eslint-disable react-hooks/rules-of-hooks */
  const { theme } = useContext(ThemeContext);
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg dark:border dark:border-gray-600 p-8 rounded-2xl'
          )}
          key={categoryExpenses.id}
        >
          <div className="flex w-full gap-2">
            <ClipboardCheck color={'#274c77'} size={35} />
            {categoryExpenses.name}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => handleEdit(categoryExpenses)}
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>
            {deletePopover({ categoryExpenses: categoryExpenses })}
          </div>
        </div>
      ) : (
        <ListItem
          categoryExpenses={categoryExpenses}
          deletePopover={deletePopover}
          handleEdit={handleEdit}
        />
      )}
    </>
  );
};

/* eslint-disable no-unused-vars */
const ListItem = ({
  categoryExpenses,
  deletePopover,
  handleEdit,
}: {
  categoryExpenses: CategoryExpense;
  deletePopover: ({ categoryExpenses }: { categoryExpenses: CategoryExpense }) => JSX.Element;
  handleEdit: (categoryExpenses: CategoryExpense) => void;
}) => {
  /* eslint-enable no-unused-vars */
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ClipboardCheck color={'#274c77'} size={35} />
            {categoryExpenses.name}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          <Button
            onClick={() => handleEdit(categoryExpenses)}
            isIconOnly
            style={{
              backgroundColor: theme.colors.secondary,
            }}
          >
            <EditIcon style={{ color: theme.colors.primary }} size={20} />
          </Button>
          {deletePopover({ categoryExpenses: categoryExpenses })}
        </div>
      </div>
    </>
  );
};
