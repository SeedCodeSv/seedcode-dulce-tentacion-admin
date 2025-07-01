import { TrashIcon } from 'lucide-react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOutletContext } from 'react-router';

import FullDialog from '../global/FullDialog';

import ListProductInventaryAdjustment from './ListProductInventaryAdjustment';
import NoDataInventory from './NoDataInventory';

import { global_styles } from '@/styles/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { useBranchesStore } from '@/store/branches.store';
import { TypeInventoryMoment } from '@/utils/utils';
import { DetailInventoryAdjustment } from '@/types/inventory_adjustment.types';
import { useIInventoryAdjustmentStore } from '@/store/inventory_adjustment.store';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';

type ContextType = {
  isOpenModalProduct: boolean;
  setIsOpenModalProduct: React.Dispatch<React.SetStateAction<boolean>>;
  branchName: string;
  setBranchName: React.Dispatch<React.SetStateAction<string>>;
};

export default function InventoryManagement() {
  const { isOpenModalProduct, setIsOpenModalProduct, setBranchName } = useOutletContext<ContextType>();
  const {
    card_products,
    OnClearProductInventoryAdjustament,
    OnDeleteProductInventoryAdjustament,
    OnGetProductInventoryAdjustament,
  } = useIInventoryAdjustmentStore();
  const { OnCreateInventoryAdjustment } = useIInventoryAdjustmentStore();
  const userId = useAuthStore((state) => state.user?.id);
  const { getBranchesList, branch_list } = useBranchesStore();
  const isMovil = useIsMobileOrTablet()

  const [dataCreate, setDataCreate] = useState({
    description: 'N/A',
    typeMovement: '',
    typeInventory: '',
    branchId: 0,
    remainingStock: 0,
    remainingPrice: 0,
    userId: userId ?? 0,
  });
  const [productData, setProductData] = useState<Record<number, DetailInventoryAdjustment>>(
    card_products.reduce(
      (acc, product) => {
        acc[product.id] = {
          branchProductId: product.id,
          remainingStock: 0,
          remainingPrice: Number(product.costoUnitario),
        };

        return acc;
      },
      {} as Record<number, DetailInventoryAdjustment>
    )
  );
  const [branch, setBranch] = useState({
    name: '',
    id: 0,
  });
  const [filter, setFilter] = useState({
    branch: '',
    supplier: '',
    product: '',
    code: '',
    page: 1,
    limit: 30,
    itemType: '1',
  });

  const handleCreate = async () => {

    if (dataCreate.typeInventory === '' && dataCreate.typeMovement === '') {
      toast.warning('Debes seleccionar el tipo de ajuste', { position: 'top-center' })

      return
    }
    const detailInventoryAdjustments = card_products.map((product) => ({
      branchProductId: product.id,
      remainingStock: productData[product.id]?.remainingStock ?? 0,
      remainingPrice: productData[product.id]?.remainingPrice ?? product.price,
    }));

    const ok = await OnCreateInventoryAdjustment({
      description: dataCreate.description,
      branchId: branch.id,
      userId: userId ?? 0,
      detailInventoryAdjustments,
      typeMovement: dataCreate.typeMovement,
      typeInventory: dataCreate.typeInventory,
    });

    if (ok.ok) {
      toast.success('PDF generado exitosamente');
      await OnGetProductInventoryAdjustament(
        branch.name,
        filter.supplier,
        filter.product,
        filter.code,
        filter.page,
        filter.limit,
        filter.itemType
      );
      OnClearProductInventoryAdjustament();
      setDataCreate({
        description: 'N/A',
        typeMovement: '',
        typeInventory: '',
        branchId: 0,
        remainingStock: 0,
        remainingPrice: 0,
        userId: userId ?? 0,
      })
      toast.success('Ajuste de inventario creado exitosamente');
    } else {
      toast.error('Error al crear el ajuste de inventario');
    }
  };

  const handleStockChange = (productId: number, stock: number) => {
    setProductData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        remainingStock: stock,
      },
    }));
  };
  const handlePriceChange = (productId: number, price: number) => {
    setProductData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        remainingPrice: price,
      },
    }));
  };

  useEffect(() => {
    if (branch.id !== 0) {
      OnClearProductInventoryAdjustament();
    }
    if (branch.id === 0) {
      OnClearProductInventoryAdjustament();
    }
  }, [branch.id]);

  useEffect(() => {
    getBranchesList();
  }, []);

  const tableHeaders = [
    'Articulo',
    'En Stock',
    dataCreate.typeMovement === 'Entradas' ? 'Añadir Stock' : 'Quitar Stock',
    'Costo',
    'Stock Final',
    'Acciones',
  ];

  return (
    <>
      <div className="w-full bg-transparent h-full relative">
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden pt-6">
            <div className="w-full h-[calc(100vh-200px)] p-4 border rounded-xl space-y-6 overflow-auto scrollbar-hide relative">
              <div className="grid xl:grid-cols-2 sm:grid-cols-2 gap-6">
                <div>
                  <Autocomplete
                    className="w-full dark:text-white"
                    classNames={{
                      base: 'font-semibold  text-sm',
                    }}
                    label="Selecciona el tipo de ajuste"
                    labelPlacement="outside"
                    placeholder="Selecciona el tipo "
                    selectedKey={String(
                      TypeInventoryMoment.find((type) => type.name === dataCreate.typeInventory)?.id ?? ''
                    )}
                    variant="bordered"
                    onSelectionChange={(key) => {
                      const selectedType = TypeInventoryMoment.find(
                        (branch) => branch.id === Number(key)
                      );

                      if (selectedType) {
                        setDataCreate({
                          ...dataCreate,
                          typeInventory: selectedType.name,
                          typeMovement: selectedType.type,
                        });
                      }
                    }}
                  >
                    {TypeInventoryMoment.map((type) => (
                      <AutocompleteItem
                        key={type.id}
                        className="dark:text-white"
                        textValue={type.name + ' - ' + type.type}
                      >
                        {type.name} - {type.type}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div>
                  <Autocomplete
                    className="font-semibold w-full dark:text-white"
                    clearButtonProps={{
                      onClick: () => {
                        setBranch({ name: '', id: 0 });
                        setBranchName!('');
                      },
                    }}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal"
                    variant="bordered"
                    onInputChange={(value) => {
                      const selectedBranch = branch_list.find(
                        (branch) => branch.id === Number(value)
                      );

                      if (selectedBranch) {
                        setBranch({ name: selectedBranch.name, id: selectedBranch.id });
                        setBranchName!(selectedBranch.name);
                      }
                    }}
                    onSelectionChange={(key) => {
                      const selectedBranch = branch_list.find(
                        (branch) => branch.id === Number(key)
                      );

                      if (selectedBranch) {
                        setBranch({ name: selectedBranch.name, id: selectedBranch.id });
                        setBranchName!(selectedBranch.name);
                        OnGetProductInventoryAdjustament(
                          selectedBranch.name,
                          filter.supplier,
                          filter.product,
                          filter.code,
                          filter.page,
                          filter.limit,
                          filter.itemType
                        );
                      }
                    }}
                  >
                    {branch_list.map((branch) => (
                      <AutocompleteItem
                        key={branch.id}
                        className="dark:text-white"

                      >
                        {branch.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <div className="w-full">
                <div className="hidden md:block h-[calc(100vh-430px)]  overflow-y-auto scrollbar-hide rounded-lg">
                  <div className="overflow-x-auto h-min-[900px] scrollbar-hide">
                    {card_products.length === 0 ? (
                      <NoDataInventory />
                    ) : (
                      <>
                        <table className="w-full">
                          <thead className="sticky top-0 z-[999] bg-white dark:bg-slate-800">
                            <tr>
                              {tableHeaders.map((header, index) => (
                                <th
                                  key={index}
                                  className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 bg-slate-200 dark:bg-slate-700"
                                  style={global_styles().primaryStyles}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <AnimatePresence>
                              {card_products.map((article) => (
                                <motion.tr
                                  key={article.id}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="border-b border-indigo-200 dark:border-slate-700"
                                  exit={{ opacity: 0, y: -20 }}
                                  initial={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <td className="p-3 text-sm text-slate-500 dark:text-slate-300">
                                    {article.product.name}
                                  </td>
                                  <td className="p-3 text-sm  text-slate-500 dark:text-slate-300">
                                    {article.stock}
                                  </td>
                                  <td className="p-3 text-sm text-slate-500 dark:text-slate-300">
                                    <Input
                                      className="dark:text-white"
                                      labelPlacement="outside"
                                      name="name"
                                      placeholder="stock"
                                      value={(
                                        productData[article.id]?.remainingStock?.toString() ?? 0
                                      ).toString()}
                                      variant="bordered"
                                      onChange={(e) =>
                                        handleStockChange(article.id, Number(e.target.value))
                                      }
                                    />
                                  </td>
                                  <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-300">
                                    <Input
                                      className="dark:text-white"
                                      isReadOnly={dataCreate.typeInventory !== 'Compra'}
                                      labelPlacement="outside"
                                      name="price"
                                      placeholder="precio"
                                      startContent="$"
                                      type="number"
                                      value={
                                        productData[article.id]?.remainingPrice?.toString() ??
                                        article.costoUnitario.toString()
                                      }
                                      variant="bordered"
                                      onChange={(e) =>
                                        handlePriceChange(article.id, Number(e.target.value))
                                      }
                                    />
                                  </td>
                                  <td className="p-3 text-sm  text-slate-500 whitespace-nowrap dark:text-slate-300">
                                    {dataCreate.typeMovement === 'Entradas'
                                      ? Number(article.stock) +
                                      (productData[article.id]?.remainingStock ?? 0)
                                      : article.stock -
                                      (productData[article.id]?.remainingStock ?? 0)}
                                  </td>

                                  <td className="p-3 text-sm text-center text-slate-500 dark:text-slate-300">
                                    <div className="flex gap-2">
                                      <Button
                                        isIconOnly
                                        className="bg-red-500"
                                        color="danger"
                                        variant="bordered"
                                        onPress={() =>
                                          OnDeleteProductInventoryAdjustament(article.id)
                                        }
                                      >
                                        <TrashIcon className="h-5 w-5 text-white" />
                                      </Button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                        <div className="flex justify-end space-x-4 mt-3">
                          <Button variant="bordered"
                            onPress={() => OnClearProductInventoryAdjustament()}
                          >Cancelar</Button>
                          <Button
                            className='font-semibold'
                            style={{
                              background: global_styles().thirdStyle.backgroundColor,
                              color: '#ffffff'
                            }} onPress={handleCreate}>Guardar</Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="md:hidden space-y-2 p-2">
                  <AnimatePresence>
                    {card_products.map((article) => (
                      <>
                        <motion.div
                          key={article.id}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-transparent border dark:border-white rounded-lg  border-gray-200  shadow-lg overflow-hidden"
                          exit={{ opacity: 0, y: -20 }}
                          initial={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {article.product.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-base">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 dark:text-white">En Stock:</span>
                                  <span
                                    className={`font-semibold ${article.stock < 5 ? 'text-red-600' : 'text-gray-900'} dark:text-white`}
                                  >
                                    {article.stock}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Input
                                    className="w-full text-right dark:text-white"
                                    label={
                                      dataCreate.typeMovement === 'Entradas'
                                        ? 'Añadir Stock'
                                        : 'Quitar Stock'
                                    }
                                    labelPlacement="outside"
                                    placeholder="0"
                                    type="number"
                                    value={(
                                      productData[article.id]?.remainingStock?.toString() ?? 0
                                    ).toString()}
                                    variant="bordered"
                                    onChange={(e) =>
                                      handleStockChange(article.id, Number(e.target.value))
                                    }
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 dark:text-white">
                                    Stock Final:
                                  </span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {dataCreate.typeMovement === 'Entradas'
                                      ? Number(article.stock) +
                                      (productData[article.id]?.remainingStock ?? 0)
                                      : article.stock -
                                      (productData[article.id]?.remainingStock ?? 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <Input
                                    className="w-full text-right text-green-400"
                                    isReadOnly={dataCreate.typeInventory !== 'Compra'}
                                    label="Costo"
                                    labelPlacement="outside"
                                    placeholder="0.00"
                                    startContent="$"
                                    type="number"
                                    value={
                                      productData[article.id]?.remainingPrice?.toString() ??
                                      article.price.toString()
                                    }
                                    variant="bordered"
                                    onChange={(e) =>
                                      handlePriceChange(article.id, Number(e.target.value))
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 py-4 dark:bg-transparent  dark:bg-gray-700 border-t border-white dark:border-white">
                            <Button
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              size="sm"
                              variant="ghost"
                              onPress={() => OnDeleteProductInventoryAdjustament(article.id)}
                            >
                              <TrashIcon className="h-5 w-5 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </motion.div>
                      </>
                    ))}
                    {card_products.length > 0 && (
                      <>
                        <Textarea
                          className="dark:text-white mb-4"
                          classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                          defaultValue={dataCreate.description}
                          label="Descripción"
                          labelPlacement="outside"
                          name="description"
                          placeholder="Ingresa la descripción"
                          value={dataCreate.description}
                          variant="bordered"
                          onChange={(e) =>
                            setDataCreate({ ...dataCreate, description: e.target.value })
                          }
                        />
                        <div className="flex justify-end space-x-4 mt-3">
                          <Button variant="bordered">Cancelar</Button>
                          <Button onPress={handleCreate}>Guardar</Button>
                        </div>
                      </>
                    )}
                    {card_products.length === 0 && <NoDataInventory />}
                  </AnimatePresence>
                </div>
                <div className="absolute xl:block md:block hidden  bottom-0 left-0 w-full px-4 mt-0 z-[999] shadow-lg ">
                  <Textarea
                    className="dark:text-white mb-4"
                    classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                    defaultValue={dataCreate.description}
                    label="Descripción"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Ingresa la descripción"
                    value={dataCreate.description}
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <FullDialog className={isMovil ? 'w-screen' : 'w-[79vw]'} isOpen={isOpenModalProduct!} title="Productos" onClose={() => setIsOpenModalProduct(false)}>
              <div className='w-full'>
                <ListProductInventaryAdjustment
                  branchName={branch.name}
                  reloadInventory={(branchName, supplier, product, code, page, limit, itemType) => {
                    setFilter({
                      branch: branchName,
                      supplier,
                      product,
                      code,
                      page,
                      limit,
                      itemType,
                    });
                  }}
                />
              </div>
            </FullDialog>
          </div>
        </div>
      </div>
    </>
  );
}
