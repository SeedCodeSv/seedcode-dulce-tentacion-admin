import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';

import { global_styles } from '@/styles/global.styles';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Filter, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { IPropsSearchEmployee } from '../types/mobile-view.types';
import { useBranchesStore } from '@/store/branches.store';
import { useEmployeeStore } from '@/store/employee.store';
import { useAuthStore } from '@/store/auth.store';
function SearchEmployee(props: IPropsSearchEmployee) {
  const [openVaul, setOpenVaul] = useState(false);
  const { theme } = useContext(ThemeContext);

  const { user } = useAuthStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getEmployeesPaginated } = useEmployeeStore();
  useEffect(() => {
    getBranchesList();
  }, []);
  const [filter, setFilter] = useState({
    nameEmployee: '',
    phoneEmployee: '',
    nameBranchEmployee: '',
  });
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
          <Button
            className="border border-white rounded-xl"
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
          <div className="flex flex-col  gap-2">
            <Input
              value={filter.nameEmployee}
              onClear={() => {
                setFilter({ ...filter, nameEmployee: '' });

                getEmployeesPaginated(
                  Number(user?.correlative.branch.transmitterId),
                  1,
                  5,
                  filter.nameEmployee,
                  '',
                  filter.nameBranchEmployee,
                  filter.phoneEmployee,
                  '',
                  1
                );
              }}
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, nameEmployee: e.target.value });
                props.nameEmployee(e.target.value);
              }}
              startContent={<Search />}
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
            />
            <Input
              value={filter.phoneEmployee}
              onClear={() => {
                setFilter({ ...filter, phoneEmployee: '' });
              }}
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, phoneEmployee: e.target.value });
                props.phoneEmployee(e.target.value);
              }}
              startContent={<Search />}
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Telefono"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
            />
            <label className="dark:text-white">Sucursal </label>
            <Autocomplete
              onSelectionChange={(value) => {
                const selectRol = branch_list.find((rol) => rol.name === value);
                setFilter({
                  nameEmployee: '',
                  phoneEmployee: '',
                  nameBranchEmployee: selectRol?.name || '',
                });
                props.branchName(selectRol?.name ?? '');
              }}
              defaultItems={branch_list}
              defaultSelectedKey={filter.nameBranchEmployee}
              clearButtonProps={{
                onClick: () => {
                  setFilter({ nameEmployee: '', phoneEmployee: '', nameBranchEmployee: '' });
                },
              }}
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              className="dark:text-white border dark:border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
            >
              {branch_list.map((dep) => (
                <AutocompleteItem className="dark:text-white" value={dep.id} key={dep.name}>
                  {dep.name}
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
                getEmployeesPaginated(
                  Number(user?.correlative.branch.transmitterId),
                  1,
                  5,
                  filter.nameEmployee,
                  '',
                  filter.nameBranchEmployee,
                  filter.phoneEmployee,
                  '',
                  1
                );
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

export default SearchEmployee;
