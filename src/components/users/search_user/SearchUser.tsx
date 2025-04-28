import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IPropsSearchUser } from '../types/mobile-view.types';

import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useRolesStore } from '@/store/roles.store';
import { useUsersStore } from '@/store/users.store';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function SearchUser(props: IPropsSearchUser) {
  const [openVaul, setOpenVaul] = useState(false);
  const { roles_list, getRolesList } = useRolesStore();
  const { getUsersPaginated } = useUsersStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const [filter, setFilter] = useState({
    nameUser: '',
    nameRol: '',
  });
  const { user } = useAuthStore();

  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal color="primary" text="Buscar por filtros">
          <ButtonUi
            isIconOnly
            className="border border-white rounded-xl"
            theme={Colors.Info}
            type="button"
            onPress={() => setOpenVaul(true)}
          >
            <Filter />
          </ButtonUi>
        </TooltipGlobal>
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
              value={filter.nameUser}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, nameUser: e.target.value });
                props.nameUser(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, nameUser: '' });
                props.nameUser('');
                getUsersPaginated(
                  user?.correlative?.branch.transmitterId ??
                    user?.pointOfSale?.branch.transmitterId ??
                    0,
                  1,
                  5,
                  filter.nameUser,
                  filter.nameRol
                );
              }}
            />
            <span className="font-semibold dark:text-white text-sm">Rol</span>
            <Autocomplete
              className="dark:text-white border dark:border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
              clearButtonProps={{
                onClick: () => {
                  setFilter({ nameUser: '', nameRol: '' });
                  getUsersPaginated(
                    user?.correlative?.branch.transmitterId ??
                      user?.pointOfSale?.branch.transmitterId ??
                      0,
                    1,
                    5,
                    filter.nameUser,
                    filter.nameRol
                  );
                },
              }}
              defaultItems={roles_list}
              defaultSelectedKey={filter.nameRol}
              labelPlacement="outside"
              placeholder="Selecciona el rol"
              variant="bordered"
              onSelectionChange={(value) => {
                const selectRol = roles_list.find((rol) => rol.name === value);

                setFilter({ nameUser: '', nameRol: selectRol?.name || '' });
              }}
            >
              {roles_list.map((dep) => (
                <AutocompleteItem key={dep.name} className="dark:text-white">
                  {dep.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <ButtonUi
              className="mb-10 font-semibold"
              color="primary"
              theme={Colors.Primary}
              onPress={() => {
                getUsersPaginated(
                  user?.correlative?.branch.transmitterId ??
                    user?.pointOfSale?.branch.transmitterId ??
                    0,
                  1,
                  5,
                  filter.nameUser,
                  filter.nameRol,
                  1
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

export default SearchUser;
