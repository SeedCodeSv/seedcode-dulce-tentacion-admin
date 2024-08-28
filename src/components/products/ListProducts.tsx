import {
  Input,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Switch,
} from '@nextui-org/react';
import { useEffect, useState, useContext } from 'react';
import {
  EditIcon,
  SearchIcon,
  TrashIcon,
  List,
  CreditCard,
  Table as ITable,
  RefreshCcw,
  Lock,
} from 'lucide-react';
import AddButton from '../global/AddButton';
import { useProductsStore } from '../../store/products.store';
import Pagination from '../global/Pagination';
import { Product } from '../../types/products.types';
import AddProducts from './AddProducts';
import { useCategoriesStore } from '../../store/categories.store';
import { ThemeContext } from '../../hooks/useTheme';
import { ButtonGroup } from '@nextui-org/react';
import { CategoryProduct } from '../../types/categories.types';
import MobileView from './MobileView';
// import { Drawer } from "vaul";

import UpdateProduct from './UpdateProduct';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import useWindowSize from '../../hooks/useWindowSize';
import HeadlessModal from '../global/HeadlessModal';
import classNames from 'classnames';
import TooltipGlobal from '../global/TooltipGlobal';
import { useSubCategoryStore } from '@/store/sub-category';
import { useNavigate } from 'react-router';

import { useSubCategoriesStore } from '@/store/sub-categories.store';
import NO_DATA from '@/assets/svg/no_data.svg';
import NotAddButton from '../global/NoAdd';
import SearchProduct from './search_product/SearchProduct';

interface Props {
  actions: string[];
}
function ListProducts({ actions }: Props) {
  const { sub_categories, getSubCategoriesList } = useSubCategoryStore();
  const { getSubcategories, subcategories } = useSubCategoriesStore();

  const { theme } = useContext(ThemeContext);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const { getPaginatedProducts, paginated_products, activateProduct, loading_products } =
    useProductsStore();

  const [search, setSearch] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [subCategory, setSubCategory] = useState('');
  const [limit, setLimit] = useState(5);
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const [page, serPage] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getPaginatedProducts(1, limit, category, subCategory, search, code, active ? 1 : 0);
  }, [limit, active]);

  useEffect(() => {
    getSubcategories(categoryId);
  }, [categoryId]);

  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getListCategories();
    getSubCategoriesList();
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      limit,
      searchParam ?? category,
      searchParam ?? subCategory,
      searchParam ?? search,
      searchParam ?? code,
      active ? 1 : 0
    );
  };

  const modalAdd = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts(1, limit, '', '', '', '', active ? 1 : 0);
    });
  };

  const navigate = useNavigate();

  const { colors } = theme;

  const style = {
    backgroundColor: colors.third,
    color: colors.primary,
  };
  return (
    <>
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between items-end ">
            <SearchProduct
              categoryProduct={(category: string) => setCategory(category)}
              subCategoryProduct={(subCategory: string) => setSubCategory(subCategory)}
              codeProduct={(code: string) => setCode(code)}
              nameProduct={(name: string) => setSearch(name)}
            ></SearchProduct>
            {actions.includes('Agregar') ? (
              <AddButton
                onClick={() => {
                  navigate('/add-product');
                }}
              />
            ) : (
              <NotAddButton></NotAddButton>
            )}
          </div>
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-5 gap-3">
              <Input
                startContent={<SearchIcon />}
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
                  setSearch('');
                }}
              />
              <Input
                startContent={<SearchIcon />}
                className="w-full dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="Código"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  // handleSearch("");
                  setCode('');
                }}
              />
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as CategoryProduct;
                    setCategory(branchSelected.name);
                    setCategoryId(branchSelected.id);
                  }
                }}
                className="w-full dark:text-white"
                label="Categoría"
                labelPlacement="outside"
                placeholder="Selecciona la categoría"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                value={category}
                clearButtonProps={{
                  onClick: () => {
                    setCategory('');
                    setCategoryId(0);
                  },
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

              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const branchSelected = JSON.parse(key as string) as CategoryProduct;
                    setSubCategory(branchSelected.name);
                  }
                }}
                className="w-full dark:text-white"
                label="Sub Categoría"
                labelPlacement="outside"
                placeholder="Selecciona la sub categoría"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                value={category}
                items={subcategories.length > 0 || categoryId > 0 ? subcategories : sub_categories}
                clearButtonProps={{
                  onClick: () => {
                    setSubCategory('');
                  },
                }}
              >
                {(item) => (
                  <AutocompleteItem
                    value={item.name}
                    key={JSON.stringify(item)}
                    className="dark:text-white"
                  >
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="hidden mt-6 font-semibold md:flex"
                color="primary"
                startContent={<SearchIcon size={15} />}
                onClick={() => {
                  handleSearch(undefined);
                }}
              >
                Buscar
              </Button>
            </div>
          </div>




          <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex justify-between justify-start order-2 lg:order-1">
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
            <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
              <Select
                className="max-w-44 dark:text-white"
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
                {limit_options.map((limit) => (
                  <SelectItem key={limit} value={limit} className="dark:text-white">
                    {limit}
                  </SelectItem>
                ))}
              </Select>
              <ButtonGroup className="mt-4">
                <Button
                  className="hidden md:inline-flex"
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
            </div>
          </div>

         
          {(view === 'grid' || view === 'list') && (
            <MobileView
              DeletePopover={DeletePopover}
              openEditModal={(product) => {
                setSelectedProduct(product);
                setIsOpenModalUpdate(true);
              }}
              layout={view as 'grid' | 'list'}
              actions={actions}
              handleActivate={handleActivate}
            />
          )}
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
                        Código
                      </th>
                      <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Sub categoría
                      </th>
                      <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="max-h-[600px] w-full overflow-y-auto">
                    {loading_products ? (
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
                        {paginated_products.products.length > 0 ? (
                          <>
                            {paginated_products.products.map((product) => (
                              <tr className="border-b border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {product.id}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                  {product.name}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  {product.code}
                                </td>
                                <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                  {product.subCategory.name}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                  <div className="flex w-full gap-5">
                                    {actions.includes('Editar') && product.isActive ? (
                                      <TooltipGlobal text="Editar">
                                        <Button
                                          onClick={() => {
                                            setSelectedProduct(product);

                                            setIsOpenModalUpdate(true);
                                          }}
                                          isIconOnly
                                          style={{
                                            backgroundColor: theme.colors.secondary,
                                          }}
                                        >
                                          <EditIcon
                                            style={{
                                              color: theme.colors.primary,
                                            }}
                                            size={20}
                                          />
                                        </Button>
                                      </TooltipGlobal>
                                    ) : (
                                      <Button
                                        type="button"
                                        disabled
                                        style={{ ...style, cursor: 'not-allowed' }}
                                        className="flex font-semibold "
                                        isIconOnly
                                      >
                                        <Lock />
                                      </Button>
                                    )}
                                    <>
                                      {product.isActive && actions.includes('Eliminar') ? (
                                        <DeletePopover product={product} />
                                      ) : (
                                        <Button
                                          type="button"
                                          disabled
                                          style={{
                                            backgroundColor: colors.danger,
                                            color: colors.primary,
                                            cursor: 'not-allowed',
                                          }}
                                          className="flex font-semibold "
                                          isIconOnly
                                        >
                                          <Lock />
                                        </Button>
                                      )}
                                      {actions.includes('Activar Productos') &&
                                        !product.isActive && (
                                          <>
                                            {!product.isActive ? (
                                              <Button
                                                onClick={() => handleActivate(product.id)}
                                                style={{
                                                  backgroundColor: colors.secondary,
                                                  color: colors.primary,
                                                }}
                                                className="flex font-semibold cursor-pointer "
                                                isIconOnly
                                              >
                                                <RefreshCcw></RefreshCcw>
                                              </Button>
                                            ) : (
                                              <Button
                                                type="button"
                                                disabled
                                                style={{
                                                  backgroundColor: colors.secondary,
                                                  color: colors.primary,
                                                  cursor: 'not-allowed',
                                                }}
                                                className="flex font-semibold "
                                                isIconOnly
                                              >
                                                <Lock />
                                              </Button>
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
                                <img src={NO_DATA} alt="X" className="w-32 h-32" />
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
            </>
          )}
          {paginated_products.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  previousPage={paginated_products.prevPag}
                  nextPage={paginated_products.nextPag}
                  currentPage={paginated_products.currentPag}
                  totalPages={paginated_products.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getPaginatedProducts(page, limit, category, subCategory, search, code);
                  }}
                />
              </div>
              <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                <SmPagination
                  handleNext={() => {
                    serPage(paginated_products.nextPag);
                    getPaginatedProducts(
                      paginated_products.nextPag,
                      limit,
                      category,
                      subCategory,
                      search,
                      code
                    );
                  }}
                  handlePrev={() => {
                    serPage(paginated_products.prevPag);
                    getPaginatedProducts(
                      paginated_products.prevPag,
                      limit,
                      category,
                      subCategory,
                      search,
                      code
                    );
                  }}
                  currentPage={paginated_products.currentPag}
                  totalPages={paginated_products.totalPag}
                />
              </div>
            </>
          )}
        </div>
        <HeadlessModal
          title={selectedProduct ? 'Editar producto' : 'Nuevo producto'}
          onClose={modalAdd.onClose}
          size="w-full md:w-[90vw] lg:w-[80vw]"
          isOpen={modalAdd.isOpen}
          // isFull
        >
          <AddProducts onCloseModal={modalAdd.onClose} product={selectedProduct} />
        </HeadlessModal>

        <HeadlessModal
          title={'Editar producto'}
          onClose={() => {
            setIsOpenModalUpdate(false);
          }}
          size="w-full md:w-[900px] lg:w-[1000px] xl:w-[1200px]"
          isOpen={isOpenModalUpdate}
        >
          <UpdateProduct
            onCloseModal={() => setIsOpenModalUpdate(false)}
            product={selectedProduct}
          />
        </HeadlessModal>
      </div>
    </>
  );
}

export default ListProducts;

interface PopProps {
  product: Product;
}

export const DeletePopover = ({ product }: PopProps) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { deleteProducts } = useProductsStore();

  const handleDelete = () => {
    deleteProducts(product.id);
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
          <TooltipGlobal text="Eliminar el producto" color="primary">
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
        <div className="flex flex-col items-center justify-center w-full p-5">
          <p className="font-semibold text-gray-600 dark:text-white">Eliminar {product.name}</p>
          <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
            ¿Estas seguro de eliminar este registro?
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose}>No, cancelar</Button>
            <Button
              onClick={() => handleDelete()}
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
