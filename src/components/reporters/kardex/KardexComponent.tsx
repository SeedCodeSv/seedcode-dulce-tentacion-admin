import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { CreditCard, List, Table as ITable, SearchIcon, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

import KardexTable from './TableKardex';
import MobileViewKardex from './KardexCardView';
import DownloadPDFButton from './KardexPDF';

import { useBranchesStore } from '@/store/branches.store';
import { limit_options } from '@/utils/constants';
import useWindowSize from '@/hooks/useWindowSize';
import { get_user } from '@/storage/localStorage';
import { global_styles } from '@/styles/global.styles';
import EMPTY from '@/assets/animations/Animation - 1724269736818.json';
import { useTransmitterStore } from '@/store/transmitter.store';
import { Branches } from '@/types/branches.types';
import Pagination from '@/components/global/Pagination';
import { Kardex } from '@/types/reports/reportKardex.types';
import { useDebounce } from '@/hooks/useDebounce';
import { useReportKardex } from '@/store/reports/reportKardex.store';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import LoadingTable from '@/components/global/LoadingTable';
import BottomDrawer from '@/components/global/BottomDrawer';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';


export default function KardexComponent() {
  const user = get_user();
  const [openVaul, setOpenVaul] = useState(false);
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
  },[branch_list]);

  useEffect(() => {
    OnGetReportKardex(Number(search.branch), 1, search.limit, search.name);
  }, [debounceName]);


  return (
    <div className="w-full h-full p-4 md:p-6  md:px-4 bg-gray-50 dark:bg-gray-800">
      <div className="w-90 h-full flex flex-col p-5 mt-2 rounded-xl overflow-y-auto bg-white custom-scrollbar shadow border dark:border-gray-700 dark:bg-gray-900">
        <div className="w-full hidden gap-5 md:flex">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full items-end ">
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
            <div className="flex gap-5">
              <Select
                disallowEmptySelection
                className=" dark:text-white "
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
            </div>
          </div>
        </div>
        <div className="mt-0 md:mt-3 md:mb-2 flex gap-5 justify-end md:justify-start">
          <ButtonGroup>
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
            <ButtonUi
              isIconOnly
              theme={view === 'list' ? Colors.Primary : Colors.Default}
              onPress={() => setView('list')}
            >
              <List />
            </ButtonUi>
          </ButtonGroup>
          {view === 'table' && (
            <div className="">
              <DownloadPDFButton branch={branch!} tableData={data} transmitter={transmitter} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-5 md:hidden">
          <TooltipGlobal color="primary" text="Filtros disponibles">
            <Button
              isIconOnly
              style={global_styles().thirdStyle}
              type="button"
              onPress={() => setOpenVaul(true)}
            >
              <Filter />
            </Button>
          </TooltipGlobal>
          <div className="block md:hidden">
            <BottomDrawer
              open={openVaul}
              title="Filtros disponibles"
              onClose={() => setOpenVaul(false)}
            >
              <div className="flex flex-col gap-3">
                <Autocomplete
                  className="font-semibold dark:text-white w-full"
                  defaultSelectedKey={String(search.branch)}
                  label="Sucursal"
                  labelPlacement="outside"
                  placeholder="Selecciona la sucursal"
                  variant="bordered"
                  onSelectionChange={(key) => setSearch({ ...search, branch: Number(key) })}
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
                  className="md:w-48 dark:text-white "
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
              </div>
            </BottomDrawer>
          </div>
        </div>
        {view === 'grid' && (
          <>
            {loading ? (
              <LoadingTable />
            ) : (
              <>
                {pagination_kardex.totalPag > 0 ? (
                  <MobileViewKardex branch={branch!} transmitter={transmitter} view={view} />
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
                  <MobileViewKardex branch={branch!} transmitter={transmitter} view={view} />
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
      </div>
    </div>
  );
}
