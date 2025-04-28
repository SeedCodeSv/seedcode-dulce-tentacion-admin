import { DataView } from 'primereact/dataview';
import { BadgeCheck, Edit, MapPin, Phone, Scroll, ShoppingBag } from 'lucide-react';
import { classNames } from 'primereact/utils';

import { useBranchesStore } from '../../store/branches.store';

import { GridProps, MobileViewProps } from './types/mobile_view.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function MobileView(props: MobileViewProps) {
  const {
    layout,
    deletePopover,
    handleEdit,
    handleBranchProduct,
    handleBox,
    handleActive,
    actions,
  } = props;
  const { branches_paginated } = useBranchesStore();

  return (
    <div className="w-full pb-10">
      <DataView
        gutter
        color="surface"
        emptyMessage="No users found"
        itemTemplate={(item) => (
          <GridItem
            actions={actions}
            branch={item}
            deletePopover={deletePopover}
            handleActive={handleActive}
            handleBox={handleBox}
            handleBranchProduct={handleBranchProduct}
            handleEdit={handleEdit}
            layout={layout}
          />
        )}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid  pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        value={branches_paginated.branches}
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const {
    layout,
    deletePopover,
    handleEdit,
    handleBranchProduct,
    handleBox,
    handleActive,
    branch,
    actions,
  } = props;

  return (
    <>
      {layout === 'grid' ? (
        <div
          key={branch.id}
          className={classNames(
            'w-full shadow flex border dark:border-white flex-col justify-between hover:shadow-lg p-5 dark:border dark:border-gray-600 rounded-2xl'
          )}
        >
          <div>
            <div className="flex items-center w-full gap-2">
              <Scroll className="text-blue-500 dark:text-blue-300" size={20} />
              <p className="dark:text-white">{branch.name}</p>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <MapPin className="text-blue-500 dark:text-blue-300" size={20} />
              <div className="w-full">
                <p className="dark:text-white">{branch.address}</p>
              </div>
            </div>
            <div className="flex items-center w-full gap-2 mt-3">
              <Phone className="text-blue-500 dark:text-blue-300" size={20} />
              <p className="dark:text-white"> {branch.phone}</p>
            </div>
          </div>
          <div className="flex justify-between mt-5 w-full">
            {actions.includes('Editar') && branch.isActive && (
              <>
                <ButtonUi isIconOnly theme={Colors.Success} onPress={() => handleEdit(branch)}>
                  <Edit />
                </ButtonUi>
              </>
            )}
            <ButtonUi
              isIconOnly
              theme={Colors.Info}
              onPress={() => {
                handleBranchProduct(branch.id);
              }}
            >
              <ShoppingBag />
            </ButtonUi>
            {branch.isActive === false && (
              <ButtonUi
                isIconOnly
                theme={Colors.Info}
                onPress={() => {
                  handleActive(branch.id);
                }}
              >
                <BadgeCheck
                  size={20}
                  onClick={() => {
                    handleActive(branch.id);
                  }}
                />
              </ButtonUi>
            )}
            {deletePopover({ branch })}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          branch={branch}
          deletePopover={deletePopover}
          handleActive={handleActive}
          handleBox={handleBox}
          handleBranchProduct={handleBranchProduct}
          handleEdit={handleEdit}
          layout="list"
        />
      )}
    </>
  );
};
const ListItem = (props: GridProps) => {
  const { branch, deletePopover, handleEdit, handleActive, handleBranchProduct } = props;

  return (
    <>
      <div className="flex gap-5 border dark:border-white w-full p-5 border-b dark:border dark:border-gray-600 rounded-2xl shadow">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <Scroll className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white"> {branch.name}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <MapPin className="text-blue-500 dark:text-blue-300" size={20} />
            <div className="w-full">
              <p className="dark:text-white">{branch.address}</p>
            </div>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="dark:text-white">{branch.phone}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
          <ButtonUi isIconOnly theme={Colors.Info} onPress={() => handleEdit(branch)}>
            <Edit />
          </ButtonUi>
          <ButtonUi
            isIconOnly
            theme={Colors.Info}
            onPress={() => {
              handleBranchProduct(branch.id);
            }}
          >
            <ShoppingBag />
          </ButtonUi>
          {branch.isActive === false && (
            <ButtonUi
              isIconOnly
              theme={Colors.Info}
              onPress={() => {
                handleActive(branch.id);
              }}
            >
              <BadgeCheck
                size={20}
                onClick={() => {
                  handleActive(branch.id);
                }}
              />
            </ButtonUi>
          )}
          {deletePopover({ branch })}
        </div>
      </div>
    </>
  );
};
