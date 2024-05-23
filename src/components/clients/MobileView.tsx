import { useContext } from 'react';
import { Button } from '@nextui-org/react';
import { DataView } from 'primereact/dataview';
import { useCustomerStore } from '../../store/customers.store';
import { classNames } from 'primereact/utils';
import {
  User as IUser,
  Trash,
  Phone,
  Mail,
  Users2Icon,
  EditIcon,
  Repeat,
  MapPin,
  RefreshCcw,
  BadgeCheck,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";
import { Customer } from "../../types/customers.types";
import { global_styles } from "../../styles/global.styles";

/* eslint-disable no-unused-vars */
interface Props {
  layout: 'grid' | 'list';
  deletePopover: ({ customers }: { customers: Customer }) => JSX.Element;
  handleChangeCustomer: (customer: Customer, type: string) => void;
  handleActive: (id: number) => void;
}
/* eslint-enable no-unused-vars */

function MobileView({ layout, handleChangeCustomer, handleActive }: Props) {
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
              'grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-nogutter gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(customer) =>
          gridItem(customer, layout, handleChangeCustomer, handleActive)
        }
        emptyMessage="No customers found"
      />
    </div>
  );
}

/* eslint-disable no-unused-vars */
const gridItem = (
  customers: Customer,
  layout: "grid" | "list",
  handleChangeCustomer: (customer: Customer, type: string) => void,
  handleActive: (id: number) => void
) => {
  /* eslint-enable no-unused-vars */

  
  const { theme } = useContext(ThemeContext);
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full shadow-sm hover:shadow-lg dark:border dark:border-gray-600 p-8 rounded-2xl'
          )}
          key={customers.id}
        >
          <div className="flex w-full gap-2">
            <IUser className="text-[#274c77] dark:text-gray-400" size={35} />
            {customers.nombre}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone className="text-[#00bbf9] dark:text-gray-400" size={33} />
            {customers.telefono}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <MapPin className="text-[#00bbf9] dark:text-gray-400" size={33} />
            {customers.direccion.nombreDepartamento} ,{customers.direccion.municipio} ,
            {customers.direccion.complemento}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Users2Icon className="text-[#006d77] dark:text-gray-400" size={35} />
            {customers.esContribuyente ? 'Si' : 'No'}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => handleChangeCustomer(customers, 'edit')}
              isIconOnly
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <EditIcon style={{ color: theme.colors.primary }} size={20} />
            </Button>
            <Button
              onClick={() => handleChangeCustomer(customers, 'change')}
              isIconOnly
              style={{
                backgroundColor: theme.colors.third,
              }}
            >
              <Repeat style={{ color: theme.colors.primary }} size={20} />
            </Button>
            <Button
              isIconOnly
              style={{
                backgroundColor: theme.colors.danger,
              }}
            >
              <Trash color={theme.colors.primary} size={20} />
            </Button>

            {customers.isActive === false && (
              <Button
                onClick={() => {
                  handleActive(customers.id);
                }}
                isIconOnly
                style={{
                  backgroundColor: theme.colors.third,
                }}
              >
                <BadgeCheck style={{ color: theme.colors.primary }} size={20} />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          handleActive={handleActive}
          customers={customers}
          handleChangeCustomer={handleChangeCustomer}
        />
      )}
    </>
  );
};
const ListItem = ({
  customers,
  handleChangeCustomer,
  handleActive,
}: {
  customers: Customer;
  handleChangeCustomer: (customer: Customer, type: string) => void;
  handleActive: (id: number) => void;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser color={'#274c77'} size={35} />
            {customers.nombre}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone color="#00bbf9" size={35} />
            {customers.telefono}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Mail color={'#006d77'} size={35} />
            {customers.correo}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Users2Icon color={'#006d77'} size={35} />
            {customers.esContribuyente ? 'Si' : 'No'}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full">
          <Button
            onClick={() => handleChangeCustomer(customers, 'edit')}
            isIconOnly
            style={{
              backgroundColor: theme.colors.secondary,
            }}
          >
            <EditIcon style={{ color: theme.colors.primary }} size={20} />
          </Button>
          <Button
            onClick={() => handleChangeCustomer(customers, 'change')}
            isIconOnly
            style={{
              backgroundColor: theme.colors.third,
            }}
          >
            <Repeat style={{ color: theme.colors.primary }} size={20} />
          </Button>
          <Button
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <Trash color={theme.colors.primary} size={20} />
          </Button>
          {customers.isActive === false && (
            <Button
              onClick={() => {
                handleActive(customers.id);
              }}
              isIconOnly
              style={{
                backgroundColor: theme.colors.third,
              }}
            >
              <BadgeCheck style={{ color: theme.colors.primary }} size={20} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
