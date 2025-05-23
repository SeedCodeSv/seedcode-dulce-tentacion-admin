import { useEffect, useState } from 'react';
import {
  Button,
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
  Mail,
  RefreshCcw,
  Trash,
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

import { Supplier } from '../../types/supplier.types';
import { useSupplierStore } from '../../store/supplier.store';
import Pagination from '../global/Pagination';
import TooltipGlobal from '../global/TooltipGlobal';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';
import RenderViewButton from '../global/render-view-button';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';

import MobileViewSupplier from './MobileViewSupplier';

import useWindowSize from '@/hooks/useWindowSize';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { limit_options } from '@/utils/constants';

function ListSuppliers({ actions }: ArrayAction) {
  const { getSupplierPagination, supplier_pagination, activateSupplier, loading } =
    useSupplierStore();

  const [searchParams, setSearchParams] = useState({
    limit: 5,
    page: 1,
    name: '',
    email: '',
    nit: '',
    nrc: '',
    active: true,
    tipeSupplier: ''
  })
  const { windowSize } = useWindowSize();
  const store = useSupplierStore();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  useEffect(() => {
    getSupplierPagination(1, searchParams.limit, searchParams.name, searchParams.email, searchParams.nit, searchParams.nrc, searchParams.tipeSupplier, searchParams.active ? 1 : 0);
  }, [])

  useEffect(() => {
    store.supplier_type = searchParams.tipeSupplier;
  }, [searchParams.tipeSupplier]);

  const clearAndSearch = (field: keyof typeof searchParams) => {
    const newParams = { ...searchParams, [field]: '' };

    setSearchParams(newParams);
    handleSearchMultipleParams(newParams);
  };

  const handleSearchMultipleParams = (params: typeof searchParams) => {
    getSupplierPagination(
      params.page,
      params.limit,
      params.name,
      params.email,
      params.nit,
      params.nrc,
      params.tipeSupplier,
      params.active ? 1 : 0
    );
  };

  const handleActivate = (id: number) => {
    activateSupplier(id).then(() => {
      getSupplierPagination(searchParams.page, searchParams.limit, searchParams.name, searchParams.email, searchParams.nit, searchParams.nrc, searchParams.tipeSupplier, searchParams.active ? 1 : 0);
    });
  };
  const { OnGetBySupplier } = useSupplierStore();

  const navigate = useNavigate();

  return (
    <>
      <DivGlobal className="flex flex-col h-full overflow-y-auto">
        <div className='flex lg:flex-col items-start justify-between'>
          <ResponsiveFilterWrapper onApply={() => handleSearchMultipleParams(searchParams)}>
            <Input
              isClearable
              className="dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<User />}
              value={searchParams.name}
              variant="bordered"
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              onClear={() => clearAndSearch('name')}
            />
            <Input
              isClearable
              className=" dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Correo"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Mail />}
              value={searchParams.email}
              variant="bordered"
              onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
              onClear={() => clearAndSearch('email')}
            />
            <Select
              className="w-full dark:text-white"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['']}
              labelPlacement="outside"
              value={String(searchParams.tipeSupplier)}
              variant="bordered"
              onChange={(e) => {
                setSearchParams({ ...searchParams, tipeSupplier: e.target.value !== '' ? e.target.value : '' });
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
          </ResponsiveFilterWrapper>

          <div className="flex flex-col w-full my-6 gap-4 lg:flex-row lg:justify-between items-end lg:gap-10">
            <RenderViewButton setView={setView} view={view} />
            <div className="flex gap-3 w-full justify-end items-end">
              <Select
                disallowEmptySelection
                className="w-72 sm:w-44 dark:text-white"
                classNames={{
                  label: 'font-semibold',
                }}
                defaultSelectedKeys={['5']}
                labelPlacement="outside"
                value={searchParams.limit}
                variant="bordered"
                onChange={(e) => {
                  setSearchParams({ ...searchParams, limit: Number(e.target.value !== '' ? e.target.value : '5') });
                }}
              >
                {limit_options.map((option) => (
                  <SelectItem key={option} className="dark:text-white">
                    {option}
                  </SelectItem>
                ))}
              </Select>
              {actions.includes('Agregar') && (
                <>
                  <BottomAdd />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="my-2">
          <Switch
            classNames={{
              thumb: classNames(searchParams.active ? 'bg-blue-500' : 'bg-gray-400'),
              wrapper: classNames(searchParams.active ? '!bg-blue-300' : 'bg-gray-200'),
            }}
            isSelected={searchParams.active}
            onValueChange={(active) => setSearchParams({ ...searchParams, active })}
          >
            <span className="text-sm sm:text-base whitespace-nowrap">
              Mostrar {searchParams.active ? 'inactivos' : 'activos'}
            </span>
          </Switch>
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
          <TableComponent
            headers={['Nº', 'Nombre', 'Telefono', 'Correo', 'Tipo de Proveedor', 'Acciones']}>
            {loading ? (
              <tr>
                <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                  <LoadingTable />
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
                            className={`px-2 py-1 text-white rounded-lg ${item.esContribuyente ? 'bg-green-500' : 'bg-red-500'
                              }`}
                          >
                            {item.esContribuyente ? 'CONTRIBUYENTE' : 'CONSUMIDOR FINAL'}
                          </span>
                        </td>

                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                          <div className="flex w-full gap-5">
                            {item.isActive && actions.includes('Editar') && (
                              <ButtonUi
                                isIconOnly
                                showTooltip
                                className="border border-white"
                                theme={Colors.Success}
                                tooltipText='Editar'
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
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
        )}
        {supplier_pagination.totalPag > 1 && (
          <>
            <div className="w-full mt-5">
              <Pagination
                currentPage={supplier_pagination.currentPag}
                nextPage={supplier_pagination.nextPag}
                previousPage={supplier_pagination.prevPag}
                totalPages={supplier_pagination.totalPag}
                onPageChange={(page) => {
                  getSupplierPagination(page, searchParams.limit, searchParams.name, searchParams.email, searchParams.nit, searchParams.nrc, searchParams.tipeSupplier, searchParams.active ? 1 : 0);
                }}
              />
            </div>

          </>
        )}
      </DivGlobal>
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
        <ButtonUi
          isIconOnly
          endContent={<PlusIcon />}
          theme={Colors.Success}
          onPress={() => (isOpen ? onClose() : onOpen())}
        />
      </PopoverTrigger>
      <PopoverContent aria-labelledby="popover-title" className="border border-white">
        <div className="flex flex-col gap-5 p-3 bg-white dark:bg-zinc-900">
          <Button
            className="border bg-[#64DD17] text-white"
            onPress={() => {
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

