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
import { Dispatch, SetStateAction, useEffect } from 'react';
import classNames from 'classnames';

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

  useEffect(() => {
    getListCategories();
  }, []);

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
          <DrawerBody>
            <div className="flex flex-col gap-4 h-full overflow-y-auto">
              <p className="text-lg font-semibold">Lista de productos</p>
              <div className="grid grid-cols-4 gap-3 place-content-end">
                <div className="flex gap-3 items-end">
                  <Input
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    defaultValue={filter?.name}
                    label="Nombre del producto"
                    labelPlacement="outside"
                    placeholder="Buscar por nombre del producto"
                    variant="bordered"
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                  />
                </div>

                <Autocomplete
                  className="dark:text-white"
                  classNames={{
                    base: 'font-semibold text-sm text-gray-900 dark:text-white',
                  }}
                  clearButtonProps={{
                    onClick: () => {
                      setFilter({ ...filter, category: '' });
                    },
                  }}
                  label="Selecciona la categoria"
                  labelPlacement="outside"
                  placeholder="Seleccione la categoria"
                  variant="bordered"
                  onSelectionChange={(key) => {
                    if (key) {
                      setFilter({ ...filter, category: String(key) });
                    }
                  }}
                >
                  {list_categories.map((b) => (
                    <AutocompleteItem key={b.name} className="dark:text-white">
                      {b.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="h-full overflow-y-auto flex flex-col">
                <div className="grid grid-cols-3 gap-2">
                  {branchProducts.map((item) => {
                    const isSelected = product_selected.find((p) => p.id === item.id);

                    return (
                      <button
                        key={item.id}
                        className={classNames(
                          'flex flex-col items-start w-full border shadow rounded-[12px] p-3 cursor-pointer',
                          !item?.product?.name && 'opacity-50 bg-gray-50 cursor-not-allowed',
                          isSelected && 'border-green-500 bg-green-50'
                        )}
                        onClick={() => {
                          OnAddProductSelected(item);
                        }}
                      >
                        <div className="w-full flex flex-col items-start">
                          <p className="font-semibold">{item?.product?.name}</p>
                          <p className="text-xs">{item?.product?.subCategoryProduct?.name}</p>
                          <div className="flex row gap-2">
                            <p className="text-xs font-semibold py-2">Categoria: </p>
                            <p className="text-xs py-2">{item?.product?.subCategory?.name}</p>
                          </div>
                          <div className="flex row gap-2">
                            <p className="text-xs font-semibold py-2">Precio: </p>
                            <p className="text-xs py-2">${item?.price ?? 'N/A'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
