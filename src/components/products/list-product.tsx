import {
  useDisclosure,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { EditIcon, RefreshCcw, Book, ShoppingBag } from 'lucide-react';
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
import LoadingTable from '../global/LoadingTable';

import UpdateProduct from './update-product';
import CardProduct from './card-product';
import RecipeBook from './recipe-book';
import RenderProductsFilters from './render-products-filters';
import { DeletePopover } from './delete-popover';
import ConvertProduct from './ConvertProduct';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';


interface Props {
  actions: string[];
}

function ListProducts({ actions }: Props) {
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const { getPaginatedProducts, paginated_products, activateProduct, loading_products } =
    useProductsStore();
  const modalConvert = useDisclosure()
  const [product, setSelectProduct] = useState<Product>()

  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const [params, setParams] = useState({
    page: 1,
    limit: 30,
    category: 0,
    subCategory: 0,
    name: "",
    code: "",
    active: true
  })


  // const [view, setView] = useState<'table' | 'grid'>('table');

  // useEffect(() => {
  //   if (typeof windowSize?.width === 'number') {
  //     setView(windowSize.width < 768 ? 'grid' : 'table');
  //   }
  // }, [windowSize?.width]);

  useEffect(() => {
    getPaginatedProducts(params);
  }, [params.limit, params.active]);

  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts({...params,page:1, name: searchParam ?? params.name, code: searchParam ?? params.code});
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const handleActivate = (id: number) => {
    activateProduct(id).then(() => {
      getPaginatedProducts({...params, page: 1});
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
      <DivGlobal >
        <div className="hidden lg:flex w-full">
          <RenderProductsFilters
            handleSearch={handleSearch}
            params={params}
            setParams={setParams}
          />
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex justify-start items-end order-2 lg:order-1">
            <div>
              <Switch
                classNames={{
                  thumb: classNames(params.active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(params.active ? '!bg-blue-300' : 'bg-gray-200'),
                }}
                isSelected={params.active}
                onValueChange={(active) => setParams({ ...params, active })}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {params.active ? 'inactivos' : 'activos'}
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
                defaultSelectedKeys={[params.limit.toString()]}
                label="Cantidad a mostrar"
                labelPlacement="outside"
                value={params.limit}
                variant="bordered"
                onChange={(e) => {
                  setParams({ ...params, limit: Number(e.target.value !== '' ? e.target.value : params.limit) });
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
                handleSearch={handleSearch}
                params={params}
                setParams={setParams}
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
            modalConvertOpen={() => {
              modalConvert.onOpen()
            }}
            openEditModal={(prd) => {
              setSelectedProduct(prd);
              setIsOpenModalUpdate(true);
            }}
          />
        )}
        {view === 'table' && (
          <>
            <TableComponent
              className='overflow-auto'
              headers={["Nº", "Nombre", "Código", "Sub categoría", 'Acciones']}
            >
              {loading_products ? (
                <tr>
                  <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                    <LoadingTable />
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

                              <ButtonUi
                                isIconOnly
                                showTooltip
                                theme={Colors.Info}
                                tooltipText='Convertir Producto'
                                onPress={() => {
                                  setSelectProduct(product)
                                  modalConvert.onOpen()
                                }}
                              >
                                <RefreshCcw />
                              </ButtonUi>
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
                              {actions.includes('Asignar a productos') && (
                                <ButtonUi
                                  isIconOnly
                                  showTooltip
                                  className="border border-white"
                                  theme={Colors.Secondary}
                                  tooltipText="Asignar a productos"
                                  onPress={() => navigate(`/create-branch-product/${product.id}`)}
                                >
                                  <ShoppingBag size={20} />
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
                        <EmptyTable />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </TableComponent>
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
                  setParams({...params, page})
                  getPaginatedProducts({...params, page});
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
        <ConvertProduct
          isOpen={modalConvert.isOpen}
          product={product!}
          onClose={() => {
            modalConvert.onClose();
            setSelectProduct(undefined)
          }}
        />
      </DivGlobal>
    </>
  );
}

export default ListProducts;