import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react';
import {
  Key,
  Table as ITable,
  CreditCard,
  EditIcon,
  RefreshCcw,
  Lock,
  RectangleEllipsis,
  Trash,
} from 'lucide-react';
import { ButtonGroup } from '@heroui/react';
import classNames from 'classnames';
import { Search } from 'lucide-react';

import { useUsersStore } from '../../store/users.store';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { User } from '../../types/users.types';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import TooltipGlobal from '../global/TooltipGlobal';

import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
import UpdatePassword from './UpdatePassword';
import SearchUser from './search_user/SearchUser';
import GenerateCode from './GenerateCode';
import CardProduct from './MobileView';

import useWindowSize from '@/hooks/useWindowSize';
import NO_DATA from '@/assets/svg/no_data.svg';
import { useRolesStore } from '@/store/roles.store';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';

interface Props {
  actionss: string[];
}
function ListUsers({ actionss }: Props) {
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated, activateUser } = useUsersStore();
  const [users, setUser] = useState<User | undefined>();
  const [active, setActive] = useState(true);
  const [page, serPage] = useState(1);
  const { roles_list, getRolesList } = useRolesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getUsersPaginated(
      user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      limit,
      '',
      '',
      active ? 1 : 0
    );
    getRolesList();
  }, [limit, active]);

  const modalAdd = useDisclosure();
  const modalUpdate = useDisclosure();
  const modalChangePassword = useDisclosure();
  const generateCodeModal = useDisclosure();

  const [selectId, setSelectedId] = useState(0);

  const { windowSize } = useWindowSize();

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const [userName, setUserName] = useState('');
  const [rol, setRol] = useState('');

  const handleSearch = (searchParam: string | undefined) => {
    getUsersPaginated(
       user?.pointOfSale?.branch.transmitterId ?? 0,
      page,
      limit,
      searchParam ?? userName,
      rol,
      active ? 1 : 0
    );
  };

  const handleActivate = (id: number) => {
    activateUser(id).then(() => {
      getUsersPaginated(
        user?.pointOfSale?.branch.transmitterId ?? 0,
        1,
        limit,
        '',
        '',
        active ? 1 : 0
      );
    });
  };

  return (
    <>
      <div className=" w-full h-full bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between items-end ">
            <SearchUser
              nameRol={(rol) => setRol(rol)}
              nameUser={(userName) => setUserName(userName)}
             />
            {actionss.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
          </div>
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-3 gap-3">
              <Input
                isClearable
                className=" dark:text-white border border-white rounded-xl"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                label="Nombre"
                labelPlacement="outside"
                placeholder="Escribe para buscar..."
                startContent={<Search />}
                value={userName}
                variant="bordered"
                onChange={(e) => setUserName(e.target.value)}
                onClear={() => {
                  setUserName('');
                  handleSearch('');
                }}
              />

              <div className="w-full">
                <span className="dark:text-white text-sm font-semibold">Rol</span>
                <Autocomplete
                  className="dark:text-white border border-white rounded-xl"
                  classNames={{
                    base: 'text-gray-500 text-sm',
                  }}
                  clearButtonProps={{
                    onClick: () => {
                      setRol('');
                      handleSearch('');
                    },
                  }}
                  labelPlacement="outside"
                  placeholder="Selecciona el rol"
                  variant="bordered"
                  onClear={() => {
                    setRol('');
                    handleSearch('');
                  }}
                  onSelectionChange={(value) => {
                    const selectRol = roles_list.find((rol) => rol.name === value);

                    setRol(selectRol?.name ?? '');
                  }}
                >
                  {roles_list.map((dep) => (
                    <AutocompleteItem key={dep.name} className="dark:text-white">
                      {dep.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <ButtonUi
                className="hidden mt-6 font-semibold md:flex border border-white"
                theme={Colors.Primary}
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex  justify-start order-2 lg:order-1">
              <div className="xl:mt-10">
                <Switch
                  classNames={{
                    thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                    wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                  }}
                  isSelected={active}
                  onValueChange={(active) => setActive(active)}
                >
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Mostrar {active ? 'inactivos' : 'activos'}
                  </span>
                </Switch>
              </div>
            </div>
            <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
              <div className="w-44">
                <span className="dark:text-white text-sm font-semibold">Mostrar</span>
                <Select
                  className="w-44 dark:text-white border border-white rounded-xl"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  labelPlacement="outside"
                  value={limit}
                  variant="bordered"
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <ButtonGroup className="mt-4">
                <ButtonUi
                  isIconOnly
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>
            </div>
          </div>

          {(view === 'grid' || view === 'list') && (
            <CardProduct
              DeletePopover={DeletePopUp}
              actions={actionss}
              handleActivate={handleActivate}
              openEditModal={(user) => {
                setUser(user);
                modalUpdate.onOpen();
              }}
              openKeyModal={(user) => {
                setSelectedId(user.id);
                modalChangePassword.onOpen();
              }}
            />
          )}
          {view === 'table' && (
            <div className="overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Nombre de usuario</ThGlobal>
                    <ThGlobal className="text-left p-3">Rol</ThGlobal>
                    <ThGlobal className="text-left p-3" />
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {users_paginated.users.length > 0 ? (
                    <>
                      {users_paginated.users.map((item, index) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.id}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100  max-w-[350px]">
                            {item.userName}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.role.name}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <div className="flex w-full gap-5">
                              {item.active && actionss.includes('Editar') ? (
                                <TooltipGlobal text="Editar">
                                  <ButtonUi
                                    isIconOnly
                                    className="border border-white"
                                    theme={Colors.Success}
                                    onPress={() => {
                                      setUser(item);
                                      modalUpdate.onOpen();
                                    }}
                                  >
                                    <EditIcon size={20} />
                                  </ButtonUi>
                                </TooltipGlobal>
                              ) : (
                                <ButtonUi
                                  disabled
                                  isIconOnly
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  theme={Colors.Secondary}
                                  type="button"
                                >
                                  <Lock className="text-white" />
                                </ButtonUi>
                              )}
                              {item.active && actionss.includes('Cambiar Contraseña') ? (
                                <TooltipGlobal text="Cambiar contraseña">
                                  <ButtonUi
                                    isIconOnly
                                    className="border border-white"
                                    theme={Colors.Warning}
                                    onPress={() => {
                                      setSelectedId(item.id);
                                      modalChangePassword.onOpen();
                                    }}
                                  >
                                    <Key size={20} />
                                  </ButtonUi>
                                </TooltipGlobal>
                              ) : (
                                <ButtonUi
                                  disabled
                                  isIconOnly
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  theme={Colors.Warning}
                                  type="button"
                                >
                                  <Lock className="text-white" />
                                </ButtonUi>
                              )}

                              {item.active && actionss.includes('Eliminar') ? (
                                <>
                                  <DeletePopUp user={item} />
                                </>
                              ) : (
                                <ButtonUi
                                  disabled
                                  isIconOnly
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  theme={Colors.Warning}
                                  type="button"
                                >
                                  <Lock className="text-white" />
                                </ButtonUi>
                              )}
                              {!item.active && (
                                <>
                                  {actionss.includes('Activar') ? (
                                    <TooltipGlobal text="Activar">
                                      <ButtonUi
                                        isIconOnly
                                        theme={Colors.Info}
                                        onPress={() => handleActivate(item.id)}
                                      >
                                        <RefreshCcw />
                                      </ButtonUi>
                                    </TooltipGlobal>
                                  ) : (
                                    <ButtonUi
                                      disabled
                                      isIconOnly
                                      className="flex font-semibold border border-white  cursor-not-allowed"
                                      theme={Colors.Info}
                                      type="button"
                                    >
                                      <Lock />
                                    </ButtonUi>
                                  )}
                                </>
                              )}
                              <TooltipGlobal text="Generar código">
                                <ButtonUi
                                  isIconOnly
                                  theme={Colors.Info}
                                  onPress={() => {
                                    setSelectedId(item.id);
                                    generateCodeModal.onOpen();
                                  }}
                                >
                                  <RectangleEllipsis />
                                </ButtonUi>
                              </TooltipGlobal>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center justify-center w-full">
                          <img alt="X" className="w-32 h-32" src={NO_DATA} />
                          <p className="mt-3 text-xl dark:text-white">
                            No se encontraron resultados
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {users_paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={users_paginated.currentPag}
                  nextPage={users_paginated.nextPag}
                  previousPage={users_paginated.prevPag}
                  totalPages={users_paginated.totalPag}
                  onPageChange={(page) => {
                    getUsersPaginated(
                        user?.pointOfSale?.branch.transmitterId ??
                        0,
                      page,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0
                    );
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  currentPage={users_paginated.currentPag}
                  handleNext={() => {
                    serPage(users_paginated.nextPag);
                    getUsersPaginated(
                      user?.pointOfSale?.branch.transmitterId ??
                        0,
                      users_paginated.nextPag,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0
                    );
                  }}
                  handlePrev={() => {
                    serPage(users_paginated.prevPag);
                    getUsersPaginated(
                      user?.pointOfSale?.branch.transmitterId ??
                        0,
                      users_paginated.prevPag,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0
                    );
                  }}
                  totalPages={users_paginated.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          isOpen={modalAdd.isOpen}
          size="w-[350px] md:w-[550px]"
          title="Agregar usuario"
          onClose={modalAdd.onClose}
        >
          <AddUsers
            reload={() =>
              getUsersPaginated(
               user?.pointOfSale?.branch.transmitterId ??
                  0,
                1,
                limit,
                '',
                '',
                active ? 1 : 0
              )
            }
            onClose={modalAdd.onClose}
          />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalChangePassword.isOpen}
          size="w-[350px] md:w-[550px]"
          title="Actualizar contraseña"
          onClose={modalChangePassword.onClose}
        >
          <UpdatePassword closeModal={modalChangePassword.onClose} id={selectId} />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalUpdate.isOpen}
          size="w-[350px] md:w-[550px]"
          title="Editar usuario"
          onClose={modalUpdate.onClose}
        >
          <UpdateUsers
            reload={() =>
              getUsersPaginated(
               user?.pointOfSale?.branch.transmitterId ??
                  0,
                1,
                limit,
                '',
                '',
                active ? 1 : 0
              )
            }
            user={users}
            onClose={modalUpdate.onClose}
          />
        </HeadlessModal>
        <HeadlessModal
          isOpen={generateCodeModal.isOpen}
          size="w-[350px] md:w-[450px]"
          title="Generar código"
          onClose={generateCodeModal.onClose}
        >
          <GenerateCode id={selectId} />
        </HeadlessModal>
      </div>
    </>
  );
}
export default ListUsers;
interface PopProps {
  user: User;
}
export const DeletePopUp = ({ user }: PopProps) => {
  const { deleteUser } = useUsersStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = () => {
    deleteUser(user.id);
    deleteDisclosure.onClose();
  };
  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        {...deleteDisclosure}
        showArrow
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {user.userName}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4 gap-5">
              <ButtonUi
                className="border border-white"
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
              >
                No, cancelar
              </ButtonUi>
              <ButtonUi theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
