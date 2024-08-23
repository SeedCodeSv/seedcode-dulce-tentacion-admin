import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { useCustomerStore } from '../../store/customers.store';
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
import { global_styles } from '../../styles/global.styles';
import { GridProps, MobileViewProps } from './types/mobile-view.types';
import TooltipGlobal from '../global/TooltipGlobal';
import { DeletePopover } from './ListClients';

function MobileView({ actions, layout, handleChangeCustomer, handleActive }: MobileViewProps) {
  const { customer_pagination } = useCustomerStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={customer_pagination.customers}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5',
          }),
        }}
        color="surface"
        className="dark:text-white"
        itemTemplate={(customer) => (
          <GridItem
            actions={actions}
            layout={layout}
            customers={customer}
            handleChangeCustomer={handleChangeCustomer}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No customers found"
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
          className={classNames(
            'w-full shadow dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl'
          )}
          key={customers.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{customers.nombre}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white"> {customers.telefono}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div>
              <MapPin className="text-[#274c77] dark:text-gray-400" size={20} />
            </div>
            <div className="w-full dark:text-white">
              {customers.direccion.nombreDepartamento} ,{customers.direccion.municipio} ,
              {customers.direccion.complemento}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Users2Icon className="text-[#274c77] dark:text-gray-400" size={20} />
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
                      onClick={() => handleChangeCustomer(customers, 'edit')}
                      isIconOnly
                      style={global_styles().secondaryStyle}
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
                            onClick={() => handleChangeCustomer(customers, 'change')}
                            isIconOnly
                            style={global_styles().thirdStyle}
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
                {/* {actions.includes('Cambiar Tipo de Cliente') && (
                  <TooltipGlobal text="Activar">
                    <Button
                      onClick={() => {
                        handleActive(customers.id);
                      }}
                      isIconOnly
                      style={global_styles().secondaryStyle}
                    >
                      <BadgeCheck size={20} />
                    </Button>
                  </TooltipGlobal>
                )} */}

                {actions.includes('Eliminar') && (
                  <TooltipGlobal text="Activar">
                    <Button
                      onClick={() => {
                        handleActive(customers.id);
                      }}
                      isIconOnly
                      style={global_styles().secondaryStyle}
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
          handleActive={handleActive}
          customers={customers}
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
      <div className="flex w-full col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{customers.nombre}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{customers.telefono}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Mail className="text-[#274c77] dark:text-gray-400" size={20} />
            <p className="w-full dark:text-white">{customers.correo}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Users2Icon className="text-[#274c77] dark:text-gray-400" size={20} />
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
                    onClick={() => handleChangeCustomer(customers, 'edit')}
                    isIconOnly
                    style={global_styles().secondaryStyle}
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
                          onClick={() => handleChangeCustomer(customers, 'change')}
                          isIconOnly
                          style={global_styles().thirdStyle}
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
                    onClick={() => {
                      handleActive(customers.id);
                    }}
                    isIconOnly
                    style={global_styles().secondaryStyle}
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
