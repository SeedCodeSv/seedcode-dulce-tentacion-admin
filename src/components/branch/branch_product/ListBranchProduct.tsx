import { useContext, useEffect, useState } from 'react';
import { useBranchesStore } from '../../../store/branches.store';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
} from '@nextui-org/react';
import { Search, Filter, ArrowLeft, CreditCard, Table as ITable } from 'lucide-react';
import { ThemeContext } from '../../../hooks/useTheme';
import MobileView from './MobileView';
import { global_styles } from '../../../styles/global.styles';
import { CategoryProduct } from '../../../types/categories.types';
import { useCategoriesStore } from '../../../store/categories.store';
import Pagination from '../../global/Pagination';
import SmPagination from '../../global/SmPagination';
import { limit_options } from '@/utils/constants';
import NO_DATA from '@/assets/svg/no_data.svg';
import { formatCurrency } from '@/utils/dte';
import BottomDrawer from '@/components/global/BottomDrawer';
interface Props {
  id: number;
  onclick: () => void;
}
function ListEmployee({ id, onclick }: Props) {
  const { theme } = useContext(ThemeContext);
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
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div onClick={onclick} className="mb-4  w-24 cursor-pointer flex">
            <ArrowLeft className="dark:text-white mr-2" />
            <p className="dark:text-white">Regresar</p>
          </div>
          <div className="hidden w-full   gap-2 mb-4 md:grid">
            <div className="flex gap-5 ">
              <Input
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                className="w-full  order-1"
                placeholder="Buscar por nombre..."
                startContent={<Search />}
                variant="bordered"
                label="Nombre"
                labelPlacement="outside"
                name="searchName"
                id="searchName"
                value={name}
                autoComplete="search"
                onChange={(e) => setName(e.target.value)}
                isClearable
                onClear={() => setName('')}
              />
              <Input
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                className="w-full  order-2"
                placeholder="Buscar por codigo..."
                startContent={<Search />}
                variant="bordered"
                name="searCode"
                label="Código"
                labelPlacement="outside"
                id="searCode"
                value={code}
                autoComplete="search"
                onChange={(e) => setCode(e.target.value)}
                isClearable
                onClear={() => setCode('')}
              />

              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as CategoryProduct;
                    setCategory(branchSelected.name);
                  }
                }}
                className="w-full  order-3"
                labelPlacement="outside"
                label="Categoria"
                placeholder="Selecciona la categoría"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                value={category}
                clearButtonProps={{
                  onClick: () => setCategory(''),
                }}
              >
                {list_categories.map((bra) => (
                  <AutocompleteItem
                    value={bra.name}
                    key={JSON.stringify(bra)}
                    className="dark:text-white"
                  >
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>
          <div className="w-full flex items-end justify-between">
            <ButtonGroup>
              <Button
                isIconOnly
                color="secondary"
                style={{
                  backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                  color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                }}
                onClick={() => setView('table')}
                type="button"
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
                type="button"
              >
                <CreditCard />
              </Button>
            </ButtonGroup>
            <Button style={global_styles().thirdStyle} isIconOnly onClick={() => setOpenVaul(true)}>
              <Filter />
            </Button>
            <div className="flex items-end gap-5">
              <div>
                <Select
                  className="w-44"
                  variant="bordered"
                  label="Mostrar"
                  placeholder="Mostrar"
                  labelPlacement="outside"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  value={limit}
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
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                  }}
                  color="primary"
                  onClick={() => changePage()}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-5  md:grid-cols-2">
            <div className="flex items-end justify-between gap-10 mt lg:justify-end">
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                  <BottomDrawer
                    title="Filtros disponibles"
                    open={openVaul}
                    onClose={() => setOpenVaul(false)}
                  >
                    <div className="flex flex-col gap-3">
                      <>
                        <Input
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          className="w-full xl:w-96"
                          placeholder="Buscar por nombre..."
                          startContent={<Search />}
                          variant="bordered"
                          label="Nombre"
                          labelPlacement="outside"
                          name="searchName"
                          id="searchName"
                          value={name}
                          autoComplete="search"
                          onChange={(e) => setName(e.target.value)}
                          isClearable
                          onClear={() => setName('')}
                        />
                        <Input
                          classNames={{
                            label: 'font-semibold text-gray-700',
                            inputWrapper: 'pr-0',
                          }}
                          className="w-full xl:w-96"
                          placeholder="Buscar por código..."
                          startContent={<Search />}
                          variant="bordered"
                          name="searCode"
                          label="Código"
                          labelPlacement="outside"
                          id="searCode"
                          value={code}
                          autoComplete="search"
                          onChange={(e) => setCode(e.target.value)}
                          isClearable
                          onClear={() => setCode('')}
                        />
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              setCategory(key as string);
                            }
                          }}
                          className="w-full xl:w-80"
                          labelPlacement="outside"
                          label="Categoría"
                          placeholder="Selecciona la categoría"
                          variant="bordered"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          value={category}
                          defaultSelectedKey={`${category}`}
                          clearButtonProps={{
                            onClick: () => setCategory(''),
                          }}
                        >
                          {list_categories.map((bra) => (
                            <AutocompleteItem
                              value={bra.name}
                              key={bra.name}
                              className="dark:text-white"
                            >
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </>
                      <Button
                        className="mb-10 font-semibold"
                        onClick={() => {
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
                    </tr>
                  </thead>
                  <tbody className="max-h-[600px] w-full overflow-y-auto">
                    {loading_branch_product ? (
                      <tr>
                        <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center w-full h-64">
                            <div className="loader"></div>
                            <p className="mt-3 text-xl font-semibold">Cargando...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {branch_products_list.length > 0 ? (
                          <>
                            {branch_products_list.map((cat) => (
                              <tr className="border-b border-slate-200">
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
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={5}>
                              <div className="flex flex-col items-center justify-center w-full">
                                <img src={NO_DATA} alt="X" className="w-32 h-32" />
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
                  previousPage={branch_product_Paginated.prevPag}
                  nextPage={branch_product_Paginated.nextPag}
                  currentPage={branch_product_Paginated.currentPag}
                  totalPages={branch_product_Paginated.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getBranchProducts(id, page, limit, name, category, code);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
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
                  currentPage={branch_product_Paginated.currentPag}
                  totalPages={branch_product_Paginated.totalPag}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default ListEmployee;
