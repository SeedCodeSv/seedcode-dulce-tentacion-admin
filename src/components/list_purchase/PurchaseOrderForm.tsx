import { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { Building2, Search, DollarSign, User, ScrollText, Truck } from 'lucide-react';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import { useBranchProductStore } from '../../store/branch_product.store';
import { useSupplierStore } from '../../store/supplier.store';
import { useBranchesStore } from '../../store/branches.store';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';
import Pagination from '../global/Pagination';
import useGlobalStyles from '../global/global.styles';
import ModalGlobal from '../global/ModalGlobal';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';

import { limit_options } from '@/utils/constants';
import { Branches } from '@/types/branches.types';
import Layout from '@/layout/Layout';
import { IBranchProductOrder, Supplier } from '@/types/branch_product_order.types';
import { useDebounce } from '@/hooks/useDebounce';


const PurchaseOrderForm = () => {
  const [branch, setBranch] = useState('');
  const [supplier, setSupplier] = useState('');
  const [productName, setProductName] = useState('');
  const [code, setCode] = useState('');
  const [limit, setLimit] = useState(5);
  const styles = useGlobalStyles();
  const [searchSupplier, setSearchSupplier] = useState('')
  const debName = useDebounce(searchSupplier, 300)

  const {
    getBranchProductOrders,
    branch_product_order_paginated,
    // addProductOrder,
    branch_product_order_paginated_loading,
  } = useBranchProductStore();

  const { branch_list, getBranchesList } = useBranchesStore();
  const { getSupplierList, supplier_list } = useSupplierStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    getSupplierList(String(debName ?? ''));
  }, [debName]);

  useEffect(() => {
    getBranchProductOrders(branch, supplier, productName, code, 1, limit);
  }, [branch, supplier, productName, limit, code]);
  const navigate = useNavigate();

  const branchProducts = useBranchProductStore((state) => state.order_branch_products);
  const addProductOrder = useBranchProductStore((state) => state.addProductOrder);
  const deleteProductOrder = useBranchProductStore((state) => state.deleteProductOrder);

  const modalSelect = useDisclosure()
  const [branchProduct, setBranchProduct] = useState<IBranchProductOrder>()
  const [supplierSelected, setSupplierSelected] = useState<Supplier>()

  const handleSearch = (searchParam: string | undefined) => {
    getBranchProductOrders(
      searchParam ?? branch,
      searchParam ?? supplier,
      productName,
      code,
      1,
      limit,
    );
  };

  return (
    <Layout title="Ordenes de Compra">
      <>
        <div className="w-full h-full p-2 pt-6 md:pl-0 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full flex flex-col p-5 pt-2 border border-white rounded-xl overflow-y-auto bg-white custom-scrollbar shadow  dark:bg-gray-900 scrollbar-hide">
           <div className='w-full flex md:flex-col justify-between'>
            <div className="md:w-full flex justify-end md:pb-4 gap-4">
                <Button
                  className="px-7 font-semibold"
                  style={styles.darkStyle}
                  onPress={() => {
                    navigate('/add-purchase-order');
                  }}
                >
                  Aceptar
                </Button>
            </div>
              <ResponsiveFilterWrapper
                withButton={false}
                onApply={() => handleSearch(undefined)}
              >
                <div>
                  <Autocomplete
                    className="w-full dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    clearButtonProps={{
                      onClick: () => setBranch(''),
                    }}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona una sucursal"
                    startContent={<Building2 size={20} />}
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const branchSelected = JSON.parse(key as string) as Branches;

                        setBranch(branchSelected.name);
                      }
                    }}
                  >
                    {branch_list.map((bra) => (
                      <AutocompleteItem
                        key={JSON.stringify(bra)}
                        className="dark:text-white"
                      >
                        {bra.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div>
                  <Autocomplete
                    className="font-semibold dark:text-white"
                    clearButtonProps={{
                      onClick: () => setSupplier(''),
                    }}
                    label="Proveedor"
                    labelPlacement="outside"
                    placeholder="Selecciona un proveedor"
                    startContent={<User size={20} />}
                    variant="bordered"
                    onInputChange={(e) => setSearchSupplier(e)}
                    onSelect={(e) => {
                      setSupplier(e.currentTarget.value);
                    }}
                  >
                    {supplier_list.map((sup) => (
                      <AutocompleteItem
                        key={sup.id}
                        className="dark:text-white"
                        onPress={() => setSupplier(sup.nombre)}
                      >
                        {sup.nombre}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div>
                  <Input
                    className="w-full dark:text-white font-semibold"
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Escribe el nombre del producto"
                    startContent={<Search />}
                    variant="bordered"
                    onChange={(e) => setProductName(e.target.value)}
                    onClear={() => setProductName('')}
                  />
                </div>
                <div>
                  <Input
                    className="w-full dark:text-white font-semibold"
                    label="Código"
                    labelPlacement="outside"
                    placeholder="Escribe el código del producto"
                    startContent={<Search />}
                    variant="bordered"
                    onChange={(e) => setCode(e.target.value)}
                    onClear={() => setCode('')}
                  />
                </div>
                  <div>
                <Select
                  className="w-28 dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  defaultSelectedKeys={[limit.toString()]}
                  label="Mostrar"
                  labelPlacement="outside"
                  variant="bordered"

                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '8'));
                  }}
                >
                  {limit_options.map((option) => (
                    <SelectItem key={option} className="dark:text-white">
                      {option}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              </ResponsiveFilterWrapper>
            </div>
            <div>
              {branch_product_order_paginated_loading ? (
                <>
                  <div className="flex items-center justify-center h-full">
                    <tr>
                      <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                        <LoadingTable />
                      </td>
                    </tr>
                  </div>
                </>
              ) : (
                <>
                  {branch_product_order_paginated.branchProducts.length > 0 ? (
                    <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <>
                        {branch_product_order_paginated.branchProducts.map((branch_product) => {
                          const isProductSelected = branchProducts.some(
                            (product) => product.id === branch_product.id
                          );

                          const handleProductClick = (supplier: Supplier) => {
                            if (isProductSelected) {
                              deleteProductOrder(branch_product.id);
                            } else {
                              addProductOrder({ ...branch_product, supplier: supplier });
                            }
                          };

                          return (
                            <div
                              key={branch_product.id}
                              className="shadow border p-4 rounded-lg dark:border-gray-500"
                            >
                              <p className="font-semibold dark:text-white">
                                {branch_product.product?.name ?? ''}
                              </p>
                              <p className="dark:text-white">Stock: {branch_product.stock}</p>
                              <p className="mt-2 flex gap-3 dark:text-white">
                                <Truck />{branch_product?.suppliers?.length}
                              </p>
                              <p className="mt-2 flex gap-3 dark:text-white">
                                <ScrollText />
                                {branch_product.product?.subCategory?.categoryProduct.name ??
                                  ''}
                              </p>
                              <p className="mt-2 flex gap-3 dark:text-white">
                                <DollarSign /> ${branch_product.price}
                              </p>
                              <Button
                                className={`px-10 mt-3 ${isProductSelected ? 'bg-green-500' : 'bg-[#f4a261]'
                                  }`}
                                onPress={() => {
                                  if (!isProductSelected && branch_product?.suppliers?.length > 1) {
                                    setBranchProduct(branch_product)
                                    modalSelect.onOpen()
                                  } else {
                                    handleProductClick(branch_product?.suppliers[0])
                                  }
                                }
                                }
                              >
                                <p className="text-white">
                                  {' '}
                                  {isProductSelected ? 'Quitar' : 'Agregar'}
                                </p>
                              </Button>
                            </div>
                          );
                        })}
                      </>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <tr>
                        <td colSpan={6}>
                          <EmptyTable />
                        </td>
                      </tr>
                    </div>
                  )}
                </>
              )}
            </div>
            <>
              {branch_product_order_paginated.totalPag > 1 && (

                <div className="w-full mt-5">
                  <Pagination
                    currentPage={branch_product_order_paginated.currentPag}
                    nextPage={branch_product_order_paginated.nextPag}
                    previousPage={branch_product_order_paginated.prevPag}
                    totalPages={branch_product_order_paginated.totalPag}
                    onPageChange={(page) => {
                      getBranchProductOrders(
                        branch,
                        supplier,
                        productName,
                        code,
                        page,
                        limit
                      );
                    }}
                  />
                </div>

              )}
            </>
          </div>
          <ModalGlobal
            isBlurred={true}
            isOpen={modalSelect.isOpen}
            size='w-[40vw]'
            title='Seleccionar proveedor'
            onClose={() => {
              if (supplierSelected && branchProduct) {
                addProductOrder({ ...branchProduct, supplier: supplierSelected });
              }
              modalSelect.onClose()
            }}
          >
            <div className="flex flex-col overflow-y-auto h-full w-full gap-3 pb-4">
              {branchProduct && branchProduct.suppliers?.map((sup) =>

                <div key={sup?.id} className={classNames(
                  supplierSelected?.id === sup?.id
                    ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                    : '',
                  'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                )}>
                  <div className="flex justify-between gap-5 w-full">
                    {/* <Truck/> */}
                    <p className="text-sm font-semibold dark:text-white">{sup?.nombre}</p>
                    <Checkbox
                      checked={supplierSelected?.id === sup?.id}
                      isSelected={supplierSelected?.id === sup?.id}
                      onValueChange={() => {
                        setSupplierSelected(sup);
                      }}
                    />
                  </div>
                </div>
              )}
              <Button style={styles.dangerStyles}
                onPress={() => {
                  if (supplierSelected && branchProduct) {
                    addProductOrder({ ...branchProduct, supplier: supplierSelected });
                    modalSelect.onClose()
                  }
                }}
              >Continuar</Button>
            </div>
          </ModalGlobal>
        </div>
      </>
    </Layout>
  );
};

export default PurchaseOrderForm;
