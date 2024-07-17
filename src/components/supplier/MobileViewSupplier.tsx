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
} from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import { GridProps, MobileViewProps } from './types/movile-view.types';
import { useSupplierStore } from '../../store/supplier.store';
import TooltipGlobal from '../global/TooltipGlobal';
import { DeletePopover } from './ListSuppliers';

function MobileViewSupplier({
  layout,
  handleChangeSupplier,
  // handleActive,
}: MobileViewProps) {
  const { supplier_pagination } = useSupplierStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={supplier_pagination.suppliers}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(suppliers) => (
          <GridItem
            layout={layout}
            supplier={suppliers}
            handleChangeSupplier={handleChangeSupplier}
            // handleActive={handleActive}
          />
        )}
        emptyMessage="No se encontraron proveedores"
      />
    </div>
  );
}

const GridItem = (props: GridProps) => {
  const { layout, supplier, handleChangeSupplier } = props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            "w-full shadow dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl"
          )}
          key={supplier.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white"> {supplier.nombre}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone className="dark:text-gray-400 text-[#274c77]" size={33} />
            <p className="w-full dark:text-white">{supplier.telefono}</p> 
          </div>
          <div className="flex w-full gap-2 mt-3">
            <MapPin className="dark:text-gray-400 text-[#274c77]" size={33} />
            <p className="w-full dark:text-white"> {supplier.direccion.nombreDepartamento} ,{supplier.direccion.municipio} ,{supplier.direccion.complemento}</p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Users2Icon className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white">{supplier.esContribuyente ? "Contribuyente" : "No Contribuyente"}</p>
          </div>
          <div className="flex justify-between mt-5 w-ful">
          <TooltipGlobal text="Editar">
            <Button
              onClick={() => handleChangeSupplier(supplier, 'edit')}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <EditIcon size={20} />
            </Button>
            </TooltipGlobal>
            {supplier.esContribuyente === false && (
              <TooltipGlobal text="Cambiar tipo de proveedor">
            <Button
              onClick={() => handleChangeSupplier(supplier, 'change')}
              isIconOnly
              style={global_styles().thirdStyle}
            >
              <Repeat size={20} />
            </Button></TooltipGlobal>
            )}
            {DeletePopover({ supplier: supplier })}

            {/* {supplier.isActive === false && (
              <Button
                onClick={() => {
                  handleActive(supplier.id);
                }}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <BadgeCheck size={20} />
              </Button>
            )} */}
          </div>
        </div>
      ) : (
        <ListItem
          // handleActive={handleActive}
          supplier={supplier}
          handleChangeSupplier={handleChangeSupplier}
          layout="list"
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { supplier, handleChangeSupplier } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white"> {supplier.nombre}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white">{supplier.telefono}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Mail className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white">{supplier.correo}</p>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Users2Icon className="dark:text-gray-400 text-[#274c77]" size={35} />
            <p className="w-full dark:text-white">{supplier.esContribuyente ? "Contribuyente" : "No Contribuyente"}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
        <TooltipGlobal text="Editar">
          <Button
            onClick={() => handleChangeSupplier(supplier, 'edit')}
            isIconOnly
            style={global_styles().secondaryStyle}
          >
            <EditIcon size={20} />
          </Button>
          </TooltipGlobal>
          {supplier.esContribuyente === false && (
            <TooltipGlobal text="Cambiar tipo de proveedor">
          <Button
            onClick={() => handleChangeSupplier(supplier, 'change')}
            isIconOnly
            style={global_styles().thirdStyle}
          >
            <Repeat size={20} />
          </Button></TooltipGlobal>
           )}
          {DeletePopover({ supplier: supplier })}
          {/* {supplier.isActive === false && (
            <Button
              onClick={() => {
                handleActive(supplier.id);
              }}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <BadgeCheck size={20} />
            </Button>
          )} */}
        </div>
      </div>
    </>
  );
};

export default MobileViewSupplier;
