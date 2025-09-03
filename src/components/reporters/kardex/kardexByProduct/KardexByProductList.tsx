import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import debounce from 'debounce';
import { useOutletContext } from 'react-router';

import TableKardexProduct from './TableKardexProduct';
import KardexProductCardView from './KardexProductCardView';
import { DownloadKardexProductPDFButton } from './KardexByProductPDF';
import { DownloadKardexProductExcelButton } from './KardexByProductExcel';

import { useReportKardex } from "@/store/reports/reportKardex.store";
import LoadingTable from '@/components/global/LoadingTable';
import Pagination from '@/components/global/Pagination';
import useWindowSize from '@/hooks/useWindowSize';
import { get_user } from '@/storage/localStorage';
import { limit_options } from '@/utils/constants';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useBranchesStore } from '@/store/branches.store';
import RenderViewButton from '@/components/global/render-view-button';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import EmptyTable from '@/components/global/EmptyTable';
import { useProductsStore } from '@/store/products.store';
import { getElSalvadorDateTime } from '@/utils/dates';

type ContextType = {
  actionView: string[];
};


export const KardexByProductList = () => {
  const user = get_user();
  const { actionView } = useOutletContext<ContextType>();

  const { getBranchesList, branch_list } = useBranchesStore();
  const { getReportKardexByProduct, paginationKardexProduct, isLoadinKarProd, totales } = useReportKardex();
  const { windowSize } = useWindowSize();
  const { productsFilteredList, getProductsFilteredList } = useProductsStore()
  const [branchName, setBranchName] = useState('');

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [search, setSearch] = useState({
    page: 1,
    limit: 20,
    productId: 0,
    branchId: user?.branchId,
    startDate: defaultStartDate.toISOString().split('T')[0],
    endDate: getElSalvadorDateTime().fecEmi,
    productName: ''
  });
  
  const changePage = (page: number) => {
    getReportKardexByProduct(
      Number(search.branchId),
      page,
      search.limit,
      search.productName,
      search.startDate,
      search.endDate
    );
  };

  const options_limit = [
    { label: 'Todos', value: paginationKardexProduct.total },
    ...limit_options.map((option) => ({ label: option, value: option })),
  ];

  const handleSearchProduct = useCallback(
    debounce((value: string) => {
      getProductsFilteredList({
        productName: value,
        code: ''
      });
    }, 300),
    [search.branchId]
  );

  useEffect(() => {
    getBranchesList();
    getProductsFilteredList({
      productName: '',
      code: ''
    });
  }, []);

  useEffect(() => {
    getReportKardexByProduct(
      Number(search.branchId),
      1,
      search.limit,
      search.productName,
      search.startDate,
      search.endDate
    );
  }, [search.branchId, search.startDate, search.endDate, search.productName, search.limit]);

  useEffect(() => {
    const branchName = branch_list.find((branch) => branch.id === search.branchId)?.name ?? '';

    setBranchName(branchName);
  }, [branch_list])

  return (
    <>
      <div className="flex flex-col gap-5 items-end w-full">
        <section className="flex flex-row-reverse lg:flex-col gap-4 pt-4 w-full">
          <ResponsiveFilterWrapper classLg='grid grid-cols-4 gap-4 w-full' withButton={false}>
            <Autocomplete
              className="font-semibold dark:text-white w-full"
              defaultSelectedKey={String(search.branchId)}
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona la sucursal"
              variant="bordered"
              onSelectionChange={(key) => {
                const newBranchId = Number(key);
                const branchName = branch_list.find((branch) => branch.id === newBranchId)?.name ?? '';

                setSearch({
                  ...search,
                  branchId: newBranchId,
                });

                setBranchName(branchName);
              }}
            >
              {branch_list.map((branch) => (
                <AutocompleteItem key={branch.id} className="dark:text-white">
                  {branch.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              isClearable
              className="font-semibold dark:text-white w-full"
              label="Producto"
              labelPlacement="outside"
              listboxProps={{
                emptyContent: "Escribe para buscar",
              }}
              placeholder="Selecciona un producto"
              selectedKey={String(search.productId)}
              startContent={<SearchIcon />}
              variant="bordered"
              onClear={() => setSearch({ ...search, productId: 0, productName: '' })}
              onInputChange={(value) => {
                handleSearchProduct(value);
              }}
              onSelectionChange={(key) => {
                const product = productsFilteredList.find((item) => item.id === Number(key))

                setSearch({
                  ...search, productName: String(product?.name),
                  productId: Number(key)
                })
              }}
            >
              {productsFilteredList.map((bp) => (
                <AutocompleteItem key={bp.id} className="dark:text-white">
                  {bp.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Input
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              labelPlacement="outside"
              type="date"
              value={search.startDate}
              variant="bordered"
              onChange={(e) => {
                setSearch({ ...search, startDate: e.target.value });
              }}
            />
            <Input
              className="dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Fecha final"
              labelPlacement="outside"
              type="date"
              value={search.endDate}
              variant="bordered"
              onChange={(e) => {
                setSearch({ ...search, endDate: e.target.value });
              }}
            />
            <div className='flex gap-3 w-full justify-between'>
            <Select
              disallowEmptySelection
              aria-label="Cantidad a mostrar"
              className=" dark:text-white max-w-64 max-md:hidden"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['20']}
              labelPlacement="outside"
              value={search.limit}
              variant="bordered"
              onChange={(e) => {
                setSearch({ ...search, limit: Number(e.target.value) });
              }}
            >
              {options_limit.map((limit) => (
                <SelectItem key={limit.value} className="dark:text-white">
                  {limit.label}
                </SelectItem>
              ))}
            </Select>
            <div className='hidden lg:flex'>
             <RenderViewButton isList setView={setView} view={view} />
             </div>
            </div>
           <div className="flex gap-3 items-center col-start-4 justify-end hidden lg:flex">
              {JSON.stringify(actionView).includes('Descargar PDF') && (
                <DownloadKardexProductPDFButton branchName= {branchName}
                   search={search}
                />
              )}
              {JSON.stringify(actionView).includes('Exportar Excel') && (
                <DownloadKardexProductExcelButton branchName= {branchName}
                   search={search}
                />
              )}
            </div>
          </ResponsiveFilterWrapper>
           <div className='flex justify-between gap-4 w-full lg:hidden flex'>
            <RenderViewButton isList setView={setView} view={view} />
            <div className="flex gap-3 items-center">
              {JSON.stringify(actionView).includes('Descargar PDF') && (
                <DownloadKardexProductPDFButton branchName= {branchName}
                   search={search}
                />
              )}
              {JSON.stringify(actionView).includes('Exportar Excel') && (
                <DownloadKardexProductExcelButton branchName= {branchName}
                   search={search}
                />
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col w-full max-w-[380px] gap-1 flex-1 dark:text-white px-3 py-2 rounded-xl bg-slate-100 shadow-sm dark:bg-slate-700">
          <div className='flex gap-4 justify-between w-full'>
          <span className="flex gap-1 font-semibold">
            Nombre:
            {totales.productName ? (
              <TooltipGlobal text={totales.productName}>
                <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {totales.productName}
                </p>
              </TooltipGlobal>
            ) : (
              <p className="text-gray-400">Sin producto</p>
            )}

          </span>
          {/* <span className="font-semibold">Stock Inicial: {totales.initialStock}</span> */}
          <span className="font-semibold text-gray-500"> stock actual: {totales.stockActual}</span>
          </div>
          <div className='flex gap-4 justify-between w-full'>
          <span className="font-semibold">Total de entradas: {totales.totalEntradas}</span>
          <span className="font-semibold">Total de salidas: {totales.totalSalidas}</span>
          </div>
        </section>
      </div>

      {view === 'grid' && (
        <>
          {isLoadinKarProd ? (
            <LoadingTable />
          ) : (
            <>
              {paginationKardexProduct.totalPag > 0 ? (
                <KardexProductCardView view={view} />
              ) : (
                <EmptyTable />
              )}
            </>
          )}
        </>
      )}
      {
        view === 'list' && (
          <>
            {isLoadinKarProd ? (
              <LoadingTable />
            ) : (
              <>
                {paginationKardexProduct.totalPag > 0 ? (
                  <KardexProductCardView view={view} />
                ) : (
                  <EmptyTable />
                )}
              </>
            )}
          </>
        )
      }

      {view === 'table' && <TableKardexProduct />}

      {
        paginationKardexProduct.totalPag > 1 && (
          <Pagination
            currentPage={paginationKardexProduct.currentPag}
            nextPage={paginationKardexProduct.nextPag}
            previousPage={paginationKardexProduct.prevPag}
            totalPages={paginationKardexProduct.totalPag}
            onPageChange={(page) => changePage(page)}
          />
        )
      }
    </>
  );
};
