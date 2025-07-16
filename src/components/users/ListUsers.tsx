import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react';
import { Key, EditIcon, RefreshCcw, RectangleEllipsis, Trash } from 'lucide-react';
import classNames from 'classnames';
import { Search } from 'lucide-react';

import { useUsersStore } from '../../store/users.store';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { User } from '../../types/users.types';
import { limit_options } from '../../utils/constants';
import HeadlessModal from '../global/HeadlessModal';

import AddUsers from './AddUsers';
import UpdateUsers from './UpdateUsers';
import UpdatePassword from './UpdatePassword';
import SearchUser from './search_user/SearchUser';
import GenerateCode from './GenerateCode';
import CardProduct from './MobileView';

import NO_DATA from '@/assets/svg/no_data.svg';
import { useRolesStore } from '@/store/roles.store';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import TdGlobal from '@/themes/ui/td-global';
import DisplayView from '@/themes/ui/display-view';
import useWindowSize from '@/hooks/useWindowSize';

interface Props {
  actions: string[];
}
function ListUsers({ actions }: Props) {
  const [limit, setLimit] = useState(5);
  const { users_paginated, getUsersPaginated, activateUser } = useUsersStore();
  const [users, setUser] = useState<User | undefined>();
  const [active, setActive] = useState(true);
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
  const { windowSize } = useWindowSize()
  const modalAdd = useDisclosure();
  const modalUpdate = useDisclosure();
  const modalChangePassword = useDisclosure();
  const generateCodeModal = useDisclosure();

  const [selectId, setSelectedId] = useState(0);

  const [view, setView] = useState<'table' | 'grid'>(
    windowSize.height < 768 ? 'grid' : 'table'
  )

  const [userName, setUserName] = useState('');
  const [rol, setRol] = useState('');

  const handleSearch = (searchParam: string | undefined) => {
    getUsersPaginated(
      user?.pointOfSale?.branch.transmitterId ?? 0,
      1,
      limit,
      searchParam ?? userName,
      rol,
      active ? 1 : 0
    );
  };

  const handleActivate = (id: number) => {
    activateUser(id).then(() => {
      getUsersPaginated(
        user?.pointOfSale?.branch?.transmitterId ?? 0,
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
      <DivGlobal>
        <div className="w-full h-full overflow-y-auto">

          <div className="hidden w-full gap-5 md:flex">
            <div className="flex items-end gap-5 w-full">
              <Input
                isClearable
                className=" dark:text-white"
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
                <Autocomplete
                  className="dark:text-white"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
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
                  onClear={() => {
                    setRol('');
                    handleSearch('');
                  }}
                  onSelectionChange={(value) => {
                    const selectRol = roles_list.find((rol) => rol?.name === value);

                    setRol(selectRol?.name ?? '');
                  }}
                >
                  {roles_list.map((dep) => (
                    <AutocompleteItem key={dep?.name} className="dark:text-white">
                      {dep?.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <ButtonUi
                className="hidden font-semibold md:flex"
                theme={Colors.Primary}
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="hidden md:flex  justify-start items-end">
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
            <div className="flex gap-10 w-full justify-between items-end">
              <div className="w-44">
                <Select
                  className="w-36 dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  label="Cantidad a mostrar"
                  labelPlacement="outside"
                  placeholder="Seleccione una opción"
                  selectedKeys={[limit]}
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

              <div className="flex gap-5 items-end">
                <div className='absolute left-44'>
                  {windowSize.width < 780 && (
                    <>
                      {actions.includes('Agregar') &&
                        <AddButton onClick={() => modalAdd.onOpen()} />
                      }
                    </>
                  )}
                </div>


                <DisplayView setView={setView} view={view} />
                <SearchUser
                  active={active}
                  nameRol={(rol) => setRol(rol)}
                  nameUser={(userName) => setUserName(userName)}
                  setActive={setActive}
                />
                {windowSize.width > 780 && (
                  <>
                    {actions.includes('Agregar') &&
                      <AddButton onClick={() => modalAdd.onOpen()} />
                    }
                  </>
                )}


              </div>
            </div>
          </div>

          {view === 'grid' && (
            <CardProduct
              DeletePopover={DeletePopUp}
              actions={actions}
              generateCodeModal={generateCodeModal}
              handleActivate={handleActivate}
              openEditModal={(user) => {
                setUser(user);
                modalUpdate.onOpen();
              }}
              openKeyModal={(user) => {
                setSelectedId(user.id);
                modalChangePassword.onOpen();
              }}
              setSelectedId={setSelectedId}
            />
          )}
          {view === 'table' && (
            <div className="overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full overflow-auto">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Usuario</ThGlobal>
                    <ThGlobal className="text-left p-3">Rol</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {users_paginated.users.length > 0 ? (
                    <>
                      {users_paginated.users.map((item, index) => (
                        <tr key={index}>
                          <TdGlobal className="p-3">{item.id}</TdGlobal>
                          <TdGlobal className="p-3">{item?.userName}</TdGlobal>
                          <TdGlobal className="p-3">{item?.role?.name}</TdGlobal>
                          <TdGlobal className="p-3">
                            <div className="flex w-full gap-5">
                              {item.active && actions.includes('Editar') && (
                                <ButtonUi
                                  isIconOnly
                                  showTooltip
                                  theme={Colors.Success}
                                  tooltipText="Editar"
                                  onPress={() => {
                                    setUser(item);
                                    modalUpdate.onOpen();
                                  }}
                                >
                                  <EditIcon size={20} />
                                </ButtonUi>
                              )}
                              {item.active && actions.includes('Cambiar Contraseña') && (
                                <ButtonUi
                                  isIconOnly
                                  showTooltip
                                  theme={Colors.Warning}
                                  tooltipText="Cambiar contraseña"
                                  onPress={() => {
                                    setSelectedId(item.id);
                                    modalChangePassword.onOpen();
                                  }}
                                >
                                  <Key size={20} />
                                </ButtonUi>
                              )}

                              {item.active && actions.includes('Eliminar') && (
                                <>
                                  <DeletePopUp user={item} />
                                </>
                              )}
                              {!item.active && (
                                <>
                                  {actions.includes('Activar') && (
                                    <ButtonUi
                                      isIconOnly
                                      showTooltip
                                      theme={Colors.Info}
                                      tooltipText="Activar"
                                      onPress={() => handleActivate(item.id)}
                                    >
                                      <RefreshCcw />
                                    </ButtonUi>
                                  )}
                                </>
                              )}
                              <ButtonUi
                                isIconOnly
                                showTooltip
                                theme={Colors.Info}
                                tooltipText="Generar código"
                                onPress={() => {
                                  setSelectedId(item.id);
                                  generateCodeModal.onOpen();
                                }}
                              >
                                <RectangleEllipsis />
                              </ButtonUi>
                            </div>
                          </TdGlobal>
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
            <Pagination
              currentPage={users_paginated.currentPag}
              nextPage={users_paginated.nextPag}
              previousPage={users_paginated.prevPag}
              totalPages={users_paginated.totalPag}
              onPageChange={(page) => {
                getUsersPaginated(
                  user?.pointOfSale?.branch.transmitterId ?? 0,
                  page,
                  limit,
                  userName,
                  rol,
                  active ? 1 : 0
                );
              }}
            />
          )}
        </div>
        <Modal isOpen={modalAdd.isOpen} title="Agregar usuario" onClose={modalAdd.onClose}>
          <ModalContent>
            <ModalHeader>Agregar usuario</ModalHeader>
            <ModalBody>
              <AddUsers
                reload={() =>
                  getUsersPaginated(
                    user?.pointOfSale?.branch.transmitterId ?? 0,
                    1,
                    limit,
                    '',
                    '',
                    active ? 1 : 0
                  )
                }
                onClose={modalAdd.onClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal {...modalChangePassword}>
          <ModalContent>
            <ModalHeader>Modificar contraseña</ModalHeader>
            <ModalBody>
              <UpdatePassword closeModal={modalChangePassword.onClose} id={selectId} />
            </ModalBody>
          </ModalContent>
        </Modal>

        <HeadlessModal
          isOpen={modalUpdate.isOpen}
          size="w-[350px] md:w-[550px]"
          title="Editar usuario"
          onClose={modalUpdate.onClose}
        >
          <UpdateUsers
            reload={() =>
              getUsersPaginated(
                user?.pointOfSale?.branch.transmitterId ?? 0,
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
      </DivGlobal>
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
