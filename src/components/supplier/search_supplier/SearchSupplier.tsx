import { Input } from '@heroui/react';
import { Filter, Mail, User } from 'lucide-react';
import { useState } from 'react';

import { IPropsSearchSupplier } from '../types/movile-view.types';

import TooltipGlobal from '@/components/global/TooltipGlobal';
import BottomDrawer from '@/components/global/BottomDrawer';
import { useSupplierStore } from '@/store/supplier.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function SearchSupplier(props: IPropsSearchSupplier) {
  const { getSupplierPagination } = useSupplierStore();
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
        <TooltipGlobal color="primary" text="Buscar por filtros">
          <ButtonUi isIconOnly theme={Colors.Info} type="button" onPress={() => setOpenVaul(true)}>
            <Filter />
          </ButtonUi>
        </TooltipGlobal>
        <BottomDrawer
          open={openVaul}
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col gap-3">
            <Input
              isClearable
              className="w-full dark:text-white border border-white rounded-xl"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<User />}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, nameSupplier: e.target.value });
                props.nameSupplier(e.target.value);
              }}
              onClear={() => {
                handleSearch();
                setFilter({ ...filter, nameSupplier: '' });
              }}
            />
            <Input
              isClearable
              className="w-full dark:text-white border border-white rounded-xl"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Correo"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Mail />}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, emailSuppplier: e.target.value });
                props.emailSupplier(e.target.value);
              }}
              onClear={() => {
                handleSearch();
                setFilter({ ...filter, emailSuppplier: '' });
              }}
            />

            <ButtonUi
              className="font-semibold"
              color="primary"
              theme={Colors.Primary}
              onPress={() => {
                handleSearch();
                setFilter({ typeSupplier: '', nameSupplier: '', emailSuppplier: '' });
                setOpenVaul(false);
              }}
            >
              Buscar
            </ButtonUi>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchSupplier;
