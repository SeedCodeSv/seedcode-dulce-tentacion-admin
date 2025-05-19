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
import { Kardex } from '@/types/reports/reportKardex.types';
import { useDebounce } from '@/hooks/useDebounce';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import LoadingTable from '@/components/global/LoadingTable';
import DivGlobal from '@/themes/ui/div-global';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import RenderViewButton from '@/components/global/render-view-button';

interface PProps {
  actions: string[];
}

export default function KardexComponent({ actions }: PProps) {
  const user = get_user();
  const { transmitter, gettransmitter } = useTransmitterStore();

  const { getBranchesList, branch_list } = useBranchesStore();
  const { OnGetReportKardex, pagination_kardex, loading } = useReportKardex();
  const { windowSize } = useWindowSize();
  const [data, setData] = useState<Kardex[]>([]);
  const [branch, setBranch] = useState<Branches>();

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const [search, setSearch] = useState({
    limit: 20,
    name: '',
    branch: user?.branchId ?? 0,
  });

  const debounceName = useDebounce(search.name, 300);

  useEffect(() => {
    gettransmitter();
    getBranchesList();
  }, []);

  useEffect(() => {
    OnGetReportKardex(Number(search.branch), 1, search.limit, search.name);
  }, [search.branch, search.limit]);

  const changePage = (page: number) => {
    OnGetReportKardex(Number(search.branch), page, search.limit, search.name);
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

  useEffect(() => {
    OnGetReportKardex(Number(search.branch), 1, search.limit, search.name);
  }, [debounceName]);


  return (
    <DivGlobal className="flex flex-col h-full overflow-y-auto">
      <div className="my-3 flex gap-5 justify-between lg:flex-col items-end">
        <ResponsiveFilterWrapper withButton={false}>
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
            {actions.includes('Descargar PDF') && (
            <DownloadPDFButton branch={branch!} tableData={data} transmitter={transmitter} />
            )}
            {actions.includes('Exportar Excel') && (
            <KardexExportExcell  branch={branch!} tableData={data} transmitter={transmitter} />
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
                <MobileViewKardex actions={actions} branch={branch!} transmitter={transmitter} view={view} />
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
                <MobileViewKardex actions={actions} branch={branch!} transmitter={transmitter} view={view} />
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
