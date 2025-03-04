import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { useRolesStore } from '@/store/roles.store';
import { useUsersStore } from '@/store/users.store';
import { global_styles } from '@/styles/global.styles';
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { Filter, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { IPropsSearchUser } from '../types/mobile-view.types';
import { useAuthStore } from '@/store/auth.store';
function SearchUser(props: IPropsSearchUser) {
  const [openVaul, setOpenVaul] = useState(false);
  const { theme } = useContext(ThemeContext);
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
              value={filter.nameUser}
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
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, nameUser: e.target.value });
                props.nameUser(e.target.value);
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
            <label className="font-semibold dark:text-white text-sm">Rol</label>
            <Autocomplete
              onSelectionChange={(value) => {
                const selectRol = roles_list.find((rol) => rol.name === value);
                setFilter({ nameUser: '', nameRol: selectRol?.name || '' });
              }}
              defaultItems={roles_list}
              defaultSelectedKey={filter.nameRol}
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
              labelPlacement="outside"
              placeholder="Selecciona el rol"
              variant="bordered"
              className="dark:text-white border dark:border-white rounded-xl"
              classNames={{
                base: 'text-gray-500 text-sm',
              }}
            >
              {roles_list.map((dep) => (
                <AutocompleteItem className="dark:text-white" key={dep.name}>
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
            </Button>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchUser;
