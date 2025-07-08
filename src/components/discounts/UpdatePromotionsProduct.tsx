import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { DollarSign, ScrollText, Search, Truck } from 'lucide-react';

import { PromotionProducts } from '../../types/promotions.types';
import { useProductsStore } from '../../store/products.store';
import { useBranchesStore } from '../../store/branches.store';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';
import { operadores } from '../../utils/constants';
import { global_styles } from '../../styles/global.styles';
import HeadlessModal from '../global/HeadlessModal';
import { Branches } from '../../types/branches.types';
import { usePromotionsProductsStore } from '../../store/promotions/promotionsByProduct.store';

import WeekSelector from './WeekSelector';

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
  id: number;
  promotion: PromotionProducts | undefined;
  branch: Branches | undefined;
  onClose: () => void;
  reloadData: () => void;
}
function UpdatePromotionsByProduct(props: Props) {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const { getListProductsList } = useProductsStore();
  const [selectedBranchId] = useState<number | null>(null);
  const [branchId] = useState(props.promotion?.branchId || 0);
  const [endDate, setEndDate] = useState(props.promotion?.endDate);
  const [startDate, setStartDate] = useState(props.promotion?.startDate);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    props.promotion?.days ? JSON.parse(props.promotion.days) : []
  );
  const { branch_list, getBranchesList } = useBranchesStore();
  const { getProductsByPromotion, removeProductsToPromotion, addProductToPromotion, products } =
    usePromotionsProductsStore();

  useEffect(() => {
    getProductsByPromotion(props.id);
    getListProductsList();
    products.forEach((product) => {
      setSelectedProductIds([...selectedProductIds, product]);
    });
  }, []);

  type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
  const priority: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

  interface PriorityInfo {
    label: string;
    color: string;
  }

  const priorityMap: Record<Priority, PriorityInfo> = {
    LOW: { label: 'Baja', color: 'green' },
    MEDIUM: { label: 'Media', color: 'orange' },
    HIGH: { label: 'Alta', color: 'red' },
  };

  const [selectedPriority, setPriority] = useState(props.promotion!.priority);
  const handlePriorityChange = (selectedValues: string[]) => {
    setPriority(selectedValues[0]);
  };

  const handleDaysSelected = (days: string[]) => {
    setSelectedDays(days);
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required('**El nombre es requerido**'),
    price: yup
      .number()
      .required('**El precio es requerido**')
      .min(0, '**El precio no puede ser negativo**'),
    operatorPrice: yup
      .string()
      .oneOf(['=', '>', '<', '>=', '<='])
      .required('**El operador es requerido**'),
    priority: yup.string().required('**La prioridad es requerida**'),
    fixedPrice: yup.number().min(0, '**El precio fijo no puede ser negativo**'),

    branchId: yup
      .string()
      .required('**Debes seleccionar la sucursal**')
      .min(1, '**Debes seleccionar la sucursal*'),

    description: yup.string().required('**La descripción es requerida**'),
    percentage: yup
      .number()
      .required('**El porcentaje es requerido**')
      .min(0, '**El porcentaje no puede ser negativo**')
      .max(100, '**El porcentaje no puede ser mayor a 100**'),
  });
  const { getPaginatedBranchProducts } = useBranchProductStore();
  const { updatePromotionProduct } = usePromotionsByCategoryStore();

  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId]);
  useEffect(() => {
    getBranchesList();
  }, [branchId]);

  const handleSave = (values: PromotionProducts) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      name: values.name,
      branchId: branchId,
      // operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate as string,
      endDate: endDate as string,
      days: daysArrayString.toString(),
      typePromotion: 'Productos',
      priority: selectedPriority,
      products: selectedProductIds.map((products) => ({ productId: Number(products) })),
    };

    updatePromotionProduct(props.id, {
      ...payload,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    props.reloadData();
    props.onClose();
    // navigate('/discounts');
  };

  //Add products
  const vaul = useDisclosure();
  const [branch, setBranch] = useState(props.branch?.name ?? '');
  const [selectedBrancheId, setSelectedBrancheId] = useState<number | null>(null);
  const handleBranchSelection = (branchId: number) => {
    setSelectedBrancheId(branchId);
  };

  const handleRemoveProduct = (productId: number) => {
    removeProductsToPromotion(productId, props.id);
  };

  const handleAddProduct = (productId: number) => {
    addProductToPromotion(productId);
  };

  const handleAccept = () => {
    vaul.onClose();
    setSelectedProductIds([...selectedProductIds, ...products]);
  };

  const { getBranchProductOrders, branch_product_order } = useBranchProductStore();

  useEffect(() => {
    getBranchProductOrders(branch, '', '', '');
  }, [branch, selectedBrancheId]);

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8">
        <Formik
          initialValues={{
            name: props.promotion?.name || '',
            branchId: props.promotion?.branchId || 0,
            days: props.promotion?.days || '',
            description: props.promotion?.description || '',
            startDate: props.promotion!.startDate || '',
            endDate: props.promotion!.endDate || '',
            // quantity: 0,
            percentage: props.promotion?.percentage || 0,
            // operator: '',
            operatorPrice: props.promotion?.operatorPrice || '',
            fixedPrice: props.promotion?.fixedPrice || 0,
            typePromotion: 'Productos',
            // maximum: 0,
            price: props.promotion?.price || 0,
            priority: props.promotion?.priority || '',
            products: props.promotion?.products || [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <form className="w-full max-w-5xl mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-50">
                  {/* COLUMNA 1 */}
                  <div>
                    <Input
                      className="dark:text-white"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.promotion?.name}
                      label="Nombre"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Ingresa el nombre "
                      variant="bordered"
                      onChange={handleChange('name')}
                    />
                    {errors.name && touched.name && (
                      <>
                        <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-5 mt-4">
                      <div>
                        <Input
                          className="dark:text-white"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultValue={props.promotion?.price.toString()}
                          label="Precio"
                          labelPlacement="outside"
                          name="price"
                          placeholder="0"
                          startContent=""
                          type="number"
                          variant="bordered"
                          onBlur={handleBlur('price')}
                          onChange={handleChange('price')}
                        />
                        {errors.price && touched.price && (
                          <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                        )}
                      </div>
                      <div className="">
                        <Select
                          className="w-full dark:text-white"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          label={`Selecciona el operador`}
                          labelPlacement="outside"
                          placeholder={`${props.promotion?.operatorPrice}`}
                          value={values.operatorPrice}
                          variant="bordered"
                          onChange={(e) => setFieldValue('operatorPrice', e.target.value)}
                        >
                          {operadores.map((operator) => (
                            <SelectItem
                              key={operator.value}
                              className="dark:text-white"
                            >
                              {operator.label}
                            </SelectItem>
                          ))}
                        </Select>

                        {errors.operatorPrice && touched.operatorPrice && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.operatorPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mt-4">
                      <div>
                        <Input
                          className="dark:text-white"
                          classNames={{ label: 'font-semibold' }}
                          defaultValue={props.promotion?.startDate.toString()}
                          label="Fecha inicial"
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
                          onChange={(e) => {
                            setStartDate(e.target.value);
                          }}
                        />
                        {errors.startDate && touched.startDate && (
                          <>
                            <span className="text-sm font-semibold text-red-500">
                              {errors.startDate}
                            </span>
                          </>
                        )}
                      </div>
                      <div>
                        <Input
                          className="dark:text-white"
                          classNames={{
                            label: 'font-semibold',
                          }}
                          defaultValue={props.promotion?.endDate.toString()}
                          label="Fecha final"
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        {errors.endDate && touched.endDate && (
                          <>
                            <span className="text-sm font-semibold text-red-500">
                              {errors.endDate}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Descripción  */}
                    <div className="mt-5">
                      <Textarea
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm ',
                        }}
                        defaultValue={props.promotion?.description}
                        label="Descripción"
                        labelPlacement="outside"
                        name="description"
                        placeholder="Ingresa la descripción"
                        variant="bordered"
                        onBlur={handleBlur('description')}
                        onChange={handleChange('description')}
                      />
                      {errors.description && touched.description && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.description}
                        </span>
                      )}
                    </div>
                    <div>
                      <h1 className="mt-4 mb-3 text-sm font-semibold dark:text-white">
                        Selecciona los días de la semana
                      </h1>
                      {/* Seleccionar dia */}
                      <div className="grid items-start grid-cols-6 ">
                        <WeekSelector
                          endDate={endDate as string}
                          startDate={startDate as string}
                          onDaysSelected={handleDaysSelected}
                        />
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 2 */}
                  <div>
                    <div>
                      <Input
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                        defaultValue={props.promotion?.percentage.toString()}
                        label="Porcentaje de descuento"
                        labelPlacement="outside"
                        name="percentage"
                        placeholder="0"
                        startContent="%"
                        type="number"
                        variant="bordered"
                        onBlur={handleBlur('percentage')}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);

                          handleChange('percentage')(newValue.toString());
                          if (newValue > 0) {
                            setFieldValue('fixedPrice', 0);
                          }
                        }}
                      />
                      <div className="mt-11">
                        <Input
                          className="dark:text-white"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultValue={props.promotion?.fixedPrice.toString()}
                          label="Precio Fijo"
                          labelPlacement="outside"
                          name="fixedPrice"
                          placeholder="0"
                          startContent=""
                          type="number"
                          variant="bordered"
                          onBlur={handleBlur('fixedPrice')}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);

                            handleChange('fixedPrice')(newValue.toString());
                            if (newValue > 0) {
                              setFieldValue('percentage', 0);
                            }
                          }}
                        />
                      </div>
                      <div className="mt-6">
                        <CheckboxGroup
                          classNames={{
                            label: 'font-semibold text-black text-md dark:text-white',
                          }}
                          label="Prioridad"
                          orientation="horizontal"
                          size="lg"
                          value={selectedPriority ? [selectedPriority] : []}
                          onChange={handlePriorityChange}
                        >
                          {priority.map((p) => (
                            <Checkbox key={p} value={p}>
                              <span style={{ color: priorityMap[p].color }}>
                                {priorityMap[p].label}
                              </span>
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                        {errors.priority && touched.priority && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 mt-6">
                      <ButtonUi
                        theme={Colors.Info}
                        onClick={vaul.onOpen}
                      >
                        Productos
                      </ButtonUi>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-center mt-4">
                  <ButtonUi
                    className="h-full py-2 font-semibold w-44"
                    theme={Colors.Primary}
                    type="submit"
                    onClick={() => handleSubmit()}
                  >
                    Actualizar Promoción
                  </ButtonUi>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
      <HeadlessModal
        isOpen={vaul.isOpen}
        size="w-screen h-screen pb-20 md:pb-0 p-5 overflow-y-auto xl:w-[80vw]"
        title="Seleccionar Productos"
        onClose={vaul.onClose}
      >
        <div className="w-full bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <Select
                className="w-full dark:text-white"
                defaultSelectedKeys={props.branch?.name}
                label="Sucursal"
                labelPlacement="outside"
                placeholder={props.branch?.name ? props.branch.name : 'Selecciona una sucursal'}
                value={branch}
                variant="bordered"
                onSelectionChange={(e) => {
                  const setkeys = new Set(e as unknown as string[]);
                  const keysArray = Array.from(setkeys);

                  if (keysArray.length > 0) {
                    const branchId = branch_list.find((branch) => branch.name === keysArray[0])?.id;

                    if (branchId) {
                      handleBranchSelection(branchId);
                      setBranch(keysArray[0]); // Asegúrate de que `branch` también se actualice
                    }
                  }
                }}
              >
                {branch_list.map((branch: Branches) => (
                  <SelectItem key={branch.name} className="dark:text-white">
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                className="w-full dark:text-white"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Escribe el nombre del producto"
                startContent={<Search />}
                variant="bordered"
              />
            </div>
          </div>
          <div className="flex justify-end w-full py-5">
            <Button
              className="px-10"
              style={global_styles().secondaryStyle}
              onClick={() => handleAccept()}
            >
              Aceptar
            </Button>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {branch_product_order.map((branch_product) => (
              <div
                key={branch_product.id}
                className="p-4 border rounded-lg shadow dark:border-gray-500"
              >
                <p className="font-semibold dark:text-white">{branch_product.product.name}</p>
                <p className="dark:text-white">Stock: {branch_product.stock}</p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <Truck /> {branch_product?.suppliers[0]?.nombre}
                </p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <ScrollText /> {branch_product.product.subCategory.name}
                </p>
                <p className="flex gap-3 mt-2 dark:text-white">
                  <DollarSign /> ${branch_product.price}
                </p>
                <div className="flex justify-start">
                  {products.includes(branch_product.id) ? (
                    <Button
                      className="px-8 my-3"
                      style={global_styles().warningStyles}
                      onPress={() => handleRemoveProduct(branch_product.id)}
                    >
                      Eliminar
                    </Button>
                  ) : (
                    <Button
                      className="px-8 my-3"
                      style={global_styles().thirdStyle}
                      onClick={() => handleAddProduct(branch_product.id)}
                    >
                      Agregar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </HeadlessModal>
    </>
  );
}

export default UpdatePromotionsByProduct;
