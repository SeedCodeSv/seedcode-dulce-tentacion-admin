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
} from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import WeekSelector from './WeekSelector';
import { useBranchesStore } from '../../store/branches.store';
import { formatDate } from '../../utils/dates';
import { operadores } from '../../utils/constants';
import { PromotionProduct } from '../../types/promotions.types';
import { useBranchProductStore } from '../../store/branch_product.store';
import { DollarSign, ScanBarcode, ScrollText, Search, Truck } from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import HeadlessModal from '../global/HeadlessModal';
import { Branches } from '../../types/branches.types';
import { useSupplierStore } from '../../store/supplier.store';
import { usePromotionsProductsStore } from '../../store/promotions/promotionsByProduct.store';
import { useNavigate } from 'react-router';

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
    getSupplierList();
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
  const { theme } = useContext(ThemeContext);
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
            products: [],
          }}
          onSubmit={handleSave}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <>
              <div className=" flex justify-end absolute  right-20 top-8">
                <Button onClick={vaul.onOpen} style={global_styles().thirdStyle}>
                  Agregar Producto
                </Button>
              </div>

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
                        className="dark:text-white"
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
                        className="dark:text-white"
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
                    <div className="mt-11">
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
                    <div className="mt-6">
                      <CheckboxGroup
                        classNames={{
                          label: 'font-semibold text-black dark:text-white text-md',
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
                      <span className="text-sm font-semibold text-red-500">{errors.startDate}</span>
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
                      <span className="text-sm font-semibold text-red-500">{errors.endDate}</span>
                    )}
                  </div>
                </div>

                <Textarea
                  label="Productos Seleccionados"
                  labelPlacement="outside"
                  name="description"
                  width={300}
                  height={200}
                  placeholder="Productos ..."
                  classNames={{
                    label: 'font-semibold text-black text-sm',
                  }}
                  variant="bordered"
                  value={selectedProductIds
                    .map((id) => {
                      const product = branch_product_order.find((p) => p.id === id);
                      return product ? product.product.name : '';
                    })
                    .join(', ')} // Muestra solo los nombres de los productos seleccionados
                />

                <div className="grid grid-cols-1 ">
                  {/* Seleccionar dia */}
                  <h1 className="text-sm  font-semibold dark:text-white">
                    Selecciona los días de la semana
                  </h1>
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

                <div className="mt-32">
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

      <HeadlessModal
        isOpen={vaul.isOpen}
        onClose={vaul.onClose}
        title="Seleccionar Productos"
        size="w-screen h-screen pb-20 md:pb-0 p-5 overflow-y-auto xl:w-[80vw]"
      >
        <div className="w-full bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <Select
                label="Sucursal"
                value={branch}
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
                placeholder="Selecciona una sucursal"
                labelPlacement="outside"
                variant="bordered"
                className="w-full dark:text-white"
              >
                {branch_list.map((branch: Branches) => (
                  <SelectItem className="dark:text-white" key={branch.name} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Autocomplete
                label="Proveedor"
                value={branch}
                onSelect={(e) => {
                  setSupplier(e.currentTarget.value);
                }}
                placeholder="Selecciona un proveedor"
                labelPlacement="outside"
                variant="bordered"
              >
                {supplier_list.map((branch) => (
                  <AutocompleteItem className="dark:text-white" key={branch.id} value={branch.id}>
                    {branch.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div>
              <Input
                label="Nombre"
                placeholder="Escribe el nombre del producto"
                labelPlacement="outside"
                variant="bordered"
                onChange={(e) => setProduct(e.currentTarget.value)}
                startContent={<Search />}
                className="w-full dark:text-white"
              />
            </div>
            <div>
              <Input
                label="Código"
                placeholder="Escribe el código del producto"
                labelPlacement="outside"
                variant="bordered"
                onChange={(e) => setProductCode(e.currentTarget.value)}
                startContent={<Search />}
                className="w-full dark:text-white"
              />
            </div>
          </div>
          {/* <div className="w-full flex justify-end py-5">
            <Button
              // onClick={vaul.onClose}
              style={global_styles().secondaryStyle}
              className="px-10">
              Aceptar
            </Button>
          </div> */}
          <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {branch_product_order.map((branch_product) => (
              <div
                key={branch_product.id}
                className="shadow border p-4 rounded-lg dark:border-gray-500"
              >
                <p className="font-semibold dark:text-white">{branch_product.product.name}</p>
                <p className="dark:text-white">Stock: {branch_product.stock}</p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <Truck /> {branch_product.supplier.nombre}
                </p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <ScrollText /> {branch_product.product.categoryProduct.name}
                </p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <DollarSign /> ${branch_product.price}
                </p>
                <p className="mt-2 flex gap-3 dark:text-white">
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
