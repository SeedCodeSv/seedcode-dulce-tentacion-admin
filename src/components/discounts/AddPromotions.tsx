import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { Formik } from 'formik';
import { Key, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Tab, Tabs } from "@heroui/react";
import React from 'react';

import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { operadores } from '../../utils/constants';
import { Promotion } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsStore } from '../../store/promotions/promotions.store';


import WeekSelector from './WeekSelector';
import AddPromotionsByProducts from './AddPromotionsByProducts';
import AddPromotionsByCategory from './AddPromotionsByCategory';

import { Colors } from "@/types/themes.types";
import ButtonUi from "@/themes/ui/button-ui";


function AddDiscount() {
  const [selectedBranchId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState(0);
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
    price: yup
      .number()
      .required('**El precio es requerido**')
      .min(0, '**El precio no puede ser negativo**'),
    operatorPrice: yup
      .string()
      .oneOf(['=', '>', '<', '>=', '<='])
      .required('**El operador es requerido**'),
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
  const { postPromotions } = usePromotionsStore();

  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId]);

  const navigate = useNavigate();

  useEffect(() => {
    getBranchesList();
  }, []);
  const handleSave = (values: Promotion) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: branchId,
      // operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      // typePromotion: selectedPromotion,
      priority: selectedPriority,
    };

    postPromotions(payload);
    navigate('/discounts');
  };

  const [selected, setSelected] = React.useState<string>('sucursales');

  const handleSelectionChange = (key: Key) => {
    setSelected(key as string);
  };

  const [showTooltipFixedPrice, setShowTooltipFixedPrice] = useState(false);

  // const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full flex flex-col h-full dark:bg-transparent relative p-2">
          <div className="justify-between w-full lg:flex-row lg:gap-0 absolute top-8 left-4 ">
            <ArrowLeft
              className="cursor-pointer"
              size={25}
              onClick={() => {
                navigate('/discounts');
              }}
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full p-5  shadow rounded-xl border dark:border-gray-600 ">
            <Tabs
              aria-label="Options"
              selectedKey={selected}
              onSelectionChange={handleSelectionChange}
            >
              <Tab key="sucursales" title="Sucursales">
                <Formik
                  initialValues={{
                    name: '',
                    branchId: 0,
                    days: '',
                    description: '',
                    startDate: formatDate(),
                    endDate: formatDate(),
                    // quantity: 0,
                    percentage: 0,
                    // operator: '',
                    operatorPrice: '',
                    fixedPrice: 0,
                    // maximum: 0,
                    price: 0,
                    priority: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSave}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                  }) => (
                    <form className="w-full mt-4 " onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
                        {/* Columna 1 */}
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
                            <span className="text-sm font-semibold text-red-600">
                              {errors.name}
                            </span>
                          )}

                          <div className="grid grid-cols-2 gap-5 mt-4">
                            <div>
                              <Input
                                className='dark:text-white'
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                label="Precio"
                                labelPlacement="outside"
                                name="price"
                                placeholder="0"
                                value={values.price.toString()}
                                variant="bordered"
                                onBlur={handleBlur('price')}
                                onChange={handleChange('price')}
                              />
                              {errors.price && touched.price && (
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.price}
                                </span>
                              )}
                            </div>
                            <div>
                              <Select
                                className="w-full dark:text-white"
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
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
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.startDate}
                                </span>
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
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.endDate}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-5">
                            <Textarea
                              classNames={{ label: 'font-semibold text-gray-500 text-sm ' }}
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
                          <div className="grid grid-cols-1">
                            <h1 className="text-sm mb-3 font-semibold mt-4 dark:text-white">
                              Selecciona los días de la semana
                            </h1>
                            <div className=" grid grid-cols-6 items-start ">
                              <WeekSelector
                                endDate={endDate}
                                startDate={startDate}
                                onDaysSelected={handleDaysSelected}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Columna 2 */}
                        <div>
                          <Autocomplete
                            className="font-semibold"
                            label="Sucursal"
                            labelPlacement="outside"
                            placeholder="Selecciona la sucursal"
                            variant="bordered"
                          >
                            {branch_list.map((branch) => (
                              <AutocompleteItem
                                key={branch.id}
                                className="dark:text-white"
                                onClick={() => setBranchId(branch.id)}
                              >
                                {branch.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                          {errors.branchId && touched.branchId && (
                            <span className="text-sm font-semibold text-red-500">
                              {errors.branchId}
                            </span>
                          )}

                          <div className="mt-10">
                            <div>
                              {/* <Tooltip
                                color="primary"
                                content="Solo puedes llenar uno de los campos: porcentaje o precio fijo"
                                isOpen={showTooltip}
                                onOpenChange={setShowTooltip}
                                placement="right"
                              >
                                <Input
                                  label="Porcentaje"
                                  labelPlacement="outside"
                                  name="percentage"
                                  type="number"
                                  value={values.percentage ? values.percentage.toString() : ''}
                                  onChange={(e) => {
                                    const newValue = parseFloat(e.target.value);
                                    handleChange('percentage')(e);
                                    if (newValue > 0) {
                                      setFieldValue('fixedPrice', 0);
                                      setShowTooltip(false);
                                    }
                                    if (newValue > 0 && values.fixedPrice > 0) {
                                      setShowTooltip(true);
                                    }
                                  }}
                                  onBlur={handleBlur('percentage')}
                                  placeholder="0"
                                  classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                  variant="bordered"
                                />
                                
                              </Tooltip> */}

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
                              {errors.percentage && touched.percentage && (
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.percentage}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-10">
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

                          <div className="mt-4">
                            <CheckboxGroup
                              className="font-semibold text-black text-lg dark:text-white"
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
                      <div className="mt-4 flex flex-row justify-center">
                        <ButtonUi
                          className="hidden w-44 font-semibold md:flex h-full py-2"
                          theme={Colors.Primary}
                          type="submit"
                        >
                          Crear Promoción
                        </ButtonUi>
                      </div>
                    </form>
                  )}
                </Formik>
              </Tab>
              <Tab key="productos" title="Productos">
                <AddPromotionsByProducts />
              </Tab>
              <Tab key="categoria" title="Categorias">
                <AddPromotionsByCategory />
              </Tab>
         
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddDiscount;
