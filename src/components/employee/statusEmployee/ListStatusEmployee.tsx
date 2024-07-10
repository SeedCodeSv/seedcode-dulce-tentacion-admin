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
import { EditIcon, User, TrashIcon, Table as ITable, CreditCard, List, Filter, RefreshCcw } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Drawer } from 'vaul';
import classNames from 'classnames';
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

interface PProps {
  actions: string[];
}

function ListStatusEmployee({ actions }: PProps) {
  const { theme, context } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = useState(false);

  const { paginated_status_employee,activateStatusEmployee, getPaginatedStatusEmployee, loading_status_employee } =
    useStatusEmployeeStore();

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

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

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
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col w-full p-5 rounded">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-5 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="hidden w-full md:flex gap-3">
              <Input
                startContent={<User />}
                className="w-full xl:w-96 dark:text-white"
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
                className="mt-6 font-semibold"
                color="primary"
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
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
                      type="button"
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
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-400 mb-8" />
                        <Drawer.Title className="mb-4 dark:text-white font-medium">
                          Filtros disponibles
                        </Drawer.Title>

                        <div className="flex flex-col gap-3">
                          <Input
                            startContent={<User />}
                            className="w-full xl:w-96 dark:text-white"
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
                            className="mt-6 font-semibold"
                            color="primary"
                            onClick={() => {
                              handleSearch(undefined);
                              setOpenVaul(false);
                            }}
                          >
                            Buscar
                          </Button>
                        </div>
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>
              </div>
            </div>
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
        <div className="flex justify-end items-end w-full mb-4 gap-5">
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
              setLimit(Number(e.target.value !== '' ? e.target.value : '8'));
            }}
          >
            {limit_options.map((option) => (
              <SelectItem key={option} value={option} className="dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
          <div className="flex items-center">
            <Switch onValueChange={(isActive) => setActive(isActive)} isSelected={isActive}>
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {isActive ? 'inactivos' : 'activos'}
              </span>
            </Switch>
          </div>
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
          <DataTable
            className="w-full shadow"
            emptyMessage="No se encontraron resultados"
            value={paginated_status_employee.employeeStatus}
            tableStyle={{ minWidth: '50rem' }}
            loading={loading_status_employee}
          >
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
              field="id"
              header="No."
            />
            <Column
              headerClassName="text-sm font-semibold"
              headerStyle={style}
              field="name"
              header="Nombre"
            />
            <Column
              headerStyle={{ ...style, borderTopRightRadius: '10px' }}
              header="Acciones"
              body={(item) => (
                <div className="flex gap-6">
                  {actions.includes('Editar') && (
                    <Button
                      onClick={() => handleEdit(item)}
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
                      {/* <DeletePopUp statusEmployees={item} /> */}
                      {item.isActive ? (
                        <DeletePopUp statusEmployees={item} />
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
