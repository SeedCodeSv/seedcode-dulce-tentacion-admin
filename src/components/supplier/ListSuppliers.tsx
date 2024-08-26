import AddNormalSupplier from './AddNormalSupplier';
import AddTributeSupplier from './AddTributeSupplier';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { PayloadSupplier, Supplier, SupplierDirection } from '../../types/supplier.types';
import {
  Button,
  ButtonGroup,
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
  PlusIcon,
  Repeat,
  TrashIcon,
  List,
  CreditCard,
  Table as ITable,
  Mail,
  Filter,
  BadgeCheck,
} from 'lucide-react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import { global_styles } from '../../styles/global.styles';
import Pagination from '../global/Pagination';
import MobileViewSupplier from './MobileViewSupplier';
import NO_DATA from '@/assets/svg/no_data.svg';

import SmPagination from '../global/SmPagination';
import TooltipGlobal from '../global/TooltipGlobal';
import useWindowSize from '@/hooks/useWindowSize';
import BottomDrawer from '../global/BottomDrawer';
import classNames from 'classnames';
import { ArrayAction } from '@/types/view.types';
import { useNavigate } from 'react-router';

function ListSuppliers({ actions }: ArrayAction) {
  const { theme } = useContext(ThemeContext);
  const { getSupplierPagination, supplier_pagination, activateSupplier } = useSupplierStore();
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [openVaul, setOpenVaul] = useState(false);
  const [page, serPage] = useState(1);
  const { windowSize } = useWindowSize();
  const [typeProveedor, setTypeProveedor] = useState('normal');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<PayloadSupplier>();
  const [selectedSupplierDirection, setSelectedSupplierDirection] = useState<SupplierDirection>();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [active, setActive] = useState(true);
  const [tipeSupplier, setTypeSupplier] = useState('');
  const store = useSupplierStore();
  // const style = {
  //   backgroundColor: theme.colors.dark,
  //   color: theme.colors.primary,
  // };
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  useEffect(() => {
    getSupplierPagination(1, limit, search, email, tipeSupplier, active ? 1 : 0);
    store.supplier_type = tipeSupplier;
  }, [limit, tipeSupplier, active]);

  const handleSearch = (searchParam: string | undefined) => {
    getSupplierPagination(page, limit, searchParam ?? search, searchParam ?? email, tipeSupplier);
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
    setSelectedId(supplier.id ?? 0);

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
      setSelectedTitle('Cambiar el tipo de proveedor');
    } else {
      setTypeProveedor('contribuyente');
      setSelectedTitle('Cambiar el tipo de proveedor');
    }
    modalAdd.onOpen();
  };

  const handleActivate = (id: number) => {
    activateSupplier(id).then(() => {
      getSupplierPagination(page, limit, search, email, tipeSupplier, active ? 1 : 0);
    });
  };

  const {  OnGetBySupplier } = useSupplierStore();

  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-6 2xl:mb-10 lg:flex-row lg:gap-0">
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
          <div className="flex items-end justify-between gap-10">
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
              {actions.includes('Agregar') && (
                <>
                  <BottomSm />
                  <BottomAdd />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 justify-between w-full mb-5 mt-3">
            <div className="flex flex-row gap-5 items-center w-full">
              <Select
                className="w-72 sm:w-44 dark:text-white"
                variant="bordered"
                label="Tipo de proveedor"
                defaultSelectedKeys={['']}
                labelPlacement="outside"
                classNames={{
                  label: 'font-semibold',
                }}
                value={String(tipeSupplier)}
                onChange={(e) => {
                  setTypeSupplier(e.target.value !== '' ? e.target.value : '');
                }}
              >
                <SelectItem className="dark:text-white" key={''}>
                  Todos
                </SelectItem>
                <SelectItem className="dark:text-white" key={'1'}>
                  Contribuyente
                </SelectItem>
                <SelectItem className="dark:text-white" key={'0'}>
                  No Contribuyente
                </SelectItem>
              </Select>
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
            <div className="flex items-center">
              <Switch
                onValueChange={(active) => setActive(active)}
                isSelected={active}
                classNames={{
                  thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                }}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {active ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>

          <div className="flex items-center justify-center ml-2"></div>
          {(view === 'grid' || view === 'list') && (
            <MobileViewSupplier
              handleActive={handleActivate}
              handleChangeSupplier={(supplier, type) => {
                handleChangeSupplier(supplier, type);
              }}
              deletePopover={DeletePopover}
              layout={view as 'grid' | 'list'}
            />
          )}

          {view === 'table' && (
            <div className="overflow-x-auto custom-scrollbar ">
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
                      Telefono
                    </th>
                    <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Correo
                    </th>
                    <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Contribuyente
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {supplier_pagination.suppliers.length > 0 ? (
                    <>
                      {supplier_pagination.suppliers.map((item) => (
                        <tr className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.id}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100 max-w-[350px]">
                            {item.nombre}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.telefono}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.correo}
                          </td>
                          <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                            {item.esContribuyente ? 'Si' : 'No'}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <div className="flex w-full gap-5">
                              {item.isActive && actions.includes('Editar') && (
                                <>
                                  <TooltipGlobal text="Editar">
                                    <Button
                                      onClick={() => {
                                        if (item.esContribuyente === true) {
                                          navigate(`/update-supplier-tribute/${item.id}`);
                                          OnGetBySupplier(item.id ?? 0);
                                        } else {
                                          navigate(`/update-supplier-normal/${item.id}`);
                                          OnGetBySupplier(item.id ?? 0);
                                        }
                                      }}
                                      isIconOnly
                                      style={{
                                        backgroundColor: theme.colors.secondary,
                                      }}
                                    >
                                      <EditIcon style={{ color: theme.colors.primary }} size={20} />
                                    </Button>
                                  </TooltipGlobal>
                                  <DeletePopover supplier={item} />
                                  {item.esContribuyente === false && actions.includes('Agrgar') && (
                                    <TooltipGlobal text="Cambiar el tipo de proveedor">
                                      <Button
                                        onClick={() => {
                                          setSelectedTitle('Cambiar el tipo de proveedor');
                                          handleChangeSupplier(item, 'change');
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
                                </>
                              )}
                              <>
                                {actions.includes('Activar Proveedor') && !item.isActive && (
                                  <Button
                                    onClick={() => {
                                      handleActivate(item.id ?? 0);
                                    }}
                                    isIconOnly
                                    style={{
                                      backgroundColor: theme.colors.third,
                                    }}
                                  >
                                    <BadgeCheck style={{ color: theme.colors.primary }} size={20} />
                                  </Button>
                                )}
                              </>
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
          {supplier_pagination.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={supplier_pagination.prevPag}
                  nextPage={supplier_pagination.nextPag}
                  currentPage={supplier_pagination.currentPag}
                  totalPages={supplier_pagination.totalPag}
                  onPageChange={(page) => {
                    getSupplierPagination(page, limit, search, email, tipeSupplier);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    serPage(supplier_pagination.nextPag);
                    getSupplierPagination(
                      supplier_pagination.nextPag,
                      limit,
                      search,
                      email,
                      tipeSupplier
                    );
                  }}
                  handlePrev={() => {
                    serPage(supplier_pagination.prevPag);
                    getSupplierPagination(
                      supplier_pagination.prevPag,
                      limit,
                      search,
                      email,
                      tipeSupplier
                    );
                  }}
                  currentPage={supplier_pagination.currentPag}
                  totalPages={supplier_pagination.totalPag}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ListSuppliers;

interface PopProps {
  supplier: Supplier;
}

export const DeletePopover = ({ supplier }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteSupplier } = useSupplierStore();

  const handleDelete = async (id: number) => {
    await deleteSupplier(id);
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
        <div className="w-full p-5 dark:text-white">
          <p className="font-semibold text-gray-600 dark:text-white">Eliminar {supplier.nombre}</p>
          <p className="mt-3 text-center text-gray-600 w-72 dark:text-white">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete(supplier.id ?? 0)}
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

interface PopoverAddProps {
  setTypeSupplier: Dispatch<SetStateAction<string>>;
  openModal: () => void;
}

export const BottomAdd = () => {
  const navigate = useNavigate();
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
        <div className="flex flex-col gap-5 p-3 bg-white dark:bg-zinc-900">
          <Button
            onClick={() => {
              navigate('/add-supplier-normal');
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Proveedor Consumidor Final
          </Button>
          <Button
            onClick={() => {
              navigate('/add-supplier-tribute');
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Proveedor Contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const BottomSm = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
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
          <TooltipGlobal text="Agregar nuevo">
            <PlusIcon />
          </TooltipGlobal>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title">
        <div className="flex flex-col gap-5 p-3 bg-white dark:bg-zinc-900">
          <Button
            onClick={() => {
              navigate('/add-supplier-normal');
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
            }}
          >
            Proveedor Consumidor Final
          </Button>
          <Button
            onClick={() => {
              navigate('/add-supplier-tribute');
            }}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Proveedor Contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
