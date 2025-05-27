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

import Layout from '@/layout/Layout';
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

type ProductRecipe = ResponseVerifyProduct & {
  quantity: number;
};

function AddProductionOrder() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const isMovil = useIsMobileOrTablet();
  const { show, close } = useAlert()

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
          message:
            'Algunos insumos no tienen stock suficiente. ¿Deseas continuar de todas formas?',
          buttonOptions: (
            <>
              <ButtonUi theme={Colors.Info} onPress={close}>Cancelar</ButtonUi>
              <ButtonUi theme={Colors.Primary} onPress={() => {
                sendProductionOrder('["algunos insumos no tienen suficiente stock"]')
                close()
              }
              }  >Sí, continuar</ButtonUi>
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

    sendProductionOrder()
  };

  const sendProductionOrder = (moreInformation = '[]') => {
    const branch = new Set(selectedBranch).values().next().value;
    const employee = new Set(selectedEmployee).values().next().value;
    const destinationBranch = new Set(moveSelectedBranch).values().next().value;

    const payload = {
      branchProductId: selectedProducts[0].branchProduct.id,
      receptionBranch: Number(destinationBranch),
      destinationBranch: Number(branch),
      employee: Number(employee),
      quantity: Number(selectedProducts[0].recipeBook.performance),
      observation,
      moreInformation,
      totalCost: totalCost(0),
      costPrime: calcCostoPrimo(0).toFixed(2),
      products: selectedProducts[0].recipeBook.productRecipeBookDetails.map((p) => ({
        observations: '',
        branchProductId: p.branchProduct?.id,
        branchProductName: p.branchProduct?.product.name,
        quantity: +p.quantityPerPerformance,
        totalCost: (Number(p.branchProduct?.costoUnitario) * Number(p.quantityPerPerformance)).toFixed(4),
      })),
      
    };

    axios
      .post(API_URL + '/production-orders', payload)
      .then(() => {
        toast.success('Orden de producción creada exitosamente', {
          position: isMovil ? 'bottom-right' : 'top-center',
          duration: 1000,
        });
      navigate('/production-orders');
      })
      .catch(() => {
        toast.error('Error al crear la orden de producción', {
          position: isMovil ? 'bottom-right' : 'top-center',
          duration: 1000,
        });
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

  const calcMod = (index: number) => {
    if (selectedProducts.length === 0) {
      return '0';
    }

    if (mod === '0' || mod === undefined || mod === null || isNaN(Number(mod))) {
      return '0';
    }

    const performance = selectedProducts[index].recipeBook?.performance;

    return (Number(mod) * Number(performance))?.toFixed(2);
  };

  const [mod, setMod] = useState('0');

  const calcCostoPrimo = (index: number) => {
    const mp = calcMp(index);

    if (mp <= 0) {
      return 0;
    }

    if (calcMod(0) === '0' || calcMod(0) === undefined || mod === null || isNaN(Number(calcMod(0)))) {
      return 0;
    }

    return mp + Number(calcMod(0));
  };

  const [costCif, setCostCif] = useState('0');

  const calcCif = (index: number) => {
    if (selectedProducts.length === 0) {
      return '0';
    }

    if (costCif === '0' || costCif === undefined || costCif === null || isNaN(Number(costCif))) {
      return '0';
    }

    const performance = selectedProducts[index].recipeBook?.performance;

    return (Number(costCif) * Number(performance))?.toFixed(2);
  };

  const totalCost = (index: number) => {
    if (selectedProducts.length === 0) {
      return '0';
    }

    const cif = calcCif(index);
    const mod = calcCostoPrimo(index);

    return (Number(cif) + Number(mod))?.toFixed(2);
  };

  const Filters = () => (
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
                e.firstName + ' ' + e.secondName + ' ' + e.firstLastName + ' ' + e.secondLastName
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
  );

  return (
    <Layout title="Nueva Orden de Producción">
      <>
        <RecipeBook
          isOpen={modalRecipe.isOpen}
          productId={0}
          onOpenChange={modalRecipe.onOpenChange}
        />
        <DivGlobal className=" w-full h-full flex flex-col overflow-y-auto p-5 lg:p-8">
          <div className="hidden xl:flex">
            <Filters />
          </div>
          <div className="flex justify-between items-end w-full my-4">
            <p className="text-sm font-semibold">Productos</p>
            <div className="flex  gap-5">
              <div className="flex xl:hidden">
                <Filters />
              </div>
              <ButtonUi
                isIconOnly
                isDisabled={new Set(selectedBranch).size === 0 || new Set(moveSelectedBranch).size === 0}
                theme={Colors.Success}
                onPress={modalProducts.onOpen}
              >
                <Plus />
              </ButtonUi>
            </div>
          </div>
          <div className="w-full h-full overflow-y-auto flex flex-col">
            {selectedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-2">
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
                      className=' hidden md:flex flex-col'
                      headers={[
                        'Producto',
                        'Código',
                        'Cant. por unidad',
                        'Costo unitario',
                        'Cant. Total',
                        'Costo Total'
                      ]}
                    >
                      {selectedProducts[0].recipeBook?.productRecipeBookDetails?.map((r) => (
                        <tr key={r.id}>
                          <td className="p-3">{r.product?.name}</td>
                          <td className="p-3">{r.product.code}</td>
                          <td className="p-3">{r.quantity}</td>
                          <td className="p-3">{r.branchProduct?.costoUnitario}
                          </td>
                          <td className="p-3">{r.quantityPerPerformance}</td>
                          <td className="p-3">
                            {(Number(r.branchProduct?.costoUnitario) * Number(r.quantityPerPerformance)).toFixed(
                              4
                            )}
                          </td>
                        </tr>
                      ))}
                    </TableComponent>
                  </>
                )}
                <div className="h-full overflow-y-auto flex md:hidden" />
              </>
            )}
          </div>
          <Accordion defaultExpandedKeys={['costs']} variant="splitted">
            <AccordionItem
              key="costs"
              indicator={<ArrowDown className="text-slate-700 dark:text-slate-200" />}
              startContent={<DollarSign className="text-green-700 dark:text-slate-200" size={25} />}
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
                    value={selectedProducts.length > 0 ? calcMp(0)?.toFixed(2) : '0'}
                    variant="bordered"
                  />
                  <div className="flex gap-1 items-end col-span-2">
                   <Input
                      classNames={{
                        label: 'font-semibold text-[10px]',
                        input: 'text-xs',
                      }}
                      label="VALOR"
                      labelPlacement="outside"
                      placeholder="0.00"
                      size="sm"
                      value={mod}
                      variant="bordered"
                      onKeyDown={preventLetters}
                      onValueChange={(e) => setMod(e)}
                    />
                    <span className="font-semibold text-3xl">*</span>
                     <Input
                      readOnly
                      classNames={{
                        label: 'font-semibold text-[10px]',
                        input: 'text-xs',
                      }}
                      label="RENDIMIENTO"
                      labelPlacement="outside"
                      placeholder="0.00"
                      size="sm"
                      value={
                        selectedProducts.length > 0
                          ? String(selectedProducts[0].recipeBook?.performance)
                          : '0'
                      }
                      variant="bordered"
                    />
                    <span className="font-semibold text-3xl">=</span>
                  <Input
                    classNames={{
                      label: 'font-semibold text-[10px]',
                      input: 'text-xs',
                    }}
                    label="MOD"
                    labelPlacement="outside"
                    placeholder="0.00"
                    size="sm"
                    value={calcMod(0)}
                    variant="bordered"
                    onKeyDown={preventLetters}
                  />
                  <Input
                    classNames={{
                      label: 'font-semibold text-[10px]',
                      input: 'text-xs',
                    }}
                    label="COSTO PRIMO"
                    labelPlacement="outside"
                    placeholder="0.00"
                    size="sm"
                    value={selectedProducts.length > 0 ? calcCostoPrimo(0).toFixed(2) : '0'}
                    variant="bordered"
                  />
                  </div>
                  <div className="flex gap-1 items-end col-span-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-[10px]',
                        input: 'text-xs',
                      }}
                      label="VALOR"
                      labelPlacement="outside"
                      placeholder="0.00"
                      size="sm"
                      value={costCif}
                      variant="bordered"
                      onKeyDown={preventLetters}
                      onValueChange={(e) => setCostCif(e)}
                    />
                    <span className="font-semibold text-3xl">*</span>
                    <Input
                      readOnly
                      classNames={{
                        label: 'font-semibold text-[10px]',
                        input: 'text-xs',
                      }}
                      label="RENDIMIENTO"
                      labelPlacement="outside"
                      placeholder="0.00"
                      size="sm"
                      value={
                        selectedProducts.length > 0
                          ? String(selectedProducts[0].recipeBook?.performance)
                          : '0'
                      }
                      variant="bordered"
                    />
                    <span className="font-semibold text-3xl">=</span>
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
                      value={calcCif(0)}
                      variant="bordered"
                    />
                  </div>
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
                    value={selectedProducts.length > 0 ? totalCost(0) : '0'}
                    variant="bordered"
                  />
                </div>
              </div>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between md:justify-end gap-0 md:gap-4 items-end mt-3">
            <ButtonUi theme={Colors.Warning} onPress={() => setSelectedProducts([])}>Limpiar todo</ButtonUi>
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
    </Layout>
  );
}

export default AddProductionOrder;
