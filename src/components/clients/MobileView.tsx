import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import {
  User as IUser,
  Phone,
  Mail,
  Users2Icon,
  EditIcon,
  Repeat,
  MapPin,
  BadgeCheck,
} from 'lucide-react';

import { useCustomerStore } from '../../store/customers.store';
import { global_styles } from '../../styles/global.styles';
import TooltipGlobal from '../global/TooltipGlobal';

import { GridProps, MobileViewProps } from './types/mobile-view.types';
import { DeletePopover } from './view-modes/DeleteClients';

function MobileView({ actions, layout, handleChangeCustomer, handleActive }: MobileViewProps) {
  const { customer_pagination } = useCustomerStore();

  return (
    <div className="w-full pb-10">
      <DataView
        gutter
        className="dark:text-white"
        color="surface"
        emptyMessage="No customers found"
        itemTemplate={(customer) => (
          <GridItem
            actions={actions}
            customers={customer}
            handleActive={handleActive}
            handleChangeCustomer={handleChangeCustomer}
            layout={layout}
          />
        )}
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5',
          }),
        }}
        value={customer_pagination.customers}
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const { layout, customers, handleChangeCustomer, handleActive, actions } = props;

  return (
    <>
      {layout === 'grid' ? (
        <div
          key={customers.id}
          className={classNames(
            'w-full shadow border dark:border-white dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl'
          )}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{customers.nombre}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white"> {customers.telefono}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div>
              <MapPin className="text-blue-300 dark:text-blue-300" size={20} />
            </div>
            <div className="w-full dark:text-white">
              {customers.direccion.nombreDepartamento} ,{customers.direccion.municipio} ,
              {customers.direccion.complemento}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Users2Icon className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              {' '}
              {customers.esContribuyente ? 'Contribuyente' : 'No Contribuyente'}
            </p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {customers.isActive ? (
              <>
                {actions.includes('Editar') && (
                  <TooltipGlobal text="Editar">
                    <Button
                      isIconOnly
                      style={global_styles().secondaryStyle}
                      onClick={() => handleChangeCustomer(customers, 'edit')}
                    >
                      <EditIcon size={20} />
                    </Button>
                  </TooltipGlobal>
                )}
                <>
                  {actions.includes('Cambiar Tipo de Cliente') && (
                    <>
                      {customers.esContribuyente === false && (
                        <TooltipGlobal text="Cambiar tipo de cliente">
                          <Button
                            isIconOnly
                            style={global_styles().thirdStyle}
                            onClick={() => handleChangeCustomer(customers, 'change')}
                          >
                            <Repeat size={20} />
                          </Button>
                        </TooltipGlobal>
                      )}
                    </>
                  )}
                </>
                <>
                  {actions.includes('Eliminar') && <> {DeletePopover({ customers: customers })}</>}
                </>
              </>
            ) : (
              <>
                {actions.includes('Eliminar') && (
                  <TooltipGlobal text="Activar">
                    <Button
                      isIconOnly
                      style={global_styles().secondaryStyle}
                      onClick={() => {
                        handleActive(customers.id);
                      }}
                    >
                      <BadgeCheck size={20} />
                    </Button>
                  </TooltipGlobal>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          customers={customers}
          handleActive={handleActive}
          handleChangeCustomer={handleChangeCustomer}
          layout="list"
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { customers, handleChangeCustomer, handleActive, actions } = props;

  return (
    <>
      <div className="flex w-full dark:border-white col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{customers.nombre}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{customers.telefono}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Mail className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{customers.correo}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Users2Icon className="text-blue-300 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">
              {customers.esContribuyente ? 'Contribuyente' : 'No Contribuyente'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          {customers.isActive ? (
            <>
              {actions.includes('Editar') && (
                <TooltipGlobal text="Editar">
                  <Button
                    isIconOnly
                    style={global_styles().secondaryStyle}
                    onClick={() => handleChangeCustomer(customers, 'edit')}
                  >
                    <EditIcon size={20} />
                  </Button>
                </TooltipGlobal>
              )}

              <>
                {actions.includes('Cambiar Tipo de Cliente') && (
                  <>
                    {customers.esContribuyente === false && (
                      <TooltipGlobal text="Cambiar tipo de cliente">
                        <Button
                          isIconOnly
                          style={global_styles().thirdStyle}
                          onClick={() => handleChangeCustomer(customers, 'change')}
                        >
                          <Repeat size={20} />
                        </Button>
                      </TooltipGlobal>
                    )}
                  </>
                )}
              </>
              {actions.includes('Eliminar') && <>{DeletePopover({ customers: customers })}</>}
            </>
          ) : (
            <>
              {actions.includes('Eliminar') && (
                <TooltipGlobal text="Activar">
                  <Button
                    isIconOnly
                    style={global_styles().secondaryStyle}
                    onClick={() => {
                      handleActive(customers.id);
                    }}
                  >
                    <BadgeCheck size={20} />
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

export default MobileView;
