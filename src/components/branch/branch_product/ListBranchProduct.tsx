import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
  useDisclosure,
} from '@heroui/react';
import { Search, ArrowLeft, CreditCard, Table as ITable, Lock, NotepadText} from 'lucide-react';

import { useBranchesStore } from '../../../store/branches.store';
import { CategoryProduct } from '../../../types/categories.types';
import { useCategoriesStore } from '../../../store/categories.store';
import Pagination from '../../global/Pagination';
import SmPagination from '../../global/SmPagination';
import SearchBranchProduct from '../search_branch_product/SearchBranchProduct';

import MobileView from './MobileView';

import DetailsBranchProduct from './DetailsBranchProduct';
import NO_DATA from '@/assets/svg/no_data.svg';
import { formatCurrency } from '@/utils/dte';
import BottomDrawer from '@/components/global/BottomDrawer';
import { limit_options } from '@/utils/constants';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ModalGlobal from '@/components/global/ModalGlobal';
interface Props {
  id: number;
  onclick: () => void;
}
export default function ListBranchProduct({ id, onclick }: Props) {
  const {
    getBranchProducts,
    branch_product_Paginated,
    loading_branch_product,
    branch_products_list,
  } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore();
  const [category, setCategory] = useState('');
  const [code, setCode] = useState('');
  const [page, serPage] = useState(1);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(10);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const modalDetails = useDisclosure();

  const [openVaul, setOpenVaul] = useState(false);
  //   const modalAdd = useDisclosure();
  const changePage = () => {
    getBranchProducts(id, page, limit, name, category, code);
  };

  useEffect(() => {
    getBranchProducts(id, page, limit, name, category, code);
  }, [id, limit]);
  useEffect(() => {
    getListCategories();
  }, []);

  return (
    <>
      <div className=" w-full h-full p-5 pr-2 pl-0 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button className="mb-4  w-24 cursor-pointer flex" onClick={onclick}>
            <ArrowLeft className="dark:text-white mr-2" />
            <p className="dark:text-white">Regresar</p>
          </button>
          <div className="hidden w-full   gap-2 mb-4 md:grid">
            <div className="flex gap-5 ">
              <Input
                isClearable
                autoComplete="search"
                className="w-full  order-1"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                id="searchName"
                label="Nombre"
                labelPlacement="outside"
                name="searchName"
                placeholder="Buscar por nombre..."
                startContent={<Search />}
                value={name}
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
                onClear={() => setName('')}
              />
              <Input
                isClearable
                autoComplete="search"
                className="w-full  order-2"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                id="searCode"
                label="Código"
                labelPlacement="outside"
                name="searCode"
                placeholder="Buscar por codigo..."
                startContent={<Search />}
                value={code}
                variant="bordered"
                onChange={(e) => setCode(e.target.value)}
                onClear={() => setCode('')}
              />

              <Autocomplete
                className="w-full  order-3"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                clearButtonProps={{
                  onClick: () => setCategory(''),
                }}
                label="Categoria"
                labelPlacement="outside"
                placeholder="Selecciona la categoría"
                value={category}
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as CategoryProduct;

                    setCategory(branchSelected.name);
                  }
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>
          <SearchBranchProduct />
          <div className="w-full flex items-end justify-between">
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

            <div className="flex items-end gap-5">
              <div>
                <Select
                  className="w-44"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Mostrar"
                  labelPlacement="outside"
                  placeholder="Mostrar"
                  value={limit}
                  variant="bordered"
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                  }}
                >
                  {limit_options.map((limit) => (
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="hidden md:flex">
                <ButtonUi color="primary" theme={Colors.Primary} onPress={() => changePage()}>
                  Buscar
                </ButtonUi>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-5  md:grid-cols-2">
            <div className="flex items-end justify-between gap-10 mt lg:justify-end">
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                  <BottomDrawer
                    open={openVaul}
                    title="Filtros disponibles"
                    onClose={() => setOpenVaul(false)}
                  >
                    <div className="flex flex-col gap-3">
                      <>
                        <Input
                          isClearable
                          autoComplete="search"
                          className="w-full xl:w-96"
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          id="searchName"
                          label="Nombre"
                          labelPlacement="outside"
                          name="searchName"
                          placeholder="Buscar por nombre..."
                          startContent={<Search />}
                          value={name}
                          variant="bordered"
                          onChange={(e) => setName(e.target.value)}
                          onClear={() => setName('')}
                        />
                        <Input
                          isClearable
                          autoComplete="search"
                          className="w-full xl:w-96"
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          id="searCode"
                          label="Código"
                          labelPlacement="outside"
                          name="searCode"
                          placeholder="Buscar por código..."
                          startContent={<Search />}
                          value={code}
                          variant="bordered"
                          onChange={(e) => setCode(e.target.value)}
                          onClear={() => setCode('')}
                        />
                        <Autocomplete
                          className="w-full xl:w-80"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          clearButtonProps={{
                            onClick: () => setCategory(''),
                          }}
                          defaultSelectedKey={`${category}`}
                          label="Categoría"
                          labelPlacement="outside"
                          placeholder="Selecciona la categoría"
                          value={category}
                          variant="bordered"
                          onSelectionChange={(key) => {
                            if (key) {
                              setCategory(key as string);
                            }
                          }}
                        >
                          {list_categories.map((bra) => (
                            <AutocompleteItem key={bra.name} className="dark:text-white">
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </>
                      <Button
                        className="mb-10 font-semibold"
                        onPress={() => {
                          changePage();
                          setOpenVaul(false);
                        }}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </BottomDrawer>
                </div>
              </div>
            </div>
          </div>
          {view === 'table' && (
            <>
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
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
                        Codigo
                      </th>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Precio
                      </th>
                       <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Stock
                      </th>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Reservado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="max-h-[600px] w-full overflow-y-auto">
                    {loading_branch_product ? (
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
                        {branch_products_list.length > 0 ? (
                          <>
                            {branch_products_list.map((cat, index) => (
                              <tr key={index} className="border-b border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {cat.id}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                  {cat.product.name}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {cat.product.code}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {formatCurrency(Number(cat.price))}
                                </td>
                                <td className="p-3 text-sm text-green-500 dark:text-slate-100">
                                  {cat.stock}
                                </td>
                                <td className="p-3 text-sm text-red-500 dark:text-slate-100">
                                  {cat.reserved}
                                </td>
                                {/* <td>
                                  <ButtonUi
                                    isIconOnly
                                    className="flex font-semibold border border-white cursor-pointer"
                                    theme={Colors.Info}
                                    type="button"
                                    onPress={() => {modalDetails.onOpen();
                                    }}
                                    // tooltipText='Detalles'
                                    // showTooltip
                                  >
                                     <NotepadText />
                                  </ButtonUi>
                                </td> */}
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={5}>
                              <div className="flex flex-col items-center justify-center w-full">
                                <img alt="X" className="w-32 h-32" src={NO_DATA} />
                                <p className="mt-3 text-xl">No se encontraron resultados</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {(view === 'grid' || view === 'list') && <MobileView layout={'grid'} />}

          {branch_product_Paginated.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={branch_product_Paginated.currentPag}
                  nextPage={branch_product_Paginated.nextPag}
                  previousPage={branch_product_Paginated.prevPag}
                  totalPages={branch_product_Paginated.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getBranchProducts(id, page, limit, name, category, code);
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  currentPage={branch_product_Paginated.currentPag}
                  handleNext={() => {
                    serPage(branch_product_Paginated.nextPag);

                    getBranchProducts(
                      id,
                      branch_product_Paginated.nextPag,
                      limit,
                      name,
                      category,
                      code
                    );
                  }}
                  handlePrev={() => {
                    serPage(branch_product_Paginated.prevPag);
                    getBranchProducts(
                      id,
                      branch_product_Paginated.prevPag,
                      limit,
                      name,
                      category,
                      code
                    );
                  }}
                  totalPages={branch_product_Paginated.totalPag}
                />
              </div>
            </>
          )}
            <ModalGlobal
        isOpen={modalDetails.isOpen}
        size='w-[40vw]'
        onClose={() => modalDetails.onClose()}
        title='Reservado'
        >
          <DetailsBranchProduct onClose={() => modalDetails.onClose()}/>
        </ModalGlobal>
        </div>

      </div>
    </>
  );
}
