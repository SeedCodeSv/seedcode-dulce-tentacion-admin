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
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { EditIcon, SearchIcon, CreditCard, Table as ITable, RefreshCcw, Trash } from 'lucide-react';
import AddButton from '../global/AddButton';
import { useProductsStore } from '../../store/products.store';
import Pagination from '../global/Pagination';
import { Product } from '../../types/products.types';
import { useCategoriesStore } from '../../store/categories.store';
import { ButtonGroup } from '@heroui/react';
import { CategoryProduct } from '../../types/categories.types';
import UpdateProduct from './update-product';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import useWindowSize from '../../hooks/useWindowSize';
import classNames from 'classnames';
import { useSubCategoryStore } from '@/store/sub-category';
import { useNavigate } from 'react-router';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import NO_DATA from '@/assets/svg/no_data.svg';
import SearchProduct from './search-product';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import ThGlobal from '@/themes/ui/th-global';
import CardProduct from './card-product';

interface Props {
  actions: string[];
}
function ListProducts({ actions }: Props) {
  const { sub_categories, getSubCategoriesList } = useSubCategoryStore();
  const { getSubcategories, subcategories } = useSubCategoriesStore();
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

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts(1, limit, '', '', '', '', active ? 1 : 0);
    });
  };
  const navigate = useNavigate();
  return (
    <>
      <div className=" w-full h-full bg-white dark:bg-gray-900">
        <div className="w-full h-full border  p-5 border-white overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-between items-end ">
            <SearchProduct
              categoryProduct={(category: string) => setCategory(category)}
              subCategoryProduct={(subCategory: string) => setSubCategory(subCategory)}
              codeProduct={(code: string) => setCode(code)}
              nameProduct={(name: string) => setSearch(name)}
            ></SearchProduct>
            {actions.includes('Agregar') && (
              <AddButton
                onClick={() => {
                  navigate('/add-product');
                }}
              />
            )}
          </div>
          <div className="hidden w-full gap-5 md:flex">
            <div className="grid w-full grid-cols-5 gap-3 items-end">
              <Input
                startContent={<SearchIcon />}
                className="w-full text-gray-900 dark:text-white  border border-white rounded-xl"
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
                  handleSearch('');
                }}
              />
              <Input
                startContent={<SearchIcon />}
                className="w-full dark:text-white border border-white rounded-xl"
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
                  handleSearch('');
                }}
              />

              <div className="w-full">
                <label className="font-semibold dark:text:white text-sm">Categoría</label>
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as CategoryProduct;
                      setCategory(branchSelected.name);
                      setCategoryId(branchSelected.id);
                    }
                  }}
                  className="w-full dark:text-white border border-white rounded-xl "
                  placeholder="Selecciona la categoría"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  value={category}
                  clearButtonProps={{
                    onClick: () => {
                      setCategory('');
                      handleSearch('');
                      // setCategoryId(0);
                    },
                  }}
                >
                  {list_categories.map((bra) => (
                    <AutocompleteItem key={JSON.stringify(bra)} className="dark:text-white">
                      {bra.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="w-full">
                <label className="font-semibold dark:text-white text-sm">Sub Categoría</label>
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as CategoryProduct;
                      setSubCategory(branchSelected.name);
                    }
                  }}
                  className="w-full dark:text-white border border-white rounded-xl "
                  placeholder="Selecciona la sub categoría"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  value={category}
                  items={
                    subcategories.length > 0 || categoryId > 0 ? subcategories : sub_categories
                  }
                  clearButtonProps={{
                    onClick: () => {
                      setSubCategory('');
                      handleSearch('');
                    },
                  }}
                >
                  {(item) => (
                    <AutocompleteItem key={JSON.stringify(item)} className="dark:text-white">
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <ButtonUi
                className="hidden  md:flex "
                theme={Colors.Primary}
                startContent={<SearchIcon className="w-10" />}
                onPress={() => {
                  handleSearch(undefined);
                }}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex justify-start order-2 lg:order-1">
              <div className="xl:mt-10">
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
            </div>
            <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
              <div className="w-[150px]">
                <label className="  font-semibold text-white text-sm">Mostrar</label>
                <Select
                  className="max-w-44 dark:text-white border border-white rounded-xl "
                  variant="bordered"
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
                    <SelectItem key={limit} className="dark:text-white">
                      {limit}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <ButtonGroup className="mt-4">
                <ButtonUi
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  isIconOnly
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  isIconOnly
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>
            </div>
          </div>

          {(view === 'grid' || view === 'list') && (
            <CardProduct
              actions={actions}
              openEditModal={(prd) => {
                setSelectedProduct(prd);
                setIsOpenModalUpdate(true);
              }}
              DeletePopover={DeletePopover}
              handleActivate={(id) => handleActivate(id)}
            />
          )}
          {view === 'table' && (
            <>
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <ThGlobal className='text-left p-3'>No.</ThGlobal>
                      <ThGlobal className='text-left p-3'>Nombre</ThGlobal>
                      <ThGlobal className='text-left p-3'>Código</ThGlobal>
                      <ThGlobal className='text-left p-3'>Sub categoría</ThGlobal>
                      <ThGlobal className='text-left p-3'>Acciones</ThGlobal>
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
                                    {actions.includes('Editar') && product.isActive && (
                                      <ButtonUi
                                        className="border border-white"
                                        onPress={() => {
                                          setSelectedProduct(product);
                                          setIsOpenModalUpdate(true);
                                        }}
                                        isIconOnly
                                        theme={Colors.Success}
                                      >
                                        <EditIcon size={20} />
                                      </ButtonUi>
                                    )}
                                    <>
                                      {product.isActive && actions.includes('Eliminar') && (
                                        <DeletePopover product={product} />
                                      )}
                                      {actions.includes('Activar Productos') &&
                                        !product.isActive && (
                                          <>
                                            {!product.isActive && (
                                              <ButtonUi
                                                theme={Colors.Info}
                                                onPress={() => handleActivate(product.id)}
                                                isIconOnly
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
        <UpdateProduct
          isOpen={isOpenModalUpdate}
          onCloseModal={() => setIsOpenModalUpdate(false)}
          product={selectedProduct}
        />
      </div>
    </>
  );
}

export default ListProducts;

interface PopProps {
  product: Product;
}

export const DeletePopover = ({ product }: PopProps) => {
  const { deleteProducts } = useProductsStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = () => {
    deleteProducts(product.id);
    deleteDisclosure.onClose();
  };
  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        {...deleteDisclosure}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {product.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4 gap-5">
              <ButtonUi
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
                className="border border-white"
              >
                No, cancelar
              </ButtonUi>
              <ButtonUi
                theme={Colors.Error}
                onPress={() => handleDelete()}
              >
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
