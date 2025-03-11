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
import NO_DATA from '@/assets/svg/no_data.svg';
import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import HeadlessModal from '../../global/HeadlessModal';
import { limit_options } from '../../../utils/constants';
import { useStatusEmployeeStore } from '../../../store/statusEmployee';
import AddStatusEmployee from './AddStatusEmployee';
import { statusEmployee } from '../../../types/statusEmployee.types';
import BottomDrawer from '@/components/global/BottomDrawer';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';

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
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="grid w-full grid-cols-2 gap-5 md:flex">
          <div className="w-full flex gap-4">
            <Input
              startContent={<User />}
              className="w-full xl:w-96 dark:text-white hidden md:flex"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                setSearch('');
                handleSearch('');
              }}
            />
            <ButtonUi
              theme={Colors.Primary}
              className="mt-6 font-semibold hidden md:flex"
              color="primary"
              startContent={<SearchIcon size={15} />}
              onPress={() => handleSearch(undefined)}
            >
              Buscar
            </ButtonUi>
          </div>

          <div className="flex mt-6 justify-between">
            <div className="md:hidden justify-start">
              <ButtonUi
                theme={Colors.Info}
                isIconOnly
                onPress={() => setOpenVaul(true)}
                type="button"
              >
                <Filter />
              </ButtonUi>
              <BottomDrawer
                open={openVaul}
                onClose={() => setOpenVaul(false)}
                title="Filtros disponibles"
              >
                <div className="flex flex-col  gap-2">
                  <Input
                    startContent={<User />}
                    className="w-full xl:w-96 dark:text-white border border-white rounded-xl"
                    variant="bordered"
                    labelPlacement="outside"
                    label="Nombre"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Escribe para buscar..."
                    isClearable
                    onClear={() => {
                      setSearch('');
                      handleSearch('');
                    }}
                  />
                  <ButtonUi
                    theme={Colors.Primary}
                    className="mt-6 font-semibold"
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
                onValueChange={(isActive) => setActive(isActive)}
                isSelected={isActive}
                classNames={{
                  thumb: classNames(isActive ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(isActive ? '!bg-blue-300' : 'bg-gray-200'),
                }}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {isActive ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
            <div className="w-[150px]">
              <label className="  font-semibold text-white text-sm">Mostrar</label>
              <Select
                className="max-w-44 dark:text-white border border-white rounded-xl "
                variant="bordered"
                defaultSelectedKeys={['5']}
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold',
                }}
                value={limit}
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
          <div className="flex items-center"></div>
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
                    <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader"></div>
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginated_status_employee.employeeStatus.length > 0 ? (
                      <>
                        {paginated_status_employee.employeeStatus.map((employeeStatus) => (
                          <tr className="border-b border-slate-200">
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
                                    onPress={() => {
                                      handleEdit(employeeStatus);
                                      modalAdd.onOpen();
                                    }}
                                    isIconOnly
                                    theme={Colors.Success}
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
                                        onPress={() => handleActivate(employeeStatus.id)}
                                        isIconOnly
                                        theme={Colors.Primary}
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
                            <img src={NO_DATA} alt="X" className="w-32 h-32" />
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
                previousPage={paginated_status_employee.prevPag}
                nextPage={paginated_status_employee.nextPag}
                currentPage={paginated_status_employee.currentPag}
                totalPages={paginated_status_employee.totalPag}
                onPageChange={(page) => {
                  getPaginatedStatusEmployee(page, limit, search);
                }}
              />
            </div>
          </>
        )}
      </div>
      <HeadlessModal
        size="w-[350px] md:w-[500px]"
        title={selectedStatusEmployee ? 'Editar estado de empleado' : 'Nuevo estado de empleado'}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddStatusEmployee closeModal={modalAdd.onClose} statusEmployees={selectedStatusEmployee} />
      </HeadlessModal>
    </div>
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
      <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button onPress={onOpen} isIconOnly style={style}>
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
              <ButtonUi onPress={() => handleDelete()} className="ml-5" theme={Colors.Error}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
