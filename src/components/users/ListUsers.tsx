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
interface Props {
  actionss: string[];
}
function ListUsers({ actionss }: Props) {
  const { theme } = useContext(ThemeContext);
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated, activateUser } = useUsersStore();
  const [user, setUser] = useState<User | undefined>();
  const [active, setActive] = useState(true);
  const [page, serPage] = useState(1);
  const { roles_list, getRolesList } = useRolesStore();

  useEffect(() => {
    getUsersPaginated(1, limit, '', '', active ? 1 : 0);
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
    getUsersPaginated(page, limit, searchParam ?? userName, rol, active ? 1 : 0);
  };

  const handleActivate = (id: number) => {
    activateUser(id).then(() => {
      getUsersPaginated(1, limit, '', '', active ? 1 : 0);
    });
  };
  return (
    <>
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between items-end ">
            <SearchUser
              nameUser={(userName) => setUserName(userName)}
              nameRol={(rol) => setRol(rol)}
            ></SearchUser>
            {actionss.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
          </div>
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-5 gap-3">
              <Input
                startContent={<Search />}
                className=" dark:text-white"
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
                label="Rol"
                labelPlacement="outside"
                placeholder="Selecciona el rol"
                variant="bordered"
                className="dark:text-white"
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
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="hidden mt-6 font-semibold md:flex"
                color="primary"
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex justify-between justify-start order-2 lg:order-1">
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
            <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
              <Select
                className="w-44 dark:text-white"
                variant="bordered"
                label="Mostrar"
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
              <ButtonGroup className="mt-4">
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
                              {item.active && actionss.includes('Editar') && (
                                <TooltipGlobal text="Editar">
                                  <Button
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
                              )}
                              {item.active && actionss.includes('Cambiar Contraseña') && (
                                <TooltipGlobal text="Cambiar contraseña">
                                  <Button
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
                              )}
                              {/* {actions.includes('Eliminar') && <DeletePopUp user={item} />} */}
                              {actionss.includes('Eliminar') && (
                                <>
                                  {item.active ? (
                                    <DeletePopUp user={item} />
                                  ) : (
                                    <TooltipGlobal text="Activar">
                                      <Button
                                        onClick={() => handleActivate(item.id)}
                                        isIconOnly
                                        style={global_styles().thirdStyle}
                                      >
                                        <RefreshCcw />
                                      </Button>
                                    </TooltipGlobal>
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
                    getUsersPaginated(page, limit, userName, rol, active ? 1 : 0);
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  handleNext={() => {
                    serPage(users_paginated.nextPag);
                    getUsersPaginated(
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
          size="w-[350px] md:w-[500px]"
        >
          <AddUsers onClose={modalAdd.onClose} />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalChangePassword.isOpen}
          onClose={modalChangePassword.onClose}
          title="Actualizar contraseña"
          size="w-[350px] md:w-[500px]"
        >
          <UpdatePassword id={selectId} closeModal={modalChangePassword.onClose} />
        </HeadlessModal>
        <HeadlessModal
          isOpen={modalUpdate.isOpen}
          onClose={modalUpdate.onClose}
          title="Editar usuario"
          size="w-[350px] md:w-[500px]"
        >
          <UpdateUsers onClose={modalUpdate.onClose} user={user} />
        </HeadlessModal>
      </div>
    </>
  );
}

export default ListUsers;

interface PopProps {
  user: User;
}

const DeletePopUp = ({ user }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { deleteUser } = useUsersStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    deleteUser(user.id);
    onClose();
  };

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button
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
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {user.userName}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={onClose}>No, cancelar</Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5"
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
