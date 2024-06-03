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
import { useCategoriesStore } from '../../store/categories.store';
import { CategoryProduct } from '../../types/products.types';
import { fechaActualString } from '../../utils/dates';
import Layout from '../../layout/Layout';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

function AddDiscount() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');


  const { getBranchesList, branch_list } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore(); //  Quitar esto solo para ver el selector de categorias

  const { theme } = useContext(ThemeContext);
  // const validationSchema = yup.object().shape({
  //   name: yup.string().required('**El nombre es requerido**'),
  //   description: yup.string().required('**La descripción es requerida**'),
  //   branch: yup
  //     .array()
  //     .of(yup.string().required('**Debes seleccionar las sucursales**'))
  //     .required('**Debes seleccionar las sucursales**')
  //     .test('not-empty', '**Debes seleccionar al menos una sucursal**', (value) => {
  //       return value && value.length > 0;
  //     }),
  //   startDate: yup.string().required('**La fecha de inicio es requerida**'),
  //   endDate: yup.string().required('**La fecha de fin es requerida**'),
  //   quantity: yup.number().required('**La cantidad es requerida**'),
  //   discount: yup.number().required('**El descuento es requerido**'),
  // });

  const validationSchema = yup.object().shape({
    name: yup.string().required('**El nombre es requerido**'),
    description: yup.string().required('**La descripción es requerida**'),
    branch: yup
      .array()
      .of(yup.string().required('**Debes seleccionar las sucursales**'))
      .required('**Debes seleccionar las sucursales**')
      .test('not-empty', '**Debes seleccionar al menos una sucursal**', (value) => {
        return value && value.length > 0;
      }),
    startDate: yup.string().required('**La fecha de inicio es requerida**'),
    endDate: yup.string().required('**La fecha de fin es requerida**'),
    quantity: yup.number().required('**La cantidad es requerida**'),
    discount: yup.number(),
    price: yup.number(),
  }).test('price-or-discount', '**Debe ingresar un valor en Precio o Promoción, no en ambos**', function (value) {
    const { price, discount } = value;
    if ((price && discount) || (!price && !discount)) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    getBranchesList();
    getListCategories();
  }, []);

  const handleSave = () => {

  };
  const navigate = useNavigate();

  return (
    <Layout title="Nueva Promocion">
      <>
        <div className="h-full m-7">
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              name: '',
              branch: [],
              description: '',
              startDate: '',
              endDate: '',
              quantity: 0,
              discount: 0,
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
              <>
                <div className="w-full overflow-x-auto">
                  <div>
                    <Button
                      onClick={() => {
                        navigate('/discounts');
                      }}
                    >
                      <ArrowLeft size={20} />
                      Regresar
                    </Button>
                  </div>
                  <div className="w-full  grid grid-cols-3 gap-5">
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
                    {/* Selecionar sucursales */}
                    <div className="w-full gap-5 grid grid-cols-1 mt-4">
                      <div className="flex flex-col justify-content-center w-full">
                        <Select
                          multiple
                          variant="bordered"
                          placeholder="Selecciona la sucursal"
                          selectedKeys={selectedBranches}
                          label="Sucursales"
                          onBlur={handleBlur('branch')}
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          name="branch"
                          labelPlacement="outside"
                          onSelectionChange={(keys) => {
                            const setkeys = new Set(keys as unknown as string[]);
                            const keysArray = Array.from(setkeys);
                            if (keysArray.length > 0) {
                              const includes_key = selectedBranches.includes(keysArray[0]);
                              if (!includes_key) {
                                const news = [...selectedBranches, ...keysArray];
                                setSelectedBranches(news);
                                setFieldValue('branch', news);
                              } else {
                                setSelectedBranches(keysArray);
                                setFieldValue('branch', keysArray);
                              }
                            } else {
                              setSelectedBranches([]);
                              setFieldValue('branch', []);
                            }
                          }}
                        >
                          {branch_list.map((val) => (
                            <SelectItem key={val.id} value={val.id} className="dark:text-white">
                              {val.name}
                            </SelectItem>
                          ))}
                        </Select>
                        {errors.branch && touched.branch && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.branch}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selecionar sucursales */}
                    <div className="w-full gap-5 grid grid-cols-1 mt-4">
                      <div className="flex flex-col justify-content-center w-full">
                        <Select
                          multiple
                          variant="bordered"
                          placeholder="Selecciona la sucursal"
                          selectedKeys={selectedBranches}
                          label="Productos"
                          onBlur={handleBlur('branch')}
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          name="branch"
                          labelPlacement="outside"
                          onSelectionChange={(keys) => {
                            const setkeys = new Set(keys as unknown as string[]);
                            const keysArray = Array.from(setkeys);
                            if (keysArray.length > 0) {
                              const includes_key = selectedBranches.includes(keysArray[0]);
                              if (!includes_key) {
                                const news = [...selectedBranches, ...keysArray];
                                setSelectedBranches(news);
                                setFieldValue('branch', news);
                              } else {
                                setSelectedBranches(keysArray);
                                setFieldValue('branch', keysArray);
                              }
                            } else {
                              setSelectedBranches([]);
                              setFieldValue('branch', []);
                            }
                          }}
                        >
                          {branch_list.map((val) => (
                            <SelectItem key={val.id} value={val.id} className="dark:text-white">
                              {val.name}
                            </SelectItem>
                          ))}
                        </Select>
                        {errors.branch && touched.branch && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.branch}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5 w-full mt-4">
                    <div>
                      <Input
                        label="Cantidad"
                        labelPlacement="outside"
                        name="price"
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
                        label="Descuento"
                        labelPlacement="outside"
                        name="discount"
                        value={values.discount.toString()}
                        onChange={handleChange('discount')}
                        onBlur={handleBlur('discount')}
                        placeholder="0"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent=""
                      />
                      {errors.discount && touched.discount && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.discount}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        label="V. Max"
                        labelPlacement="outside"
                        name="price"
                        // value={values.price.toString()}
                        onChange={handleChange('price')}
                        onBlur={handleBlur('price')}
                        placeholder="00.00"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent="$"
                      />
                      {/* {errors.price && touched.price && (
                      <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                    )} */}
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-3 gap-5 mt-4">
                    <div className="">
                      <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
                      <Input
                        // onChange={(e) => setStartDate(e.target.value)}
                        defaultValue={fechaActualString}
                        className="w-full "
                        type="date"
                      ></Input>
                    </div>
                    <div>
                      <label className="text-sm font-semibold dark:text-white">Fecha final</label>
                      <Input
                        // onChange={(e) => setEndDate(e.target.value)}
                        defaultValue={fechaActualString}
                        className="w-full "
                        type="date"
                      ></Input>
                    </div>
                    {/* Seleccionar tipo */}
                    <div className="">
                      <Autocomplete
                        onSelectionChange={(key) => {
                          if (key) {
                            const branchSelected = JSON.parse(key as string) as CategoryProduct;
                            handleChange('categoryProductId')(branchSelected.id.toString());
                          }
                        }}
                        onBlur={handleBlur('categoryProductId')}
                        label="Tipo"
                        labelPlacement="outside"
                        placeholder={'Selecciona la tipo'}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
                        // defaultSelectedKey={selectedKeyCategory}
                        // value={selectedKeyCategory}
                      >
                        {list_categories.map((bra) => (
                          <AutocompleteItem
                            value={bra.name}
                            key={JSON.stringify(bra)}
                            className="dark:text-white"
                          >
                            {bra.name}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                      {/* {errors.categoryProductId && touched.categoryProductId && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.categoryProductId}
                    </span>
                  )} */}
                    </div>
                  </div>

                  {/* Seleccionar dia */}
                  <div className="mt-5 flex flex-col items-start w-full">
                    <h1 className="text-sm mb-4 font-semibold ">
                      Selecciona los días de la semana
                    </h1>
                    <WeekSelector />
                  </div>

                  <div className="w-full  grid grid-cols-1 gap-5">
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
    </Layout>
  );
}

export default AddDiscount;
