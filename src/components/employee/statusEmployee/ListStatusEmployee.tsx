import {
  Input,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { EditIcon, User, TrashIcon, Filter, RefreshCcw, SearchIcon } from 'lucide-react';
import classNames from 'classnames';

import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import HeadlessModal from '../../global/HeadlessModal';
import { limit_options } from '../../../utils/constants';
import { useStatusEmployeeStore } from '../../../store/statusEmployee';
import { statusEmployee } from '../../../types/statusEmployee.types';

import AddStatusEmployee from './AddStatusEmployee';

import NO_DATA from '@/assets/svg/no_data.svg';
import BottomDrawer from '@/components/global/BottomDrawer';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';

function ListStatusEmployee({ actions }: ArrayAction) {
  const [openVaul, setOpenVaul] = useState(false);

  const {
    paginated_status_employee,
    activateStatusEmployee,
    getPaginatedStatusEmployee,
    loading_status_employee,
  } = useStatusEmployeeStore();

  const [selectedStatusEmployee, setSelectedStatusEmployee] = useState<
    { id: number; name: string } | undefined
  >();

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    getPaginatedStatusEmployee(1, limit, search, isActive ? 1 : 0);
  }, [limit, isActive]);

  const handleSearch = (name: string | undefined) => {
    getPaginatedStatusEmployee(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  const handleEdit = (item: statusEmployee) => {
    setSelectedStatusEmployee({
      id: item.id,
      name: item.name,
    });
    modalAdd.onOpen();
  };

  const handleActivate = (id: number) => {
    activateStatusEmployee(id).then(() => {
      getPaginatedStatusEmployee(1, limit, search, isActive ? 1 : 0);
    });
  };

  return (
   <DivGlobal>
        <div className="grid w-full grid-cols-2 gap-5 md:flex">
          <div className="w-full flex gap-4">
            <Input
              isClearable
              className="w-full xl:w-96 dark:text-white hidden md:flex"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<User />}
              value={search}
              variant="bordered"
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => {
                setSearch('');
                handleSearch('');
              }}
            />
            <ButtonUi
              className="mt-6 font-semibold hidden md:flex"
              color="primary"
              startContent={<SearchIcon size={15} />}
              theme={Colors.Primary}
              onPress={() => handleSearch(undefined)}
            >
              Buscar
            </ButtonUi>
          </div>

          <div className="flex mt-6 justify-between">
            <div className="md:hidden justify-start">
              <ButtonUi
                isIconOnly
                theme={Colors.Info}
                type="button"
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
                    className="w-full xl:w-96 dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Escribe para buscar..."
                    startContent={<User />}
                    value={search}
                    variant="bordered"
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => {
                      setSearch('');
                      handleSearch('');
                    }}
                  />
                  <ButtonUi
                    className="mt-6 font-semibold"
                    theme={Colors.Primary}
                    onPress={() => {
                      handleSearch(undefined);
                      setOpenVaul(false);
                    }}
                  >
                    Aplicar filtros
                  </ButtonUi>
                </div>
              </BottomDrawer>
            </div>
            <div className="justify-end">
              {actions.includes('Agregar') && (
                <AddButton
                  onClick={() => {
                    setSelectedStatusEmployee(undefined);
                    modalAdd.onOpen();
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex justify-start order-2 lg:order-1">
            <div className="xl:mt-10">
              <Switch
                classNames={{
                  thumb: classNames(isActive ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(isActive ? '!bg-blue-300' : 'bg-gray-200'),
                }}
                isSelected={isActive}
                onValueChange={(isActive) => setActive(isActive)}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {isActive ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
            <div className="w-[150px]">
              <span className="  font-semibold text-white text-sm">Mostrar</span>
              <Select
                className="max-w-44 dark:text-white border border-white rounded-xl "
                classNames={{
                  label: 'font-semibold',
                }}
                defaultSelectedKeys={['5']}
                labelPlacement="outside"
                value={limit}
                variant="bordered"
                onChange={(e) => {
                  setLimit(Number(e.target.value !== '' ? e.target.value : '8'));
                }}
              >
                {limit_options.map((option) => (
                  <SelectItem key={option} className="dark:text-white">
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-end w-full mb-4 gap-5">
          <div className="flex items-center" />
        </div>
        <>
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">No.</ThGlobal>
                  <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                  <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading_status_employee ? (
                  <tr>
                    <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader" />
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginated_status_employee.employeeStatus.length > 0 ? (
                      <>
                        {paginated_status_employee.employeeStatus.map((employeeStatus, index) => (
                          <tr key={index} className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {employeeStatus.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                              {employeeStatus.name}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              <div className="flex w-full gap-5">
                                {actions.includes('Editar') && employeeStatus.isActive && (
                                  <ButtonUi
                                    isIconOnly
                                    theme={Colors.Success}
                                    onPress={() => {
                                      handleEdit(employeeStatus);
                                      modalAdd.onOpen();
                                    }}
                                  >
                                    <EditIcon size={20} />
                                  </ButtonUi>
                                )}
                                {actions.includes('Eliminar') && employeeStatus.isActive && (
                                  <DeletePopUp statusEmployees={employeeStatus} />
                                )}
                                {employeeStatus.isActive === false && (
                                  <>
                                    {actions.includes('Activar') && (
                                      <ButtonUi
                                        isIconOnly
                                        theme={Colors.Primary}
                                        onPress={() => handleActivate(employeeStatus.id)}
                                      >
                                        <RefreshCcw />
                                      </ButtonUi>
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
                            <img alt="X" className="w-32 h-32" src={NO_DATA} />
                            <p className="mt-3 text-xl">No se encontraron resultados</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>

        {paginated_status_employee.totalPag > 1 && (
          <>
            <div className=" w-full mt-5 ">
              <Pagination
                currentPage={paginated_status_employee.currentPag}
                nextPage={paginated_status_employee.nextPag}
                previousPage={paginated_status_employee.prevPag}
                totalPages={paginated_status_employee.totalPag}
                onPageChange={(page) => {
                  getPaginatedStatusEmployee(page, limit, search);
                }}
              />
            </div>
          </>
        )}
      <HeadlessModal
        isOpen={modalAdd.isOpen}
        size="w-[350px] md:w-[500px]"
        title={selectedStatusEmployee ? 'Editar estado de empleado' : 'Nuevo estado de empleado'}
        onClose={modalAdd.onClose}
      >
        <AddStatusEmployee closeModal={modalAdd.onClose} statusEmployees={selectedStatusEmployee} />
      </HeadlessModal>
    </DivGlobal>
  );
}

export default ListStatusEmployee;
interface Props {
  statusEmployees: statusEmployee;
}

const DeletePopUp = ({ statusEmployees }: Props) => {
  const { deleteStatuEmployee } = useStatusEmployeeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteStatuEmployee(statusEmployees.id);
    onClose();
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover showArrow backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button isIconOnly style={style} onPress={onOpen}>
            <TrashIcon size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5 flex flex-col items-center justify-cente">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {statusEmployees.name}
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4 flex justify-center">
              <ButtonUi theme={Colors.Default} onPress={onClose}>
                No, cancelar
              </ButtonUi>
              <ButtonUi className="ml-5" theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
