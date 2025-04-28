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
  import { useEffect, useState } from 'react';
  import * as yup from 'yup';

  import { useBranchesStore } from '../../store/branches.store';
  import { operadores } from '../../utils/constants';
  import { Promotion } from '../../types/promotions.types';
  import { useBranchProductStore } from '../../store/branch_product.store';
  import { usePromotionsStore } from '../../store/promotions/promotions.store';

  import WeekSelector from './WeekSelector';

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
  
  interface Props {
    reloadData: () => void;
    id: number;
    promotion?: Promotion;
    onClose: () => void;
  }
  function UpdatePromotionsBranch({ promotion, id, reloadData, onClose }: Props) {
    const [selectedBranchId] = useState<number | null>(null);
    const [branchId, setBranchId] = useState(promotion?.branchId);
  
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
  
    const [selectedPriority, setPriority] = useState(promotion!.priority);
    const handlePriorityChange = (selectedValues: string[]) => {
      setPriority(selectedValues[0]);
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
    const { patchPromotions } = usePromotionsStore();

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
        branchId: Number(branchId),
        operatorPrice: values.operatorPrice,
        startDate: startDateUpdate as string,
        endDate: endDateUpdate as string,
        days: daysArrayString.toString(),
        priority: selectedPriority,
      };

      patchPromotions(
        { ...payload, startDate: startDateUpdate as string, endDate: endDateUpdate as string },
        id
      );
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
      operatorPrice: promotion!.operatorPrice,
      fixedPrice: promotion!.fixedPrice,
      price: promotion!.price,
      priority: promotion!.priority,
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
        operatorPrice: promotion!.operatorPrice,
        fixedPrice: promotion!.fixedPrice,
        price: promotion!.price,
        priority: promotion!.priority,
      });
    }, [promotion]);
  
    return (
      <>
        <div className="flex flex-col justify-center items-center  p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
              <form className="w-full max-w-5xl mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 w-50">
                  {/* Columna 1 */}
                  <div>
                    <Input
                      className='dark:text-white'
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
                      <span className="text-sm font-semibold text-red-600">{errors.name}</span>
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
                      <div>
                        <Select
                          className="w-full dark:text-white"
                          classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                          defaultSelectedKeys={promotion?.operatorPrice}
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
                          defaultValue={promotion?.startDate.toString()}
                          label="Fecha inicial"
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
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
                          className="dark:text-white"
                          classNames={{ label: 'font-semibold' }}
                          defaultValue={promotion?.endDate.toString()}
                          label="Fecha final"
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
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
                        className='dark:text-white'
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
                    <div className="">
                      <h1 className="text-sm mb-3 font-semibold mt-4 dark:text-white">
                        Selecciona los días de la semana
                      </h1>
                      <div className=" grid grid-cols-6 items-start ">
                        <WeekSelector
                          endDate={endDateUpdate as string}
                          startDate={startDateUpdate as string}
                          onDaysSelected={handleDaysSelected}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Autocomplete
                      className="font-semibold dark:text-white"
                      defaultSelectedKey={`${promotion?.branchId}`}
                      label="Sucursal"
                      labelPlacement="outside"
                      name="branchId"
                      placeholder={'Selecciona la sucursal'}
                      value={values.branchId}
                      variant="bordered"
                      onChange={(e) => setFieldValue('branchId', e.target.value)}
                    >
                      {branch_list.map((branch) => (
                        <AutocompleteItem
                          key={branch.id}
                          className="dark:text-white"
                          textValue={branch.name}
                          onClick={() => setBranchId(branch.id)}
                        >
                          {branch.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.branchId && touched.branchId && (
                      <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
                    )}
  
                    <div className="mt-10">
                      <div>
                        <Input
                          className='dark:text-white'
                          classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                          defaultValue={promotion?.percentage.toString()}
                          label="Porcentaje de descuento"
                          labelPlacement="outside"
                          name="percentage"
                          placeholder="0"
                          startContent="%"
                          type="number"
                          variant="bordered"
                          onBlur={handleBlur('percentage')}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);

                            handleChange('percentage')(newValue.toString());
                            if (newValue > 0) {
                              setFieldValue('fixedPrice', 0);
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
                        content="Solo puedes llenar uno de los campos: porcentaje o precio fijo"
                        isDisabled={!(values.percentage > 0 && values.fixedPrice > 0)}
                        placement="right"
                      >
                        <div>
                          <Input
                            className='dark:text-white'
                            classNames={{ label: 'font-semibold text-gray-500 text-sm' }}
                            defaultValue={promotion?.fixedPrice.toString()}
                            label="Precio Fijo"
                            labelPlacement="outside"
                            name="fixedPrice"
                            placeholder="0"
                            startContent="$"
                            type="number"
                            variant="bordered"
                            onBlur={handleBlur('fixedPrice')}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value);
                              
                              handleChange('fixedPrice')(newValue.toString());
                              if (newValue > 0) {
                                setFieldValue('percentage', 0);
                              }
                            }}
                          />
                        </div>
                      </Tooltip>
                    </div>
  
                    <div className="mt-4">
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
                        <span className="text-sm font-semibold text-red-500">{errors.priority}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-row justify-center">
                  <ButtonUi
                    className="flex w-44 font-semibold h-full py-2"
                    theme={Colors.Primary}
                    type="submit"
                  >
                    Actualizar Promoción
                  </ButtonUi>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </>
    );
  }
  
  export default UpdatePromotionsBranch;
  