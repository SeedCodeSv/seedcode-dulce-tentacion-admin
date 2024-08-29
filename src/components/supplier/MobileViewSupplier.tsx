import { Button } from '@nextui-org/react';
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
  Check,
  Lock,
} from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import { GridProps, MobileViewProps } from './types/movile-view.types';
import { useSupplierStore } from '../../store/supplier.store';
import TooltipGlobal from '../global/TooltipGlobal';
import { DeletePopover } from './ListSuppliers';
import { useNavigate } from 'react-router';
import { Supplier } from '@/types/supplier.types';

function MobileViewSupplier({
  layout,
  handleChangeSupplier,
  handleActive,
  actions,
}: MobileViewProps) {
  const { supplier_pagination } = useSupplierStore();
  const { OnGetBySupplier } = useSupplierStore();
  const navigate = useNavigate();

  const handleNavigate = (supplier: Supplier) => {
    const path = supplier.esContribuyente
      ? `/update-supplier-tribute/${supplier.id}`
      : `/update-supplier-normal/${supplier.id}`;
    navigate(path);
    OnGetBySupplier(supplier.id ?? 0);
  };

  return (
    <div className="w-full pb-10">
      <DataView
        value={supplier_pagination.suppliers}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5',
          }),
        }}
        color="surface"
        itemTemplate={(suppliers) => (
          <GridItem
            actions={actions}
            onNavigate={handleNavigate}
            reloadData={OnGetBySupplier}
            layout={layout}
            supplier={suppliers}
            handleChangeSupplier={handleChangeSupplier}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron proveedores"
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const { layout, supplier, handleChangeSupplier, handleActive, reloadData, onNavigate, actions } =
    props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow flex border dark:border-white flex-col justify-between hover:shadow-lg p-5 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={supplier.id}
        >
          <div>
            <div className="flex w-full gap-2">
              <IUser className="dark:text-blue-300 text-blue-500" size={20} />
              <p className="w-full dark:text-white"> {supplier.nombre}</p>
            </div>
            <div className="flex w-full gap-2 mt-3">
              <Phone className="dark:text-blue-300 text-blue-500" size={20} />
              <p className="w-full dark:text-white">{supplier.telefono}</p>
            </div>
            <div className="flex w-full gap-2 mt-3">
              <MapPin className="dark:text-blue-300 text-blue-500" size={20} />
              <p className="w-full dark:text-white">
                {' '}
                {supplier.direccion?.nombreDepartamento} ,{supplier.direccion?.municipio} ,
                {supplier.direccion?.complemento}
              </p>
            </div>
            <div className="flex w-full gap-2 mt-3">
              <Users2Icon className="dark:text-blue-300 text-[#274c77]" size={20} />
              <p className="w-full dark:text-white">
                {supplier.esContribuyente ? 'Contribuyente' : 'No Contribuyente'}
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <>
              {actions.includes('Editar') ? (
                <TooltipGlobal text="Editar">
                  <Button
                    className="border border-white"
                    onClick={() => onNavigate(supplier)}
                    isIconOnly
                    style={global_styles().secondaryStyle}
                  >
                    <EditIcon size={20} />
                  </Button>
                </TooltipGlobal>
              ) : (
                <Button
                  type="button"
                  disabled
                  className="flex font-semibold cursor-not-allowed border border-white"
                  isIconOnly
                >
                  <Lock className="text-white" />
                </Button>
              )}

              {supplier.esContribuyente === false ? (
                <TooltipGlobal text="Cambiar tipo de proveedor">
                  <Button
                    className="border border-white"
                    onClick={() => {
                      supplier.esContribuyente = true;
                      onNavigate(supplier);
                    }}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <Repeat size={20} />
                  </Button>
                </TooltipGlobal>
              ) : (
                <Button
                  type="button"
                  disabled
                  style={global_styles().thirdStyle}
                  className="flex border border-white font-semibold cursor-not-allowed"
                  isIconOnly
                >
                  <Check />
                </Button>
              )}
              {DeletePopover({ supplier: supplier })}
            </>

            {/* <Button
              onClick={() => {
                handleActive(supplier.id ?? 0);
              }}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <BadgeCheck size={20} />
            </Button> */}
          </div>
        </div>
      ) : (
        <ListItem
          actions={actions}
          onNavigate={onNavigate}
          reloadData={reloadData}
          handleActive={handleActive}
          supplier={supplier}
          handleChangeSupplier={handleChangeSupplier}
          layout="list"
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { supplier, handleActive, onNavigate } = props;
  return (
    <>
      <div className="flex w-full border border-white col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser className="dark:text-blue-300 text-blue-500" size={20} />
            <p className="w-full dark:text-white"> {supplier.nombre}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="dark:text-blue-300 text-blue-500" size={20} />
            <p className="w-full dark:text-white">{supplier.telefono}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Mail className="dark:text-blue-300 text-blue-500" size={20} />
            <p className="w-full dark:text-white">{supplier.correo}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Users2Icon className="dark:text-blue-300 text-blue-500" size={20} />
            <p className="w-full dark:text-white">
              {supplier.esContribuyente ? 'Contribuyente' : 'No Contribuyente'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          {supplier.isActive ? (
            <>
              <TooltipGlobal text="Editar">
                <Button
                  onClick={() => onNavigate(supplier)}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon size={20} />
                </Button>
              </TooltipGlobal>
              {supplier.esContribuyente === false ? (
                <TooltipGlobal text="Cambiar tipo de proveedor">
                  <Button
                    onClick={() => {
                      supplier.esContribuyente = true;
                      onNavigate(supplier);
                    }}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <Repeat size={20} />
                  </Button>
                </TooltipGlobal>
              ) : (
                <Button
                  type="button"
                  disabled
                  style={global_styles().thirdStyle}
                  className="flex font-semibold cursor-not-allowed"
                  isIconOnly
                >
                  <Check />
                </Button>
              )}
              {DeletePopover({ supplier: supplier })}
            </>
          ) : (
            <Button
              onClick={() => {
                handleActive(supplier.id ?? 0);
              }}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <BadgeCheck size={20} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileViewSupplier;
