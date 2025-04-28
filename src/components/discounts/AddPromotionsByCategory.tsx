import {
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
} from "@heroui/react";
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { operadores } from '../../utils/constants';
import { PromotionCategories } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';
import { useCategoriesStore } from '../../store/categories.store';

import WeekSelector from './WeekSelector';


import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

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
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 w-full">
                {/* COLUMNA 1 */}
                <div>
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
                  <div className="grid grid-cols-2 gap-2 mt-6">
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
                  <div className="grid grid-cols-2  gap-4 mt-6">
                    <div className="">
                      <Input
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold',
                        }}
                        label="Fecha inicial"
                        labelPlacement="outside"
                        type="date"
                        value={startDate}
                        variant="bordered"
                        onChange={(e) => setStartDate(e.target.value)}
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
                        label="Fecha final"
                        labelPlacement="outside"
                        type="date"
                        value={endDate}
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
                  <div className="grid grid-cols-1 mt-6">
                    {/* Seleccionar dia */}
                    <div className="grid grid-cols-1">
                      <h1 className="text-sm  font-semibold dark:text-white">
                        Selecciona los días de la semana
                      </h1>
                      <div className=" grid grid-cols-6 items-start mt-2">
                        <WeekSelector
                          endDate={endDate}
                          startDate={startDate}
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
                          key={branch.id}
                          className="dark:text-white"
                          onClick={() => setBranchId(branch.id)}
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
                      </div>
                      <div>
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
                    </div>
                    <div className="grid grid-cols-1 gap-5 mt-6">
                      <Select
                        multiple
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Categorías"
                        labelPlacement="outside"
                        name="categories"
                        placeholder="Selecciona las categorías"
                        selectedKeys={selectedCategories}
                        variant="bordered"
                        onBlur={handleBlur('branch')}
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
                          <SelectItem key={val.id} className="dark:text-white">
                            {val.name}
                          </SelectItem>
                        ))}
                      </Select>
                      <div />
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
                </div>
              </div>
              <div className="mt-4 flex flex-row justify-center">
                <ButtonUi
                  className="hidden font-semibold md:flex w-44 h-full py-2"
                  theme={Colors.Primary}
                  onPress={() => handleSubmit()}
                >
                  Crear Promoción
                </ButtonUi>
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddPromotionsByCategory;
