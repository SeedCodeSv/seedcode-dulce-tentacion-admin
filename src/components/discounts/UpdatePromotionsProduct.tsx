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
import { useContext, useEffect, useState } from 'react';
import WeekSelector from './WeekSelector';
import { Formik } from 'formik';
import * as yup from 'yup';
import { PromotionProducts } from '../../types/promotions.types';
import { useProductsStore } from '../../store/products.store';
import { useBranchesStore } from '../../store/branches.store';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';
import { operadores } from '../../utils/constants';
import { global_styles } from '../../styles/global.styles';
import HeadlessModal from '../global/HeadlessModal';
import { DollarSign, ScrollText, Search, Truck } from 'lucide-react';
import { Branches } from '../../types/branches.types';
import { usePromotionsProductsStore } from '../../store/promotions/promotionsByProduct.store';

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

  const { theme } = useContext(ThemeContext);
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
          validationSchema={validationSchema}
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
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <form className="w-full max-w-5xl mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-50">
                  {/* COLUMNA 1 */}
                  <div>
                    <Input
                      name="name"
                      labelPlacement="outside"
                      defaultValue={props.promotion?.name}
                      onChange={handleChange('name')}
                      placeholder="Ingresa el nombre "
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Nombre"
                      className="dark:text-white"
                    />
                    {errors.name && touched.name && (
                      <>
                        <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-5 mt-4">
                      <div>
                        <Input
                          label="Precio"
                          labelPlacement="outside"
                          name="price"
                          defaultValue={props.promotion?.price.toString()}
                          onChange={handleChange('price')}
                          onBlur={handleBlur('price')}
                          placeholder="0"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          variant="bordered"
                          type="number"
                          startContent=""
                          className="dark:text-white"
                        />
                        {errors.price && touched.price && (
                          <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                        )}
                      </div>
                      <div className="">
                        <Select
                          variant="bordered"
                          placeholder={`${props.promotion?.operatorPrice}`}
                          className="w-full dark:text-white"
                          label={`Selecciona el operador`}
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          value={values.operatorPrice}
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
                          type="date"
                          variant="bordered"
                          label="Fecha inicial"
                          labelPlacement="outside"
                          defaultValue={props.promotion?.startDate.toString()}
                          className="dark:text-white"
                          classNames={{ label: 'font-semibold' }}
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
                          type="date"
                          variant="bordered"
                          label="Fecha final"
                          labelPlacement="outside"
                          defaultValue={props.promotion?.endDate.toString()}
                          className="dark:text-white"
                          classNames={{
                            label: 'font-semibold',
                          }}
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
                        label="Descripción"
                        labelPlacement="outside"
                        name="description"
                        defaultValue={props.promotion?.description}
                        onChange={handleChange('description')}
                        onBlur={handleBlur('description')}
                        placeholder="Ingresa la descripción"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm ',
                        }}
                        variant="bordered"
                        className="dark:text-white"
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
                          startDate={startDate as string}
                          endDate={endDate as string}
                          onDaysSelected={handleDaysSelected}
                        />
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA 2 */}
                  <div>
                    <div>
                      <Input
                        label="Porcentaje de descuento"
                        labelPlacement="outside"
                        name="percentage"
                        defaultValue={props.promotion?.percentage.toString()}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          handleChange('percentage')(newValue.toString());
                          if (newValue > 0) {
                            setFieldValue('fixedPrice', 0);
                          }
                        }}
                        onBlur={handleBlur('percentage')}
                        placeholder="0"
                        classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                        variant="bordered"
                        type="number"
                        startContent="%"
                        className="dark:text-white"
                      />
                      <div className="mt-11">
                        <Input
                          label="Precio Fijo"
                          labelPlacement="outside"
                          name="fixedPrice"
                          defaultValue={props.promotion?.fixedPrice.toString()}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            handleChange('fixedPrice')(newValue.toString());
                            if (newValue > 0) {
                              setFieldValue('percentage', 0);
                            }
                          }}
                          onBlur={handleBlur('fixedPrice')}
                          placeholder="0"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          variant="bordered"
                          type="number"
                          startContent=""
                          className="dark:text-white"
                        />
                      </div>
                      <div className="mt-6">
                        <CheckboxGroup
                          classNames={{
                            label: 'font-semibold text-black text-md dark:text-white',
                          }}
                          orientation="horizontal"
                          value={selectedPriority ? [selectedPriority] : []}
                          onChange={handlePriorityChange}
                          label="Prioridad"
                          size="lg"
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
                      <Button onClick={vaul.onOpen} style={global_styles().thirdStyle}>
                        Productos
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-center mt-4">
                  <Button
                    onClick={() => handleSubmit()}
                    type="submit"
                    className="hidden h-full py-2 font-semibold md:flex w-44"
                    style={{
                      backgroundColor: theme.colors.third,
                      color: theme.colors.primary,
                    }}
                  >
                    Actualizar Promoción
                  </Button>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
      <HeadlessModal
        isOpen={vaul.isOpen}
        onClose={vaul.onClose}
        title="Seleccionar Productos"
        size="w-screen h-screen pb-20 md:pb-0 p-5 overflow-y-auto xl:w-[80vw]"
      >
        <div className="w-full bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <Select
                label="Sucursal"
                value={branch}
                defaultSelectedKeys={props.branch?.name}
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
                placeholder={props.branch?.name ? props.branch.name : 'Selecciona una sucursal'}
                labelPlacement="outside"
                variant="bordered"
                className="w-full dark:text-white"
              >
                {branch_list.map((branch: Branches) => (
                  <SelectItem className="dark:text-white" key={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                label="Nombre"
                placeholder="Escribe el nombre del producto"
                labelPlacement="outside"
                variant="bordered"
                startContent={<Search />}
                className="w-full dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end w-full py-5">
            <Button
              onClick={() => handleAccept()}
              style={global_styles().secondaryStyle}
              className="px-10"
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
                  <Truck /> {branch_product.supplier.nombre}
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
                      onClick={() => handleRemoveProduct(branch_product.id)}
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
