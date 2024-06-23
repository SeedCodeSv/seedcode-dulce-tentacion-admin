import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
} from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import WeekSelector from './WeekSelector';
import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { operadores } from '../../utils/constants';
import { PromotionCategories } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';
import { useCategoriesStore } from '../../store/categories.store';
import { useNavigate } from 'react-router';

function AddPromotionsByCategory() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categories_list, getListCategoriesList } = useCategoriesStore();
  const [selectedBranchId] = useState<number | null>(null);
  // const [selectedPromotion, setSelectedPromotion] = useState('');
  const [branchId, setBranchId] = useState(0);
  const [endDate, setEndDate] = useState(formatDate());
  const [startDate, setStartDate] = useState(formatDate());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { getBranchesList, branch_list } = useBranchesStore();
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
  const navigate = useNavigate();
  const handleSave = (values: PromotionCategories) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: branchId,
      // operator: values.operator,
      operatorPrice: values.operatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      typePromotion: 'Categorias',
      priority: selectedPriority,
      categories: selectedCategories.map((categories) => ({ categoryId: Number(categories) })),
    };
    postPromotions(payload);
    navigate('/discounts');
  };
  const [showTooltipFixedPrice, setShowTooltipFixedPrice] = useState(false);

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
            // quantity: 0,
            percentage: 0,
            // operator: '',
            operatorPrice: '',
            fixedPrice: 0,
            typePromotion: '',
            // maximum: 0,
            price: 0,
            priority: '',
            categories: [],
          }}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
                {/* COLUMNA 1 */}
                <div>
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
                  <div className="grid grid-cols-2 gap-2 mt-6">
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
                        className="dark:text-white"
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
                        label="Operador de precio"
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
                  <div className="grid grid-cols-2  gap-4 mt-6">
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
                  <div className="grid grid-cols-1 mt-6">
                    {/* Seleccionar dia */}
                    <div className="grid grid-cols-1">
                      <h1 className="text-sm  font-semibold dark:text-white">
                        Selecciona los días de la semana
                      </h1>
                      <div className=" grid grid-cols-6 items-start mt-2">
                        <WeekSelector
                          startDate={startDate}
                          endDate={endDate}
                          onDaysSelected={handleDaysSelected}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA 2 */}
                <div>
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
                  </div>
                  <div className="mt-6">
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
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
                      </div>
                      <div>
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
                    </div>
                    <div className="grid grid-cols-1 gap-5 mt-6">
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
                </div>
              </div>
              <div className="mt-4 flex flex-row justify-center">
                <Button
                  onClick={() => handleSubmit()}
                  className="hidden font-semibold md:flex w-44 h-full py-2"
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                >
                  Crear Promoción
                </Button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddPromotionsByCategory;
