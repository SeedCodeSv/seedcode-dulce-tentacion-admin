import { Autocomplete, AutocompleteItem, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import { useSupplierStore } from '@/store/supplier.store';
import { verify_code_product } from '@/services/products.service';
import { useProductsStore } from '@/store/products.store';
import { ProductPayloadFormik } from '@/types/products.types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function AddProduct() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const { getBranchesList, branch_list } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore();
  const { getSubcategories, subcategories } = useSubCategoriesStore();
  const { getSupplierList, supplier_list } = useSupplierStore();
  const service = new SeedcodeCatalogosMhService();
  const unidadDeMedidaList = service.get014UnidadDeMedida();
  const itemTypes = service.get011TipoDeItem();

  useEffect(() => {
    getBranchesList();
    getListCategories();
    getSupplierList('');
  }, []);

  const validationSchema = yup.object().shape({
    name: yup.string().required('**El nombre es requerido**'),
    description: yup.string().required('**La descripción es requerida**'),
    price: yup
      .number()
      .required('**El precio es requerido**')
      .typeError('**El precio es requerido**'),
    priceA: yup.number().typeError('**El precio es requerido**'),
    priceB: yup.number().typeError('**El precio es requerido**'),
    priceC: yup.number().typeError('**El precio es requerido**'),
    costoUnitario: yup
      .number()
      .required('**El precio es requerido**')
      .typeError('**El precio es requerido**'),
    minimumStock: yup
      .number()
      .required('**El stock mínimo es requerido**')
      .typeError('**El stock mínimo es requerido**'),
    code: yup.string().required('**El Código es requerido**'),
    subCategoryId: yup
      .number()
      .required('**Debes seleccionar la sub-categoría**')
      .min(1, '**Debes seleccionar la sub-categoría**')
      .typeError('**Debes seleccionar la sub-categoría**'),
    tipoItem: yup.string().required('**Debes seleccionar el tipo de item**'),
    uniMedida: yup
      .string()
      .required('**Debes seleccionar la unidad**')
      .min(1, '**Debes seleccionar la unidad**'),
    branch: yup
      .array()
      .of(yup.string().required('**Debes seleccionar las sucursales**'))
      .required('**Debes seleccionar las sucursales**')
      .test('not-empty', '**Debes seleccionar al menos una sucursal**', (value) => {
        return value && value.length > 0;
      }),
    supplierId: yup
      .number()
      .required('**Debes seleccionar el proveedor**')
      .min(1, '**Debes seleccionar el proveedor**'),
  });

  const initialValues = {
    name: '',
    description: 'N/A',
    price: '',
    priceA: '',
    priceB: '',
    priceC: '',
    costoUnitario: '',
    minimumStock: '',
    code: 'N/A',
    subCategoryId: 0,
    tipoDeItem: 'N/A',
    unidaDeMedida: 'N/A',
    tipoItem: '',
    uniMedida: '',
    branch: [],
    supplierId: 0,
  };

  const { postProducts } = useProductsStore();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const handleSave = async (values: ProductPayloadFormik) => {
    const letvalue = values.code !== 'N/A';

    if (letvalue) {
      const verify = await verifyCode(values.code);

      if (!verify) {
        toast.error('Código  en uso');
        setError(true);

        return;
      }
    }
    const send_payload = {
      ...values,
      priceA: values.priceA !== '' ? values.priceA : values.price,
      priceB: values.priceB !== '' ? values.priceB : values.price,
      priceC: values.priceC !== '' ? values.priceC : values.price,
      branch: values.branch.map((branch) => {
        return { id: Number(branch) };
      }),
    };

    setLoading(true);
    await postProducts(send_payload).then(() => {
      navigate('/products');
      setLoading(false);
    });
  };

  const [codigo, setCodigoGenerado] = useState('');

  const generarCodigo = async (name: string) => {
    if (!name) {
      toast.error('Necesitas ingresar el nombre del producto para generar el código.');

      return '';
    }

    const productNameInitials = name.slice(0, 4).toUpperCase();
    const makeid = (length: number) => {
      let result = '';
      const characters = '0123456789';
      const charactersLength = characters.length;
      let counter = 0;

      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }

      return result;
    };

    const randomNumber = makeid(4);
    const codigoGenerado = `${productNameInitials}${randomNumber}`;
    const verify = await verifyCode(codigoGenerado);

    if (verify) {
      setError(false);
    } else {
      setError(true);
    }

    return codigoGenerado;
  };

  const verifyCode = async (codigo: string) => {
    try {
      if (codigo !== 'N/A') {
        const data = await verify_code_product(codigo);

        if (data.data.ok === true) {
          return true;
        }

        return data.data.ok;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <Layout title="Nuevo producto">
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className=" dark:text-white" />
            <span className="dark:text-white">Regresar</span>
          </button>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleSubmit,
              handleChange,
              setFieldValue,
            }) => (
              <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                <div>
                  <div>
                    <Input
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.name && errors.name}
                      isInvalid={touched.name && !!errors.name}
                      label="Nombre"
                      labelPlacement="outside"
                      placeholder="Ingresa el nombre"
                      value={values.name}
                      variant="bordered"
                      onBlur={handleBlur('name')}
                      onChange={(e) => {
                        handleChange('name')(e);
                      }}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.costoUnitario && errors.costoUnitario}
                      isInvalid={touched.costoUnitario && !!errors.costoUnitario}
                      label="Costo unitario"
                      labelPlacement="outside"
                      placeholder="Ingresa el costo unitario"
                      startContent="$"
                      step="0.01"
                      type="number"
                      value={values.costoUnitario}
                      variant="bordered"
                      onBlur={handleBlur('costoUnitario')}
                      onChange={handleChange('costoUnitario')}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.price && errors.price}
                      isInvalid={touched.price && !!errors.price}
                      label="Precio"
                      labelPlacement="outside"
                      placeholder="Ingresa el precio"
                      startContent="$"
                      step="0.01"
                      type="number"
                      value={values.price}
                      variant="bordered"
                      onBlur={handleBlur('price')}
                      onChange={handleChange('price')}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.minimumStock && errors.minimumStock}
                      isInvalid={touched.minimumStock && !!errors.minimumStock}
                      label="Cantidad minima"
                      labelPlacement="outside"
                      placeholder="Ingresa la cantidad minima"
                      value={values.minimumStock}
                      variant="bordered"
                      onBlur={handleBlur('minimumStock')}
                      onChange={handleChange('minimumStock')}
                    />
                  </div>
                  <div>
                    <div className="flex items-end gap-5 py-2">
                      <Input
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm text-gray-600',
                        }}
                        label="Código de producto"
                        labelPlacement="outside"
                        name="code"
                        placeholder="Ingresa el código"
                        value={codigo || values.code}
                        variant="bordered"
                        onBlur={handleBlur('code')}
                        onChange={(e) => {
                          handleChange('code')(e);
                          setCodigoGenerado(e.target.value);
                        }}
                      />
                      <ButtonUi
                        className="px-6"
                        theme={Colors.Info}
                        onPress={async () => {
                          const code = await generarCodigo(values.name);

                          if (code) {
                            handleChange('code')(code);
                          }
                        }}
                      >
                        Generar
                      </ButtonUi>
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 font-semibold ml-1">
                        {'Este código ya existe'}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <Input
                      className="dark:text-white"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.priceA && errors.priceA}
                      isInvalid={touched.priceA && !!errors.priceA}
                      label="Precio A"
                      labelPlacement="outside"
                      placeholder="Ingresa el precio A"
                      startContent="$"
                      step="0.01"
                      type="number"
                      value={values.priceA}
                      variant="bordered"
                      onBlur={handleBlur('priceA')}
                      onChange={handleChange('priceA')}
                    />
                    <Input
                      className="dark:text-white"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.priceB && errors.priceB}
                      isInvalid={touched.priceB && !!errors.priceB}
                      label="Precio B"
                      labelPlacement="outside"
                      placeholder="Ingresa el precio B"
                      startContent="$"
                      step="0.01"
                      type="number"
                      value={values.priceB}
                      variant="bordered"
                      onBlur={handleBlur('priceB')}
                      onChange={handleChange('priceB')}
                    />
                    <Input
                      className="col-span-2 dark:text-white"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.priceC && errors.priceC}
                      isInvalid={touched.priceC && !!errors.priceC}
                      label="Precio C"
                      labelPlacement="outside"
                      placeholder="Ingresa el precio C"
                      startContent="$"
                      step="0.01"
                      type="number"
                      value={values.priceC}
                      variant="bordered"
                      onBlur={handleBlur('priceC')}
                      onChange={handleChange('priceC')}
                    />
                  </div>
                  <div className="py-2">
                    <Select
                      multiple
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                      errorMessage={touched.branch && errors.branch}
                      isInvalid={touched.branch && !!errors.branch}
                      label="Sucursales"
                      labelPlacement="outside"
                      name="branch"
                      placeholder="Selecciona la sucursal"
                      selectedKeys={selectedBranches}
                      variant="bordered"
                      onBlur={handleBlur('branch')}
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
                        <SelectItem key={val.id} className="dark:text-white">
                          {val.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <div>
                    <Autocomplete
                      className="dark:text-white font-semibold"
                      errorMessage={touched.tipoItem && errors.tipoItem}
                      isInvalid={touched.tipoItem && !!errors.tipoItem}
                      label="Tipo de item"
                      labelPlacement="outside"
                      placeholder={'Ingresa el tipo de item'}
                      value={values.tipoItem}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set([key]).values().next().value;
                          const item = itemTypes.find((i) => i.codigo === value);

                          setFieldValue('tipoItem', value);
                          setFieldValue('tipoDeItem', item?.valores);
                        } else {
                          setFieldValue('tipoItem', '');
                          setFieldValue('tipoDeItem', '');
                        }
                      }}
                    >
                      {itemTypes.map((item) => (
                        <AutocompleteItem key={item.codigo} className="dark:text-white">
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      className="dark:text-white font-semibold"
                      errorMessage={touched.uniMedida && errors.uniMedida}
                      isInvalid={touched.uniMedida && !!errors.uniMedida}
                      label="Unidad de medida"
                      labelPlacement="outside"
                      name="unidaDeMedida"
                      placeholder="Selecciona unidad de medida"
                      value={values.uniMedida}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set([key]).values().next().value;
                          const item = unidadDeMedidaList.find((i) => i.codigo === value);

                          setFieldValue('uniMedida', value);
                          setFieldValue('unidaDeMedida', item?.valores);
                        } else {
                          setFieldValue('uniMedida', '');
                          setFieldValue('unidaDeMedida', '');
                        }
                      }}
                    >
                      {unidadDeMedidaList.map((item) => (
                        <AutocompleteItem key={item.codigo} className="dark:text-white">
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      label="Categoría producto"
                      labelPlacement="outside"
                      placeholder="Selecciona la categoría"
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          getSubcategories(Number(key));
                        }
                      }}
                    >
                      {list_categories.map((bra) => (
                        <AutocompleteItem key={bra.id} className="dark:text-white">
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Select
                      className="dark:text-white"
                      classNames={{ base: 'font-semibold text-sm' }}
                      errorMessage={touched.subCategoryId && errors.subCategoryId}
                      isInvalid={touched.subCategoryId && !!errors.subCategoryId}
                      label="Sub-categoría"
                      labelPlacement="outside"
                      name="subCategoryId"
                      placeholder="Selecciona la subcategoria"
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          setFieldValue(
                            'subCategoryId',
                            Number(new Set(key).values().next().value)
                          );
                        } else {
                          setFieldValue('subCategoryId', 0);
                        }
                      }}
                    >
                      {subcategories?.map((sub) => (
                        <SelectItem key={sub.id} className="dark:text-white">
                          {sub.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="py-2">
                    <Textarea
                      className="dark:text-white"
                      classNames={{
                        label: 'font-semibold text-sm ',
                      }}
                      errorMessage={touched.description && errors.description}
                      isInvalid={touched.description && !!errors.description}
                      label="Descripción"
                      labelPlacement="outside"
                      name="description"
                      placeholder="Ingresa la descripción"
                      value={values.description}
                      variant="bordered"
                      onBlur={handleBlur('description')}
                      onChange={handleChange('description')}
                    />
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      errorMessage={touched.supplierId && errors.supplierId}
                      isInvalid={touched.supplierId && !!errors.supplierId}
                      label="Proveedor"
                      labelPlacement="outside"
                      placeholder={'Selecciona el proveedor'}
                      value={values.supplierId}
                      variant="bordered"
                      onBlur={handleBlur('supplierId')}
                      onSelectionChange={(key) => {
                        if (key) {
                          setFieldValue('supplierId', new Set([key]).values().next().value);
                        } else {
                          setFieldValue('supplierId', 0);
                        }
                      }}
                    >
                      {supplier_list.map((bra) => (
                        <AutocompleteItem key={bra.id ?? 0} className="dark:text-white">
                          {bra.nombre}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                 <div className='flex justify-end items-end mt-4'>
                 {!loading ? (
                    <ButtonUi className='px-20' theme={Colors.Primary} onPress={() => handleSubmit()}>
                      Guardar
                    </ButtonUi>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="loaderBranch w-2 h-2 mt-2" />
                      <p className="mt-3 text-sm font-semibold">Cargando...</p>
                    </div>
                  )}
                 </div>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
}

export default AddProduct;
