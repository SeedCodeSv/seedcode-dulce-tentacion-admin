import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  type Selection,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { ArrowBigLeft, ArrowDown, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useEmployeeStore } from '@/store/employee.store';
import { API_URL } from '@/utils/constants';
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
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { Branches } from '@/types/branches.types';

type ProductRecipe = ResponseVerifyProduct & {
  quantity: number;
};

type TypeSearch = 'MP' | 'RENDIMIENTO';

interface Props {
  branchOrigin: Branches
  selectedProduct: ProductRecipe
  setSelectedProduct: (product: ProductRecipe | undefined) => void
}

export default function AddProductionOrderByProductOrder({ branchOrigin, selectedProduct, setSelectedProduct }: Props) {

  const handleChangePerformance = (performance: string) => {
    const performanceNumber = Number(performance);

    if (performanceNumber <= 0) return;

    const updatedDetails = selectedProduct.recipeBook.productRecipeBookDetails.map((detail) => ({
      ...detail,
      quantityPerPerformance: (performanceNumber * Number(detail.quantity)).toFixed(4),
    }));

    const updatedProduct = {
      ...selectedProduct,
      recipeBook: {
        ...selectedProduct.recipeBook,
        performance: performanceNumber,
        productRecipeBookDetails: updatedDetails,
      },
    };

    setSelectedProduct(updatedProduct);
  };

  const navigate = useNavigate();

  const isMovil = useIsMobileOrTablet();
  const { show, close } = useAlert()

  const { branchDestiny } = useShippingBranchProductBranch();
  const [selectedEmployee, setSelectedEmployee] = useState<Selection>(new Set([]));
  const [observation, setObservation] = useState('Orden de producción a partir de orden de productos');
  
  const modalRecipe = useDisclosure();
  const typeSearch = ['RENDIMIENTO', 'MP'];

  const [selectedTypeSearch, setSelectedTypeSearch] = useState<'RENDIMIENTO' | 'MP'>(
    'RENDIMIENTO'
  );


  const { getEmployeesList, employee_list } = useEmployeeStore();

  useEffect(() => {
    getEmployeesList();
  }, []);


  const { errors } = useProductionOrderStore();

  const validateSelection = (value: unknown, message: string) => {
    if (!value) {
      toast.error(message, { position: isMovil ? 'bottom-right' : 'top-center' });

      return false;
    }

    return true;
  };

  const validateHasProducts = () => {
    if (!selectedProduct) {
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
    const branch = branchOrigin.id;
    const employee = new Set(selectedEmployee).values().next().value;
    const destinationBranch = branchDestiny?.id;

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
    const branch = branchOrigin.id;
    const employee = new Set(selectedEmployee).values().next().value;
    const destinationBranch = branchDestiny?.id;

    const payload = {
      branchProductId: selectedProduct?.branchProduct.id,
      receptionBranch: Number(branch),
      destinationBranch: Number(destinationBranch),
      employee: Number(employee),
      quantity: Number(selectedProduct?.recipeBook.performance),
      observation,
      moreInformation,
      totalCost: totalCost(),
      costPrime: calcCostoPrimo().toFixed(2),
      costRawMaterial: calcMp(),
      indirectManufacturingCost: calcCif(),
      costDirectLabor: calcMod(),
      products: selectedProduct?.recipeBook.productRecipeBookDetails.map((p) => ({
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
        navigate('/order-products')
      })
      .catch(() => {
        toast.error('Error al crear la orden de producción', {
          position: isMovil ? 'bottom-right' : 'top-center',
          duration: 1000,
        });
      });
  };


  const calcMp = () => {

    const total = selectedProduct.recipeBook?.productRecipeBookDetails?.reduce(
      (acc, detail) =>
        acc + Number(detail.branchProduct?.costoUnitario) * Number(detail.quantityPerPerformance),
      0
    );

    return total ?? 0;
  };

  const calcMod = () => {
    if (!selectedProduct) {
      return '0';
    }

    if (mod === '0' || mod === undefined || mod === null || isNaN(Number(mod))) {
      return '0';
    }

    const base = selectedTypeSearch === 'MP' ? calcMp() : selectedProduct.recipeBook?.performance;

    return (Number(mod) * base).toFixed(2);
  };

  const [mod, setMod] = useState('0');

  const calcCostoPrimo = () => {
    const mp = calcMp();

    if (mp <= 0) {
      return 0;
    }

    if (calcMod() === '0' || calcMod() === undefined || mod === null || isNaN(Number(calcMod()))) {
      return 0;
    }

    return mp + Number(calcMod());
  };

  const [costCif, setCostCif] = useState('0');

  const calcCif = () => {
    if (!selectedProduct) {
      return '0';
    }

    if (costCif === '0' || costCif === undefined || costCif === null || isNaN(Number(costCif))) {
      return '0';
    }

    const performance = selectedProduct?.recipeBook?.performance;

    return (Number(costCif) * Number(performance))?.toFixed(2);
  };

  const totalCost = () => {
    if (!selectedProduct) {
      return '0';
    }

    const cif = calcCif();
    const mod = calcCostoPrimo();

    return (Number(cif) + Number(mod))?.toFixed(2);
  };

  return (
    <>
      <RecipeBook
        isOpen={modalRecipe.isOpen}
        productId={0}
        onOpenChange={modalRecipe.onOpenChange}
      />
      <DivGlobal>
        <div className='pb-2'>
          <ButtonUi
            startContent={<ArrowBigLeft />}
            theme={Colors.Info}
            onPress={() => navigate('/order-products')}
          >
            Regresar
          </ButtonUi>
        </div>
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-row-reverse w-full justify-between xl:flex-col gap-5">
            <ResponsiveFilterWrapper withButton={false}>
              <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5">
                <Input
                  isReadOnly
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Extraer producto de"
                  placeholder="Selecciona la sucursal de origen"
                  value={String(branchOrigin?.name ?? '')}
                  variant="bordered"
                />
                <Input
                  isReadOnly
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Mover producto a"
                  placeholder="Seleccione la sucursal de destino"
                  value={String(branchDestiny?.name ?? '')}
                  variant="bordered"
                />
                <Select
                  className="dark:text-white"
                  classNames={{ label: 'font-semibold' }}
                  label="Encargado"
                  placeholder="Selecciona el encargado de la orden"
                  selectedKeys={selectedEmployee}
                  selectionMode="single"
                  variant="bordered"
                  onSelectionChange={setSelectedEmployee}
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
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto flex flex-col py-2">
          {selectedProduct && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-2 items-center">
                <p>PROCESO: {selectedProduct?.branchProduct?.product?.name}</p>
                <Input
                  className="max-w-64"
                  defaultValue={String(selectedProduct?.recipeBook?.performance)}
                  label='PRODUCCIÓN:'
                  labelPlacement='outside-left'
                  variant="bordered"
                  onKeyDown={preventLetters}
                  onValueChange={(e) => handleChangePerformance(e)}
                />
              </div>

              {selectedProduct?.recipeBook && (
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
                    {selectedProduct?.recipeBook?.productRecipeBookDetails?.map((r) => (
                      <tr key={r.id}>
                        <TdGlobal className="p-3">{r.product?.name}</TdGlobal>
                        <TdGlobal className="p-3">{r.product.code}</TdGlobal>
                        <TdGlobal className="p-3">{r.quantity}</TdGlobal>
                        <TdGlobal className="p-3">{r.branchProduct?.costoUnitario}
                        </TdGlobal>
                        <TdGlobal className="p-3">{r.quantityPerPerformance}</TdGlobal>
                        <TdGlobal className="p-3">
                          {(Number(r.branchProduct?.costoUnitario) * Number(r.quantityPerPerformance)).toFixed(
                            4
                          )}
                        </TdGlobal>
                      </tr>
                    ))}
                  </TableComponent>
                </>
              )}
              <div className="h-full overflow-y-auto flex md:hidden" />
            </>
          )}
        </div>
        <Accordion defaultExpandedKeys={['costs']} variant="splitted" >
          <AccordionItem
            key="costs"
            className='dark:bg-gray-800'
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
                  value={selectedProduct ? calcMp()?.toFixed(2) : '0'}
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
                    endContent={
                      <select
                        className="outline-none border-0 flex items-end bg-transparent text-default-400 text-small"
                        id="currency"
                        name="currency"
                        onChange={(e) => {
                          setSelectedTypeSearch(e.currentTarget.value as TypeSearch);
                        }}
                      >
                        {typeSearch.map((tpS) => (
                          <option key={tpS} value={tpS}>
                            {tpS}
                          </option>
                        ))}
                      </select>
                    }
                    labelPlacement="outside"
                    placeholder="0.00"
                    size="sm"
                    value={
                      !selectedProduct ? '' : selectedTypeSearch === 'MP'
                        ? calcMp()?.toFixed(2)
                        : String(selectedProduct?.recipeBook?.performance ?? '')
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
                    value={calcMod()}
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
                    value={selectedProduct ? calcCostoPrimo().toFixed(2) : '0'}
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
                      selectedProduct ? String(selectedProduct?.recipeBook?.performance)
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
                    value={calcCif()}
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
                  value={selectedProduct ? totalCost() : '0'}
                  variant="bordered"
                />
              </div>
            </div>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-between md:justify-end gap-0 md:gap-4 items-end mt-3">
          <ButtonUi theme={Colors.Error} onPress={() => {
            navigate('/order-products')
            setSelectedProduct(undefined)
          }}>
            Cancelar
          </ButtonUi>
          <ButtonUi theme={Colors.Primary} onPress={handleSaveOrder}>
            Guardar
          </ButtonUi>
        </div>
      </DivGlobal>
    </>
  );
}
