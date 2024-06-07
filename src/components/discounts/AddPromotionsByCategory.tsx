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
} from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import WeekSelector from './WeekSelector';
import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { Tipos_Promotions, operadores } from '../../utils/constants';
import { Promotion } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsStore } from '../../store/promotions/promotions.store';

function AddPromotionsByCategory() {
  const [selectedBranchId] = useState<number | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState('');
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

  const { theme } = useContext(ThemeContext);
  const validationSchema = yup.object().shape({
    name: yup.string().required('**El nombre es requerido**'),
  });

  const { getPaginatedBranchProducts } = useBranchProductStore();
  const { postPromotions } = usePromotionsStore();
  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId]);
  useEffect(() => {
    getBranchesList();
  }, []);
  const handleSave = (values: Promotion) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: branchId,
      operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      typePromotion: selectedPromotion,
      priority: selectedPriority,
    };
    postPromotions(payload);
  };

  return (
    <>
      <div className="h-full">
        <Formik
          validationSchema={validationSchema}
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
          }}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className="w-full ">
                <div className="w-full grid grid-cols-2 gap-5">
                  <div className="flex flex-col pt-2 mt-2">
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
                      <>
                        <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <Autocomplete
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder="Selecciona la sucursal"
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
                      <>
                        <span className="text-sm font-semibold text-red-500">
                          {errors.branchId}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-4 gap-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Input
                        label="Precio"
                        labelPlacement="outside"
                        name="price"
                        value={values.price.toString()}
                        onChange={handleChange('price')}
                        onBlur={handleBlur('price')}
                        placeholder="0"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent=""
                      />
                      {errors.price && touched.price && (
                        <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                      )}
                    </div>
                    <div className="">
                      <Select
                        variant="bordered"
                        placeholder="Selecciona el operador"
                        className="w-full dark:text-white"
                        label="Operador de"
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
                  <Input
                    label="Procentaje de descuento"
                    labelPlacement="outside"
                    name="percentage"
                    value={values.percentage.toString()}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      handleChange('percentage')(newValue.toString());
                      if (newValue > 0) {
                        setFieldValue('fixedPrice', 0);
                      }
                    }}
                    onBlur={handleBlur('percentage')}
                    placeholder="0"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                    type="number"
                    startContent="%"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5 w-full mt-8">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div>
                      <Input
                        label="Cantidad Minima"
                        labelPlacement="outside"
                        name="quantity"
                        value={values.quantity.toString()}
                        onChange={handleChange('quantity')}
                        onBlur={handleBlur('quantity')}
                        placeholder="0"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent=""
                      />
                      {errors.quantity && touched.quantity && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.quantity}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Cantidad Maxima"
                        labelPlacement="outside"
                        name="maximum"
                        value={values.maximum?.toString()}
                        onChange={handleChange('maximum')}
                        onBlur={handleBlur('maximum')}
                        placeholder="0"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent=""
                      />
                      {errors.maximum && touched.maximum && (
                        <span className="text-sm font-semibold text-red-500">{errors.maximum}</span>
                      )}
                    </div>
                    <div>
                      <div className="">
                        <Select
                          variant="bordered"
                          placeholder="Selecciona el operador"
                          className="w-full dark:text-white"
                          label="Operador"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          value={values.operator}
                          onChange={(e) => setFieldValue('operator', e.target.value)}
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
                      </div>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Precio Fijo"
                      labelPlacement="outside"
                      name="fixedPrice"
                      value={values.fixedPrice ? values.fixedPrice.toString() : ''}
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
                    />
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-5 mt-4">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="">
                      <Input
                        type="date"
                        variant="bordered"
                        label="Fecha inicial"
                        labelPlacement="outside"
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold',
                        }}
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
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
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold',
                        }}
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
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
                  <div>
                    {/* <Select
                                variant="bordered"
                                placeholder="Selecciona el prioridad"
                                className="w-full dark:text-white"
                                label="Prioridad"
                                labelPlacement="outside"
                                classNames={{
                                  label: 'font-semibold text-gray-500 text-sm',
                                }}
                                value={values.priority.toString()}
                                onChange={(e) => {
                                  setPiority(e.target.value);
                                }}
                              >
                                {priority.map((limit) => (
                                  <SelectItem key={limit} value={limit} className="dark:text-white">
                                    {limit}
                                  </SelectItem>
                                ))}
                              </Select> */}
                    <div>
                      <CheckboxGroup
                        className="font-semibold text-gray-500 text-lg "
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

                <div className="w-full  grid grid-cols-2 gap-5">
                  {/* Seleccionar dia */}
                  <div className="mt-5 flex flex-col items-start w-full">
                    <h1 className="text-sm mb-4 font-semibold ">
                      Selecciona los días de la semana
                    </h1>
                    <WeekSelector
                      startDate={startDate}
                      endDate={endDate}
                      onDaysSelected={handleDaysSelected}
                    />
                  </div>
                  {/* Descripción  */}
                  <div className="mt-4">
                    <Textarea
                      label="Descripción"
                      labelPlacement="outside"
                      name="description"
                      value={values.description}
                      onChange={handleChange('description')}
                      onBlur={handleBlur('description')}
                      placeholder="Ingresa la descripción"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm ',
                      }}
                      variant="bordered"
                    />
                    {errors.description && touched.description && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.description}
                      </span>
                    )}
                  </div>

                  {/* Seleccionar tipo */}
                  <div className="">
                    <Select
                      variant="bordered"
                      placeholder="Selecciona el tipo de promoción"
                      className="w-full dark:text-white"
                      label="Tipo de Promoción"
                      labelPlacement="outside"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      value={selectedPromotion}
                      onChange={(e) => {
                        setSelectedPromotion(e.target.value);
                      }}
                    >
                      {Tipos_Promotions.map((limit) => (
                        <SelectItem key={limit} value={limit} className="dark:text-white">
                          {limit}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col w-full items-center mt-7">
                  <Button
                    onClick={() => handleSubmit()}
                    className="w-500 text-sm font-semibold px-10"
                    style={{
                      backgroundColor: theme.colors.third,
                      color: theme.colors.primary,
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddPromotionsByCategory;
