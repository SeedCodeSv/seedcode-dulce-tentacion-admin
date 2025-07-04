import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useOutletContext } from 'react-router';

import KardexTable from './TableKardex';
import MobileViewKardex from './KardexCardView';
import DownloadPDFButton from './KardexPDF';
import KardexExportExcell from './kardexExcell';

import { useBranchesStore } from '@/store/branches.store';
import { limit_options } from '@/utils/constants';
import useWindowSize from '@/hooks/useWindowSize';
import { get_user } from '@/storage/localStorage';
import EMPTY from '@/assets/animations/Animation - 1724269736818.json';
import { useTransmitterStore } from '@/store/transmitter.store';
import { Branches } from '@/types/branches.types';
import Pagination from '@/components/global/Pagination';
import { DataKardex } from '@/types/reports/reportKardex.types';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import LoadingTable from '@/components/global/LoadingTable';
import DivGlobal from '@/themes/ui/div-global';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import RenderViewButton from '@/components/global/render-view-button';

type ContextType = {
  actionView: string[];
};

export default function KardexComponent() {
  const { actionView } = useOutletContext<ContextType>();

  const user = get_user();
  const { transmitter, gettransmitter } = useTransmitterStore();

  const { getBranchesList, branch_list } = useBranchesStore();
  const { pagination_kardex, loading, getReportKardexGeneral } = useReportKardex();
  const { windowSize } = useWindowSize();
  const [data, setData] = useState<DataKardex[]>([]);
  const [branch, setBranch] = useState<Branches>();

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const currentDate = new Date();
  const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const [search, setSearch] = useState({
    limit: 20,
    name: '',
    branch: user?.branchId ?? 0,
    startDate: defaultStartDate.toISOString().split('T')[0],
    endDate: currentDate.toISOString().split('T')[0],
  });

  useEffect(() => {
    gettransmitter();
    getBranchesList();
    getReportKardexGeneral(Number(search.branch), 1, search.limit, search.name, search.startDate, search.endDate);
  }, []);

  const handleSearch = () => {
    getReportKardexGeneral(Number(search.branch), 1, search.limit, search.name, search.startDate, search.endDate);
  }

  const changePage = (page: number) => {
    getReportKardexGeneral(Number(search.branch), page, search.limit, search.name, search.startDate, search.endDate);
  };

  const options_limit = [
    { label: 'Todos', value: pagination_kardex.total },
    ...limit_options.map((option) => ({ label: option, value: option })),
  ];

  useEffect(() => {
    if (!branch && user && branch_list && branch_list.length > 0) {
      const branch = branch_list.find((item) => item.id === user.branchId);

      setBranch(branch);
    }
  }, [branch_list]);

  return (
    <DivGlobal className="flex flex-col h-full overflow-y-auto pt-1">
      <div className="my-3 flex gap-5 justify-between lg:flex-col items-end">
        <ResponsiveFilterWrapper classButtonLg='col-start-4 justify-self-end w-1/2' classLg='grid grid-cols-4 w-full gap-4 items-end justify-end' onApply={() => handleSearch()}>
          <Autocomplete
            className="font-semibold dark:text-white w-full"
            defaultSelectedKey={String(search.branch)}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            onSelectionChange={(key) => {

              if (!key) return;
              const branchselected = branch_list.find(
                (item) => String(item.id) === key
              );

              setBranch(branchselected);

              setSearch({ ...search, branch: Number(key) });
            }}
          >
            {branch_list.map((branch) => (
              <AutocompleteItem key={branch.id} className="dark:text-white">
                {branch.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            isClearable
            className="w-full dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            label="Nombre"
            labelPlacement="outside"
            placeholder="Escribe para buscar..."
            startContent={<SearchIcon />}
            value={search.name}
            variant="bordered"
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            onClear={() => {
              setSearch({ ...search, name: '' });
            }}
          />
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
          <Select
            disallowEmptySelection
            className="w-full dark:text-white "
            classNames={{
              label: 'font-semibold',
            }}
            defaultSelectedKeys={['20']}
            label="Mostrar"
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
        </ResponsiveFilterWrapper>
        <div className="w-full flex gap-5 justify-between items-end">
          <RenderViewButton isList setView={setView} view={view} />
          {view === 'table' && (
            <div className="flex gap-3">
              {JSON.stringify(actionView).includes('Descargar PDF') && (
                <DownloadPDFButton branch={branch!} tableData={data} transmitter={transmitter} />
              )}
              {JSON.stringify(actionView).includes('Exportar Excel') && (
                <KardexExportExcell branch={branch!} tableData={data} transmitter={transmitter} />
              )}
            </div>
          )}
        </div>
      </div>
      {view === 'grid' && (
        <>
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              {pagination_kardex.totalPag > 0 ? (
                <MobileViewKardex actions={actionView} branch={branch!} transmitter={transmitter} view={view} />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <Lottie animationData={EMPTY} className="w-96" />
                  <p className="text-2xl dark:text-white">No se encontraron resultados</p>
                </div>
              )}
            </>
          )}
        </>
      )}
      {view === 'list' && (
        <>
          {loading ? (
            <LoadingTable />
          ) : (
            <>
              {pagination_kardex.totalPag > 0 ? (
                <MobileViewKardex actions={actionView} branch={branch!} transmitter={transmitter} view={view} />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <Lottie animationData={EMPTY} className="w-96" />
                  <p className="text-2xl dark:text-white">No se encontraron resultados</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {view === 'table' && <KardexTable data={(data) => setData(data)} />}
      {pagination_kardex.totalPag > 1 && (
        <Pagination
          currentPage={pagination_kardex.currentPag}
          nextPage={pagination_kardex.nextPag}
          previousPage={pagination_kardex.prevPag}
          totalPages={pagination_kardex.totalPag}
          onPageChange={(page) => changePage(page)}
        />
      )}
    </DivGlobal>
  );
}
