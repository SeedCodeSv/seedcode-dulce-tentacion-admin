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
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import WeekSelector from './WeekSelector';
import { useBranchesStore } from '../../store/branches.store';

import { operadores } from '../../utils/constants';
import { PromotionCategories } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { useCategoriesStore } from '../../store/categories.store';
import { usePromotionsByCategoryStore } from '../../store/promotions/promotionsByCategory.store';

interface Props {
  reloadData: () => void;
  id: number;
  promotion?: PromotionCategories;
  onClose: () => void;
}
function UpdatePromotionsCategory({ promotion, id, reloadData, onClose }: Props) {
  const [selectedBranchId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState(promotion?.branchId);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    promotion?.categories.map((promo) => promo.categoryId.toString()) || []
  );

  const { getBranchesList, branch_list } = useBranchesStore();
  const { categories_list, getListCategoriesList } = useCategoriesStore();
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
  const [selectedPriority, setPriority] = useState(promotion!.priority);
  const handlePriorityChange = (selectedValues: string[]) => {
    setPriority(selectedValues[0]);
  };
  const { theme } = useContext(ThemeContext);
  const { colors } = theme;

  const style = {
    backgroundColor: colors.third,
    color: colors.primary,
  };

  const [startDateUpdate, setStartDateUpdate] = useState(promotion?.startDate);
  const [endDateUpdate, setEndDateUpdate] = useState(promotion?.endDate);
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
  const { updatePromotionCategory } = usePromotionsByCategoryStore();
  useEffect(() => {
    if (selectedBranchId) {
      getPaginatedBranchProducts(Number(selectedBranchId));
    }
  }, [selectedBranchId, promotion]);

  useEffect(() => {
    getBranchesList();
  }, []);
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<number[]>([]);
  const handleSave = (values: PromotionCategories) => {
    const daysArrayString = JSON.stringify(selectedDays);
    const payload = {
      ...values,
      branchId: Number(branchId),
      operatorPrice: values.operatorPrice,
      startDate: startDateUpdate as string,
      endDate: endDateUpdate as string,
      days: daysArrayString.toString(),
      typePromotion: 'Categorias',
      priority: selectedPriority,
      categories: [
        ...selectedCategoryIds.map((categoryId) => ({ categoryId: Number(categoryId) })),
        ...deletedCategoryIds
          .filter((categoryId) => !selectedCategoryIds.includes(categoryId.toString()))
          .map((categoryId) => ({ categoryId: Number(categoryId), wasRemoved: true })),
      ],
    };
    updatePromotionCategory(id, {
      ...payload,
      startDate: startDateUpdate as string,
      endDate: endDateUpdate as string,
    });
    reloadData();
    onClose();
  };

  const [selectedDays, setSelectedDays] = useState<string[]>(
    promotion?.days ? JSON.parse(promotion.days) : []
  );

  const handleDaysSelected = (days: string[]) => {
    setSelectedDays(days);
  };

  const [initialValues, setInitialValues] = useState({
    name: promotion!.name,
    branchId: promotion!.branchId,
    days: promotion!.days,
    description: promotion!.description,
    startDate: promotion!.startDate,
    endDate: promotion!.endDate,
    percentage: promotion!.percentage,
    typePromotion: 'Categorias',
    operatorPrice: promotion!.operatorPrice,
    fixedPrice: promotion!.fixedPrice,
    price: promotion!.price,
    priority: promotion!.priority,
    categories: promotion?.categories?.map((promo) => promo.categoryId),
  });

  useEffect(() => {
    setInitialValues({
      name: promotion!.name,
      branchId: promotion!.branchId,
      days: promotion!.days,
      description: promotion!.description,
      startDate: promotion!.startDate,
      endDate: promotion!.endDate,
      percentage: promotion!.percentage,
      typePromotion: 'Categorias',
      operatorPrice: promotion!.operatorPrice,
      fixedPrice: promotion!.fixedPrice,
      price: promotion!.price,
      priority: promotion!.priority,
      categories: promotion?.categories?.map((promo) => promo.categoryId),
    });
    getListCategoriesList();
  }, [promotion]);

  return (
    <>
      <div className="flex flex-col justify-center items-center  p-8">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form className="w-full max-w-5xl mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 w-50">
                {/* Columna 1 */}
                <div>
                  <Input
                    name="name"
                    labelPlacement="outside"
                    value={values.name}
                    className="dark:text-white"
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Ingresa el nombre "
                    classNames={{ label: 'font-semibold text-sm dark:text-white  dark:text-white' }}
                    variant="bordered"
                    label="Nombre"
                  />
                  {errors.name && touched.name && (
                    <span className="text-sm font-semibold text-red-600">{errors.name}</span>
                  )}

                  <div className="grid grid-cols-2 gap-5 mt-4">
                    <div>
                      <Input
                        label="Precio"
                        labelPlacement="outside"
                        name="price"
                        className="dark:text-white"
                        value={values.price.toString()}
                        onChange={handleChange('price')}
                        onBlur={handleBlur('price')}
                        placeholder="0"
                        classNames={{
                          label: 'font-semibold dark:text-white text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                      />
                      {errors.price && touched.price && (
                        <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                      )}
                    </div>
                    <div>
                      <Select
                        variant="bordered"
                        placeholder="Selecciona el operador"
                        defaultSelectedKeys={promotion?.operatorPrice}
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
                        defaultValue={promotion?.startDate.toString()}
                        classNames={{ label: 'font-semibold' }}
                        onChange={(e) => setStartDateUpdate(e.target.value)}
                        // value={startDate}
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
                        defaultValue={promotion?.endDate.toString()}
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold' }}
                        onChange={(e) => setEndDateUpdate(e.target.value)}
                        // value={endDate}
                      />
                      {errors.endDate && touched.endDate && (
                        <span className="text-sm font-semibold text-red-500">{errors.endDate}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <Textarea
                      label="Descripción"
                      labelPlacement="outside"
                      name="description"
                      className="dark:text-white"
                      //   defaultValue={promotion?.description}
                      value={values.description}
                      onChange={handleChange('description')}
                      onBlur={handleBlur('description')}
                      placeholder="Ingresa la descripción"
                      classNames={{ label: 'font-semibold dark:text-white text-gray-500 text-sm ' }}
                      variant="bordered"
                    />
                    {errors.description && touched.description && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.description}
                      </span>
                    )}
                  </div>
                  <div className="">
                    <h1 className="text-sm mb-3 font-semibold mt-4 dark:text-white">
                      Selecciona los días de la semana
                    </h1>
                    <div className=" grid grid-cols-6 items-start ">
                      <WeekSelector
                        startDate={startDateUpdate as string}
                        endDate={endDateUpdate as string}
                        onDaysSelected={handleDaysSelected}
                      />
                    </div>
                  </div>
                </div>

                {/* Columna 2 */}
                <div>
                  <Autocomplete
                    className="font-semibold dark:text-white"
                    label="Sucursal"
                    name="branchId"
                    labelPlacement="outside"
                    placeholder={'Selecciona la sucursal'}
                    defaultSelectedKey={`${promotion?.branchId}`}
                    value={values.branchId}
                    variant="bordered"
                    onChange={(e) => setFieldValue('branchId', e.target.value)}
                  >
                    {branch_list.map((branch) => (
                      <AutocompleteItem
                        onClick={() => setBranchId(branch.id)}
                        className="dark:text-white"
                        key={branch.id}
                        value={branch.id}
                        textValue={branch.name}
                      >
                        {branch.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.branchId && touched.branchId && (
                    <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        label="Porcentaje de descuento"
                        labelPlacement="outside"
                        name="percentage"
                        className="dark:text-white"
                        // value={values.percentage.toString()}
                        defaultValue={promotion?.percentage.toString()}
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
                          label: 'font-semibold dark:text-white text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent="%"
                      />
                      {errors.percentage && touched.percentage && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.percentage}
                        </span>
                      )}
                    </div>
                    <div>
                      <Tooltip
                        content="Solo puedes llenar uno de los campos: porcentaje o precio fijo"
                        isDisabled={!(values.percentage > 0 && values.fixedPrice > 0)}
                        placement="right"
                      >
                        <div>
                          <Input
                            label="Precio Fijo"
                            labelPlacement="outside"
                            name="fixedPrice"
                            className="dark:text-white"
                            defaultValue={promotion?.fixedPrice.toString()}
                            //   value={values.fixedPrice ? values.fixedPrice.toString() : ''}
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
                              label: 'font-semibold text-gray-500 text-sm dark:text-white',
                            }}
                            variant="bordered"
                            type="number"
                            startContent="$"
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-4">
                    <CheckboxGroup
                      classNames={{
                        label: 'font-semibold text-black text-md dark:text-white',
                      }}
                      orientation="horizontal"
                      className="dark:text-white"
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
                      <span className="text-sm font-semibold text-red-500">{errors.priority}</span>
                    )}
                    <div className="mt-5 grid grid-cols-1">
                      <Select
                        variant="bordered"
                        placeholder="Selecciona la categoría"
                        selectedKeys={selectedCategoryIds}
                        className="w-full dark:text-white"
                        label="Categoria"
                        selectionMode="multiple"
                        labelPlacement="outside"
                        classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                        onSelectionChange={(keys) => {
                          const selectedKeys = new Set(keys as unknown as string[]);
                          const selectedKeysArray = Array.from(selectedKeys);
                          setSelectedCategoryIds(selectedKeysArray);
                        }}
                      >
                        {categories_list.map((c) => (
                          <SelectItem
                            onClick={() => setDeletedCategoryIds([...deletedCategoryIds, c.id])}
                            key={c.id}
                            value={c.id.toString()}
                            className="dark:text-white"
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-row justify-center">
                <Button
                  type="submit"
                  style={style}
                  className="hidden w-44 font-semibold md:flex h-full py-2"
                >
                  Actualizar Promoción
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default UpdatePromotionsCategory;
