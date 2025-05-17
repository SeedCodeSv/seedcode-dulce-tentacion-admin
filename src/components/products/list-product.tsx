import {
  useDisclosure,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { EditIcon, RefreshCcw, Book } from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';

import AddButton from '../global/AddButton';
import { useProductsStore } from '../../store/products.store';
import Pagination from '../global/Pagination';
import { Product } from '../../types/products.types';
import { limit_options } from '../../utils/constants';
import EmptyTable from '../global/EmptyTable';
import useWindowSize from '../../hooks/useWindowSize';
import RenderViewButton from '../global/render-view-button';

import UpdateProduct from './update-product';
import CardProduct from './card-product';
import RecipeBook from './recipe-book';
import RenderProductsFilters from './render-products-filters';
import { DeletePopover } from './delete-popover';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import DivGlobal from '@/themes/ui/div-global';

interface Props {
  actions: string[];
}

type Key = string | number;

function ListProducts({ actions }: Props) {
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const { getPaginatedProducts, paginated_products, activateProduct, loading_products } =
    useProductsStore();

  const [search, setSearch] = useState('');
  const [code, setCode] = useState('');

  const [category, setCategory] = useState<Key | null>();
  const [subCategory, setSubCategory] = useState<Key | null>();
  const [limit, setLimit] = useState(5);
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const [page, serPage] = useState(1);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getPaginatedProducts(
      1,
      limit,
      Number(category ?? 0),
      Number(subCategory ?? 0),
      search,
      code,
      active ? 1 : 0
    );
  }, [limit, active]);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      limit,
      Number(category ?? 0),
      Number(subCategory ?? 0),
      searchParam ?? search,
      searchParam ?? code,
      active ? 1 : 0
    );
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts(1, limit, 0, 0, '', '', active ? 1 : 0);
    });
  };
  const navigate = useNavigate();

  const modalRecipe = useDisclosure();
  const [selectedId, setSelectedId] = useState(0);

  const handleOpenModalRecipe = (id: number) => {
    setSelectedId(id);
    modalRecipe.onOpen();
  };

  return (
    <>
      <DivGlobal className="flex flex-col h-full overflow-y-auto ">
          <div className="hidden lg:flex w-full">
            <RenderProductsFilters
              category={category}
              code={code}
              handleSearch={handleSearch}
              search={search}
              setCategory={setCategory}
              setCode={setCode}
              setSearch={setSearch}
              setSubcategory={setSubCategory}
              subcategory={subCategory}
            />
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex justify-start items-end order-2 lg:order-1">
              <div>
                <Switch
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
            </div>
            <div className="flex gap-5 w-full justify-between items-end lg:justify-end order-1 lg:order-2">
              <div className="w-[150px] mt-2">
                <Select
                  className="max-w-44 dark:text-white border border-white rounded-xl "
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={['5']}
                  label="Cantidad a mostrar"
                  labelPlacement="outside"
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
              <RenderViewButton setView={setView} view={view} />
              <div className="flex lg:hidden">
                <RenderProductsFilters
                  category={category}
                  code={code}
                  handleSearch={handleSearch}
                  search={search}
                  setCategory={setCategory}
                  setCode={setCode}
                  setSearch={setSearch}
                  setSubcategory={setSubCategory}
                  subcategory={subCategory}
                />
              </div>

              {actions.includes('Agregar') && (
                <AddButton
                  onClick={() => {
                    navigate('/add-product');
                  }}
                />
              )}
            </div>
          </div>

          {(view === 'grid') && (
            <CardProduct
              DeletePopover={DeletePopover}
              actions={actions}
              handleActivate={(id) => handleActivate(id)}
              handleShowRecipe={(id) => handleOpenModalRecipe(id)}
              openEditModal={(prd) => {
                setSelectedProduct(prd);
                setIsOpenModalUpdate(true);
              }}
            />
          )}
          {view === 'table' && (
            <>
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                <table className="w-full">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <ThGlobal className="text-left p-3">No.</ThGlobal>
                      <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                      <ThGlobal className="text-left p-3">Código</ThGlobal>
                      <ThGlobal className="text-left p-3">Sub categoría</ThGlobal>
                      <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                    </tr>
                  </thead>
                  <tbody className="max-h-[600px] w-full overflow-y-auto">
                    {loading_products ? (
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
                        {paginated_products.products.length > 0 ? (
                          <>
                            {paginated_products.products.map((product, index) => (
                              <tr key={index} className="border-b border-slate-200">
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
                                        isIconOnly
                                        className="border border-white"
                                        theme={Colors.Success}
                                        onPress={() => {
                                          setSelectedProduct(product);
                                          setIsOpenModalUpdate(true);
                                        }}
                                      >
                                        <EditIcon size={20} />
                                      </ButtonUi>
                                    )}
                                    {actions.includes('Ver Receta') && (
                                      <ButtonUi
                                        isIconOnly
                                        showTooltip
                                        className="border border-white"
                                        theme={Colors.Info}
                                        tooltipText="Ver Receta"
                                        onPress={() => handleOpenModalRecipe(product.id)}
                                      >
                                        <Book size={20} />
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
                                                isIconOnly
                                                theme={Colors.Info}
                                                onPress={() => handleActivate(product.id)}
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
                              <EmptyTable/>
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
              <div className="w-full mt-5">
                <Pagination
                  currentPage={paginated_products.currentPag}
                  nextPage={paginated_products.nextPag}
                  previousPage={paginated_products.prevPag}
                  totalPages={paginated_products.totalPag}
                  onPageChange={(page) => {
                    serPage(page);
                    getPaginatedProducts(
                      page,
                      limit,
                      Number(category ?? 0),
                      Number(subCategory ?? 0),
                      search,
                      code,
                      active ? 1 : 0
                    );
                  }}
                />
              </div>
            </>
          )}
        <UpdateProduct
          isOpen={isOpenModalUpdate}
          product={selectedProduct}
          onCloseModal={() => setIsOpenModalUpdate(false)}
        />
        <RecipeBook
          isOpen={modalRecipe.isOpen}
          productId={selectedId}
          onOpenChange={modalRecipe.onOpenChange}
        />
      </DivGlobal>
    </>
  );
}

export default ListProducts;