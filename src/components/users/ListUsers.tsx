import { useContext, useEffect, useState } from 'react';
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
} from '@nextui-org/react';

import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
import {
  Key,
  Table as ITable,
  CreditCard,
  TrashIcon,
  List,
  EditIcon,
  RefreshCcw,
  Lock,
} from 'lucide-react';
import UpdatePassword from './UpdatePassword';
import { ThemeContext } from '../../hooks/useTheme';
import { ButtonGroup } from '@nextui-org/react';
import MobileView from './MobileView';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { User } from '../../types/users.types';
import { global_styles } from '../../styles/global.styles';
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
interface Props {
  actionss: string[];
}
function ListUsers({ actionss }: Props) {
  const { theme } = useContext(ThemeContext);
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
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
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
                    <AutocompleteItem className="dark:text-white" value={dep.id} key={dep.name}>
                      {dep.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="hidden mt-6 font-semibold md:flex border border-white"
                color="primary"
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
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
                    <SelectItem className="dark:text-white" key={limit} value={limit}>
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <ButtonGroup className="mt-4  xl:flex hidden border border-white rounded-xl">
                <Button
                  className="hidden md:inline-flex"
                  isIconOnly
                  color="secondary"
                  style={{
                    backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                    color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                  }}
                  onClick={() => setView('table')}
                >
                  <ITable />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                    color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
                  }}
                  onClick={() => setView('grid')}
                >
                  <CreditCard />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                    color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                  }}
                  onClick={() => setView('list')}
                >
                  <List />
                </Button>
              </ButtonGroup>
              <ButtonGroup className="mt-4 xl:hidden border border-white rounded-xl ">
                <Button
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                    color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
                  }}
                  onClick={() => setView('grid')}
                >
                  <CreditCard />
                </Button>
                <Button
                  isIconOnly
                  color="default"
                  style={{
                    backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                    color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                  }}
                  onClick={() => setView('list')}
                >
                  <List />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {(view === 'grid' || view === 'list') && (
            <MobileView
              deletePopover={DeletePopUp}
              openEditModal={(user) => {
                setUser(user);
                modalUpdate.onOpen();
              }}
              openKeyModal={(user) => {
                setSelectedId(user.id);
                modalChangePassword.onOpen();
              }}
              layout={view as 'grid' | 'list'}
              actions={actionss}
              handleActivate={handleActivate}
            />
          )}
          {view === 'table' && (
            <div className="overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      No.
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Nombre de usuario
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Rol
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
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
                                  <Button
                                    className="border border-white"
                                    onClick={() => {
                                      setUser(item);
                                      modalUpdate.onOpen();
                                    }}
                                    isIconOnly
                                    style={{
                                      backgroundColor: theme.colors.secondary,
                                    }}
                                  >
                                    <EditIcon style={{ color: theme.colors.primary }} size={20} />
                                  </Button>
                                </TooltipGlobal>
                              ) : (
                                <Button
                                  type="button"
                                  disabled
                                  style={{
                                    backgroundColor: theme.colors.secondary,
                                  }}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
                                >
                                  <Lock className="text-white" />
                                </Button>
                              )}
                              {item.active && actionss.includes('Cambiar Contraseña') ? (
                                <TooltipGlobal text="Cambiar contraseña">
                                  <Button
                                    className="border border-white"
                                    onClick={() => {
                                      setSelectedId(item.id);
                                      modalChangePassword.onOpen();
                                    }}
                                    isIconOnly
                                    style={{
                                      backgroundColor: theme.colors.warning,
                                    }}
                                  >
                                    <Key color={theme.colors.primary} size={20} />
                                  </Button>
                                </TooltipGlobal>
                              ) : (
                                <Button
                                  type="button"
                                  disabled
                                  style={{
                                    backgroundColor: theme.colors.warning,
                                  }}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
                                >
                                  <Lock className="text-white" />
                                </Button>
                              )}

                              {item.active && actionss.includes('Eliminar') ? (
                                <>
                                  <DeletePopUp user={item} />
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  disabled
                                  style={{
                                    backgroundColor: theme.colors.danger,
                                  }}
                                  className="flex font-semibold border border-white  cursor-not-allowed"
                                  isIconOnly
                                >
                                  <Lock className="text-white" />
                                </Button>
                              )}
                              {!item.active && (
                                <>
                                  {actionss.includes('Activar') ? (
                                    <TooltipGlobal text="Activar">
                                      <Button
                                        onClick={() => handleActivate(item.id)}
                                        isIconOnly
                                        style={global_styles().thirdStyle}
                                      >
                                        <RefreshCcw />
                                      </Button>
                                    </TooltipGlobal>
                                  ) : (
                                    <Button
                                      type="button"
                                      disabled
                                      style={global_styles().thirdStyle}
                                      className="flex font-semibold border border-white  cursor-not-allowed"
                                      isIconOnly
                                    >
                                      <Lock />
                                    </Button>
                                  )}
                                </>
                              )}
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
      </div>
    </>
  );
}
export default ListUsers;
interface PopProps {
  user: User;
}
export const DeletePopUp = ({ user }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { deleteUser } = useUsersStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    deleteUser(user.id);
    onClose();
  };

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button
            className="border border-white"
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <TooltipGlobal text="Eliminar">
              <TrashIcon
                style={{
                  color: theme.colors.primary,
                }}
                size={20}
              />
            </TooltipGlobal>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {user.userName}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4">
              <Button className="border border-white" onClick={onClose}>
                No, cancelar
              </Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5 border border-white"
                style={{
                  backgroundColor: theme.colors.danger,
                  color: theme.colors.primary,
                }}
              >
                Si, eliminar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
