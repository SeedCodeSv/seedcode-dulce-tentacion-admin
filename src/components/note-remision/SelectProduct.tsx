import {
  Autocomplete,
  AutocompleteItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  Input,
  useDisclosure,
} from '@heroui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';
import { ArrowLeft, BarChart3, Barcode, Check, ChevronRight, DollarSign, Grid3X3, Package, Search, Sparkles, Tag } from 'lucide-react';

import Pagination from '../global/Pagination';

import { Branches } from '@/shopping-branch-product/types/shipping_branch_product.types';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { useCategoriesStore } from '@/store/categories.store';

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
  } = useShippingBranchProductBranch();
  const { list_categories, getListCategories } = useCategoriesStore();

  // const inputsName = React.useRef<HTMLInputElement>(null)
  // const inputCategory = React.useRef<HTMLInputElement>(null)
  // const inputCode = React.useRef<HTMLInputElement>(null)
  const productRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [, setSelectedIndex] = useState(0);

  // const inputsSelected = React.useRef<HTMLButtonElement>(null)
  useEffect(() => {
    getListCategories();
  }, []);

  // useHotkeys('ctrl + 2', () => {
  //     inputsName.current?.focus()
  // })

  // useHotkeys('ctrl + 3', () => {
  //     inputCategory.current?.focus()
  // })

  // useHotkeys('ctrl + 4', () => {
  //     inputCode.current?.focus()
  // })

  // useHotkeys('f3', () => {
  //     productRefs.current[selectedIndex]?.focus();
  // });

  useHotkeys(['right', 'down'], () => {
    setSelectedIndex((prev) => {
      const nextIndex = Math.min(branchProducts.length - 1, prev + 1);

      productRefs.current[nextIndex]?.focus();

      return nextIndex;
    });
  });


  useHotkeys(['left', 'up'], () => {
    setSelectedIndex((prev) => {
      const nextIndex = Math.max(0, prev - 1);

      productRefs.current[nextIndex]?.focus();

      return nextIndex;
    });
  });


  useHotkeys('0', () => modalProducts.onClose())

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
              <div className="bg-white/80 dark:bg-black backdrop-blur-xl border-b dark:border-gray-200/50 border-rose-200 px-6 py-6">
                <button className='flex flex-row gap-6 items-center mb-4'
                  onClick={() => {
                    modalProducts.onClose()
                  }}
                >
                  <ArrowLeft size={24} />
                  <p className='dark:text-white'>Regresar</p>

                </button>
                <div className="mb-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-black shadow-md">
                    <div className="flex flex-wrap gap-6 items-center justify-between">
                      {/* Icono y Título */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          className="pl-12 w-full"
                          classNames={{
                            input: "pl-12 text-gray-800 dark:text-white placeholder:text-gray-400",
                            inputWrapper:
                              "bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 focus-within:border-blue-500 rounded-xl shadow-sm",
                          }}
                          defaultValue={filter?.name}
                          placeholder="Buscar productos..."
                          variant="bordered"
                          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                        />
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Autocomplete
                          className="pl-12 w-full"
                          classNames={{ base: "w-full" }}
                          clearButtonProps={{ onClick: () => setFilter({ ...filter, category: "" }) }}
                          placeholder="Seleccionar categoría"
                          variant="bordered"
                          onSelectionChange={(key) => {
                            if (key) setFilter({ ...filter, category: String(key) });
                          }}
                        >
                          {list_categories.map((b) => (
                            <AutocompleteItem
                              key={b.name}
                              className="py-2 px-3 text-gray-700 dark:text-white data-[hover=true]:bg-purple-100 data-[hover=true]:text-purple-800 rounded-lg"
                            >
                              {b.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>

                      <div className="flex-1 min-w-[200px] relative group">
                        <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          className="pl-12 w-full"
                          classNames={{
                            input: "pl-12 text-gray-800 dark:text-white placeholder:text-gray-400",
                            inputWrapper:
                              "bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-emerald-300 focus-within:border-emerald-500 rounded-xl shadow-sm",
                          }}
                          placeholder="Código del producto"
                          variant="bordered"
                          onChange={(e) => setFilter({ ...filter, code: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-sky-400">{branchProducts.length}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">Productos</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{product_selected.length}</div>
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
                      Mostrando <span className="font-semibold dark:text-sky-300">{branchProducts.length}</span> productos
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Disponible</span>
                    <div className="w-2 h-2 bg-gray-400 rounded-full ml-3" />
                    <span>No disponible</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 dark:bg-black ">
                {branchProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Grid3X3 className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No se encontraron productos</h3>
                    <p className="text-gray-400 dark:text-white">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                ) : (
                  <>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                      {branchProducts.map((item, index) => {
                        const isSelected = product_selected.find((p) => p.id === item.id);
                        const isDisabled = !item?.product?.name;

                        return (
                          <button
                            key={item.id}
                            ref={(el) => (productRefs.current[index] = el)}
                            className={classNames(
                              "relative group p-5 rounded-xl transition-all duration-300",
                              "border-2 bg-white dark:bg-black dark:border-sky-300 text-left shadow-sm hover:shadow-lg",
                              "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:ring-2 dark:focus:ring-offset-2", // <-- Esto controla el foco
                              isDisabled
                                ? "opacity-40 cursor-not-allowed border-gray-200"
                                : isSelected
                                  ? "border-emerald-500 border-1"
                                  : "border-transparent hover:border-emerald-400"
                            )}
                            disabled={isDisabled}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedIndex(index);
                                OnAddProductSelected(item);
                              }
                            }}

                          >
                            {item.product?.subCategory?.name && (
                              <span className="dark:text-white absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                                {item.product.subCategory.name}
                              </span>
                            )}

                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-emerald-600 text-white flex items-center justify-center shadow-inner">
                                <Package className="w-6 h-6" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white">
                                {item?.product?.name || "Producto no disponible"}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-5 h-5 text-emerald-600" />
                              <span className="text-xl font-bold text-gray-800 dark:text-white">
                                ${item?.price?.toLocaleString() ?? "N/A"}
                              </span>
                            </div>

                            {item?.product?.code && (
                              <div className="flex items-center gap-2 text-sm font-mono text-gray-500 mb-3">
                                <Barcode className="w-4 h-4 text-gray-400" />
                                <span className="bg-gray-100 px-2 py-0.5 rounded ">{item.product.code}</span>
                              </div>
                            )}

                            {!isDisabled && (
                              <div className="absolute bottom-4 right-4 group-hover:translate-x-0 translate-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <ChevronRight className="w-6 h-6 text-blue-500" />
                              </div>
                            )}

                            {isSelected && (
                              <>
                                <div className="absolute top-4 right-4 bg-emerald-500 rounded-full w-7 h-7 flex items-center justify-center shadow-md animate-pulse">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                                <div className="absolute inset-0 pointer-events-none" />
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>

                  </>
                )}
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
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
                  10,
                  filter.name,
                  filter.category,
                  filter.supplier,
                  filter.code
                );
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SelectProductNote;
