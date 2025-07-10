import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IPropsSearchEmployee } from '../types/mobile-view.types';

import BottomDrawer from '@/components/global/BottomDrawer';
import { useBranchesStore } from '@/store/branches.store';
import { useEmployeeStore } from '@/store/employee.store';
import { useAuthStore } from '@/store/auth.store';
import { fechaActualString } from '@/utils/dates';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
function SearchEmployee(props: IPropsSearchEmployee) {
  const [openVaul, setOpenVaul] = useState(false);
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
    codeEmployee: '',
    startDate: '',
    endDate: '',
  });

  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">

        <ButtonUi
          isIconOnly
          showTooltip
          theme={Colors.Info}
          tooltipText="Buscar por filtros"
          onPress={() => setOpenVaul(true)}
        >
          <Filter />
        </ButtonUi>
        <BottomDrawer
          open={openVaul}
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col  gap-2">
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Search />}
              value={filter.nameEmployee}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, nameEmployee: e.target.value });
                props.nameEmployee(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, nameEmployee: '' });

                getEmployeesPaginated(
                  Number(
                    user?.pointOfSale?.branch.transmitterId ??
                    0
                  ),
                  1,
                  5,
                  filter.nameEmployee,
                  '',
                  filter.nameBranchEmployee,
                  filter.phoneEmployee,
                  '',
                  1,
                  filter.startDate,
                  filter.endDate
                );
              }}
            />
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Telefono"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Search />}
              value={filter.phoneEmployee}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, phoneEmployee: e.target.value });
                props.phoneEmployee(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, phoneEmployee: '' });
              }}
            />
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Codigo"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Search />}
              value={filter.codeEmployee}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, codeEmployee: e.target.value });
                props.codeEmpleyee(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, codeEmployee: '' });
              }}
            />
            <div>
              <span className="font-semibold dark:text-white text-sm">Fecha Inicial</span>

              <Input
                className="w-full dark:text-white  rounded-xl border border-white"
                classNames={{
                  base: 'font-semibold dark:text-white text-sm',
                  label: 'font-semibold dark:text-white text-sm',
                }}
                defaultValue={filter.startDate}
                labelPlacement="outside"
                type="date"
                variant="bordered"
                onChange={(e) => {
                  props.startDate(e.target.value),
                    setFilter({ ...filter, startDate: e.target.value });
                }}
              />
            </div>
            <div>
              <span className="font-semibold dark:text-white text-sm">Fecha Final</span>
              <Input
                className="w-full dark:text-white  rounded-xl border border-white"
                classNames={{
                  base: 'font-semibold dark:text-white text-sm',
                  label: 'font-semibold dark:text-white text-sm',
                }}
                defaultValue={filter.endDate}
                labelPlacement="outside"
                type="date"
                variant="bordered"
                onChange={(e) => {
                  props.endDate(e.target.value), setFilter({ ...filter, endDate: e.target.value });
                }}
              />
            </div>
            <span className="dark:text-white">Sucursal </span>
            <Autocomplete
              className="dark:text-white border dark:border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
              clearButtonProps={{
                onClick: () => {
                  setFilter({
                    nameEmployee: '',
                    phoneEmployee: '',
                    nameBranchEmployee: '',
                    startDate: fechaActualString,
                    endDate: fechaActualString,
                    codeEmployee: '',
                  });
                },
              }}
              defaultItems={branch_list}
              defaultSelectedKey={filter.nameBranchEmployee}
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              onSelectionChange={(value) => {
                const selectRol = branch_list.find((rol) => rol.name === value);

                setFilter({
                  nameEmployee: '',
                  phoneEmployee: '',
                  codeEmployee: '',
                  startDate: fechaActualString,
                  endDate: fechaActualString,
                  nameBranchEmployee: selectRol?.name || '',
                });
                props.branchName(selectRol?.name ?? '');
              }}
            >
              {branch_list.map((dep) => (
                <AutocompleteItem key={dep.name} className="dark:text-white">
                  {dep.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <ButtonUi
              className="mb-10 font-semibold"
              theme={Colors.Primary}
              onPress={() => {
                getEmployeesPaginated(
                  Number(
                    user?.pointOfSale?.branch.transmitterId ??
                    0
                  ),
                  1,
                  5,
                  filter.nameEmployee,
                  '',
                  filter.nameBranchEmployee,
                  filter.phoneEmployee,
                  '',
                  1,
                  filter.startDate,
                  filter.endDate
                );
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

export default SearchEmployee;
