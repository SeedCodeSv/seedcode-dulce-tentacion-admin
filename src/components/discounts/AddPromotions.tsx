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
} from '@nextui-org/react';
import { Formik } from 'formik';
import { Key, useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import WeekSelector from './WeekSelector';
import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import Layout from '../../layout/Layout';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { operadores } from '../../utils/constants';
import { Promotion } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsStore } from '../../store/promotions/promotions.store';
import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';
import AddPromotionsByProducts from './AddPromotionsByProducts';
import AddPromotionsByCategory from './AddPromotionsByCategory';


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
  const { theme } = useContext(ThemeContext);
  const { colors } = theme;

  const style = {
    backgroundColor: colors.third,
    color: colors.primary,
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
    <Layout title="Nueva Promoción">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full flex flex-col h-full dark:bg-transparent relative p-2">
          <div className="justify-between w-full lg:flex-row lg:gap-0 absolute top-8 left-4 ">
            <ArrowLeft
              onClick={() => {
                navigate('/discounts');
              }}
              className="cursor-pointer"
              size={25}
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
                  validationSchema={validationSchema}
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
                            name="name"
                            labelPlacement="outside"
                            value={values.name}
                            onChange={handleChange('name')}
                            onBlur={handleBlur('name')}
                            placeholder="Ingresa el nombre "
                            classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                            variant="bordered"
                            label="Nombre"
                          />
                          {errors.name && touched.name && (
                            <span className="text-sm font-semibold text-red-600">
                              {errors.name}
                            </span>
                          )}

                          <div className="grid grid-cols-2 gap-5 mt-4">
                            <div>
                              <Input
                                label="Precio"
                                labelPlacement="outside"
                                name="price"
                                value={values.price.toString()}
                                onChange={handleChange('price')}
                                onBlur={handleBlur('price')}
                                placeholder="0"
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                variant="bordered"
                                className='dark:text-white'
                              />
                              {errors.price && touched.price && (
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.price}
                                </span>
                              )}
                            </div>
                            <div>
                              <Select
                                variant="bordered"
                                placeholder="Selecciona el operador"
                                className="w-full dark:text-white"
                                label="Operador de precio"
                                labelPlacement="outside"
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                value={values.operatorPrice}
                                onChange={(e) => setFieldValue('operatorPrice', e.target.value)}
                              >
                                {operadores.map((operator) => (
                                  <SelectItem
                                    key={operator.value}
                                    value={operator.value}
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
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                onChange={(e) => setStartDate(e.target.value)}
                                value={startDate}
                              />
                              {errors.startDate && touched.startDate && (
                                <span className="text-sm font-semibold text-red-500">
                                  {errors.startDate}
                                </span>
                              )}
                            </div>
                            <div>
                              <Input
                                type="date"
                                variant="bordered"
                                label="Fecha final"
                                labelPlacement="outside"
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                onChange={(e) => setEndDate(e.target.value)}
                                value={endDate}
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
                              label="Descripción"
                              labelPlacement="outside"
                              name="description"
                              value={values.description}
                              onChange={handleChange('description')}
                              onBlur={handleBlur('description')}
                              placeholder="Ingresa la descripción"
                              classNames={{ label: 'font-semibold text-gray-500 text-sm ' }}
                              variant="bordered"
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
                                startDate={startDate}
                                endDate={endDate}
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
                                onClick={() => setBranchId(branch.id)}
                                className="dark:text-white"
                                key={branch.id}
                                value={branch.id}
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
                                    // setShowTooltip(false);
                                  }
                                  if (newValue > 0 && values.fixedPrice > 0) {
                                    // setShowTooltip(true);
                                  }
                                }}
                                onBlur={handleBlur('percentage')}
                                placeholder="0"
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                variant="bordered"
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
                              color="primary"
                              className="capitize"
                              content="Solo puedes llenar uno de los campos: porcentaje o precio fijo"
                              isOpen={showTooltipFixedPrice}
                              onOpenChange={setShowTooltipFixedPrice}
                              placement="bottom-start"
                            >
                              <Input
                                label="Precio Fijo"
                                labelPlacement="outside"
                                name="fixedPrice"
                                type="number"
                                value={values.fixedPrice ? values.fixedPrice.toString() : ''}
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
                                onBlur={handleBlur('fixedPrice')}
                                placeholder="0"
                                classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                                variant="bordered"
                              />
                            </Tooltip>
                          </div>

                          <div className="mt-4">
                            <CheckboxGroup
                              className="font-semibold text-black text-lg dark:text-white"
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
                      </div>
                      <div className="mt-4 flex flex-row justify-center">
                        <Button
                          type="submit"
                          style={style}
                          className="hidden w-44 font-semibold md:flex h-full py-2"
                        >
                          Crear Promoción
                        </Button>
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
    </Layout>
  );
}
export default AddDiscount;
