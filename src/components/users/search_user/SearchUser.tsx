import {
  Autocomplete,
  AutocompleteItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Switch,
} from '@heroui/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { IPropsSearchUser } from '../types/mobile-view.types';

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
        <ButtonUi isIconOnly theme={Colors.Info} type="button" onPress={() => setOpenVaul(true)}>
          <Filter />
        </ButtonUi>
        <Drawer
          isOpen={openVaul}
          placement="bottom"
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <DrawerContent>
            <DrawerHeader>Filtros disponibles</DrawerHeader>
            <DrawerBody>
              <div className="flex flex-col  gap-2">
                <Input
                  isClearable
                  className="w-full dark:text-white"
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
                      user?.pointOfSale?.branch.transmitterId ?? 0,
                      1,
                      5,
                      filter.nameUser,
                      filter.nameRol
                    );
                  }}
                />
                <Autocomplete
                  className="dark:text-white "
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  clearButtonProps={{
                    onClick: () => {
                      setFilter({ nameUser: '', nameRol: '' });
                      getUsersPaginated(
                        user?.pointOfSale?.branch.transmitterId ?? 0,
                        1,
                        5,
                        filter.nameUser,
                        filter.nameRol
                      );
                    },
                  }}
                  defaultItems={roles_list}
                  defaultSelectedKey={filter.nameRol}
                  label="Rol"
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
              </div>
              <div className="flex  justify-start items-end">
                <Switch
                  classNames={{
                    thumb: classNames(props.active ? 'bg-blue-500' : 'bg-gray-400'),
                    wrapper: classNames(props.active ? '!bg-blue-300' : 'bg-gray-200'),
                  }}
                  isSelected={props.active}
                  onValueChange={(active) => props.setActive(active)}
                >
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Mostrar {props.active ? 'inactivos' : 'activos'}
                  </span>
                </Switch>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <ButtonUi
                className="px-10 font-semibold"
                color="primary"
                theme={Colors.Primary}
                onPress={() => {
                  getUsersPaginated(
                    user?.pointOfSale?.branch.transmitterId ?? 0,
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
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default SearchUser;
