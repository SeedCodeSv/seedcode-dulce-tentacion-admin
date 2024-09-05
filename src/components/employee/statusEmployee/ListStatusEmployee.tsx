import {
  Input,
  Button,
  useDisclosure,
  ButtonGroup,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
  RefreshCcw,
  SearchIcon,
  Lock,
} from 'lucide-react';
import classNames from 'classnames';
import NO_DATA from '@/assets/svg/no_data.svg';
import { ThemeContext } from '../../../hooks/useTheme';
import { global_styles } from '../../../styles/global.styles';
import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import HeadlessModal from '../../global/HeadlessModal';
import SmPagination from '../../global/SmPagination';
import { limit_options } from '../../../utils/constants';
import { useStatusEmployeeStore } from '../../../store/statusEmployee';
import AddStatusEmployee from './AddStatusEmployee';
import { statusEmployee } from '../../../types/statusEmployee.types';
import MobileView from './MobileView';
import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ArrayAction } from '@/types/view.types';
import NotAddButton from '@/components/global/NoAdd';
import useWindowSize from '@/hooks/useWindowSize';

function ListStatusEmployee({ actions }: ArrayAction) {
  const { theme } = useContext(ThemeContext);
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

  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  // const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

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
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
              className="mt-6 font-semibold hidden md:flex"
              color="primary"
              startContent={<SearchIcon size={15} />}
              onClick={() => handleSearch(undefined)}
            >
              Buscar
            </Button>
          </div>

          <div className="flex mt-6 justify-between">
            <div className="md:hidden justify-start">
              <TooltipGlobal text="Filtrar">
                <Button
                  className="border border-white"
                  style={global_styles().thirdStyle}
                  isIconOnly
                  onClick={() => setOpenVaul(true)}
                  type="button"
                >
                  <Filter />
                </Button>
              </TooltipGlobal>
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
                  <Button
                    className="mt-6 font-semibold"
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      fontSize: '16px',
                    }}
                    onClick={() => {
                      handleSearch(undefined);
                      setOpenVaul(false);
                    }}
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </BottomDrawer>
            </div>
            <div className="justify-end">
              {actions.includes('Agregar') ? (
                <AddButton
                  onClick={() => {
                    setSelectedStatusEmployee(undefined);
                    modalAdd.onOpen();
                  }}
                />
              ) : (
                <NotAddButton></NotAddButton>
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
                  <SelectItem key={option} value={option} className="dark:text-white">
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <ButtonGroup className="xl:flex hidden mt-4 border border-white rounded-xl ">
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
            <ButtonGroup className=" xl:hidden mt-4 border border-white rounded-xl ">
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

        <div className="flex justify-end items-end w-full mb-4 gap-5">
          <div className="flex items-center"></div>
        </div>
        {(view === 'grid' || view === 'list') && (
          <MobileView
            handleActive={handleActivate}
            deletePopover={DeletePopUp}
            layout={view as 'grid' | 'list'}
            handleEdit={handleEdit}
            actions={actions}
          />
        )}
        {view === 'table' && (
          <>
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      No.
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Nombre
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
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
                                  {actions.includes('Editar') && employeeStatus.isActive ? (
                                    <TooltipGlobal text="Editar">
                                      <Button
                                        onClick={() => {
                                          handleEdit(employeeStatus);

                                          modalAdd.onOpen();
                                        }}
                                        isIconOnly
                                        style={{
                                          backgroundColor: theme.colors.secondary,
                                        }}
                                      >
                                        <EditIcon
                                          style={{
                                            color: theme.colors.primary,
                                          }}
                                          size={20}
                                        />
                                      </Button>
                                    </TooltipGlobal>
                                  ) : (
                                    <Button
                                      isIconOnly
                                      style={{
                                        backgroundColor: theme.colors.secondary,
                                        cursor: 'not-allowed',
                                      }}
                                    >
                                      <Lock style={{ color: theme.colors.primary }} size={20} />
                                    </Button>
                                  )}
                                  {actions.includes('Eliminar') && employeeStatus.isActive ? (
                                    <DeletePopUp statusEmployees={employeeStatus} />
                                  ) : (
                                    <Button
                                      isIconOnly
                                      style={{ backgroundColor: theme.colors.danger }}
                                    >
                                      <Lock
                                        style={{
                                          color: theme.colors.primary,
                                          cursor: 'not-allowed',
                                        }}
                                        size={20}
                                      />
                                    </Button>
                                  )}
                                  {employeeStatus.isActive === false && (
                                    <>
                                      {actions.includes('Activar') ? (
                                        <TooltipGlobal text="Activar">
                                          <Button
                                            onClick={() => handleActivate(employeeStatus.id)}
                                            isIconOnly
                                            style={global_styles().thirdStyle}
                                          >
                                            <RefreshCcw />
                                          </Button>
                                        </TooltipGlobal>
                                      ) : (
                                        <Button
                                          isIconOnly
                                          style={{
                                            ...global_styles().thirdStyle,
                                            cursor: 'not-allowed',
                                          }}
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
        )}
        {paginated_status_employee.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
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
            <div className="flex w-full mt-5 md:hidden">
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    getPaginatedStatusEmployee(paginated_status_employee.nextPag, limit, search);
                  }}
                  handlePrev={() => {
                    getPaginatedStatusEmployee(paginated_status_employee.prevPag, limit, search);
                  }}
                  currentPage={paginated_status_employee.currentPag}
                  totalPages={paginated_status_employee.totalPag}
                />
              </div>
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
  const { theme } = useContext(ThemeContext);

  const { deleteStatuEmployee } = useStatusEmployeeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteStatuEmployee(statusEmployees.id);
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
            <TrashIcon
              style={{
                color: theme.colors.primary,
              }}
              size={20}
            />
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
