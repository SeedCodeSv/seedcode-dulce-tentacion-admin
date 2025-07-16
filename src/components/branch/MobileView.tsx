import { BadgeCheck, Edit, MapPin, Phone, RefreshCcw, Scroll, ShoppingBag, Store } from 'lucide-react';
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
    handlePointOfSales,
    handleInactive
  } = props;
  const { branches_paginated } = useBranchesStore();

  return (
    <div className="grid pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5">
      {branches_paginated.branches.map((item) => (
        <GridItem
          key={item.id}
          actions={actions}
          branch={item}
          deletePopover={deletePopover}
          handleActive={handleActive}
          handleBox={handleBox}
          handleBranchProduct={handleBranchProduct}
          handleEdit={handleEdit}
          handleInactive={handleInactive}
          handlePointOfSales={handlePointOfSales}
          layout={layout}
        />
      ))}
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
    handlePointOfSales
  } = props;

  return (
    <>
      {layout === 'grid' ? (
        <div
          key={branch.id}
          className={classNames(
            'w-full shadow flex border dark:border-white flex-col justify-between hover:shadow-lg p-5 rounded-2xl'
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
                <BadgeCheck size={20} />
              </ButtonUi>
            )}
            {deletePopover({ branch })}
            <ButtonUi
              isIconOnly
              showTooltip
              theme={Colors.Primary}
              tooltipText='Agregar punto de venta'
              onPress={() => {
              handlePointOfSales!(branch.id);
              }}
            >
              <Store />
            </ButtonUi>
            {actions.includes('Activar Sucursal') && !branch.isActive && (
              <ButtonUi
                isIconOnly
                theme={Colors.Info}
                onPress={() => {
                  props.handleInactive!(branch);
                }}
              >
                <RefreshCcw />
              </ButtonUi>
            )}
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
              <BadgeCheck size={20} />
            </ButtonUi>
          )}
          {deletePopover({ branch })}
        </div>
      </div>
    </>
  );
};
