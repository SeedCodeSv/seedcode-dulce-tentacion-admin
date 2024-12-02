import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { global_styles } from '@/styles/global.styles';
import { Button, Input } from '@nextui-org/react';
import { Filter, Mail, User } from 'lucide-react';
import { useContext, useState } from 'react';
import { IPropsSearchSupplier } from '../types/movile-view.types';
import { useSupplierStore } from '@/store/supplier.store';

function SearchSupplier(props: IPropsSearchSupplier) {
  const { getSupplierPagination } = useSupplierStore();

  const { theme } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = useState(false);

  const [filter, setFilter] = useState({
    nameSupplier: '',
    emailSuppplier: '',
    typeSupplier: '',
  });

  const handleSearch = () => {
    getSupplierPagination(1, 5, filter.nameSupplier, filter.emailSuppplier, filter.typeSupplier, 1);
  };
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
          <Button
            style={global_styles().thirdStyle}
            isIconOnly
            onClick={() => setOpenVaul(true)}
            type="button"
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          title="Filtros disponibles"
          open={openVaul}
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col gap-3">
            <Input
              startContent={<User />}
              className="w-full dark:text-white border border-white rounded-xl"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              onChange={(e) => {
                setFilter({ ...filter, nameSupplier: e.target.value });
                props.nameSupplier(e.target.value);
              }}
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                handleSearch();
                setFilter({ ...filter, nameSupplier: '' });
              }}
            />
            <Input
              startContent={<Mail />}
              className="w-full dark:text-white border border-white rounded-xl"
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, emailSuppplier: e.target.value });
                props.emailSupplier(e.target.value);
              }}
              labelPlacement="outside"
              label="Correo"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                handleSearch();
                setFilter({ ...filter, emailSuppplier: '' });
              }}
            />

            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
              className="font-semibold"
              color="primary"
              onClick={() => {
                handleSearch();
                setFilter({ typeSupplier: '', nameSupplier: '', emailSuppplier: '' });
                setOpenVaul(false);
              }}
            >
              Buscar
            </Button>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchSupplier;
