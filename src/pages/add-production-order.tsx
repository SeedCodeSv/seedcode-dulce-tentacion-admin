import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  type Selection,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { ArrowDown, DollarSign, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useBranchesStore } from '@/store/branches.store';
import { useBranchProductStore } from '@/store/branch_product.store';
import { useEmployeeStore } from '@/store/employee.store';
import SelectProduct from '@/components/production-order/select-product';
import { API_URL, typesProduct } from '@/utils/constants';
import RecipeBook from '@/components/production-order/product-recipe';
import DivGlobal from '@/themes/ui/div-global';
import { ResponsiveFilterWrapper } from '@/components/global/ResposiveFilters';
import useIsMobileOrTablet from '@/hooks/useIsMobileOrTablet';
import { TableComponent } from '@/themes/ui/table-ui';
import { preventLetters } from '@/utils';
import { ResponseVerifyProduct } from '@/types/production-order.types';
import { useProductionOrderStore } from '@/store/production-order.store';
import { useAlert } from '@/lib/alert';
import TdGlobal from '@/themes/ui/td-global';


type ProductRecipe = ResponseVerifyProduct & {
  quantity: number;
};

function AddProductionOrder() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const isMovil = useIsMobileOrTablet();
  const { show, close } = useAlert();

  const [selectedBranch, setSelectedBranch] = useState<Selection>(new Set([]));
  const [moveSelectedBranch, setMoveSelectedBranch] = useState<Selection>(new Set([]));
  const [selectedEmployee, setSelectedEmployee] = useState<Selection>(new Set([]));
  const navigate = useNavigate();
  const [observation, setObservation] = useState('');

  const modalRecipe = useDisclosure();

  const { getEmployeesList, employee_list } = useEmployeeStore();

  useEffect(() => {
    getBranchesList();
    getEmployeesList();
  }, []);
  const [selectedTypeProduct, setSelectedTypeProduct] = useState<Selection>(
    new Set([typesProduct[0]])
  );
  const [selectedProducts, setSelectedProducts] = useState<ProductRecipe[]>([]);
  const modalProducts = useDisclosure();

  const { getBranchProductsRecipe } = useBranchProductStore();
  const { errors } = useProductionOrderStore();

  useEffect(() => {
    const selectedBranchS = new Set(moveSelectedBranch);
    const selectedTypeProductS = new Set(selectedTypeProduct);

    if (selectedBranchS.size > 0) {
      getBranchProductsRecipe(
        Number(selectedBranchS.values().next().value),
        1,
        10,
        '',
        '',
        '',
        String(selectedTypeProductS.values().next().value) ?? ''
      );
    }
  }, [selectedBranch, selectedTypeProduct]);

  const validateSelection = (value: unknown, message: string) => {
    if (!value) {
      toast.error(message, { position: isMovil ? 'bottom-right' : 'top-center' });

      return false;
    }

    return true;
  };

  const validateHasProducts = () => {
    if (selectedProducts.length === 0) {
      toast.error('Debe agregar al menos un producto', {
        position: isMovil ? 'bottom-right' : 'top-center',
        duration: 1000,
      });

      return false;
    }

    return true;
  };

  const validateErrors = () => {
    if (errors && errors.length > 0) {
      const hasStockIssues = errors.some((item) => item.exist === true);

      if (hasStockIssues) {
        show({
          type: 'warning',
          message: 'Algunos insumos no tienen stock suficiente. ¿Deseas continuar de todas formas?',
          buttonOptions: (
            <>
              <ButtonUi theme={Colors.Info} onPress={close}>
                Cancelar
              </ButtonUi>
              <ButtonUi
                theme={Colors.Primary}
                onPress={() => {
                  sendProductionOrder('["algunos insumos no tienen suficiente stock"]');
                  close();
                }}
              >
                Sí, continuar
              </ButtonUi>
            </>
          ),
        });

        return false;
      }
    }

    return true;
  };

  const handleSaveOrder = () => {
    const branch = new Set(selectedBranch).values().next().value;
    const employee = new Set(selectedEmployee).values().next().value;
    const destinationBranch = new Set(moveSelectedBranch).values().next().value;

    if (
      !validateSelection(branch, 'Debe seleccionar una sucursal') ||
      !validateSelection(employee, 'Debe seleccionar un empleado') ||
      !validateHasProducts() ||
      !validateSelection(destinationBranch, 'Debe seleccionar una sucursal de destino') ||
      !validateErrors()
    ) {
      return;
    }

    sendProductionOrder();
  };

  const getMod = (index: number) => {
    return selectedProducts[index]?.recipeBook?.MOP || '0.00';
  };

  const getCif = (index: number) => {
    return selectedProducts[index]?.recipeBook?.CIF || '0.00';
  };

  const calcCostoPrimo = (index: number) => {
    const mp = Number(calcMp(index)) || 0;
    const mod = Number(getMod(index)) || 0;

    return (mp + mod).toFixed(2);
  };

  const calcCostoTotal = (index: number) => {
    const costoPrimo = Number(calcCostoPrimo(index)) || 0;
    const cif = Number(getCif(index)) || 0;

    return (costoPrimo + cif).toFixed(2);
  };

  const sendProductionOrder = (moreInformation = '[]') => {
    const branch = new Set(selectedBranch).values().next().value;
    const employee = new Set(selectedEmployee).values().next().value;
    const destinationBranch = new Set(moveSelectedBranch).values().next().value;

    const firstProduct = selectedProducts[0];
    const index = 0;

    const payload = {
      receptionBranch: Number(branch),
      destinationBranch: Number(destinationBranch),
      totalCost: calcCostoTotal(index),
      costPrime: calcCostoPrimo(index),
      costRawMaterial: calcMp(index),
      indirectManufacturingCost: getCif(index),
      costDirectLabor: getMod(index),
      employee: Number(employee),
      quantity: Number(firstProduct.recipeBook?.performance || 0),
      branchProductId: firstProduct.branchProduct.id,
      products:
        firstProduct.recipeBook?.productRecipeBookDetails?.map((detail) => ({
          observations: '',
          branchProductId: detail.branchProduct?.id,
          quantity: Number(detail.quantityPerPerformance || 0),
          totalCost: (
            Number(detail.branchProduct?.costoUnitario || 0) *
            Number(detail.quantityPerPerformance || 0)
          ).toFixed(4),
        })) || [],
      observation,
      moreInformation,
    };

    axios
      .post(API_URL + '/production-orders', payload)
      .then(() => {
        toast.success('Orden de producción creada exitosamente');
        navigate('/production-orders');
      })
      .catch(() => {
        toast.error('Error al crear la orden de producción');
      });
  };

  const handleChangePerformance = (index: number, performance: string) => {
    const products = [...selectedProducts];

    if (Number(performance) > 0) {
      products[index].recipeBook?.productRecipeBookDetails.forEach((detail) => {
        detail.quantityPerPerformance = (Number(performance) * Number(detail?.quantity)).toFixed(4);
      });
    }

    products[index].recipeBook['performance'] = performance as unknown as number;

    setSelectedProducts(products);
  };

  const navigation = useNavigate();

  const calcMp = (index: number) => {
    const product = selectedProducts[index];

    const total = product.recipeBook?.productRecipeBookDetails?.reduce(
      (acc, detail) =>
        acc + Number(detail.branchProduct?.costoUnitario) * Number(detail.quantityPerPerformance),
      0
    );

    return total;
  };

  return (
    <>
      <Helmet>
        <title>Nueva orden de producción</title>
      </Helmet>
      <>
        <RecipeBook
          isOpen={modalRecipe.isOpen}
          productId={0}
          onOpenChange={modalRecipe.onOpenChange}
        />
        <DivGlobal>
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-row-reverse w-full justify-between xl:flex-col gap-5">
              <ResponsiveFilterWrapper withButton={false}>
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5">
                  <Select
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Extraer producto de"
                    placeholder="Selecciona la sucursal de origen"
                    selectedKeys={selectedBranch}
                    variant="bordered"
                    onSelectionChange={setSelectedBranch}
                  >
                    {branch_list.map((b) => (
                      <SelectItem key={b.id} className="dark:text-white">
                        {b.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Mover producto a"
                    placeholder="Seleccione la sucursal de destino"
                    selectedKeys={moveSelectedBranch}
                    selectionMode="single"
                    variant="bordered"
                    onSelectionChange={setMoveSelectedBranch}
                  >
                    {branch_list.map((b) => (
                      <SelectItem key={b.id} className="dark:text-white">
                        {b.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Encargado"
                    placeholder="Selecciona el encargado de la orden"
                    selectedKeys={selectedEmployee}
                    selectionMode="single"
                    variant="bordered"
                    onSelectionChange={setSelectedEmployee}
                    // startContent={<RefreshCcw onClick={() => getEmployeesList()}/>}
                  >
                    {employee_list.map((e) => (
                      <SelectItem
                        key={e.id}
                        className="dark:text-white"
                        textValue={
                          e.firstName +
                          ' ' +
                          e.secondName +
                          ' ' +
                          e.firstLastName +
                          ' ' +
                          e.secondLastName
                        }
                      >
                        {e.firstName ?? '-'} {e.secondName ?? '-'} {e.firstLastName ?? '-'}{' '}
                        {e.secondLastName ?? '-'}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Observaciones"
                    placeholder="Observaciones"
                    value={observation}
                    variant="bordered"
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>
              </ResponsiveFilterWrapper>
              <div className="w-full flex justify-between">
                <p className="text-sm font-semibold hiiden xl:flex">Productos</p>
                <ButtonUi
                  isIconOnly
                  isDisabled={
                    new Set(selectedBranch).size === 0 || new Set(moveSelectedBranch).size === 0
                  }
                  theme={Colors.Success}
                  onPress={modalProducts.onOpen}
                >
                  <Plus />
                </ButtonUi>
              </div>
            </div>
          </div>
          <div className="w-full h-full overflow-y-auto flex flex-col">
            {selectedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-2 mt-2 mb-2">
                  <p>PROCESO: {selectedProducts[0].branchProduct?.product?.name}</p>
                  <div className="flex gap-5 items-center">
                    <p>PRODUCCIÓN: </p>
                    <Input
                      className="max-w-32"
                      value={String(selectedProducts[0].recipeBook?.performance)}
                      variant="bordered"
                      onKeyDown={preventLetters}
                      onValueChange={(e) => handleChangePerformance(0, e)}
                    />
                  </div>
                </div>

                {selectedProducts[0].recipeBook && (
                  <>
                    <TableComponent
                      className="md:flex flex-col"
                      headers={[
                        'Producto',
                        'Código',
                        'Cant. por unidad',
                        'Costo unitario',
                        'Cant. Total',
                        'Costo Total',
                      ]}
                    >
                      {selectedProducts[0].recipeBook?.productRecipeBookDetails?.map((r) => (
                        <tr key={r.id}>
                          <TdGlobal className="p-3">{r.product?.name}</TdGlobal>
                          <TdGlobal className="p-3">{r.product.code}</TdGlobal>
                          <TdGlobal className="p-3">{r.quantity}</TdGlobal>
                          <TdGlobal className="p-3">{r.branchProduct?.costoUnitario}</TdGlobal>
                          <TdGlobal className="p-3">{r.quantityPerPerformance}</TdGlobal>
                          <TdGlobal className="p-3">
                            {(
                              Number(r.branchProduct?.costoUnitario) *
                              Number(r.quantityPerPerformance)
                            ).toFixed(4)}
                          </TdGlobal>
                        </tr>
                      ))}
                    </TableComponent>
                  </>
                )}
                <div className="h-full overflow-y-auto flex md:hidden" />
                <Accordion defaultExpandedKeys={['costs']} variant="splitted">
                  {selectedProducts.map((_product, index) => (
                    <AccordionItem
                      key={`costs-${index}`}
                      className="dark:bg-gray-800 mb-2"
                      indicator={<ArrowDown className="text-slate-700 dark:text-slate-200" />}
                      startContent={
                        <DollarSign className="text-green-700 dark:text-slate-200" size={25} />
                      }
                      title={<p className="font-semibold">Costos</p>}
                    >
                      <div className="flex flex-col">
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            readOnly
                            classNames={{
                              label: 'font-semibold text-[10px]',
                              input: 'text-xs',
                            }}
                            label="MP"
                            labelPlacement="outside"
                            placeholder="0.00"
                            size="sm"
                            value={calcMp(index)?.toFixed(2) || '0.00'}
                            variant="bordered"
                          />

                          <Input
                            readOnly
                            classNames={{
                              label: 'font-semibold text-[10px]',
                              input: 'text-xs',
                            }}
                            label="MOD"
                            labelPlacement="outside"
                            placeholder="0.00"
                            size="sm"
                            value={String(getMod(index))}
                            variant="bordered"
                          />

                          <Input
                            readOnly
                            classNames={{
                              label: 'font-semibold text-[10px]',
                              input: 'text-xs',
                            }}
                            label="COSTO PRIMO"
                            labelPlacement="outside"
                            placeholder="0.00"
                            size="sm"
                            value={calcCostoPrimo(index)}
                            variant="bordered"
                          />

                          <Input
                            readOnly
                            classNames={{
                              label: 'font-semibold text-[10px]',
                              input: 'text-xs',
                            }}
                            label="CIF"
                            labelPlacement="outside"
                            placeholder="0.00"
                            size="sm"
                            value={String(getCif(index))}
                            variant="bordered"
                          />

                          <Input
                            readOnly
                            classNames={{
                              label: 'font-semibold text-[10px]',
                              input: 'text-xs',
                            }}
                            label="COSTO TOTAL"
                            labelPlacement="outside"
                            placeholder="0.00"
                            size="sm"
                            value={calcCostoTotal(index)}
                            variant="bordered"
                          />
                        </div>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </div>

          <div className="flex justify-between md:justify-end gap-0 md:gap-4 items-end mt-3">
            <ButtonUi theme={Colors.Warning} onPress={() => setSelectedProducts([])}>
              Limpiar todo
            </ButtonUi>
            <ButtonUi theme={Colors.Error} onPress={() => navigation('/production-orders')}>
              Cancelar
            </ButtonUi>
            <ButtonUi theme={Colors.Primary} onPress={handleSaveOrder}>
              Guardar
            </ButtonUi>
          </div>
        </DivGlobal>
        <SelectProduct
          modalProducts={modalProducts}
          moveSelectedBranch={moveSelectedBranch}
          selectedBranch={selectedBranch}
          selectedProducts={selectedProducts}
          selectedTypeProduct={selectedTypeProduct}
          setSelectedBranch={setSelectedBranch}
          setSelectedProducts={setSelectedProducts}
          setSelectedTypeProduct={setSelectedTypeProduct}
        />
      </>
    </>
  );
}

export default AddProductionOrder;
