import {
  Autocomplete,
  AutocompleteItem,
  Button,
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
import { Tipos_Promotions, operadores, priority } from '../../utils/constants';
import { Promotion } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { usePromotionsStore } from '../../store/promotions/promotions.store';

function AddPromotionsByProducts() {
  const [selectedBranchId] = useState<number | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [selectedOperators, setSelectedOperators] = useState('');
  const [selectedOperatorPrice, setOperatorPrice] = useState('');
  const [selectedPiority, setPiority] = useState('');
  const [branchId, setBranchId] = useState(0);
  const [endDate, setEndDate] = useState(formatDate());
  const [startDate, setStartDate] = useState(formatDate());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { getBranchesList, branch_list } = useBranchesStore();

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
      operator: selectedOperators,
      operatorPrice: selectedOperatorPrice,
      startDate: startDate,
      endDate: endDate,
      days: daysArrayString.toString(),
      typePromotion: selectedPromotion,
      priority: selectedPiority,
    };
    postPromotions(payload);
  };

  return (
    <>
      <div className="h-full ">
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
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <>
              <div className="w-full overflow-x-auto">
                <div className="w-full  grid grid-cols-4 gap-5">
                  {/* Nombre */}
                  <div className="flex flex-col pt-2  mt-2">
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

                  <div className="mt-10">
                    <Autocomplete placeholder="Selecciona la sucursal">
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

                  <div className="grid grid-cols-2 mt-4">
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
                        label="Operador"
                        labelPlacement="outside"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        value={values.operatorPrice?.toString()}
                        onChange={(e) => {
                          setOperatorPrice(e.target.value);
                        }}
                      >
                        {operadores.map((limit) => (
                          <SelectItem key={limit} value={limit} className="dark:text-white">
                            {limit}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5 w-full mt-8">
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
                          value={values.operator.toString()}
                          onChange={(e) => {
                            setSelectedOperators(e.target.value);
                          }}
                        >
                          {operadores.map((limit) => (
                            <SelectItem key={limit} value={limit} className="dark:text-white">
                              {limit}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Input
                      label="Procentaje de descuento"
                      labelPlacement="outside"
                      name="percentage"
                      value={values.percentage ? values.percentage.toString() : ''}
                      onChange={handleChange('percentage')}
                      onBlur={handleBlur('percentage')}
                      placeholder="0"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                      type="number"
                      startContent="%"
                    />
                    {/* {errors.discount && touched.discount && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.discount}
                      </span>
                    )} */}
                  </div>
                  <div>
                    <Input
                      label="Precio Fijo"
                      labelPlacement="outside"
                      name=" fixedPrice"
                      value={values.fixedPrice ? values.fixedPrice.toString() : ''}
                      onChange={handleChange('fixedPrice')}
                      onBlur={handleBlur('fixedPrice')}
                      placeholder="0"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                      type="number"
                      startContent=""
                    />
                    {/* {errors.price && touched.price && (
                    <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                  )} */}
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-5 mt-4">
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
                  </div>
                </div>

                {/* Seleccionar dia */}
                <div className="mt-5 flex flex-col items-start w-full">
                  <h1 className="text-sm mb-4 font-semibold ">Selecciona los días de la semana</h1>
                  <WeekSelector onDaysSelected={handleDaysSelected} />
                </div>

                <div className="w-full  grid grid-cols-3 gap-5">
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
                  <div className="">
                    <Select
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
                    </Select>
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

                <div className="flex flex-col w-full items-center mt-5">
                  <Button
                    onClick={() => handleSubmit()}
                    className="w-500 text-sm font-semibold"
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

export default AddPromotionsByProducts;
