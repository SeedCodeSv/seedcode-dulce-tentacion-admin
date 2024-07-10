import { useContext, useEffect, useMemo, useState } from 'react';
import { useEmployeeStore } from '../../store/employee.store';
import {
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Autocomplete,
  AutocompleteItem,
  Switch,
} from '@nextui-org/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import {
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  EditIcon,
  User,
  Phone,
  Filter,
  RefreshCcw,
} from 'lucide-react';
import { Employee, EmployeePayload } from '../../types/employees.types';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { ThemeContext } from '../../hooks/useTheme';
import MobileView from './MobileView';
import AddEmployee from './AddEmployee';
import { Drawer } from 'vaul';
import { global_styles } from '../../styles/global.styles';
import classNames from 'classnames';
import { useBranchesStore } from '../../store/branches.store';
import { Branches } from '../../types/branches.types';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import { useNavigate } from 'react-router';
import UpdateEmployee from './UpdateEmployee';

interface Props {
  actions: string[];
}

function ListEmployee({ actions }: Props) {
  const { theme, context } = useContext(ThemeContext);

  const { getEmployeesPaginated, employee_paginated, activateEmployee, loading_employees } =
    useEmployeeStore();

  const [firstName, setFirstName] = useState('');
  const [firstLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');
  const [limit, setLimit] = useState(5);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const [openVaul, setOpenVaul] = useState(false);
  const [active, setActive] = useState(true);

  const { getBranchesList, branch_list } = useBranchesStore();
  const modalAdd = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  const changePage = () => {
    getEmployeesPaginated(1, limit, firstName, firstLastName, branch, phone, active ? 1 : 0);
  };
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  useEffect(() => {
    getBranchesList();
    getEmployeesPaginated(1, limit, firstName, firstLastName, branch, phone, active ? 1 : 0);
  }, [limit, active]);

  const handleActivate = (id: number) => {
    activateEmployee(id).then(() => {
      getEmployeesPaginated(1, limit, '', '', '', '', active ? 1 : 0);
    });
  };
  const navigate = useNavigate();
  const filters = useMemo(() => {
    return (
      <>
        <Input
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          labelPlacement="outside"
          label="Nombre"
          className="w-full dark:text-white"
          placeholder="Buscar por nombre..."
          startContent={<User />}
          variant="bordered"
          name="searchName"
          id="searchName"
          value={firstName}
          autoComplete="search"
          onChange={(e) => setFirstName(e.target.value)}
          isClearable
          onClear={() => setFirstName('')}
        />
        <Input
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          labelPlacement="outside"
          label="Teléfono"
          placeholder="Buscar por teléfono..."
          startContent={<Phone size={20} />}
          className="w-full dark:text-white"
          variant="bordered"
          name="searchPhone"
          value={phone}
          id="searchPhone"
          onChange={(e) => setPhone(e.target.value)}
          isClearable
          onClear={() => setPhone('')}
        />
        <Autocomplete
          onSelectionChange={(key) => {
            if (key) {
              const branchSelected = JSON.parse(key as string) as Branches;
              setBranch(branchSelected.name);
            }
          }}
          className="w-full dark:text-white"
          label="Sucursal"
          labelPlacement="outside"
          placeholder="Selecciona una sucursal"
          variant="bordered"
          classNames={{
            base: 'font-semibold text-gray-500 text-sm',
          }}
          clearButtonProps={{
            onClick: () => setBranch(''),
          }}
        >
          {branch_list.map((bra) => (
            <AutocompleteItem
              value={bra.name}
              className="dark:text-white"
              key={JSON.stringify(bra)}
            >
              {bra.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </>
    );
  }, [firstName, setFirstName, phone, setPhone, branch, setBranch, branch_list]);

  //estado para capturar ;la data actualizada
  const [dataUpdate, setDataUpdate] = useState<EmployeePayload>({
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    bankAccount: '',
    chargeId: 0,
    nit: '',
    dui: '',
    isss: '',
    afp: '',
    code: '',
    phone: '',
    age: '',
    salary: '',
    dateOfBirth: '',
    dateOfEntry: '',
    dateOfExit: '',
    responsibleContact: '',
    statusId: 0,
    studyLevelId: 0,
    contractTypeId: 0,
    department: '',
    departmentName: '',
    municipality: '',
    municipalityName: '',
    complement: '',
    branchId: 0,
  });

  return (
    <>
      {dataUpdate.id ? (
        <UpdateEmployee
          id={(id) => setDataUpdate({ ...dataUpdate, id: id })}
          data={dataUpdate as unknown as Employee}
        />
      ) : (
        <>
          <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
            <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
              <div className="hidden w-full md:grid grid-cols-3 gap-5 mb-4">{filters}</div>
              <div className="grid w-full grid-cols-1 gap-5 mb-4 md:grid-cols-2">
                <div className="hidden md:flex">
                  <Button
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                    }}
                    className="px-10"
                    color="primary"
                    onClick={() => changePage()}
                  >
                    Buscar
                  </Button>
                </div>
                <div className="flex items-end justify-between gap-10 mt lg:justify-end">
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
                      <Drawer.Root
                        shouldScaleBackground
                        open={openVaul}
                        onClose={() => setOpenVaul(false)}
                      >
                        <Drawer.Trigger asChild>
                          <Button
                            style={global_styles().thirdStyle}
                            isIconOnly
                            onClick={() => setOpenVaul(true)}
                          >
                            <Filter />
                          </Button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                          <Drawer.Overlay
                            className="fixed inset-0 bg-black/40 z-[60]"
                            onClick={() => setOpenVaul(false)}
                          />
                          <Drawer.Content
                            className={classNames(
                              'bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0',
                              context === 'dark' ? 'dark' : ''
                            )}
                          >
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                              <Drawer.Title className="mb-4 dark:text-white font-medium">
                                Filtros disponibles
                              </Drawer.Title>
                              <div className="flex flex-col gap-3">
                                {filters}
                                <Button
                                  style={global_styles().secondaryStyle}
                                  className="mb-10 font-semibold"
                                  onClick={() => {
                                    changePage();
                                    setOpenVaul(false);
                                  }}
                                >
                                  Aplicar
                                </Button>
                              </div>
                            </div>
                          </Drawer.Content>
                        </Drawer.Portal>
                      </Drawer.Root>
                    </div>
                    {actions.includes('Agregar') && (
                      <AddButton
                        onClick={() => {
                          modalAdd.onOpen();
                          navigate('/AddEmployee');
                          setSelectedEmployee(undefined);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-end w-full mb-5 gap-5">
                <Select
                  className="w-44 dark:text-white"
                  variant="bordered"
                  label="Mostrar"
                  labelPlacement="outside"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((option) => (
                    <SelectItem key={option} value={option} className="dark:text-white">
                      {option}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex items-center">
                  <Switch onValueChange={(active) => setActive(active)} isSelected={active}>
                    <span className="text-sm sm:text-base whitespace-nowrap">
                      Mostrar {active ? 'inactivos' : 'activos'}
                    </span>
                  </Switch>
                </div>
              </div>
              {(view === 'grid' || view === 'list') && (
                <MobileView
                  deletePopover={DeletePopover}
                  openEditModal={(employee) => {
                    setSelectedEmployee(employee);
                    modalAdd.onOpen();
                  }}
                  layout={view as 'grid' | 'list'}
                  actions={actions}
                  handleActivate={handleActivate}
                />
              )}
              {view === 'table' && (
                <DataTable
                  className="shadow"
                  emptyMessage="No se encontraron resultados"
                  value={employee_paginated.employees}
                  tableStyle={{ minWidth: '50rem' }}
                  loading={loading_employees}
                >
                  <Column
                    headerClassName="text-sm font-semibold"
                    headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                    field="id"
                    header="No."
                  />
                  <Column
                    headerClassName="text-sm font-semibold"
                    field="firstName"
                    headerStyle={style}
                    header="Nombre"
                    body={(rowData) => `${rowData.firstName} ${rowData.firstLastName}`}
                  />
                  <Column
                    headerClassName="text-sm font-semibold"
                    headerStyle={style}
                    field="phone"
                    header="Teléfono"
                  />
                  <Column
                    headerClassName="text-sm font-semibold"
                    headerStyle={style}
                    field="branch.name"
                    header="Sucursal"
                  />
                  <Column
                    headerStyle={{ ...style, borderTopRightRadius: '10px' }}
                    header="Acciones"
                    body={(item) => (
                      <div className="flex w-full gap-5">
                        {actions.includes('Editar') && (
                          <Button
                            onClick={() => {
                              setDataUpdate(item);
                            }}
                            isIconOnly
                            style={{
                              backgroundColor: theme.colors.secondary,
                            }}
                          >
                            <EditIcon style={{ color: theme.colors.primary }} size={20} />
                          </Button>
                        )}
                        {actions.includes('Eliminar') && (
                          <>
                            {item.isActive ? (
                              <DeletePopover employee={item} />
                            ) : (
                              <Button
                                onClick={() => handleActivate(item.id)}
                                isIconOnly
                                style={global_styles().thirdStyle}
                              >
                                <RefreshCcw />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  />
                </DataTable>
              )}
              {employee_paginated.totalPag > 1 && (
                <>
                  <div className="hidden w-full mt-5 md:flex">
                    <Pagination
                      previousPage={employee_paginated.prevPag}
                      nextPage={employee_paginated.nextPag}
                      currentPage={employee_paginated.currentPag}
                      totalPages={employee_paginated.totalPag}
                      onPageChange={(page) => {
                        getEmployeesPaginated(
                          page,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          active ? 1 : 0
                        );
                      }}
                    />
                  </div>
                  <div className="flex w-full mt-5 md:hidden">
                    <div className="flex w-full mt-5 md:hidden">
                      <SmPagination
                        handleNext={() => {
                          getEmployeesPaginated(
                            employee_paginated.nextPag,
                            limit,
                            firstName,
                            firstLastName,
                            branch,
                            phone,
                            active ? 1 : 0
                          );
                        }}
                        handlePrev={() => {
                          getEmployeesPaginated(
                            employee_paginated.prevPag,
                            limit,
                            firstName,
                            firstLastName,
                            branch,
                            phone,
                            active ? 1 : 0
                          );
                        }}
                        currentPage={employee_paginated.currentPag}
                        totalPages={employee_paginated.totalPag}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <HeadlessModal
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            title={selectedEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            size="w-[350px] md:w-full"
          >
            <AddEmployee />
          </HeadlessModal>
        </>
      )}
    </>
  );
}
export default ListEmployee;

interface PopProps {
  employee: Employee;
}

export const DeletePopover = ({ employee }: PopProps) => {
  const { theme } = useContext(ThemeContext);

  const { deleteEmployee } = useEmployeeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
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
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {employee.firstName}
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4">
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
