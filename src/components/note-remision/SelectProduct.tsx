import {
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  ArrowLeft,
  Badge,
  BarChart3,
  Barcode,
  Check,
  CreditCard,
  DollarSign,
  Grid3X3,
  Hash,
  Package,
  Search,
  Sparkles,
  Table,
  Tag,
} from 'lucide-react';
import classNames from 'classnames';
import { toast } from 'sonner';

import Pagination from '../global/Pagination';

import { Branches } from '@/shopping-branch-product/types/shipping_branch_product.types';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { useCategoriesStore } from '@/store/categories.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import TdGlobal from '@/themes/ui/td-global';
import { ThemeContext } from '@/hooks/useTheme';
import { limit_options } from '@/utils/constants';

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
  modalProducts: DisclosureProps;
  selectedBranch: Branches;
  setFilter: Dispatch<
    SetStateAction<{
      page: number;
      limit: number;
      name: string;
      category: string;
      supplier: string;
      code: string;
    }>
  >;
  filter: {
    page: number;
    limit: number;
    name: string;
    category: string;
    supplier: string;
    code: string;
  };
}

function SelectProductNote({ modalProducts, setFilter, filter, selectedBranch }: Props) {
  const {
    branchProducts,
    OnAddProductSelected,
    pagination_shippin_product_branch,
    product_selected,
    OnGetShippinProductBranch,
    OnClearProductSelected,
  } = useShippingBranchProductBranch();
  const { list_categories, getListCategories } = useCategoriesStore();
  const { context, theme } = useContext(ThemeContext);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    getListCategories();
  }, []);

  const [view, setView] = useState<'grid' | 'table'>('table');

  useHotkeys(['right', 'down'], () => {
    setSelectedIndex((prev) => {
      const nextIndex = Math.min(branchProducts.length - 1, prev + 1);

      productRefs.current[nextIndex]?.focus();

      return nextIndex;
    });
  });

  const header = [
    { name: '', uuid: 'check' },
    { name: 'No.', uuid: 'no' },
    { name: 'Codigo', uuid: 'code' },
    { name: 'Nombre', uuid: 'name' },
    { name: 'Stock', uuid: 'stock' },
    { name: 'Costo unitario', uuid: 'coste' },
  ];

  useHotkeys(['left', 'up'], () => {
    setSelectedIndex((prev) => {
      const nextIndex = Math.max(0, prev - 1);

      productRefs.current[nextIndex]?.focus();

      return nextIndex;
    });
  });

  useHotkeys('ctrl+arrowleft', () => {
    setView('table');
  });

  useHotkeys('ctrl+arrowright', () => {
    setView('grid');
  });

  useHotkeys('0', () => modalProducts.onClose());

  const handleSelect = (id: number) => {
    const selectedProduct = branchProducts.find((item) => item.id === id);
    const data = product_selected.find((item) => item.id === id);

    if (data) {
      OnClearProductSelected(data.id);

      return;
    }

    OnAddProductSelected(selectedProduct!);
  };
  const colorfrom = theme.colors[context].buttons.colors.secondary;
  const colorPrim = theme.colors[context].buttons.colors.primary;

  return (
    <>
      <Drawer
        isDismissable={false}
        isOpen={modalProducts.isOpen}
        placement="right"
        scrollBehavior="inside"
        size="full"
        onOpenChange={modalProducts.onOpenChange}
      >
        <DrawerContent>
          <DrawerBody className="p-0">
            <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-gray-100 ">
              <div className="bg-white/80 dark:bg-black backdrop-blur-xl dark:border-gray-200/50 px-6 py-6 h-auto">
                <button
                  className="flex flex-row gap-2 items-center mb-4 p-2 rounded-xl"
                  onClick={() => {
                    modalProducts.onClose();
                  }}
                >
                  <ArrowLeft size={24} />
                  <p className="dark:text-white">Regresar</p>
                </button>
                <div className="mb-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-black shadow-md">
                    <div className="flex flex-wrap gap-6 items-center justify-between">
                      {/* Icono y Título */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}
                            style={{
                              background: `linear-gradient(to bottom right, ${colorPrim}, ${colorfrom})`,
                            }}
                          >
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Productos
                        </h1>
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Input
                          className="w-full"
                          classNames={{
                            label: 'text-xs font-semibold',
                          }}
                          defaultValue={filter?.name}
                          label="Buscar por nombre"
                          labelPlacement="outside"
                          placeholder="Buscar productos..."
                          startContent={<Search className="w-5 h-5 text-gray-400" />}
                          variant="bordered"
                          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                        />
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Autocomplete
                          className="pl-12 w-full"
                          classNames={{ base: 'w-full text-xs font-semibold' }}
                          clearButtonProps={{
                            onClick: () => setFilter({ ...filter, category: '' }),
                          }}
                          label={<p className="text-xs font-semibold">Buscar por categoría</p>}
                          labelPlacement="outside"
                          placeholder="Seleccionar categoría"
                          startContent={<Tag className="w-5 h-5 text-gray-400" />}
                          variant="bordered"
                          onSelectionChange={(key) => {
                            if (key) setFilter({ ...filter, category: String(key) });
                          }}
                        >
                          {list_categories.map((b) => (
                            <AutocompleteItem
                              key={b.name}
                              className="py-2 px-3 text-gray-700 dark:text-white data-[hover=true]:bg-gray-200 dark:data-[hover=true]:bg-gray-700 data-[hover=true]:text-black-800 rounded-lg"
                            >
                              {b.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Input
                          className="w-full"
                          classNames={{
                            label: 'text-xs font-semibold',
                          }}
                          label="Buscar por código"
                          placeholder="Código del producto"
                          startContent={<Barcode className="w-5 h-5 text-gray-400" />}
                          variant="bordered"
                          onChange={(e) => setFilter({ ...filter, code: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-sky-400">
                            {branchProducts.length}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">Productos</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">
                            {product_selected.length}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-white">Seleccionados</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between bottom-14 mb-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-white">
                      Mostrando{' '}
                      <span className="font-semibold dark:text-sky-300">
                        {branchProducts.length}
                      </span>{' '}
                      productos
                    </span>
                  </div>

                  <div className="flex items-end gap-5 text-sm text-gray-500">
                    <ButtonGroup>
                      <ButtonUi
                        isIconOnly
                        color="secondary"
                        theme={view === 'table' ? Colors.Primary : Colors.Default}
                        onPress={() => setView('table')}
                      >
                        <Table />
                      </ButtonUi>

                      <ButtonUi
                        isIconOnly
                        color="default"
                        theme={view === 'grid' ? Colors.Primary : Colors.Default}
                        onPress={() => setView('grid')}
                      >
                        <CreditCard />
                      </ButtonUi>
                    </ButtonGroup>
                    <div className="min-w-44">
                      <Select
                        classNames={{
                          label: 'text-xs font-semibold',
                        }}
                        label="Cantidad a mostrar"
                        labelPlacement="outside"
                        selectedKeys={[`${filter.limit}`]}
                        variant="bordered"
                        onChange={(e) => setFilter({ ...filter, limit: Number(e.target.value ?? 30) })}
                      >
                        {limit_options.map((l) => (
                          <SelectItem key={l}>{l}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 dark:bg-black ">
                {branchProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Grid3X3 className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">
                      No se encontraron productos
                    </h3>
                    <p className="text-gray-400 dark:text-white">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </div>
                ) : (
                  <>
                    {view === 'grid' && (
                      <section
                        className={`w-full max-h-[200px] lg:max-h-[422px] 2xl:max-h-[600px] p-6 dark:bg-gray-900`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {branchProducts.map((bp, index) => {
                            const isSelected = product_selected.some(
                              (product) => product.id === bp.id
                            );
                            const isFocused = index === selectedIndex;
                            const isOutOfStock = bp.stock === 0;
                            const colorFocus2 = Colors.Success;
                            const colorFocus3 = Colors.Secondary;

                            return (
                              <div
                                key={bp.id}
                                ref={(el) => (productRefs.current[index] = el)}
                                className={` mb-2 relative cursor-pointer transition-all duration-200 border-2 hover:shadow-xl hover:-translate-y-1 rounded-xl
                                             focus:outline-none focus:ring-4 } dark:focus:ring-rose-400 
                                             ${isFocused ? `ring-4  dark:ring-rose-400 ` : ''}
                                             ${isSelected ? ` dark:bg-rose-900/20 border-${colorFocus2} ` : `border-${colorFocus3}-100 dark:border-rose-300 ${Number(bp.stock) <= 0 && 'bg-gray-200 opacity-100'} dark:bg-gray-800`}
                                             ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
                                              `}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  if (Number(bp.stock) <= 0) {
                                    toast.warning('No cuentas con stock suficiente')

                                    return
                                  }
                                  setSelectedIndex(index);
                                  handleSelect(bp.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (Number(bp.stock) <= 0) {
                                      toast.warning('No cuentas con stock suficiente')

                                      return
                                    }
                                    handleSelect(bp.id);
                                    setSelectedIndex(index);
                                  }
                                }}
                              >
                                {isSelected && (
                                  <div
                                    className={`absolute -top-2 -right-2 w-8 h-8 bg-${colorFocus2} rounded-full flex items-center justify-center shadow-lg`}
                                  >
                                    <Check className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                {isOutOfStock && (
                                  <div className="absolute top-3 right-3">
                                    <Badge className="text-xs font-semibold">Sin Stock</Badge>
                                  </div>
                                )}
                                <div className="p-6">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                    {bp.product.name}
                                  </h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                      <Hash className="w-4 h-4" />
                                      <span className="font-mono">{bp.product.code}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Package className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Stock:
                                      </span>
                                      <span
                                        className={`text-sm font-semibold ${Number(bp.stock) > 10
                                          ? 'text-green-600'
                                          : Number(bp.stock) > 0
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                          }`}
                                      >
                                        {bp.stock} unidades
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                      <DollarSign className="w-5 h-5 text-rose-400" />
                                      <span className="text-xl font-bold text-rose-500">
                                        {bp.price}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xs font-medium ${isSelected ? `text-rose-600` : 'text-gray-400'}`}
                                  >
                                    {isSelected ? '✓ Seleccionado' : 'Click para seleccionar'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                    {view === 'table' && (
                      <section className="w-full h-full shadow text-white overflow-auto">
                        <table className="w-full">
                          <thead className="sticky top-0 z-10 bg-gray-700">
                            <tr className="text-left text-sm">
                              {header.map((item) => (
                                <ThGlobal key={item.uuid} className="py-4 px-3">
                                  {item.name}
                                </ThGlobal>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {branchProducts.map((bp, index) => {
                              const isSelected = product_selected.find((p) => p.product.id === bp.product.id);
                              const iseSelectedBol = isSelected ? true : false;
                              const isFocused = index === selectedIndex;

                              return (
                                <tr
                                  key={bp.id}
                                  ref={(el) => (productRefs.current[index] = el)}
                                  className={classNames(
                                    `text-left text-gray-600 dark:text-white focus:outline-none ${Number(bp.stock) <= 0 && 'bg-gray-300 dark:bg-gray-200'} `,
                                    isFocused && `${Number(bp.stock) <= 0 ? 'bg-gray-300 dark:bg-gray-200' : 'bg-blue-100 dark:bg-blue-200'} `
                                  )}
                                  tabIndex={0}
                                  onClick={() => {
                                    if (Number(bp.stock) <= 0) {
                                      toast.warning('No cuentas con stock suficiente')

                                      return
                                    }
                                    setSelectedIndex(index);
                                    handleSelect(bp.id);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (Number(bp.stock) <= 0) {
                                        return toast.warning(
                                          'Este producto no cuenta con suficiente stock'
                                        );
                                      }
                                      setSelectedIndex(index);
                                      handleSelect(bp.id);
                                    }
                                  }}
                                >
                                  <TdGlobal className="py-2 px-3">
                                    <Checkbox isSelected={iseSelectedBol} />
                                  </TdGlobal>
                                  <TdGlobal className="py-2 px-3">{bp.id}</TdGlobal>
                                  <TdGlobal className="py-2 px-3">{bp.product.code}</TdGlobal>
                                  <TdGlobal className="py-2 px-3">{bp.product.name}</TdGlobal>
                                  <TdGlobal className="py-2 px-3">{bp.stock}</TdGlobal>
                                  <TdGlobal className="py-2 px-3">
                                    {Number(bp.costoUnitario).toFixed(4)}
                                  </TdGlobal>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </section>
                    )}
                  </>
                )}
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            {pagination_shippin_product_branch.total > 0 && (
              <Pagination
                currentPage={pagination_shippin_product_branch.currentPag}
                nextPage={pagination_shippin_product_branch.nextPag}
                previousPage={pagination_shippin_product_branch.prevPag}
                totalItems={pagination_shippin_product_branch.total}
                totalPages={pagination_shippin_product_branch.totalPag}
                onPageChange={(page) => {
                  OnGetShippinProductBranch(
                    selectedBranch?.id ?? 0,
                    page,
                    filter.limit,
                    filter.name,
                    filter.category,
                    filter.supplier,
                    filter.code
                  );
                }}
              />
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SelectProductNote;
