import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { Autocomplete, AutocompleteItem, Button, Input } from '@heroui/react';
import { Filter, Mail, User } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { IPropsSearchCustomer } from '../types/mobile-view.types';
import { useBranchesStore } from '@/store/branches.store';
import { ThemeContext } from '@/hooks/useTheme';
import { useCustomerStore } from '@/store/customers.store';

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
  const { theme } = useContext(ThemeContext);
  const { branch_list, getBranchesList } = useBranchesStore();
  useEffect(() => {
    getBranchesList();
  }, []);
  const [openVaul, setOpenVaul] = useState(false);
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
          <Button
            onClick={() => setOpenVaul(true)}
            style={global_styles().thirdStyle}
            isIconOnly
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
              onChange={(e) => {
                setFilter({ ...filter, nameCustomer: e.target.value }),
                  props.nameCustomer(e.target.value);
              }}
              startContent={<User />}
              className="w-full dark:text-white border border-white  rounded-xl"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                // handleSearch("");
              }}
            />

            <Input
              startContent={<Mail />}
              className="w-full dark:text-white border border-white  rounded-xl"
              variant="bordered"
              labelPlacement="outside"
              label="Correo"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                // handleSearch("");
              }}
            />
            <label>
              <span className="font-semibold dark:text-white">Sucursal</span>
            </label>
            <Autocomplete
              onSelectionChange={(key) => {
                const branchName = String(new Set([key]).values().next().value ?? '');
                setFilter({ ...filter, nameBranch: branchName });
                props.nameBranch(branchName);
              }}
              className="w-full dark:text-white border border-white  rounded-xl"
              labelPlacement="outside"
              placeholder="Selecciona una sucursal"
              variant="bordered"
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              clearButtonProps={{}}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem className="dark:text-white" key={bra.name}>
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontSize: '16px',
              }}
              className="mb-10 font-semibold"
              color="primary"
              onClick={() => {
                setFilter({ ...filter, nameCustomer: '', nameBranch: '', emailCustomer: '' });
                handleSearch();
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

export default SearchClient;
