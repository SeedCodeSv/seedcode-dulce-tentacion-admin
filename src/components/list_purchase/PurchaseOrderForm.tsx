import { useState, useEffect } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Building2, Search, Truck, DollarSign, User, ScrollText, ArrowLeft } from 'lucide-react';
import { useBranchProductStore } from '../../store/branch_product.store';
import { useSupplierStore } from '../../store/supplier.store';
import { useBranchesStore } from '../../store/branches.store';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import { useNavigate } from 'react-router';
import Layout from '@/layout/Layout';
import { Branches } from '@/types/branches.types';
import { global_styles } from '@/styles/global.styles';
import { limit_options } from '@/utils/constants';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';

const PurchaseOrderForm = () => {
  const [branch, setBranch] = useState('');
  const [supplier, setSupplier] = useState('');
  const [productName, setProductName] = useState('');
  const [code, setCode] = useState('');
  const [limit, setLimit] = useState(5);
  const {
    getBranchProductOrders,
    branch_product_order_paginated,
    branch_product_order_paginated_loading,
  } = useBranchProductStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { getSupplierList, supplier_list } = useSupplierStore();

  useEffect(() => {
    getBranchesList();
    getSupplierList('');
  }, []);

  useEffect(() => {
    getBranchProductOrders(branch, supplier, productName, code, 1, limit);
  }, [branch, supplier, productName, limit, code]);
  const navigate = useNavigate();
  const branchProducts = useBranchProductStore((state) => state.order_branch_products);
  const addProductOrder = useBranchProductStore((state) => state.addProductOrder);
  const deleteProductOrder = useBranchProductStore((state) => state.deleteProductOrder);
  return (
    <Layout title="Ordenes de Compra">
      <>
        <div className="w-full h-full p-4 md:p-10 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 md:p-10 mt-0 overflow-y-auto bg-white custom-scrollbar shadow border dark:bg-gray-900">
            <div
              className="flex items-center cursor-pointer mb-4"
              onClick={() => navigate('/add-purchase-order')}
            >
              <ArrowLeft onClick={() => navigate('/add-purchase-order')} className="mr-2" />
              <p>Regresar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as Branches;
                      setBranch(branchSelected.name);
                    }
                  }}
                  className="w-full dark:text-white hidden md:flex"
                  label="Sucursal"
                  startContent={<Building2 size={20} />}
                  labelPlacement="outside"
                  placeholder="Selecciona una sucursal"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  clearButtonProps={{
                    onClick: () => setBranch(''),
                  }}
                >
                  {branch_list.map((bra) => (
                    <AutocompleteItem
                      value={bra.name}
                      className="dark:text-white"
                      key={JSON.stringify(bra)}
                    >
                      {bra.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div>
                <Autocomplete
                  className="font-semibold dark:text-white"
                  label="Proveedor"
                  onSelect={(e) => {
                    setSupplier(e.currentTarget.value);
                  }}
                  placeholder="Selecciona un proveedor"
                  startContent={<User size={20} />}
                  labelPlacement="outside"
                  variant="bordered"
                  clearButtonProps={{
                    onClick: () => setSupplier(''),
                  }}
                >
                  {supplier_list.map((branch) => (
                    <AutocompleteItem
                      className="dark:text-white"
                      onClick={() => setSupplier(branch.nombre)}
                      key={branch.id}
                    >
                      {branch.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div>
                <Input
                  label="Nombre"
                  placeholder="Escribe el nombre del producto"
                  labelPlacement="outside"
                  variant="bordered"
                  startContent={<Search />}
                  className="w-full dark:text-white font-semibold"
                  onChange={(e) => setProductName(e.target.value)}
                  onClear={() => setProductName('')}
                />
              </div>
              <div>
                <Input
                  label="Código"
                  placeholder="Escribe el código del producto"
                  labelPlacement="outside"
                  variant="bordered"
                  startContent={<Search />}
                  className="w-full dark:text-white font-semibold"
                  onChange={(e) => setCode(e.target.value)}
                  onClear={() => setCode('')}
                />
              </div>
            </div>
            <div className="w-full flex justify-end py-5 gap-4">
              <div>
                <Select
                  className="w-44 dark:text-white"
                  variant="bordered"
                  label="Mostrar"
                  defaultSelectedKeys={[limit.toString()]}
                  labelPlacement="outside"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value !== '' ? e.target.value : '8'));
                  }}
                >
                  {limit_options.map((option) => (
                    <SelectItem key={option} value={option} className="dark:text-white">
                      {option}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    navigate('/add-purchase-order');
                  }}
                  style={global_styles().secondaryStyle}
                  className="px-10"
                >
                  Aceptar
                </Button>
              </div>
            </div>
            <div>
              {branch_product_order_paginated_loading ? (
                <>
                  <div className="flex items-center justify-center h-full">
                    <tr>
                      <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
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

                          const handleProductClick = () => {
                            if (isProductSelected) {
                              deleteProductOrder(branch_product.id);
                            } else {
                              addProductOrder(branch_product);
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
                                <Truck /> {branch_product.supplier?.nombre ?? ''}
                              </p>
                              <p className="mt-2 flex gap-3 dark:text-white">
                                <ScrollText />
                                {branch_product.product.subCategory.categoryProduct.name ?? ''}
                              </p>
                              <p className="mt-2 flex gap-3 dark:text-white">
                                <DollarSign /> ${branch_product.price}
                              </p>

                              <Button
                                className={`px-10 mt-3 ${
                                  isProductSelected ? 'bg-green-500' : 'bg-blue-950'
                                }`}
                                onPress={handleProductClick}
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
                <>
                  <div className="hidden w-full mt-5 md:flex">
                    <Pagination
                      previousPage={branch_product_order_paginated.prevPag}
                      nextPage={branch_product_order_paginated.nextPag}
                      currentPage={branch_product_order_paginated.currentPag}
                      totalPages={branch_product_order_paginated.totalPag}
                      onPageChange={(page) => {
                        getBranchProductOrders(branch, supplier, productName, code, page, limit);
                      }}
                    />
                  </div>
                  <div className="flex w-full mt-5 md:hidden">
                    <SmPagination
                      handleNext={() => {
                        getBranchProductOrders(branch, supplier, productName, code, 1, limit);
                      }}
                      handlePrev={() => {
                        getBranchProductOrders(branch, supplier, productName, code, 1, limit);
                      }}
                      currentPage={branch_product_order_paginated.currentPag}
                      totalPages={branch_product_order_paginated.totalPag}
                    />
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default PurchaseOrderForm;
