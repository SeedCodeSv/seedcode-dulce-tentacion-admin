import {
 

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
import {  operadores } from '../../utils/constants';
import { PromotionCategories } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';
import { useCategoriesStore } from '../../store/categories.store';

function AddPromotionsByCategory() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categories_list, getListCategoriesList } = useCategoriesStore();
  const [selectedBranchId] = useState<number | null>(null);
  // const [selectedPromotion, setSelectedPromotion] = useState('');
  const [branchId, ] = useState(0);
  const [endDate, setEndDate] = useState(formatDate());
  const [startDate, setStartDate] = useState(formatDate());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { getBranchesList } = useBranchesStore();
  useEffect(() => {
    getListCategoriesList();
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
  const { postPromotions } = usePromotionsByCategoryStore();
  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId]);
  useEffect(() => {
    getBranchesList();
  }, []);
  const handleSave = (values: PromotionCategories) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: branchId,
      operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      typePromotion: 'Categorias',
      priority: selectedPriority,
      categories: selectedCategories.map((categories) => ({ categoryId: Number(categories) })),
    };
    postPromotions(payload);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full">
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
            categories: [],
          }}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className="grid grid-cols-2 gap-5 ">
                <div className="grid grid-cols-1 gap-5 w-full">
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
                      <>
                        <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="">
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

                  <div className="grid grid-cols-3 gap-2 w-full ">
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
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="">
                    <Input
                      label="Porcentaje de descuento"
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
                    <div className="mt-11">
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
                    <div className="mt-6">
                      <CheckboxGroup
                        classNames={{
                          label: 'font-semibold text-black text-md',
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
                </div>
                <div className="grid grid-cols-2  gap-4">
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
                        <span className="text-sm font-semibold text-red-500">{errors.endDate}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <Select
                    multiple
                    variant="bordered"
                    placeholder="Selecciona las categorías"
                    selectedKeys={selectedCategories}
                    label="Categorías"
                    onBlur={handleBlur('branch')}
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    name="categories"
                    labelPlacement="outside"
                    onSelectionChange={(keys) => {
                      const setkeys = new Set(keys as unknown as string[]);
                      const keysArray = Array.from(setkeys);
                      if (keysArray.length > 0) {
                        const includes_key = selectedCategories.includes(keysArray[0]);
                        if (!includes_key) {
                          const news = [...selectedCategories, ...keysArray];
                          setSelectedCategories(news);
                          setFieldValue('categories', news);
                        } else {
                          setSelectedCategories(keysArray);
                          setFieldValue('categories', keysArray);
                        }
                      } else {
                        setSelectedCategories([]);
                        setFieldValue('categories', []);
                      }
                    }}
                  >
                    {categories_list.map((val) => (
                      <SelectItem key={val.id} value={val.id} className="dark:text-white">
                        {val.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <div></div>
                </div>
                <div className="grid grid-cols-1 ">
                  {/* Seleccionar dia */}
                  <h1 className="text-sm  font-semibold ">Selecciona los días de la semana</h1>
                  <div className=" grid grid-cols-6 items-start ">
                    <WeekSelector
                      startDate={startDate}
                      endDate={endDate}
                      onDaysSelected={handleDaysSelected}
                    />
                  </div>
                  {/* Descripción  */}
                  <div className="mt-2">
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
                </div>

                <div className="mt-40">
                  <Button
                    onClick={() => handleSubmit()}
                    className="hidden font-semibold md:flex w-full h-full py-2"
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
