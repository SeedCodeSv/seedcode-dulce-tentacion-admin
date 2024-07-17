import { useContext, useEffect, useState } from 'react';
import { useUsersStore } from '../../store/users.store';
import {
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
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
import {
  Key,
  Table as ITable,
  CreditCard,
  TrashIcon,
  List,
  EditIcon,
  Filter,
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
import BottomDrawer from '../global/BottomDrawer';
import NO_DATA from "@/assets/svg/no_data.svg";

interface Props {
  actions: string[];
}

function ListUsers({ actions }: Props) {
  const { theme } = useContext(ThemeContext);
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated } = useUsersStore();
  const [user, setUser] = useState<User | undefined>();
  const [active, setActive] = useState(true);
  const [page, serPage] = useState(1);

  useEffect(() => {
    getUsersPaginated(1, limit, '', '', active ? 1 : 0);
  }, [limit, active]);

  const modalAdd = useDisclosure();
  const modalUpdate = useDisclosure();
  const modalChangePassword = useDisclosure();

  const [selectId, setSelectedId] = useState(0);

  // const style = {
  //   backgroundColor: theme.colors.dark,
  //   color: theme.colors.primary,
  // };
  const { windowSize } = useWindowSize();

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const [userName, setUserName] = useState('');
  const [rol, setRol] = useState('')

  const handleSearch = (searchParam: string | undefined) => {
    getUsersPaginated(page, limit, searchParam ?? userName, rol, active ? 1 : 0);
  };

  const [openVaul, setOpenVaul] = useState(false);

  // const emptyMessage = (
  //   <div className="flex flex-col items-center justify-center w-full">
  //     <img
  //       src={NO_DATA}
  //       alt="No data"
  //       className="w-32 h-32"
  //     />
  //     <p className="mt-3 text-xl dark:text-white">
  //       No se encontraron resultados
  //     </p>
  //   </div>
  // );

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
      <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
      <div className="flex flex-col justify-between w-full gap-5 lg:flex-row lg:gap-0">
            <div className="hidden w-full gap-5 md:flex">
              <div className="w-1/2">
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
              </div>
              <div className="w-1/2">
                <Input
                  startContent={<Search />}
                  className=" dark:text-white"
                  variant="bordered"
                  labelPlacement="outside"
                  label="Rol"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  placeholder="Escribe para buscar..."
                  isClearable
                  onClear={() => {
                    setRol('');
                    handleSearch('');
                  }}
                />
              </div>
              <div className="w-1/2 mt-6">
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                  }}
                  className="font-semibold"
                  color="primary"
                  onClick={() => handleSearch(undefined)}
                >
                  Buscar
                </Button>
              </div>
            </div>
            <div className="flex items-end justify-between gap-10 lg:justify-end">
              <ButtonGroup>
                <Button
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
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                
                    <TooltipGlobal text="Buscar por filtros" color="primary">
                      <Button
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
                          <div className="flex flex-col gap-3">
                            <div className="w-full">
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
                            </div>
                            <div className="w-full">
                              <Input
                                startContent={<Search />}
                                className=" dark:text-white"
                                variant="bordered"
                                labelPlacement="outside"
                                label="Rol"
                                classNames={{
                                  label: 'font-semibold text-gray-700',
                                  inputWrapper: 'pr-0',
                                }}
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                placeholder="Escribe para buscar..."
                                isClearable
                                onClear={() => {
                                  setRol('');
                                  handleSearch('');
                                }}
                              />
                            </div>
                            <Button
                              style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.primary,
                                fontSize: '16px', 
                              }}
                              className="mb-10 font-semibold"
                              color="primary"
                              onClick={() => {
                                handleSearch(undefined);
                                setOpenVaul(false);
                              }}
                            >
                              Buscar
                            </Button>
                          </div>
                       </BottomDrawer>
                </div>
              {actions.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
              </div>
            </div>
          </div>
          <div className="flex justify-between md:justify-end items-end gap-5 w-full pt-4 mb-5">
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
            <div className="flex items-center">
              <Switch onValueChange={(active) => setActive(active)} isSelected={active}
                classNames={{
                  thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                }}>
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {active ? 'inactivos' : 'activos'}
                </span>
              </Switch>
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
              actions={actions}
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
                                 {actions.includes('Editar') && (
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
                      {actions.includes('Cambiar Contraseña') && (
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
                        </Button></TooltipGlobal>
                      )}
                      {actions.includes('Eliminar') && <DeletePopUp user={item} />}
                                 </div>
                               </td>
                             </tr>
                           ))}
                         </>
                       ) : (
                         <tr>
                           <td colSpan={5}>
                             <div className="flex flex-col items-center justify-center w-full">
                               <img
                                 src={NO_DATA}
                                 alt="X"
                                 className="w-32 h-32"
                               />
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
            // <DataTable
            //   className="shadow dark:text-white w-full"
            //   emptyMessage={emptyMessage}
            //   value={users_paginated.users}
            //   tableStyle={{ minWidth: '50rem' }}
            // >
            //   <Column
            //     headerClassName="text-sm font-semibold"
            //     headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
            //     field="id"
            //     header="No."
            //     className='dark:text-white'
            //   />
            //   {/* <Column
            //     headerClassName="text-sm font-semibold"
            //     headerStyle={style}
            //     field="employee.fullName"
            //     header="Empleado"
            //     className='dark:text-white'
            //   /> */}
            //   <Column
            //     headerClassName="text-sm font-semibold"
            //     headerStyle={style}
            //     field="userName"
            //     header="Nombre de usuario"
            //     className='dark:text-white'
            //   />
            //   <Column
            //     headerClassName="text-sm font-semibold"
            //     headerStyle={style}
            //     field="role.name"
            //     header="Rol"
            //     className='dark:text-white'
            //   />
            //   <Column
            //     headerStyle={{ ...style, borderTopRightRadius: '10px' }}
            //     header="Acciones"
            //     body={(item) => (
            //       <div className="flex w-full gap-5">
            //         {actions.includes('Editar') && (
            //           <TooltipGlobal text="Editar">
            //           <Button
            //             onClick={() => {
            //               setUser(item);
            //               modalUpdate.onOpen();
            //             }}
            //             isIconOnly
            //             style={{
            //               backgroundColor: theme.colors.secondary,
            //             }}
            //           >
            //             <EditIcon style={{ color: theme.colors.primary }} size={20} />
            //           </Button>
            //           </TooltipGlobal>
            //         )}
            //         {actions.includes('Cambiar Contraseña') && (
            //            <TooltipGlobal text="Cambiar contraseña">
            //           <Button
            //             onClick={() => {
            //               setSelectedId(item.id);
            //               modalChangePassword.onOpen();
            //             }}
            //             isIconOnly
            //             style={{
            //               backgroundColor: theme.colors.warning,
            //             }}
            //           >
            //             <Key color={theme.colors.primary} size={20} />
            //           </Button></TooltipGlobal>
            //         )}
            //         {actions.includes('Eliminar') && <DeletePopUp user={item} />}
            //       </div>
            //     )}
            //   />
            // </DataTable>
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
              <div className="flex w-full mt-5 md:hidden">
              <SmPagination
                  handleNext={() => {
                    serPage(users_paginated.nextPag);
                    getUsersPaginated(
                      users_paginated.nextPag,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0,
                    );
                  }}
                  handlePrev={() => {
                    serPage(users_paginated.prevPag);
                    getUsersPaginated(
                      users_paginated.prevPag,
                      limit,
                      userName,
                      rol,
                      active ? 1 : 0,
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
