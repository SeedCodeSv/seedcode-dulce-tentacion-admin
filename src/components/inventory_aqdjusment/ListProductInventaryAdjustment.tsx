
import { Button, Input } from '@heroui/react';
import { motion } from 'framer-motion';
import { Check, Plus, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CiBarcode, CiCirclePlus, CiMoneyBill } from 'react-icons/ci';
import { FaPencilAlt } from 'react-icons/fa';

import NoDataInventory from './NoDataInventory';

import SmPagination from '@/components/global/SmPagination';
import { global_styles } from '@/styles/global.styles';
import { IPropsListInventoryAdjustment } from '@/types/inventory_adjustment.types';
import { useIInventoryAdjustmentStore } from '@/store/inventory_adjustment.store';

export default function ListProductInventoryAdjustment({
  branchName,
  reloadInventory,
}: IPropsListInventoryAdjustment) {
  const {
    branchProducts,
    OnAddProductInventoryAdjustament,
    OnGetProductInventoryAdjustament,
    pagination_data,
    card_products,
  } = useIInventoryAdjustmentStore();

  const [filter, setFilter] = useState({
    branch: branchName,
    supplier: '',
    product: '',
    code: '',
    page: 1,
    limit: 30,
    itemType: '1',
  });

  useEffect(() => {
    reloadInventory(
      branchName,
      filter.supplier,
      filter.product,
      filter.code,
      filter.page,
      filter.limit,
      filter.itemType
    );
  }, [filter.branch, filter.product, branchName]);

  return (
    <div className="bg-transparent border p-4 w-full sm:p-6 rounded-xl h-[calc(100vh-200px)] flex-grow overflow-hidden flex flex-col">
      <div className="mb-6">
        <div className="relative">
          <Input
            className="dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-600 dark:text-gray-200 text-sm mb-1',
              base: 'font-semibold',
              input: 'text-lg',
            }}
            label="Nombre"
            labelPlacement="outside"
            name="name"
            placeholder="Ingresa el nombre"
            startContent={<SearchIcon className="h-5 w-5 text-gray-400" />}
            variant="bordered"
            onChange={(e) => setFilter({ ...filter, product: e.target.value })}
          />
        </div>
      </div>

      {branchProducts?.length === 0 ? (
        <NoDataInventory />
      ) : (
        <div className="space-y-4 overflow-y-auto scrollbar-hide flex-grow">
          <div className="md:hidden space-y-4">
            {branchProducts.map((b, index) => (
              <motion.div
                key={b.id}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border shadow-md p-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold flex items-center mb-2 dark:text-white">
                  <FaPencilAlt className="mr-2" />
                  {b.product.name}
                </h3>
                <p
                  className={`${b.stock < 5 ? 'dark:text-red-500 text-red-600' : ''} text-sm  flex items-center dark:text-white mb-3}`}
                >
                  <CiCirclePlus className="mr-2" />
                  {b.stock}
                </p>
                <p className="text-sm  flex items-center dark:text-white mb-1">
                  <CiBarcode className="mr-2" />
                  {b.product.code}
                </p>
                <p className="text-sm  flex items-center text-green-400 mb-3">
                  <CiMoneyBill className="mr-2" />${b.price}
                </p>

                <Button
                  className={`${card_products.find((p) => p.product.id === b.product.id) ? 'bg-green-600' : 'bg-red-500'} w-full`}
                  color="success"
                  size="sm"
                  onPress={() => OnAddProductInventoryAdjustament(b)}
                >
                  {card_products.find((p) => p.product.id === b.product.id) ? (
                    <Check className="h-6 w-6 mr-2" color="white" />
                  ) : (
                    <Plus className="h-6 w-6 mr-2" color="white" />
                  )}
                  <p className="text-white">
                    {' '}
                    {card_products.find((p) => p.product.id === b.product.id)
                      ? 'Añadido'
                      : 'Añadir'}
                  </p>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-transparent shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100" style={global_styles().primaryStyles}>
                <tr>
                  <th className="px-4 py-2 text-left text-white">Nombre</th>
                  <th className="px-4 py-2 text-left text-white">Stock</th>
                  <th className="px-4 py-2 text-left text-white">Codigo</th>
                  <th className="px-4 py-2 text-left text-white">Precio</th>
                  <th className="px-4 py-2 text-left text-white">Costo Unitario</th>
                  <th className="px-4 py-2 text-left text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {branchProducts.map((b, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 dark:text-white">{b.product.name}</td>
                    <td className={`${b.stock < 5 ? 'text-red-600' : 'dark:text-white'} px-4 py-2`}>
                      {b.stock}
                    </td>

                    <td className="px-4 py-2 dark:text-white">{b.product.code}</td>
                    <td className="px-4 py-2 text-green-400">${b.price}</td>
                    <td className="px-4 py-2 text-green-400">${b.costoUnitario}</td>
                    <td className="px-4 py-2 text-center dark:text-white">
                      <Button
                        isIconOnly
                        className={`${card_products.find((p) => p.product.id === b.product.id) ? 'bg-green-600' : 'bg-red-500'} `}
                        size="sm"
                        onPress={() => OnAddProductInventoryAdjustament(b)}
                      >
                        {card_products.find((p) => p.product.id === b.product.id) ? (
                          <Check color="white" />
                        ) : (
                          <Plus color="white" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination_data.totalPag! > 1 && (
        <div className="mt-6">
          <SmPagination
            currentPage={pagination_data.currentPag!}
            handleNext={() => {
              OnGetProductInventoryAdjustament(
                branchName,
                filter.supplier,
                filter.product,
                filter.code,
                pagination_data.nextPag,
                filter.limit,
                filter.itemType
              );
            }}
            handlePrev={() => {
              OnGetProductInventoryAdjustament(
                branchName,
                filter.supplier,
                filter.product,
                filter.code,
                pagination_data.prevPag,
                filter.limit,
                filter.itemType
              );
            }}
            totalPages={pagination_data.totalPag!}
          />
        </div>
      )}
    </div>
  );
}
