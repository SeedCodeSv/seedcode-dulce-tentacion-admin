import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Autocomplete,
  AutocompleteItem,
  Switch,
} from '@heroui/react';
import {
  EditIcon,
  User,
  Phone,
  RefreshCcw,
  ScanBarcode,
  Store,
  Trash,
  RectangleEllipsis,
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

import { useEmployeeStore } from '../../store/employee.store';
import { Employee, EmployeePayload, IResponseCodes } from '../../types/employees.types';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { useBranchesStore } from '../../store/branches.store';
import { limit_options } from '../../utils/constants';
import HeadlessModal from '../global/HeadlessModal';
import RenderViewButton from '../global/render-view-button';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';

import MobileView from './MobileView';
import UpdateEmployee from './update-employee';
import ProofSalary from './employees-pdfs/ProofSalary';
import ProofeOfEmployment from './employees-pdfs/ProofeOfEmployment';
import ContractPdf from './../employee/employees-pdfs/pdfContract';
import GenerateCodeEmployee from './GenerateCode';
import { ChangePageParams } from './types/mobile-view.types';

import useWindowSize from '@/hooks/useWindowSize';
import { useAuthStore } from '@/store/auth.store';
import { fechaActualString } from '@/utils/dates';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import { TableComponent } from '@/themes/ui/table-ui';
import DivGlobal from '@/themes/ui/div-global';
import { get_codes_employees } from '@/services/employess.service';


interface Props {
  actions: string[];
}

function ListEmployee({ actions }: Props) {
  const { user } = useAuthStore();
  const { getEmployeesPaginated, employee_paginated, activateEmployee, loading_employees } =
    useEmployeeStore();
  const [params, setParams] = useState({
    startDate: fechaActualString,
    endDate: fechaActualString,
    firstName: '',
    branch: '',
    phone: '',
    limit: 5,
    codeEmployee: '',
  });
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const [active, setActive] = useState(true);

  const { getBranchesList, branch_list } = useBranchesStore();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [selectId, setSelectedId] = useState(0);
  const [codes, setCodes] = useState<IResponseCodes>()

  const [isDate, setDate] = useState(false);
  const changePage = ({
    page,
    name,
    firstLastName: fln,
    branch: br,
    phone: ph,
    codeEmployee: ce,
    active: isActive,
    isDate: useDate,
    startDate: sd,
    endDate: ed,
  }: ChangePageParams = {}) => {
    getEmployeesPaginated(
      Number(user?.pointOfSale?.branch.transmitterId ?? 0),
      page ?? 1,
      params.limit,
      name ?? params.firstName,
      fln ?? '',
      br ?? params.branch,
      ph ?? params.phone,
      ce ?? params.codeEmployee,
      (isActive ?? active) ? 1 : 0,
      (useDate ?? isDate) ? (sd ?? params.startDate) : '',
      (useDate ?? isDate) ? (ed ?? params.endDate) : ''
    );
  };

  useEffect(() => {
    getBranchesList();
    changePage()
  }, [params.limit, active]);

  const handleActivate = (id: number) => {
    activateEmployee(id).then(() => {
      changePage()
    });
  };
  const navigate = useNavigate();
  const generateCodeModal = useDisclosure()
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
    // addressId: 0,
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
          data={dataUpdate as unknown as Employee}
          id={(id) => setDataUpdate({ ...dataUpdate, id: id })}
        />
      ) : (
        <>
          <DivGlobal>
            <div className="flex lg:flex-col-reverse justify-between items-end ">
              <ResponsiveFilterWrapper classButtonLg='col-start-4 justify-self-end w-1/2' classLg='grid grid-cols-4 gap-4 w-full items-end' onApply={() => changePage()}>
                <Input
                  isClearable
                  autoComplete="search"
                  className="w-full dark:text-white border border-white rounded-xl"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  id="searchName"
                  label="Nombre"
                  labelPlacement="outside"
                  name="searchName"
                  placeholder="Buscar por nombre..."
                  startContent={<User />}
                  value={params.firstName}
                  variant="bordered"
                  onChange={(e) => setParams({ ...params, firstName: e.target.value })}
                  onClear={() => {
                    setParams({ ...params, firstName: '' });
                    changePage({ name: '' })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      changePage();
                    }
                  }}
                />

                <Input
                  isClearable
                  autoComplete="search"
                  className="w-full dark:text-white border border-white rounded-xl"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  id="searchNameCodeEmployee"
                  label="Código"
                  labelPlacement="outside"
                  name="searchCodeEmployee"
                  placeholder="Buscar por código..."
                  startContent={<ScanBarcode />}
                  value={params.codeEmployee}
                  variant="bordered"
                  onChange={(e) => setParams({ ...params, codeEmployee: e.target.value })}
                  onClear={() => {
                    setParams({ ...params, codeEmployee: '' })
                    changePage({ codeEmployee: '' });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      changePage();
                    }
                  }}
                />
                <Input
                  isClearable
                  className="w-full dark:text-white border border-white rounded-xl"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  id="searchPhone"
                  label="Teléfono"
                  labelPlacement="outside"
                  name="searchPhone"
                  placeholder="Buscar por teléfono..."
                  startContent={<Phone size={20} />}
                  value={params.phone}
                  variant="bordered"
                  onChange={(e) => setParams({ ...params, phone: e.target.value })}
                  onClear={() => {
                    setParams({ ...params, phone: '' })
                    changePage({ phone: '' })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      changePage();
                    }
                  }}
                />

                <div className="w-full">
                  <span className="font-semibold dark:text-white text-sm">Sucursal</span>
                  <Autocomplete
                    className="w-full dark:text-white border border-white rounded-xl"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    clearButtonProps={{
                      onClick: () => {
                        setParams({ ...params, branch: '' })
                        changePage({ branch: '' })
                      },
                    }}
                    defaultSelectedKey={params.branch}
                    labelPlacement="outside"
                    placeholder="Selecciona una sucursal"
                    startContent={<Store />}
                    variant="bordered"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        changePage();
                      }
                    }}
                    onSelectionChange={(key) => {
                      if (key) {
                        setParams({ ...params, branch: key as string })
                      }
                    }}
                  >
                    {branch_list.map((bra) => (
                      <AutocompleteItem key={bra.name} className="dark:text-white">
                        {bra.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                {isDate && (
                  <>
                    <div>
                      <span className="font-semibold dark:text-white text-sm">
                        Fecha Inicial
                      </span>

                      <Input
                        className="w-full dark:text-white  rounded-xl border border-white"
                        classNames={{
                          base: 'font-semibold dark:text-white text-sm',
                          label: 'font-semibold dark:text-white text-sm',
                        }}
                        defaultValue={params.startDate}
                        labelPlacement="outside"
                        type="date"
                        variant="bordered"
                        onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <span className="font-semibold dark:text-white text-sm">Fecha Final</span>
                      <Input
                        className="w-full dark:text-white  rounded-xl border border-white"
                        classNames={{
                          base: 'font-semibold dark:text-white text-sm',
                          label: 'font-semibold dark:text-white text-sm',
                        }}
                        defaultValue={params.endDate}
                        labelPlacement="outside"
                        type="date"
                        variant="bordered"
                        onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <ButtonUi
                  className="hidden font-semibold md:flex border border-white"
                  theme={Colors.Primary}
                  onPress={() => setDate(!isDate)}
                >
                  Filtrar Fechas
                </ButtonUi>
              </ResponsiveFilterWrapper>
              {actions.includes('Agregar') && (
                <AddButton
                  onClick={() => {
                    navigate('/add-employee');
                    setSelectedEmployee(undefined);
                  }}
                />
              )}

            </div>
            <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
              <div className="flex justify-between order-2 lg:order-1">
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
                {actions.includes('Cumpleaños') && (
                  <ButtonUi
                    className="xl:hidden md:hidden border border-white"
                    theme={Colors.Primary}
                    onPress={() => navigate('/birthday-calendar')}
                  >
                    <p className="text-sm sm:text-base">Cumpleaños</p>
                  </ButtonUi>
                )}
              </div>
              <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
                {actions.includes('Cumpleaños') && (
                  <ButtonUi
                    className=" xl:flex md:flex hidden border mt-7 border-white"
                    theme={Colors.Primary}
                    onPress={() => navigate('/birthday-calendar')}
                  >
                    <p className="text-sm sm:text-base">Cumpleaños</p>
                  </ButtonUi>
                )}

                <div className="w-44">
                  <span className="font-semibold dark:text-white text-sm">Mostrar</span>
                  <Select
                    className="w-44 dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold',
                    }}
                    defaultSelectedKeys={['5']}
                    labelPlacement="outside"
                    value={params.limit}
                    variant="bordered"
                    onChange={(e) => {
                      setParams({ ...params, limit: Number(e.target.value !== '' ? e.target.value : '5') });
                    }}
                  >
                    {limit_options.map((option) => (
                      <SelectItem key={option} className="dark:text-white">
                        {option}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <RenderViewButton setView={setView} view={view} />
              </div>
            </div>

            {(view === 'grid' || view === 'list') && (
              <MobileView
                DeletePopover={DeletePopover}
                actions={actions}
                generateCodeModal={generateCodeModal}
                handleActivate={handleActivate}
                openEditModal={(employee) => {
                  setDataUpdate(employee);
                }}
                setCodes={setCodes}
                setSelectedEmployee={setSelectedEmployee}
                setSelectedId={setSelectedId}
              />
            )}
            {view === 'table' && (
              <>
                <TableComponent
                  className='overflow-auto'
                  headers={['Nº', 'Nombre', 'Apellido', 'Teléfono', 'Sucursal', 'Codigo', 'Acciones']}
                >
                  {loading_employees ? (
                    <tr>
                      <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                        <LoadingTable />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {employee_paginated.employees.length > 0 ? (
                        <>
                          {employee_paginated.employees.map((employee, key) => (
                            <tr key={key} className="border-b border-slate-200">
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {employee.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {employee.firstName} {employee.secondName}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {employee.firstLastName} {employee.secondLastName}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {employee.phone}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {employee.branch.name}
                              </td>
                              <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {employee.code}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  {employee.isActive && actions.includes('Editar') && (
                                    <>
                                      <ButtonUi
                                        isIconOnly
                                        showTooltip
                                        className="border border-white"
                                        theme={Colors.Success}
                                        tooltipText='Editar'
                                        onPress={() => {
                                          setDataUpdate(employee);
                                        }}
                                      >
                                        <EditIcon size={20} />
                                      </ButtonUi>
                                    </>
                                  )}

                                  {actions.includes('Eliminar') && employee.isActive && (
                                    <DeletePopover employee={employee} />
                                  )}
                                  {actions.includes('Contrato de Trabajo') &&
                                    employee.isActive && (
                                      <ContractPdf employee={employee} />
                                    )}
                                  <ButtonUi
                                    isIconOnly
                                    showTooltip
                                    theme={Colors.Default}
                                    tooltipText="Generar códigos"
                                    onPress={async () => {
                                      setSelectedId(employee?.id)
                                      setSelectedEmployee(employee)
                                      generateCodeModal.onOpen();
                                      await get_codes_employees(employee?.id)
                                      const data = (await get_codes_employees(employee?.id)).data

                                      setCodes(data)

                                    }}
                                  >
                                    <RectangleEllipsis />
                                  </ButtonUi>

                                  {!employee.isActive && (
                                    <>
                                      {actions.includes('Activar') && (
                                        <ButtonUi
                                          isIconOnly
                                          showTooltip
                                          className="border border-white"
                                          theme={Colors.Info}
                                          tooltipText='Activar'
                                          onPress={() => handleActivate(employee.id)}
                                        >
                                          <RefreshCcw />
                                        </ButtonUi>
                                      )}
                                    </>
                                  )}
                                  <ProofSalary
                                    actions={actions}
                                    employee={employee}
                                  />

                                  <ProofeOfEmployment
                                    actions={actions}
                                    employee={employee}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={8}>
                            <EmptyTable />
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </TableComponent>
              </>
            )}
            {employee_paginated.totalPag > 1 && (
              <>
                <div className="w-full mt-5">
                  <Pagination
                    currentPage={employee_paginated.currentPag}
                    nextPage={employee_paginated.nextPag}
                    previousPage={employee_paginated.prevPag}
                    totalPages={employee_paginated.totalPag}
                    onPageChange={(page) => {
                     changePage({page})
                    }}
                  />
                </div>
              </>
            )}
          </DivGlobal>
          <HeadlessModal
            isOpen={generateCodeModal.isOpen}
            size="w-[350px] md:w-[560px]"
            title="Generar códigos"
            onClose={() => { generateCodeModal.onClose(), setSelectedEmployee(undefined) }}
          >
            <GenerateCodeEmployee code={codes as IResponseCodes} id={selectId} isResponsableCutz={selectedEmployee?.isResponsibleCutZ} />
          </HeadlessModal>
        </>
      )
      }
    </>
  );
}
export default ListEmployee;

interface PopProps {
  employee: Employee;
}

export const DeletePopover = ({ employee }: PopProps) => {
  const { deleteEmployee } = useEmployeeStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
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
        <PopoverTrigger >
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {employee.firstName}
            </p>
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
