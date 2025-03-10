import { useEffect, useState } from 'react';
import { useUsersStore } from '../../store/users.store';
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

import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
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
import UpdatePassword from './UpdatePassword';
import { ButtonGroup } from '@heroui/react';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { User } from '../../types/users.types';
import classNames from 'classnames';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import { Search } from 'lucide-react';
import HeadlessModal from '../global/HeadlessModal';
import useWindowSize from '@/hooks/useWindowSize';
import TooltipGlobal from '../global/TooltipGlobal';
import NO_DATA from '@/assets/svg/no_data.svg';
import SearchUser from './search_user/SearchUser';
import { useRolesStore } from '@/store/roles.store';
import { useAuthStore } from '@/store/auth.store';
import GenerateCode from './GenerateCode';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import CardProduct from './MobileView';
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
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
              nameUser={(userName) => setUserName(userName)}
              nameRol={(rol) => setRol(rol)}
            ></SearchUser>
            {actionss.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
          </div>
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-3 gap-3">
              <Input
                startContent={<Search />}
                className=" dark:text-white border border-white rounded-xl"
                variant="bordered"
                labelPlacement="outside"
                label="Nombre"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  setUserName('');
                  handleSearch('');
                }}
              />

              <div className="w-full">
                <label className="dark:text-white text-sm font-semibold">Rol</label>
                <Autocomplete
                  onSelectionChange={(value) => {
                    const selectRol = roles_list.find((rol) => rol.name === value);
                    setRol(selectRol?.name ?? '');
                  }}
                  onClear={() => {
                    setRol('');
                    handleSearch('');
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
                  className="dark:text-white border border-white rounded-xl"
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
              </div>
              <ButtonUi
                theme={Colors.Primary}
                className="hidden mt-6 font-semibold md:flex border border-white"
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
                  onValueChange={(active) => setActive(active)}
                  isSelected={active}
                  classNames={{
                    thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                    wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                  }}
                >
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Mostrar {active ? 'inactivos' : 'activos'}
                  </span>
                </Switch>
              </div>
            </div>
            <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
              <div className="w-44">
                <label className="dark:text-white text-sm font-semibold">Mostrar</label>
                <Select
                  className="w-44 dark:text-white border border-white rounded-xl"
                  variant="bordered"
                  labelPlacement="outside"
                  defaultSelectedKeys={['5']}
                  classNames={{
                    label: 'font-semibold',
                  }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem className="dark:text-white" key={limit}>
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <ButtonGroup className="mt-4">
                <ButtonUi
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  isIconOnly
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  isIconOnly
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>
            </div>
          </div>

          {(view === 'grid' || view === 'list') && (
            <CardProduct
              actions={actionss}
              openEditModal={(user) => {
                setUser(user);
                modalUpdate.onOpen();
              }}
              DeletePopover={DeletePopUp}
              handleActivate={handleActivate}
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
                    <ThGlobal className="text-left p-3"></ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {users_paginated.users.length > 0 ? (
                    <>
                      {users_paginated.users.map((item) => (
                        <tr className="border-b border-slate-200">
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
                                    className="border border-white"
                                    onPress={() => {
                                      setUser(item);
                                      modalUpdate.onOpen();
                                    }}
                                    isIconOnly
                                    theme={Colors.Success}
                                  >
                                    <EditIcon size={20} />
                                  </ButtonUi>
                                </TooltipGlobal>
                              ) : (
                                <ButtonUi
                                  type="button"
                                  disabled
                                  theme={Colors.Secondary}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
                                >
                                  <Lock className="text-white" />
                                </ButtonUi>
                              )}
                              {item.active && actionss.includes('Cambiar Contraseña') ? (
                                <TooltipGlobal text="Cambiar contraseña">
                                  <ButtonUi
                                    className="border border-white"
                                    onPress={() => {
                                      setSelectedId(item.id);
                                      modalChangePassword.onOpen();
                                    }}
                                    isIconOnly
                                    theme={Colors.Warning}
                                  >
                                    <Key size={20} />
                                  </ButtonUi>
                                </TooltipGlobal>
                              ) : (
                                <ButtonUi
                                  type="button"
                                  disabled
                                  theme={Colors.Warning}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
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
                                  type="button"
                                  disabled
                                  theme={Colors.Warning}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
                                >
                                  <Lock className="text-white" />
                                </ButtonUi>
                              )}
                              {!item.active && (
                                <>
                                  {actionss.includes('Activar') ? (
                                    <TooltipGlobal text="Activar">
                                      <ButtonUi
                                        onPress={() => handleActivate(item.id)}
                                        isIconOnly
                                        theme={Colors.Info}
                                      >
                                        <RefreshCcw />
                                      </ButtonUi>
                                    </TooltipGlobal>
                                  ) : (
                                    <ButtonUi
                                      type="button"
                                      disabled
                                      theme={Colors.Info}
                                      className="flex font-semibold border border-white  cursor-not-allowed"
                                      isIconOnly
                                    >
                                      <Lock />
                                    </ButtonUi>
                                  )}
                                </>
                              )}
                              <TooltipGlobal text="Generar código">
                                <ButtonUi
                                  onPress={() => {
                                    setSelectedId(item.id);
                                    generateCodeModal.onOpen();
                                  }}
                                  isIconOnly
                                  theme={Colors.Info}
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
                          <img src={NO_DATA} alt="X" className="w-32 h-32" />
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
                  previousPage={users_paginated.prevPag}
                  nextPage={users_paginated.nextPag}
                  currentPage={users_paginated.currentPag}
                  totalPages={users_paginated.totalPag}
                  onPageChange={(page) => {
                    getUsersPaginated(
                      user?.correlative?.branch.transmitterId ??
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
                  handleNext={() => {
                    serPage(users_paginated.nextPag);
                    getUsersPaginated(
                      user?.correlative?.branch.transmitterId ??
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
                      user?.correlative?.branch.transmitterId ??
                        user?.pointOfSale?.branch.transmitterId ??
                        0,
                      users_paginated.prevPag,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0
                    );
                  }}
                  currentPage={users_paginated.currentPag}
                  totalPages={users_paginated.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          isOpen={modalAdd.isOpen}
          onClose={modalAdd.onClose}
          title="Agregar usuario"
          size="w-[350px] md:w-[550px]"
        >
          <AddUsers
            reload={() =>
              getUsersPaginated(
                user?.correlative?.branch.transmitterId ??
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
          onClose={modalChangePassword.onClose}
          title="Actualizar contraseña"
          size="w-[350px] md:w-[550px]"
        >
          <UpdatePassword id={selectId} closeModal={modalChangePassword.onClose} />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
          title="Editar usuario"
          size="w-[350px] md:w-[550px]"
        >
          <UpdateUsers
            reload={() =>
              getUsersPaginated(
                user?.correlative?.branch.transmitterId ??
                  user?.pointOfSale?.branch.transmitterId ??
                  0,
                1,
                limit,
                '',
                '',
                active ? 1 : 0
              )
            }
            onClose={modalUpdate.onClose}
            user={users}
          />
        </HeadlessModal>
        <HeadlessModal
          isOpen={generateCodeModal.isOpen}
          onClose={generateCodeModal.onClose}
          title="Generar código"
          size="w-[350px] md:w-[450px]"
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
        backdrop="blur"
        showArrow
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
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
                className="border border-white"
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
