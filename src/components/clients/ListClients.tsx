import { Input, Select, SelectItem, Switch, Autocomplete, AutocompleteItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  Mail,
  RefreshCcw,
  Repeat,
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';

import { useCustomerStore } from '../../store/customers.store';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import AddButton from '../global/AddButton';
import RenderViewButton from '../global/render-view-button';
import LoadingTable from '../global/LoadingTable';
import EmptyTable from '../global/EmptyTable';

import SearchClient from './search_client/SearchClient';
import ModeGridClients from './view-modes/ModeGridClients';
import { DeletePopover } from './view-modes/DeleteClients';

import useWindowSize from '@/hooks/useWindowSize';
import { useBranchesStore } from '@/store/branches.store';
import EMPTY from '@/assets/animations/Animation - 1724269736818.json';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { limit_options } from '@/utils/constants';

interface Props {
  actions: string[];
}

const ListClients = ({ actions }: Props) => {
  const { getCustomersPagination, customer_pagination, save_active_customer, loading_customer } = useCustomerStore();
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');

  const [active, setActive] = useState(true);
  const [tipeCustomer, setTypeCustomer] = useState('');
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);
  
  useEffect(() => {
    getCustomersPagination(1, limit, search, email, branch, tipeCustomer, active ? 1 : 0);
  }, [limit, tipeCustomer, active]);

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
      searchParam ?? branch,
      tipeCustomer ?? 0,
      active ? 1 : 0
    );
  };

  const navigate = useNavigate();

  const handleActivate = (id: number) => {
    save_active_customer(id).then(() => {
      getCustomersPagination(1, limit, '', '', '', '', active ? 1 : 0);
    });
  };

  return (
    <>
      <DivGlobal>
        <div className="flex justify-between items-end ">
          <SearchClient
            emailCustomer={(email: string) => setEmail(email)}
            nameBranch={(name: string) => setBranch(name)}
            nameCustomer={(name: string) => setSearch(name)}
          />
          {actions.includes('Agregar') && (
            <>
              <AddButton onClick={() => navigate('/add-customer/0/0')} />
            </>
          )}
        </div>

        <div className="hidden w-full gap-5 md:flex">
          <div className="grid w-full grid-cols-4 gap-3">
            <Input
              isClearable
              className="w-full dark:text-white border border-white rounded-xl"
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
              className="w-full dark:text-white border border-white rounded-xl"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="correo"
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
            <div>
              <span className="font-semibold dark:text-white text-sm"> Sucursal</span>
              <Autocomplete
                className="w-full dark:text-white border border-white rounded-xl"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                clearButtonProps={{
                  onClick: () => setBranch(''),
                }}
                defaultSelectedKey={branch}
                placeholder="Selecciona una sucursal"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setBranch(key as string);
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
            <ButtonUi
              className="hidden mt-6 font-semibold md:flex"
              color="primary"
              theme={Colors.Primary}
              onPress={() => handleSearch(undefined)}
            >
              Buscar
            </ButtonUi>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex  justify-start order-2 lg:order-1">
            <Switch
              className="hidden xl:flex"
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

          <div className="flex xl:gap-10 gap-3 w-full  lg:justify-end order-1 lg:order-2">
            <div>
              <span className="font-semibold text-sm dark:text-white"> Tipo de Cliente</span>
              <Select
                className="xl:w-44 w-36 dark:text-white border border-white rounded-xl"
                classNames={{
                  label: 'font-semibold',
                }}
                labelPlacement="outside"
                placeholder="-- Seleccione tipo de cliente --"
                value={String(tipeCustomer)}
                variant="bordered"
                onChange={(e) => {
                  setTypeCustomer(e.target.value !== '' ? e.target.value : '');
                }}
              >
                <SelectItem key={'1'} className="dark:text-white">
                  Contribuyente
                </SelectItem>
                <SelectItem key={'0'} className="dark:text-white">
                  No Contribuyente
                </SelectItem>
                <SelectItem key={''} className="dark:text-white">
                  Todos
                </SelectItem>
              </Select>
            </div>
            <div>
              <span className="font-semibold dark:text-white text-sm">Mostrar</span>
              <Select
                className="xl:w-44 w-36 dark:text-white border border-white rounded-xl"
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
                {limit_options.map((option) => (
                  <SelectItem key={option} className="w-full dark:text-white">
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-end xl:mt-2 gap-12">
          <Switch
            className="xl:hidden flex"
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
          <RenderViewButton setView={setView} view={view} />
        </div>
        <div className="flex items-center justify-center ml-2" />

        <>
          {customer_pagination.customers.length > 0 ? (
            <>
              {view === 'grid' && (
                <ModeGridClients
                  actions={actions}
                  customers={customer_pagination.customers}
                  handleActivate={(id) => handleActivate(id)}
                />
              )}
              <div className="flex justify-end w-full py-3 md:py-0 bg-first-300" />
              {view === 'table' && (
                <>
                  <TableComponent
                    headers={['Nº', 'Nombre', 'Teléfono', 'Correo', 'Contribuyente', 'Acciones']}>
                    {loading_customer ? (
                      <tr>
                        <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                          <LoadingTable />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {customer_pagination.customers.length > 0 ? (
                          <>
                            {customer_pagination.customers.map((customer, index) => (
                              <tr key={index} className="border-b border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {customer.id}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                  {customer.nombre}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {customer.telefono}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {customer.correo}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  <span
                                    className={`px-2 py-1 text-white rounded-lg ${customer.esContribuyente ? 'bg-green-500' : 'bg-red-500'
                                      }`}
                                  >
                                    {customer.esContribuyente
                                      ? 'CONTRIBUYENTE'
                                      : 'CONSUMIDOR FINAL'}
                                  </span>
                                </td>

                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  <div className="flex w-full gap-5">
                                    {customer.isActive && actions.includes('Editar') && (
                                      <ButtonUi
                                        isIconOnly
                                        showTooltip
                                        theme={Colors.Primary}
                                        tooltipText='Editar'
                                        onPress={() =>
                                          navigate(
                                            `/add-customer/${customer.id}/${customer.esContribuyente ? 'tribute' : 'normal'}`
                                          )
                                        }
                                      >
                                        <EditIcon size={20} />
                                      </ButtonUi>
                                    )}
                                    {actions.includes('Eliminar') && (
                                      <>
                                        {customer.isActive && (
                                          <DeletePopover customers={customer} />
                                        )}
                                      </>
                                    )}
                                    {customer.isActive &&
                                      actions.includes('Cambiar Tipo de Cliente') && (
                                        <>
                                          {customer.esContribuyente === false && (
                                            <ButtonUi
                                              isIconOnly
                                              showTooltip
                                              theme={Colors.Primary}
                                              tooltipText='Cambiar tipo de Cliente'
                                              onPress={() =>
                                                navigate(
                                                  `/add-customer/${customer.id}/tribute`
                                                )
                                              }
                                            >
                                              <Repeat size={20} />
                                            </ButtonUi>
                                          )}
                                        </>
                                      )}
                                    {customer.isActive === false && (
                                      <>
                                        {actions.includes('Activar Cliente') && (
                                          <ButtonUi
                                            isIconOnly
                                            showTooltip
                                            theme={Colors.Primary}
                                            tooltipText='Activar'
                                            onPress={() => handleActivate(customer.id)}
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
                              <EmptyTable />
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </TableComponent>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Lottie animationData={EMPTY} className="w-96" />
              <p className="text-2xl">No se encontraron resultados</p>
            </div>
          )}
        </>

        {customer_pagination.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                currentPage={customer_pagination.currentPag}
                nextPage={customer_pagination.nextPag}
                previousPage={customer_pagination.prevPag}
                totalPages={customer_pagination.totalPag}
                onPageChange={(page) => {
                  serPage(page);
                  getCustomersPagination(
                    page,
                    limit,
                    search,
                    email,
                    branch,
                    tipeCustomer,
                    active ? 1 : 0
                  );
                }}
              />
            </div>
            <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
              <SmPagination
                currentPage={customer_pagination.currentPag}
                handleNext={() => {
                  serPage(customer_pagination.nextPag);

                  getCustomersPagination(
                    customer_pagination.nextPag,
                    limit,
                    search,
                    email,
                    branch,

                    tipeCustomer,
                    active ? 1 : 0
                  );
                }}
                handlePrev={() => {
                  serPage(customer_pagination.prevPag);
                  getCustomersPagination(
                    customer_pagination.prevPag,
                    limit,
                    search,
                    email,
                    branch,

                    tipeCustomer,
                    active ? 1 : 0
                  );
                }}
                totalPages={customer_pagination.totalPag}
              />
            </div>
          </>
        )}
      </DivGlobal>
    </>
  );
};

export default ListClients;
