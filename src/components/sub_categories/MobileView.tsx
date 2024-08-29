import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { EditIcon, RefreshCcw, ScrollIcon, PackageSearch } from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import { GridProps, MobileViewProps } from './types/mobile_view.types';
import { useSubCategoryStore } from '../../store/sub-category';

function MobileView(props: MobileViewProps) {
  const { layout, deletePopover, handleEdit, actions, handleActive } = props;
  const { sub_categories_paginated } = useSubCategoryStore();
  return (
    <div className="w-full pb-10">
      <DataView
        value={sub_categories_paginated.SubCategories}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(cat) => (
          <GridItem
            subcategory={cat}
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
  const { subcategory, layout, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow border dark:border-white hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={subcategory.id}
        >
          <div className="flex w-full gap-2">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{subcategory.name}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <PackageSearch className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{subcategory.categoryProduct.name}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <Button
                onClick={() => handleEdit(subcategory)}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon size={20} />
              </Button>
            )}
            {actions.includes('Eliminar') && (
              <>
                {subcategory.isActive ? (
                  deletePopover({ subcategory })
                ) : (
                  <Button
                    onClick={() => handleActive(subcategory.id)}
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
          handleActive={handleActive}
          subcategory={subcategory}
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
  const { subcategory, deletePopover, handleEdit, actions, handleActive } = props;
  return (
    <>
      <div className="flex border dark:border-white w-full p-5 border shadow dark:border-gray-600 rounded-2xl">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <ScrollIcon className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{subcategory?.name}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-2">
            <PackageSearch className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {subcategory?.categoryProduct.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-5">
          {actions.includes('Editar') && (
            <Button
              onClick={() => handleEdit(subcategory)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
          )}
          {actions.includes('Eliminar') && (
            <>
              {subcategory.isActive ? (
                deletePopover({ subcategory })
              ) : (
                <Button
                  onClick={() => handleActive(subcategory.id)}
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
