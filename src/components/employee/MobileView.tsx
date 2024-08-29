import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { User as IUser, Truck, Phone, Edit, RefreshCcw } from 'lucide-react';
import { useEmployeeStore } from '../../store/employee.store';
import { global_styles } from '../../styles/global.styles';
import { GridProps, IMobileView } from './types/mobile-view.types';
import TooltipGlobal from '../global/TooltipGlobal';

function MobileView(props: IMobileView) {
  const { layout, openEditModal, deletePopover, actions, handleActivate } = props;
  const { employee_paginated, loading_employees } = useEmployeeStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={employee_paginated.employees}
        gutter
        loading={loading_employees}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(employee) => (
          <GridItem
            employee={employee}
            layout={layout}
            openEditModal={openEditModal}
            deletePopover={deletePopover}
            actions={actions}
            handleActivate={handleActivate}
          />
        )}
        emptyMessage="No se encontraron empleados"
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const { employee, layout, openEditModal, deletePopover, actions, handleActivate } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm border dark:border-white hover:shadow-lg border dark:border-gray-600 p-8 rounded-2xl flex flex-col justify-between'
          )}
          key={employee.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{`${employee.firstName} ${employee.firstLastName}`}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone size={20} className="text-blue-500 dark:text-blue-300" />
            <p className="w-full dark:text-white">{employee.phone}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.branch.name}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {actions.includes('Editar') && (
              <>
                {employee.isActive && (
                  <TooltipGlobal text="Editar">
                    <Button
                      onClick={() => openEditModal(employee)}
                      isIconOnly
                      style={global_styles().secondaryStyle}
                    >
                      <Edit size={15} />
                    </Button>
                  </TooltipGlobal>
                )}
              </>
            )}
            {actions.includes('Eliminar') && (
              <>
                {employee.isActive ? (
                  deletePopover({ employee })
                ) : (
                  <Button
                    onClick={() => handleActivate(employee.id)}
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
          actions={actions}
          layout="list"
          employee={employee}
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { employee, actions, openEditModal, deletePopover, handleActivate } = props;
  return (
    <>
      <div className="flex w-full p-5 border shadow dark:border-gray-600 rounded-2xl">
        <div className="w-full">
          <div className="flex w-full gap-2">
            <IUser className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{`${employee.firstName} ${employee.firstLastName}`}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone size={20} className="text-blue-500 dark:text-blue-300" />
            <p className="w-full dark:text-white">{employee.phone}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Truck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{employee.branch.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          {actions.includes('Editar') && (
            <>
              {employee.isActive && (
                <TooltipGlobal text="Editar">
                  <Button
                    onClick={() => openEditModal(employee)}
                    isIconOnly
                    style={global_styles().secondaryStyle}
                  >
                    <Edit size={15} />
                  </Button>
                </TooltipGlobal>
              )}
            </>
          )}
          {actions.includes('Eliminar') && (
            <>
              {employee.isActive ? (
                deletePopover({ employee })
              ) : (
                <Button
                  onClick={() => handleActivate(employee.id)}
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
