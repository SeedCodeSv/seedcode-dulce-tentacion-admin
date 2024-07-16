import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react';
import { useCustomerStore } from '../../store/customers.store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  MailIcon,
  Phone,
  PlusIcon,
  Repeat,
  TrashIcon,
  List,
  CreditCard,
  Table as ITable,
  Mail,
  BadgeCheck,
  Filter,
} from 'lucide-react';
import AddClientNormal from './AddClientNormal';
import AddClientContributor from './AddClientContributor';
import { ButtonGroup } from '@nextui-org/react';
import { Customer, CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { ThemeContext } from '../../hooks/useTheme';
import MobileView from './MobileView';
import Pagination from '../global/Pagination';
import { global_styles } from '../../styles/global.styles';
import SmPagination from '../global/SmPagination';
import classNames from 'classnames';
import HeadlessModal from '../global/HeadlessModal';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import useWindowSize from '@/hooks/useWindowSize';

const ListClients = () => {
  const { theme } = useContext(ThemeContext);
  const { getCustomersPagination, customer_pagination, save_active_customer } = useCustomerStore();
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [typeClient, setTypeClient] = useState('normal');
  const [active, setActive] = useState(true);
  const [tipeCustomer, setTypeCustomer] = useState(1);
  useEffect(() => {
    getCustomersPagination(1, limit, search, email, active ? 1 : 0, tipeCustomer);
  }, [limit, active, tipeCustomer]);

  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const [page, serPage] = useState(1);
  const handleSearch = (searchParam: string | undefined) => {
    getCustomersPagination(
      page,
      limit,
      searchParam ?? search,
      searchParam ?? email,
      active ? 1 : 0,
      tipeCustomer
    );
  };

  const [openVaul, setOpenVaul] = useState(false);
  const modalAdd = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<PayloadCustomer>();
  const [selectedCustomerDirection, setSelectedCustomerDirection] = useState<CustomerDirection>();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedTitle, setSelectedTitle] = useState('');

  const handleChangeCustomer = (customer: Customer, type = 'edit') => {
    const payload_customer: PayloadCustomer = {
      nombre: customer.nombre,
      correo: customer.correo,
      telefono: customer.telefono,
      numDocumento: customer.numDocumento,
      nombreComercial: customer.nombreComercial,
      nrc: customer.nrc,
      nit: customer.nit,
      tipoDocumento: '13',
      bienTitulo: '05',
      codActividad: customer.codActividad,
      descActividad: customer.descActividad,
      esContribuyente: customer.esContribuyente ? 1 : 0,
    };

    const payload_direction: CustomerDirection = {
      id: customer.direccion?.id ?? 0,
      municipio: customer.direccion?.municipio ?? '',
      nombreMunicipio: customer.direccion?.nombreMunicipio ?? '',
      departamento: customer.direccion?.departamento ?? '',
      nombreDepartamento: customer.direccion?.nombreDepartamento ?? '',
      complemento: customer.direccion?.complemento ?? '',
      active: customer.direccion?.active ?? false,
    };

    setSelectedCustomer(payload_customer);
    setSelectedCustomerDirection(payload_direction);
    setSelectedId(customer.id);

    if (type === 'edit') {
      if (customer.esContribuyente) {
        setTypeClient('contribuyente');
      } else {
        setTypeClient('normal');
      }
      modalAdd.onOpen();
      return;
    }
    if (customer.esContribuyente) {
      setTypeClient('normal');
    } else {
      setTypeClient('contribuyente');
    }
    modalAdd.onOpen();
  };
  const clearClose = () => {
    modalAdd.onClose();
    handleChangeCustomer({} as Customer, '');
    setTypeClient('normal');
    setSelectedId(0);
    setSelectedCustomer(undefined);
    setSelectedTitle('');
  };

  const handleActivate = (id: number) => {
    save_active_customer(id);
  };

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full hidden gap-5 md:flex">
            <div className="flex w-full justify-between items-end gap-3">
              <Input
                startContent={<User />}
                className="w-full dark:text-white"
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
                  // handleSearch("");
                  setSearch('');
                }}
              />
              <Input
                startContent={<Mail />}
                className="w-full dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="correo"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  // handleSearch("");
                  setEmail('');
                }}
              />
              <div className="mt-6">
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
          </div>
          <div className="flex flex-col sm:flex-row items-end justify-between mt-3">
          <div className="flex-col gap-2 hidden sm:flex sm:flex-row lg:justify-start items-center w-full">
              <Select
                className="w-44 ml-2"
                variant="bordered"
                label="Mostrar"
                defaultSelectedKeys={['5']}
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold',
                }}

                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                }}
              >
                <SelectItem className="dark:text-white" key={'5'}>
                  5
                </SelectItem>
                <SelectItem className="dark:text-white" key={'10'}>
                  10
                </SelectItem>
                <SelectItem className="dark:text-white" key={'20'}>
                  20
                </SelectItem>
                <SelectItem className="dark:text-white" key={'30'}>
                  30
                </SelectItem>
                <SelectItem className="dark:text-white" key={'40'}>
                  40
                </SelectItem>
                <SelectItem className="dark:text-white" key={'50'}>
                  50
                </SelectItem>
                <SelectItem className="dark:text-white" key={'100'}>
                  100
                </SelectItem>
              </Select>
              <Select
                className="w-44 ml-2 mt-5"
                variant="bordered"
                placeholder="-- Seleccione tipo de cliente --"
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold',
                }}
                value={String(tipeCustomer)}
                onChange={(e) => {
                  setTypeCustomer(e.target.value !== '' ? Number(e.target.value) : 0);
                }}
              >
                <SelectItem className="dark:text-white" key={'1'}>
                  Contribuyente
                </SelectItem>
                <SelectItem className="dark:text-white" key={'0'}>
                  No Contribuyente
                </SelectItem>
              </Select>
            </div>
          <BottomAdd setTypeClient={setTypeClient} openModal={modalAdd.onOpen} />
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
                          <Input
                            startContent={<User />}
                            className="w-full dark:text-white"
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
                              // handleSearch("");
                              setSearch('');
                            }}
                          />
                          <Input
                            startContent={<Mail />}
                            className="w-full dark:text-white"
                            variant="bordered"
                            labelPlacement="outside"
                            label="Correo"
                            classNames={{
                              label: 'font-semibold text-gray-700',
                              inputWrapper: 'pr-0',
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Escribe para buscar..."
                            isClearable
                            onClear={() => {
                              // handleSearch("");
                              setEmail('');
                            }}
                          />

                          <Button
                            style={{
                              backgroundColor: theme.colors.secondary,
                              color: theme.colors.primary,
                            }}
                            className="font-semibold"
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
              <BottomSm setTypeClient={setTypeClient} openModal={modalAdd.onOpen} />
              </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className='w-full flex justify-start'>
          <Switch onValueChange={(active) => setActive(active)} isSelected={active}  classNames={{
                  thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                }}>
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {active ? 'inactivos' : 'activos'}
              </span>
            </Switch>
            </div>
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
            
          </div>
          <div className="mt-5">           
            <div className="xl:hidden">
              <Select
                className="w-full mt-2"
                variant="bordered"
                placeholder="-- Seleccione el tipo --"
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold',
                }}
                value={String(tipeCustomer)}
                onChange={(e) => {
                  setTypeCustomer(e.target.value !== '' ? Number(e.target.value) : 0);
                }}
              >
                <SelectItem className="dark:text-white" key={'1'}>
                  Contribuyente
                </SelectItem>
                <SelectItem className="dark:text-white" key={'0'}>
                  No Contribuyente
                </SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-center ml-2"></div>
          {(view === 'grid' || view === 'list') && (
            <MobileView
              handleActive={handleActivate}
              handleChangeCustomer={(customer, type) => {
                handleChangeCustomer(customer, type);
              }}
              deletePopover={DeletePopover}
              layout={view as 'grid' | 'list'}
            />
          )}
         <div className="flex justify-end w-full py-3 md:py-0 bg-first-300"></div>
          {view === 'table' && (
            <DataTable
              className="shadow dark:text-white"
              emptyMessage="No se encontraron resultados"
              value={customer_pagination.customers}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                field="id"
                header="No."
                className='dark:text-white'
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="nombre"
                header="Nombre"
                className='dark:text-white'
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="telefono"
                header="Teléfono"
                className='dark:text-white'
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="correo"
                header="Correo"
                className='dark:text-white'
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="esContribuyente"
                body={(item) => (item.esContribuyente ? 'Si' : 'No')}
                header="Contribuyente"
                className='dark:text-white'
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: '10px' }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    {item.isActive ? ( 
                      <>
                     <TooltipGlobal text="Editar">
                    <Button
                      onClick={() => handleChangeCustomer(item, 'edit')}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                    >
                      <EditIcon style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                    </TooltipGlobal>

                    {item.esContribuyente === false && (
                    <TooltipGlobal text="Cambiar tipo de cliente">
                    <Button
                      onClick={() => {
                        setSelectedTitle('Cambiar el tipo de cliente');
                        handleChangeCustomer(item, 'change');
                      }}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.third,
                      }}
                    >
                      <Repeat style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                    </TooltipGlobal>
                    )}
                     <DeletePopover customers={item} />
                    </>
                  ): (<TooltipGlobal text="Activar">
                      <Button
                        onClick={() => {
                          handleActivate(item.id);
                        }}
                        isIconOnly
                        style={{
                          backgroundColor: theme.colors.third,
                        }}
                      >
                        <BadgeCheck style={{ color: theme.colors.primary }} size={20} />
                      </Button>
                      </TooltipGlobal>)}
                  </div>
                )}
              />
            </DataTable>
          )}
          {customer_pagination.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={customer_pagination.prevPag}
                  nextPage={customer_pagination.nextPag}
                  currentPage={customer_pagination.currentPag}
                  totalPages={customer_pagination.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getCustomersPagination(
                      page,
                      limit,
                      search,
                      email,
                      active ? 1 : 0,
                      tipeCustomer
                    );
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    serPage(customer_pagination.nextPag);

                    getCustomersPagination(
                      customer_pagination.nextPag,
                      limit,
                      search,
                      email,
                      active ? 1 : 0,
                      tipeCustomer
                    );
                  }}
                  handlePrev={() => {
                    serPage(customer_pagination.prevPag);
                    getCustomersPagination(
                      customer_pagination.prevPag,
                      limit,
                      search,
                      email,
                      active ? 1 : 0,
                      tipeCustomer
                    );
                  }}
                  currentPage={customer_pagination.currentPag}
                  totalPages={customer_pagination.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          isOpen={modalAdd.isOpen}
          onClose={() => {
            clearClose();
            modalAdd.onClose();
          }}
          title={
            selectedCustomer
              ? selectedTitle !== ''
                ? selectedTitle
                : 'Editar cliente'
              : 'Nuevo cliente'
          }
          size={
            typeClient === 'contribuyente'
              ? 'w-full md:w-[600px] lg:w-[800px] xl:w-[1000px]'
              : 'w-full md:w-[500px] lg:w-[700px] xl:w-[800px]'
          }
        >
          <>
            {typeClient === 'normal' && (
              <AddClientNormal
                closeModal={modalAdd.onClose}
                customer={selectedCustomer}
                customer_direction={selectedCustomerDirection}
                id={selectedId}
              />
            )}
            {typeClient === 'contribuyente' && (
              <AddClientContributor
                closeModal={modalAdd.onClose}
                customer={selectedCustomer}
                customer_direction={selectedCustomerDirection}
                id={selectedId}
              />
            )}
          </>
        </HeadlessModal>
      </div>
    </>
  );
};
export default ListClients;

interface PopProps {
  customers: Customer;
}

export const DeletePopover = ({ customers }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteCustomer } = useCustomerStore();

  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
    onClose();
  };

  return (
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
      <div className="flex flex-col items-center justify-center w-full p-5">
      <p className="font-semibold text-gray-600 dark:text-white">Eliminar {customers.nombre}</p>
      <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete(customers.id)}
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
  );
};

/* eslint-disable no-unused-vars */
interface CardProps {
  customer: Customer;
  handleChange: (item: Customer, type: string) => void;
}
/* eslint-enable no-unused-vars */

export const CardItem = ({ customer, handleChange }: CardProps) => {
  return (
    <Card isBlurred isPressable>
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">{customer.nombre}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="flex ml-3 text-sm font-semibold text-gray-700">
          <MailIcon size={25} className="text-default-400" />
          <p className="ml-3">{customer.correo}</p>
        </p>
        <p className="flex mt-3 ml-3 text-sm font-semibold text-gray-700">
          <Phone size={25} className="text-default-400" />
          <p className="ml-3">{customer.telefono}</p>
        </p>
      </CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => handleChange(customer, 'edit')}
            isIconOnly
            className="bg-coffee-green"
          >
            <EditIcon className="text-white" size={20} />
          </Button>
          <Button
            onClick={() => handleChange(customer, 'change')}
            isIconOnly
            className="bg-[#E8751A]"
          >
            <Repeat className="text-white" size={20} />
          </Button>
          <DeletePopover customers={customer} />
        </div>
      </CardHeader>
    </Card>
  );
};

interface PopoverAddProps {
  setTypeClient: Dispatch<SetStateAction<string>>;
  openModal: () => void;
}

export const BottomAdd = ({ setTypeClient, openModal }: PopoverAddProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Popover
      aria-labelledby="popover-title"
      aria-describedby="popover-id"
      showArrow
      onClose={onClose}
      isOpen={isOpen}
      backdrop="blur"
    >
      <PopoverTrigger>
        <Button
          className="hidden lg:flex"
          style={{
            backgroundColor: theme.colors.third,
            color: theme.colors.primary,
          }}
          endContent={<PlusIcon size={35}/>}
          onClick={() => (isOpen ? onClose() : onOpen())}
        >
          Agregar nuevo
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title">
        <div className="flex flex-col gap-5 p-3 bg-white dark:bg-zinc-900">
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient('normal');
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Cliente normal
          </Button>
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient('contribuyente');
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Cliente contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const BottomSm = ({ setTypeClient, openModal }: PopoverAddProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Popover
      aria-labelledby="popover-title"
      aria-describedby="popover-id"
      showArrow
      onClose={onClose}
      isOpen={isOpen}
      backdrop="blur"
    >
      <PopoverTrigger>
        <Button
          className="flex lg:hidden"
          style={global_styles().thirdStyle}
          onClick={() => (isOpen ? onClose() : onOpen())}
          isIconOnly
        >
          <PlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title">
        <div className="flex flex-col gap-5 p-3 bg-white">
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient('normal');
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Cliente normal
          </Button>
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeClient('contribuyente');
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Cliente contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
