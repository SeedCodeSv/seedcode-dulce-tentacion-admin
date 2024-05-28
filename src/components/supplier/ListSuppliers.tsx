import ModalGlobal from '../global/ModalGlobal';
import AddNormalSupplier from './AddNormalSupplier';
import AddTributeSupplier from './AddTributeSupplier';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { PayloadSupplier, Supplier, SupplierDirection } from '../../types/supplier.types';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@nextui-org/react';
import { useSupplierStore } from '../../store/supplier.store';
import { ThemeContext } from '../../hooks/useTheme';
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
} from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { paginator_styles } from '../../styles/paginator.styles';
import { useCustomerStore } from '../../store/customers.store';
import { global_styles } from '../../styles/global.styles';
import Pagination from '../global/Pagination';

function ListSuppliers() {
  const { theme } = useContext(ThemeContext);
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');

  const [typeProveedor, setTypeProveedor] = useState('normal');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<PayloadSupplier>();
  const [selectedSupplierDirection, setSelectedSupplierDirection] = useState<SupplierDirection>();
  const [selectedId, setSelectedId] = useState<number>(0);

  const [active, setActive] = useState(true);
  const [tipeSupplier, setTypeSupplier] = useState(1);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

  useEffect(() => {
    getSupplierPagination(1, limit, search, email, active ? 1 : 0, tipeSupplier);
  }, [1, limit, search, email, active ? 1 : 0, tipeSupplier]);

  const handleSearch = (searchParam: string | undefined) => {
    getSupplierPagination(
      1,
      limit,
      searchParam ?? search,
      searchParam ?? email,
      active ? 1 : 0,
      tipeSupplier
    );
  };

  const modalAdd = useDisclosure();

  const handleChangeSupplier = (supplier: Supplier, type = 'edit') => {
    const payload_supplier: PayloadSupplier = {
      nombre: supplier.nombre,
      correo: supplier.correo,
      telefono: supplier.telefono,
      numDocumento: supplier.numDocumento,
      nombreComercial: supplier.nombreComercial,
      nrc: supplier.nrc,
      nit: supplier.nit,
      tipoDocumento: '13',
      bienTitulo: '05',
      codActividad: supplier.codActividad,
      descActividad: supplier.descActividad,
      esContribuyente: supplier.esContribuyente ? 1 : 0,
    };

    const payload_direction: SupplierDirection = {
      id: supplier.direccion?.id ?? 0,
      municipio: supplier.direccion?.municipio ?? '',
      nombreMunicipio: supplier.direccion?.nombreMunicipio ?? '',
      departamento: supplier.direccion?.departamento ?? '',
      nombreDepartamento: supplier.direccion?.nombreDepartamento ?? '',
      complemento: supplier.direccion?.complemento ?? '',
      active: supplier.direccion?.active ?? false,
    };

    setSelectedSupplier(payload_supplier);
    setSelectedSupplierDirection(payload_direction);
    setSelectedId(supplier.id);

    if (type === 'edit') {
      if (supplier.esContribuyente) {
        setTypeProveedor('contribuyente');
      } else {
        setTypeProveedor('normal');
      }
      modalAdd.onOpen();
      return;
    }
    if (supplier.esContribuyente) {
      setTypeProveedor('normal');
    } else {
      setTypeProveedor('contribuyente');
    }
    modalAdd.onOpen();
  };

  const clearClose = () => {
    modalAdd.onClose();
    handleChangeSupplier({} as Supplier, '');
    setTypeProveedor('normal');
    setSelectedId(0);
    setSelectedSupplier(undefined);
    setSelectedTitle('');
  };

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="hidden w-full gap-5 md:flex">
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
            <div className="flex justify-end w-full">
              <BottomAdd setTypeSupplier={setTypeProveedor} openModal={modalAdd.onOpen} />
              <BottomSm setTypeSupplier={setTypeProveedor} openModal={modalAdd.onOpen} />
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center justify-between w-full mb-5">
            <Switch onValueChange={(active) => setActive(active)} isSelected={active}>
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {active ? 'inactivos' : 'activos'}
              </span>
            </Switch>
            <Select
              className="w-44 ml-2"
              variant="bordered"
              label="Mostrar"
              labelPlacement="outside"
              classNames={{
                label: 'font-semibold',
              }}
              value={String(tipeSupplier)}
              onChange={(e) => {
                setTypeSupplier(e.target.value !== '' ? Number(e.target.value) : 0);
              }}
            >
              <SelectItem className="dark:text-white" key={'1'}>
                Contribuyente
              </SelectItem>
              <SelectItem className="dark:text-white" key={'0'}>
                No Contribuyente
              </SelectItem>
            </Select>
            <Select
              className="w-44"
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
          </div>
          <div className="flex items-center justify-center ml-2"></div>
          {/* {(view === 'grid' || view === 'list') && (
            <MobileViewSupplier
              handleActive={handleActivate}
              handleChangeCustomer={(supplier, type) => {
                handleChangeSupplier(supplier, type);
              }}
              deletePopover={DeletePopover}
              layout={view as 'grid' | 'list'}
            />
          )}
          <div className="flex justify-end w-full py-3 bg-first-300"></div> */}

          {view === 'table' && (
            <DataTable
              className="shadow"
              emptyMessage="No se encontraron resultados"
              value={supplier_pagination.Suppliers}
              tableStyle={{ minWidth: '50rem' }}
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
                field="nombre"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="telefono"
                header="Teléfono"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="correo"
                header="Correo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                // field="esContribuyente"
                body={(item) => (item.esContribuyente ? 'Si' : 'No')}
                header="Contribuyente"
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: '10px' }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <Button
                      onClick={() => handleChangeSupplier(item, 'edit')}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.secondary,
                      }}
                    >
                      <EditIcon style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedTitle('Cambiar el tipo de cliente');
                        handleChangeSupplier(item, 'change');
                      }}
                      isIconOnly
                      style={{
                        backgroundColor: theme.colors.third,
                      }}
                    >
                      <Repeat style={{ color: theme.colors.primary }} size={20} />
                    </Button>
                    {/* {item.isActive === false && (
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
                    )} */}
                    <DeletePopover suppliers={item} />
                  </div>
                )}
              />
            </DataTable>
          )}
          {supplier_pagination.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={supplier_pagination.prevPag}
                  nextPage={supplier_pagination.nextPag}
                  currentPage={supplier_pagination.currentPag}
                  totalPages={supplier_pagination.totalPag}
                  onPageChange={(page) => {
                    getSupplierPagination(page, limit, search, email, active ? 1 : 0, 1);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <Paginator
                  pt={paginator_styles(1)}
                  className="flex justify-between w-full"
                  first={supplier_pagination.currentPag}
                  rows={limit}
                  totalRecords={supplier_pagination.total}
                  template={{
                    layout: 'PrevPageLink CurrentPageReport NextPageLink',
                  }}
                  currentPageReportTemplate="{currentPage} de {totalPages}"
                />
              </div>
            </>
          )}
        </div>
        <ModalGlobal
          isOpen={modalAdd.isOpen}
          onClose={() => {
            clearClose();
            modalAdd.onClose();
          }}
          title={
            selectedSupplier
              ? selectedTitle !== ''
                ? selectedTitle
                : 'Editar Proveedor'
              : 'Nuevo Proveedor'
          }
          size={
            typeProveedor === 'contribuyente'
              ? 'w-full md:w-[600px] lg:w-[800px] xl:w-[1000px]'
              : 'w-full md:w-[500px] lg:w-[700px] xl:w-[800px]'
          }
        >
          <>
            {typeProveedor === 'normal' && (
              <AddNormalSupplier
                closeModal={modalAdd.onClose}
                supplier={selectedSupplier}
                supplier_direction={selectedSupplierDirection}
                id={selectedId}
              />
            )}
            {typeProveedor === 'contribuyente' && (
              <AddTributeSupplier
                closeModal={modalAdd.onClose}
                supplier={selectedSupplier}
                supplier_direction={selectedSupplierDirection}
                id={selectedId}
              />
            )}
          </>
        </ModalGlobal>
      </div>
    </>
  );
}

export default ListSuppliers;

interface PopProps {
  suppliers: Supplier;
}

export const DeletePopover = ({ suppliers }: PopProps) => {
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
          <p className="font-semibold text-gray-600">Eliminar {suppliers.nombre}</p>
          <p className="mt-3 text-center text-gray-600 w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete(suppliers.id)}
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
  suppliers: Supplier;
  handleChange: (item: Supplier, type: string) => void;
}
/* eslint-enable no-unused-vars */

export const CardItem = ({ suppliers, handleChange }: CardProps) => {
  return (
    <Card isBlurred isPressable>
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col">
            <p className="ml-3 text-sm font-semibold text-gray-600">{suppliers.nombre}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="flex ml-3 text-sm font-semibold text-gray-700">
          <MailIcon size={25} className="text-default-400" />
          <p className="ml-3">{suppliers.correo}</p>
        </p>
        <p className="flex mt-3 ml-3 text-sm font-semibold text-gray-700">
          <Phone size={25} className="text-default-400" />
          <p className="ml-3">{suppliers.telefono}</p>
        </p>
      </CardBody>
      <CardHeader>
        <div className="flex gap-3">
          <Button
            onClick={() => handleChange(suppliers, 'edit')}
            isIconOnly
            className="bg-coffee-green"
          >
            <EditIcon className="text-white" size={20} />
          </Button>
          <Button
            onClick={() => handleChange(suppliers, 'change')}
            isIconOnly
            className="bg-[#E8751A]"
          >
            <Repeat className="text-white" size={20} />
          </Button>
          <DeletePopover suppliers={suppliers} />
        </div>
      </CardHeader>
    </Card>
  );
};

interface PopoverAddProps {
  setTypeSupplier: Dispatch<SetStateAction<string>>;
  openModal: () => void;
}

export const BottomAdd = ({ setTypeSupplier, openModal }: PopoverAddProps) => {
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
          endContent={<PlusIcon />}
          onClick={() => (isOpen ? onClose() : onOpen())}
        >
          Agregar nuevo
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title">
        <div className="flex flex-col gap-5 p-3 bg-white">
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeSupplier('normal');
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Proveedor normal
          </Button>
          <Button
            onClick={() => {
              onClose();
              openModal();
              setTypeSupplier('contribuyente');
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Proveedor contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const BottomSm = ({ setTypeSupplier, openModal }: PopoverAddProps) => {
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
              setTypeSupplier('normal');
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
              setTypeSupplier('contribuyente');
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
