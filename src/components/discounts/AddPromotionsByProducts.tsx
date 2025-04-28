import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { DollarSign, ScanBarcode, ScrollText, Search, Truck } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { operadores } from '../../utils/constants';
import { PromotionProduct } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { global_styles } from '../../styles/global.styles';
import HeadlessModal from '../global/HeadlessModal';
import { Branches } from '../../types/branches.types';
import { useSupplierStore } from '../../store/supplier.store';
import { usePromotionsProductsStore } from '../../store/promotions/promotionsByProduct.store';


import WeekSelector from './WeekSelector';

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

function AddPromotionsByProducts() {
  const vaul = useDisclosure();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const handleProductSelection = (productId: number) => {
    setSelectedProductIds((prevSelectedProductIds) => {
      if (prevSelectedProductIds.includes(productId)) {
        return prevSelectedProductIds.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProductIds, productId];
      }
    });
  };

  const handleBranchSelection = (branchId: number) => {
    setSelectedBranchId(branchId);
  };

  const [branch, setBranch] = useState('');
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [productCode, setProductCode] = useState('');
  const { getSupplierList, supplier_list } = useSupplierStore();
  const { getBranchProductOrders, branch_product_order } = useBranchProductStore();

  useEffect(() => {
    getSupplierList('');
    getBranchProductOrders(branch, supplier, product, productCode);
  }, [branch, supplier, product, productCode]);
  const [endDate, setEndDate] = useState(formatDate());
  const [startDate, setStartDate] = useState(formatDate());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { getBranchesList, branch_list } = useBranchesStore();

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
  const [selectedPriority, setPriority] = useState('');
  const handlePriorityChange = (selectedValues: string[]) => {
    setPriority(selectedValues[0]);
  };
  const handleDaysSelected = (days: string[]) => {
    setSelectedDays(days);
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required('**El nombre es requerido**'),
  });
  const { getPaginatedBranchProducts } = useBranchProductStore();
  const { postPromotions } = usePromotionsProductsStore();

  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId]);
  useEffect(() => {
    getBranchesList();
  }, []);
  const navigate = useNavigate();
  const handleSave = (values: PromotionProduct) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: selectedBranchId!,
      operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      typePromotion: 'Productos',
      priority: selectedPriority,
      products: selectedProductIds.map((products) => ({ productId: Number(products) })),
    };

    postPromotions(payload);
    navigate('/discounts');
  };
  const [showTooltipFixedPrice, setShowTooltipFixedPrice] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <Formik
          initialValues={{
            name: '',
            branchId: 0,
            days: '',
            description: '',
            startDate: formatDate(),
            endDate: formatDate(),
            quantity: 0,
            percentage: 0,
            operator: '',
            operatorPrice: '',
            fixedPrice: 0,
            typePromotion: '',
            maximum: 0,
            price: 0,
            priority: '',
            products: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className="absolute flex justify-end  right-20 top-8">
                <Button style={global_styles().thirdStyle} onClick={vaul.onOpen}>
                  Agregar Producto
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-5 ">
                <div className="grid w-full grid-cols-1 gap-5">
                  <div>
                    <Input
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Nombre"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Ingresa el nombre "
                      value={values.name}
                      variant="bordered"
                      onBlur={handleBlur('name')}
                      onChange={handleChange('name')}
                    />
                    {errors.name && touched.name && (
                      <>
                        <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="">
                      <Input
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Precio"
                        labelPlacement="outside"
                        name="price"
                        placeholder="0"
                        startContent=""
                        type="number"
                        value={values.price.toString()}
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
                        label="Operador de precio"
                        labelPlacement="outside"
                        placeholder="Selecciona el operador"
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

                  <div className="grid w-full grid-cols-3 gap-2 ">
                    <div>
                      <Input
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Cantidad Minima"
                        labelPlacement="outside"
                        name="quantity"
                        placeholder="0"
                        startContent=""
                        type="number"
                        value={values.quantity.toString()}
                        variant="bordered"
                        onBlur={handleBlur('quantity')}
                        onChange={handleChange('quantity')}
                      />
                      {errors.quantity && touched.quantity && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.quantity}
                        </span>
                      )}
                    </div>
                    <div>
                      <Select
                        className="w-full dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Operador"
                        labelPlacement="outside"
                        placeholder="Selecciona el operador"
                        value={values.operator}
                        variant="bordered"
                        onChange={(e) => setFieldValue('operator', e.target.value)}
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
                    </div>
                    <div>
                      <Input
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Cantidad Maxima"
                        labelPlacement="outside"
                        name="maximum"
                        placeholder="0"
                        startContent=""
                        type="number"
                        value={values.maximum?.toString()}
                        variant="bordered"
                        onBlur={handleBlur('maximum')}
                        onChange={handleChange('maximum')}
                      />
                      {errors.maximum && touched.maximum && (
                        <span className="text-sm font-semibold text-red-500">{errors.maximum}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="">
                    <Input
                      classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                      label="Porcentaje"
                      labelPlacement="outside"
                      name="percentage"
                      placeholder="0"
                      type="number"
                      value={values.percentage ? values.percentage.toString() : ''}
                      variant="bordered"
                      onBlur={handleBlur('percentage')}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);

                        handleChange('percentage')(e);
                        if (newValue > 0) {
                          setFieldValue('fixedPrice', 0);
                          // setShowTooltip(false);
                        }
                        if (newValue > 0 && values.fixedPrice > 0) {
                          // setShowTooltip(true);
                        }
                      }}
                    />
                    <div className="mt-11">
                      <Tooltip
                        className="capitize"
                        color="primary"
                        content="Solo puedes llenar uno de los campos: porcentaje o precio fijo"
                        isOpen={showTooltipFixedPrice}
                        placement="bottom-start"
                        onOpenChange={setShowTooltipFixedPrice}
                      >
                        <Input
                          classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                          label="Precio Fijo"
                          labelPlacement="outside"
                          name="fixedPrice"
                          placeholder="0"
                          type="number"
                          value={values.fixedPrice ? values.fixedPrice.toString() : ''}
                          variant="bordered"
                          onBlur={handleBlur('fixedPrice')}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);

                            handleChange('fixedPrice')(e);
                            if (newValue > 0) {
                              setFieldValue('percentage', 0);
                              setShowTooltipFixedPrice(false);
                            }
                            if (newValue > 0 && values.percentage > 0) {
                              setShowTooltipFixedPrice(true);
                            }
                          }}
                        />
                      </Tooltip>
                    </div>
                    <div className="mt-6">
                      <CheckboxGroup
                        classNames={{
                          label: 'font-semibold text-black dark:text-white text-md',
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
                </div>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div>
                    <Input
                      className="dark:text-white"
                      classNames={{ label: 'font-semibold' }}
                      label="Fecha inicial"
                      labelPlacement="outside"
                      type="date"
                      value={startDate}
                      variant="bordered"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && touched.startDate && (
                      <span className="text-sm font-semibold text-red-500">{errors.startDate}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      className="dark:text-white"
                      classNames={{ label: 'font-semibold' }}
                      label="Fecha final"
                      labelPlacement="outside"
                      type="date"
                      value={endDate}
                      variant="bordered"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && touched.endDate && (
                      <span className="text-sm font-semibold text-red-500">{errors.endDate}</span>
                    )}
                  </div>
                </div>

                <Textarea
                  classNames={{
                    label: 'font-semibold text-black text-sm',
                  }}
                  height={200}
                  label="Productos Seleccionados"
                  labelPlacement="outside"
                  name="description"
                  placeholder="Productos ..."
                  value={selectedProductIds
                    .map((id) => {
                      const product = branch_product_order.find((p) => p.id === id);

                      return product ? product.product.name : '';
                    })
                    .join(', ')}
                  variant="bordered"
                  width={300}
                />

                <div className="grid grid-cols-1 ">
                  {/* Seleccionar dia */}
                  <h1 className="text-sm font-semibold dark:text-white">
                    Selecciona los días de la semana
                  </h1>
                  <div className="grid items-start grid-cols-6 ">
                    <WeekSelector
                      endDate={endDate}
                      startDate={startDate}
                      onDaysSelected={handleDaysSelected}
                    />
                  </div>
                  {/* Descripción  */}
                  <div className="mt-2">
                    <Textarea
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm ',
                      }}
                      label="Descripción"
                      labelPlacement="outside"
                      name="description"
                      placeholder="Ingresa la descripción"
                      value={values.description}
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
                </div>

                <div className="mt-32">
                  <ButtonUi
                    className="hidden w-full h-full py-2 font-semibold md:flex"
                    theme={Colors.Primary}
                    onPress={() => handleSubmit()}
                  >
                    Guardar
                  </ButtonUi>
                </div>
              </div>
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <Select
                className="w-full dark:text-white"
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Selecciona una sucursal"
                value={branch}
                variant="bordered"
                onSelectionChange={(e) => {
                  const setkeys = new Set(e as unknown as string[]);
                  const keysArray = Array.from(setkeys);

                  if (keysArray.length > 0) {
                    const branchId = branch_list.find((branch) => branch.name === keysArray[0])?.id;

                    if (branchId) {
                      handleBranchSelection(branchId);
                      setBranch(keysArray[0]);
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
              <Autocomplete
                label="Proveedor"
                labelPlacement="outside"
                placeholder="Selecciona un proveedor"
                value={branch}
                variant="bordered"
                onSelect={(e) => {
                  setSupplier(e.currentTarget.value);
                }}
              >
                {supplier_list.map((branch) => (
                  <AutocompleteItem
                    key={branch.id ?? 0}
                    className="dark:text-white"
                  >
                    {branch.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div>
              <Input
                className="w-full dark:text-white"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Escribe el nombre del producto"
                startContent={<Search />}
                variant="bordered"
                onChange={(e) => setProduct(e.currentTarget.value)}
              />
            </div>
            <div>
              <Input
                className="w-full dark:text-white"
                label="Código"
                labelPlacement="outside"
                placeholder="Escribe el código del producto"
                startContent={<Search />}
                variant="bordered"
                onChange={(e) => setProductCode(e.currentTarget.value)}
              />
            </div>
          </div>
          {/* <div className="flex justify-end w-full py-5">
            <Button
              // onClick={vaul.onClose}
              style={global_styles().secondaryStyle}
              className="px-10">
              Aceptar
            </Button>
          </div> */}
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
                <p className="flex gap-3 mt-2 dark:text-white">
                  <ScanBarcode /> {branch_product.product.code}
                </p>

                <Button
                  className={`px-10 mt-3 ${selectedProductIds.includes(branch_product.id) ? 'bg-green-500 text-white' : ''}`}
                  style={
                    selectedProductIds.includes(branch_product.id)
                      ? { backgroundColor: 'green', color: 'white' }
                      : global_styles().thirdStyle
                  }
                  onClick={() => handleProductSelection(branch_product.id)}
                >
                  {selectedProductIds.includes(branch_product.id) ? 'Eliminar' : 'Agregar'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </HeadlessModal>
    </>
  );
}

export default AddPromotionsByProducts;
