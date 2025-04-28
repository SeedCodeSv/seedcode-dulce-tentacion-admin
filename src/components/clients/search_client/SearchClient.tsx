import { Autocomplete, AutocompleteItem, Button, Input } from '@heroui/react';
import { Filter, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IPropsSearchCustomer } from '../types/mobile-view.types';

import { global_styles } from '@/styles/global.styles';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import BottomDrawer from '@/components/global/BottomDrawer';
import { useBranchesStore } from '@/store/branches.store';
import { useCustomerStore } from '@/store/customers.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function SearchClient(props: IPropsSearchCustomer) {
  const [filter, setFilter] = useState({
    nameCustomer: '',
    emailCustomer: '',
    nameBranch: '',
  });
  const { getCustomersPagination } = useCustomerStore();
  const handleSearch = () => {
    getCustomersPagination(
      1,
      5,
      filter.nameCustomer,
      filter.emailCustomer,
      filter.nameBranch,
      '',
      1
    );
  };
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);
  const [openVaul, setOpenVaul] = useState(false);

  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal color="primary" text="Buscar por filtros">
          <Button
            isIconOnly
            style={global_styles().thirdStyle}
            type="button"
            onClick={() => setOpenVaul(true)}
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          open={openVaul}
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col gap-3">
            <Input
              isClearable
              className="w-full dark:text-white border border-white  rounded-xl"
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
                setFilter({ ...filter, nameCustomer: e.target.value }),
                  props.nameCustomer(e.target.value);
              }}
              onClear={() => {
                // handleSearch("");
              }}
            />

            <Input
              isClearable
              className="w-full dark:text-white border border-white  rounded-xl"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Correo"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Mail />}
              variant="bordered"
              onClear={() => {
                // handleSearch("");
              }}
            />

            <span className="font-semibold dark:text-white">Sucursal</span>

            <Autocomplete
              className="w-full dark:text-white border border-white  rounded-xl"
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              clearButtonProps={{}}
              labelPlacement="outside"
              placeholder="Selecciona una sucursal"
              variant="bordered"
              onSelectionChange={(key) => {
                const branchName = String(new Set([key]).values().next().value ?? '');

                setFilter({ ...filter, nameBranch: branchName });
                props.nameBranch(branchName);
              }}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem key={bra.name} className="dark:text-white">
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <ButtonUi
              className="mb-10 font-semibold"
              theme={Colors.Primary}
              onPress={() => {
                setFilter({ ...filter, nameCustomer: '', nameBranch: '', emailCustomer: '' });
                handleSearch();
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

export default SearchClient;
