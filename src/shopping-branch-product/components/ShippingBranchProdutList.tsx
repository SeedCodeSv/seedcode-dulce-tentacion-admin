import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@heroui/react';

import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';

import { global_styles } from '@/styles/global.styles';
const ShippingProductBranchList = () => {
  const { branchProducts, OnAddProductSelected } = useShippingBranchProductBranch();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg shadow-lg p-2"
      initial={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {branchProducts.length === 0 ? (
        <div className="flex items-center justify-center h-[100%] border border-gray-700 w-[100%] rounded-xl">
          <div className="flex items-center justify-center w-80 h-[400px]">
            <span className="text-2xl font-bold dark:text-white">Sin resultados</span>
          </div>
        </div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <motion.thead
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-gray-700 uppercase "
            initial={{ opacity: 0, y: -20 }}
          >
            <tr>
              {['N°', 'Nombre', 'Categoria', 'SubCategoria', 'Precio', 'Stock', 'Acciones'].map(
                (column) => (
                  <motion.th
                    key={column}
                    className="px-6 py-4  "
                    scope="col"
                    style={{
                      backgroundColor: global_styles().darkStyle.backgroundColor,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="dark:text-white"
                        style={{ color: global_styles().darkStyle.color }}
                      >
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </span>
                    </div>
                  </motion.th>
                )
              )}
            </tr>
          </motion.thead>
          <tbody>
            {branchProducts.map((item, index) => (
              <motion.tr
                key={item.id}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 dark:text-white">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item?.product?.name}
                </td>
                <td className="px-6 py-4 dark:text-white">
                  {item?.product?.subCategoryProduct?.categoryProduct?.name}
                </td>
                <td className="px-6 py-4 dark:text-white">
                  {item?.product?.subCategoryProduct?.name}
                </td>
                <td className="px-6 py-4 dark:text-white">${item.price}</td>
                <td className="px-6 py-4 dark:text-white">{item.stock}</td>
                <td className="px-6 py-4 dark:text-white">
                  <Button
                    isIconOnly
                    style={{ backgroundColor: global_styles().darkStyle.backgroundColor }}
                    onClick={() => OnAddProductSelected(item)}
                  >
                    <Plus color="white" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ShippingProductBranchList;
