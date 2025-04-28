import { useEffect, useState } from 'react';
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
} from '@heroui/react';
import {
  EditIcon,
  User,
  PlusIcon,
  Repeat,
  CreditCard,
  Table as ITable,
  Mail,
  RefreshCcw,
  Trash,
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

import { Supplier } from '../../types/supplier.types';
import { useSupplierStore } from '../../store/supplier.store';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import TooltipGlobal from '../global/TooltipGlobal';

import MobileViewSupplier from './MobileViewSupplier';
import SearchSupplier from './search_supplier/SearchSupplier';

import NO_DATA from '@/assets/svg/no_data.svg';
import useWindowSize from '@/hooks/useWindowSize';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';

function ListSuppliers({ actions }: ArrayAction) {
  const { getSupplierPagination, supplier_pagination, activateSupplier, loading } =
    useSupplierStore();
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [page, serPage] = useState(1);
  const { windowSize } = useWindowSize();
  const [active, setActive] = useState(true);
  const [tipeSupplier, setTypeSupplier] = useState('');
  const store = useSupplierStore();
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

  const handleActivate = (id: number) => {
    activateSupplier(id).then(() => {
      getSupplierPagination(page, limit, search, email, tipeSupplier, active ? 1 : 0);
    });
  };

  const { OnGetBySupplier } = useSupplierStore();

  const navigate = useNavigate();

  return (
    <>
      <div className=" w-full h-full bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between items-end ">
            <SearchSupplier
              emailSupplier={(email: string) => handleSearch(email)}
              nameSupplier={(name: string) => handleSearch(name)}
              typeSupplier={(type: string) => setTypeSupplier(type)}
             />
            {actions.includes('Agregar') && (
              <>
                <BottomAdd />
              </>
            )}
          </div>

          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-3 gap-3">
              <Input
                isClearable
                className="w-full dark:text-white border  border-white rounded-xl"
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
                  // handleSearch("");
                  setSearch('');
                }}
              />
              <Input
                isClearable
                className="w-full dark:text-white  border  border-white rounded-xl"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                label="Correo"
                labelPlacement="outside"
                placeholder="Escribe para buscar..."
                startContent={<Mail />}
                value={email}
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                onClear={() => {
                  // handleSearch("");
                  setEmail('');
                }}
              />

              <ButtonUi
                className="hidden mt-6 font-semibold md:flex  border  border-white rounded-xl"
                theme={Colors.Primary}
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>

          <div className="flex flex-col mb-4 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex justify-between gap-11 w-full">
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
              <ButtonGroup className="mt-4">
                <ButtonUi
                  isIconOnly
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>
            </div>
            <div className="mt-3 mb-3 flex xl:gap-10 gap-3 w-full items-end lg:justify-between order-1 lg:order-2">
              <Select
                className="w-72 sm:w-44 dark:text-white border border-white rounded-xl"
                classNames={{
                  label: 'font-semibold',
                }}
                defaultSelectedKeys={['']}
                labelPlacement="outside"
                value={String(tipeSupplier)}
                variant="bordered"
                onChange={(e) => {
                  setTypeSupplier(e.target.value !== '' ? e.target.value : '');
                }}
              >
                <SelectItem key={''} className="dark:text-white">
                  Todos
                </SelectItem>
                <SelectItem key={'1'} className="dark:text-white">
                  Contribuyente
                </SelectItem>
                <SelectItem key={'0'} className="dark:text-white">
                  No Contribuyente
                </SelectItem>
              </Select>

              <Select
                className="w-72 sm:w-44 dark:text-white border-white border rounded-xl"
                classNames={{
                  label: 'font-semibold',
                }}
                defaultSelectedKeys={['5']}
                labelPlacement="outside"
                value={limit}
                variant="bordered"
                onChange={(e) => {
                  setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                }}
              >
                <SelectItem key={'5'} className="dark:text-white">
                  5
                </SelectItem>
                <SelectItem key={'10'} className="dark:text-white">
                  10
                </SelectItem>
                <SelectItem key={'20'} className="dark:text-white">
                  20
                </SelectItem>
                <SelectItem key={'30'} className="dark:text-white">
                  30
                </SelectItem>
                <SelectItem key={'40'} className="dark:text-white">
                  40
                </SelectItem>
                <SelectItem key={'50'} className="dark:text-white">
                  50
                </SelectItem>
                <SelectItem key={'100'} className="dark:text-white">
                  100
                </SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-center ml-2" />
          {(view === 'grid' || view === 'list') && (
            <MobileViewSupplier
              DeletePopover={DeletePopover}
              actions={actions}
              handleActive={handleActivate}
            />
          )}

          {view === 'table' && (
            <div className="overflow-x-auto custom-scrollbar ">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                    <ThGlobal className="text-left p-3">Telefono</ThGlobal>
                    <ThGlobal className="text-left p-3">Correo</ThGlobal>
                    <ThGlobal className="text-left p-3">Tipo de Proveedor</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {loading ? (
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
                      {supplier_pagination.suppliers.length > 0 ? (
                        <>
                          {supplier_pagination.suppliers.map((item, index) => (
                            <tr key={index} className="border-b border-slate-200">
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
                                <span
                                  className={`px-2 py-1 text-white rounded-lg ${
                                    item.esContribuyente ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                >
                                  {item.esContribuyente ? 'CONTRIBUYENTE' : 'CONSUMIDOR FINAL'}
                                </span>
                              </td>

                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  {item.isActive && actions.includes('Editar') && (
                                    <TooltipGlobal text="Editar">
                                      <ButtonUi
                                        isIconOnly
                                        className="border border-white"
                                        theme={Colors.Success}
                                        onPress={() => {
                                          if (item.esContribuyente === true) {
                                            navigate(`/update-supplier-tribute/${item.id}`);
                                            OnGetBySupplier(item.id ?? 0);
                                          } else {
                                            navigate(`/update-supplier-normal/${item.id}`);
                                            OnGetBySupplier(item.id ?? 0);
                                          }
                                        }}
                                      >
                                        <EditIcon className="text-white" size={20} />
                                      </ButtonUi>
                                    </TooltipGlobal>
                                  )}
                                  {item.isActive && actions.includes('Eliminar') && (
                                    <DeletePopover supplier={item} />
                                  )}
                                  <>
                                    {item.isActive &&
                                      item.esContribuyente === false &&
                                      actions.includes('Cambiar Tipo de Proveedor') && (
                                        <TooltipGlobal text="Cambiar el tipo de proveedor">
                                          <ButtonUi
                                            isIconOnly
                                            className="border border-white"
                                            theme={Colors.Warning}
                                            onPress={() => {
                                              navigate(`/update-supplier-tribute/${item.id}`);
                                              OnGetBySupplier(item.id ?? 0);
                                            }}
                                          >
                                            <Repeat size={20} />
                                          </ButtonUi>
                                        </TooltipGlobal>
                                      )}
                                  </>

                                  <>
                                    {!item.isActive && (
                                      <>
                                        {actions.includes('Activar') && (
                                          <ButtonUi
                                            isIconOnly
                                            theme={Colors.Info}
                                            onPress={() => {
                                              handleActivate(item.id ?? 0);
                                            }}
                                          >
                                            <RefreshCcw />
                                          </ButtonUi>
                                        )}
                                      </>
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
                              <img alt="X" className="w-32 h-32" src={NO_DATA} />
                              <p className="mt-3 text-xl dark:text-white">
                                No se encontraron resultados
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {supplier_pagination.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={supplier_pagination.currentPag}
                  nextPage={supplier_pagination.nextPag}
                  previousPage={supplier_pagination.prevPag}
                  totalPages={supplier_pagination.totalPag}
                  onPageChange={(page) => {
                    getSupplierPagination(page, limit, search, email, tipeSupplier);
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  currentPage={supplier_pagination.currentPag}
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
  const deleteDisclosure = useDisclosure();
  const { deleteSupplier } = useSupplierStore();

  const handleDelete = async () => {
    await deleteSupplier(supplier.id);
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
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {supplier.nombre}
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

export const BottomAdd = () => {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Popover
      showArrow
      aria-describedby="popover-id"
      aria-labelledby="popover-title"
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          className="bg-[#64DD17] text-white"
          endContent={<PlusIcon />}
          onClick={() => (isOpen ? onClose() : onOpen())}
        />
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title" className="border border-white">
        <div className="flex flex-col gap-5 p-3 bg-white dark:bg-zinc-900">
          <Button
            className="border bg-[#64DD17] text-white"
            onClick={() => {
              navigate('/add-supplier-normal');
            }}
          >
            Proveedor Consumidor Final
          </Button>
          <Button
            className="border bg-[#64DD17] text-white"
            onClick={() => {
              navigate('/add-supplier-tribute');
            }}
          >
            Proveedor Contribuyente
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
//   const navigate = useNavigate();
//   const { isOpen, onClose, onOpen } = useDisclosure();

//   return (
//     <Popover
//       aria-labelledby="popover-title"
//       aria-describedby="popover-id"
//       showArrow
//       onClose={onClose}
//       isOpen={isOpen}
//       backdrop="blur"
//     >
//       <PopoverTrigger>
//         <Button
//           className="flex lg:hidden  border border-white"
//           style={global_styles().thirdStyle}
//           onPress={() => (isOpen ? onClose() : onOpen())}
//           isIconOnly
//         >
//           <TooltipGlobal text="Agregar nuevo">
//             <PlusIcon />
//           </TooltipGlobal>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="border border-white" aria-labelledby="popover-title">
//         <div className="flex flex-col  gap-5 p-3 bg-white dark:bg-zinc-900">
//           <ButtonUi
//             className="border border-white"
//             onPress={() => {
//               navigate('/add-supplier-normal');
//             }}
//             theme={Colors.Primary}
//           >
//             Proveedor Consumidor Final
//           </ButtonUi>
//           <ButtonUi
//             className="border border-white"
//             onPress={() => {
//               navigate('/add-supplier-tribute');
//             }}
//             theme={Colors.Primary}
//           >
//             Proveedor Contribuyente
//           </ButtonUi>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };
