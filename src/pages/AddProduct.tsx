import Layout from '@/layout/Layout';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { global_styles } from '@/styles/global.styles';
import { useEffect, useState } from 'react';
import { useBranchesStore } from '@/store/branches.store';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { useCategoriesStore } from '@/store/categories.store';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import { useSupplierStore } from '@/store/supplier.store';
import { toast } from 'sonner';
import { verify_code_product } from '@/services/products.service';
import { useProductsStore } from '@/store/products.store';
import { ProductPayloadFormik } from '@/types/products.types';
import { useNavigate } from 'react-router';

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
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className=" dark:text-white" />
            <span className="dark:text-white">Regresar</span>
          </button>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
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
                      variant="bordered"
                      labelPlacement="outside"
                      
                      label="Nombre"
                      placeholder="Ingresa el nombre"
                      onChange={(e) => {
                        handleChange('name')(e);
                      }}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      isInvalid={touched.name && !!errors.name}
                      errorMessage={touched.name && errors.name}
                      className="dark:text-white font-semibold"
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      variant="bordered"
                      labelPlacement="outside"
                      label="Costo unitario"
                      type="number"
                      step="0.01"
                      placeholder="Ingresa el costo unitario"
                      startContent="$"
                      className="dark:text-white font-semibold"
                      onChange={handleChange('costoUnitario')}
                      onBlur={handleBlur('costoUnitario')}
                      value={values.costoUnitario}
                      isInvalid={touched.costoUnitario && !!errors.costoUnitario}
                      errorMessage={touched.costoUnitario && errors.costoUnitario}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      variant="bordered"
                      labelPlacement="outside"
                      label="Precio"
                      placeholder="Ingresa el precio"
                      type="number"
                      step="0.01"
                      startContent="$"
                      className="dark:text-white"
                      onChange={handleChange('price')}
                      onBlur={handleBlur('price')}
                      value={values.price}
                      isInvalid={touched.price && !!errors.price}
                      errorMessage={touched.price && errors.price}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                  </div>
                  <div className="py-2">
                    <Input
                      variant="bordered"
                      labelPlacement="outside"
                      label="Cantidad minima"
                      placeholder="Ingresa la cantidad minima"
                      onChange={handleChange('minimumStock')}
                      className="dark:text-white"
                      onBlur={handleBlur('minimumStock')}
                      value={values.minimumStock}
                      isInvalid={touched.minimumStock && !!errors.minimumStock}
                      errorMessage={touched.minimumStock && errors.minimumStock}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-end gap-5 py-2">
                      <Input
                        value={codigo || values.code}
                        onBlur={handleBlur('code')}
                        onChange={(e) => {
                          handleChange('code')(e);
                          setCodigoGenerado(e.target.value);
                        }}
                        name="code"
                        labelPlacement="outside"
                        className="dark:text-white font-semibold"
                        placeholder="Ingresa el código"
                        classNames={{
                          label: 'font-semibold text-sm text-gray-600',
                        }}
                        variant="bordered"
                        label="Código de producto"
                      />
                      <Button
                        onClick={async () => {
                          const code = await generarCodigo(values.name);
                          if (code) {
                            handleChange('code')(code);
                          }
                        }}
                        className="px-6"
                        style={global_styles().thirdStyle}
                      >
                        Generar
                      </Button>
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 font-semibold ml-1">
                        {'Este código ya existe'}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <Input
                      variant="bordered"
                      label="Precio A"
                      className="dark:text-white"
                      type="number"
                      step="0.01"
                      labelPlacement="outside"
                      startContent="$"
                      placeholder="Ingresa el precio A"
                      onChange={handleChange('priceA')}
                      onBlur={handleBlur('priceA')}
                      value={values.priceA}
                      isInvalid={touched.priceA && !!errors.priceA}
                      errorMessage={touched.priceA && errors.priceA}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                    <Input
                      variant="bordered"
                      label="Precio B"
                      type="number"
                      step="0.01"
                      className="dark:text-white"
                      labelPlacement="outside"
                      startContent="$"
                      placeholder="Ingresa el precio B"
                      onChange={handleChange('priceB')}
                      onBlur={handleBlur('priceB')}
                      value={values.priceB}
                      isInvalid={touched.priceB && !!errors.priceB}
                      errorMessage={touched.priceB && errors.priceB}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                    <Input
                      className="col-span-2 dark:text-white"
                      variant="bordered"
                      label="Precio C"
                      type="number"
                      step="0.01"
                      labelPlacement="outside"
                      startContent="$"
                      placeholder="Ingresa el precio C"
                      onChange={handleChange('priceC')}
                      onBlur={handleBlur('priceC')}
                      value={values.priceC}
                      isInvalid={touched.priceC && !!errors.priceC}
                      errorMessage={touched.priceC && errors.priceC}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
                      }}
                    />
                  </div>
                  <div className="py-2">
                    <Select
                      multiple
                      variant="bordered"
                      className="dark:text-white"
                      placeholder="Selecciona la sucursal"
                      selectedKeys={selectedBranches}
                      label="Sucursales"
                      onBlur={handleBlur('branch')}
                      classNames={{
                        label: 'font-semibold dark:text-white text-gray-500 text-sm',
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
                      isInvalid={touched.branch && !!errors.branch}
                      errorMessage={touched.branch && errors.branch}
                    >
                      {branch_list.map((val) => (
                        <SelectItem key={val.id} value={val.id} className="dark:text-white">
                          {val.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <div>
                    <Autocomplete
                      variant="bordered"
                      className="dark:text-white"
                      label="Tipo de item"
                      labelPlacement="outside"
                      placeholder={'Ingresa el tipo de item'}
                      value={values.tipoItem}
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
                      isInvalid={touched.tipoItem && !!errors.tipoItem}
                      errorMessage={touched.tipoItem && errors.tipoItem}
                    >
                      {itemTypes.map((item) => (
                        <AutocompleteItem
                          key={item.codigo}
                          value={item.codigo}
                          className="dark:text-white"
                        >
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      className="dark:text-white"
                      variant="bordered"
                      name="unidaDeMedida"
                      label="Unidad de medida"
                      labelPlacement="outside"
                      placeholder="Selecciona unidad de medida"
                      value={values.uniMedida}
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
                      isInvalid={touched.uniMedida && !!errors.uniMedida}
                      errorMessage={touched.uniMedida && errors.uniMedida}
                    >
                      {unidadDeMedidaList.map((item) => (
                        <AutocompleteItem
                          key={item.codigo}
                          value={item.codigo}
                          className="dark:text-white"
                        >
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          getSubcategories(new Set([key]).values().next().value);
                        }
                      }}
                      label="Categoría producto"
                      labelPlacement="outside"
                      placeholder="Selecciona la categoría"
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      className="dark:text-white"
                    >
                      {list_categories.map((bra) => (
                        <AutocompleteItem value={bra.name} key={bra.id} className="dark:text-white">
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="py-2">
                    <Select
                      name="subCategoryId"
                      label="Sub-categoría"
                      labelPlacement="outside"
                      placeholder="Selecciona la subcategoria"
                      variant="bordered"
                      classNames={{ base: 'font-semibold text-sm' }}
                      className="dark:text-white"
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
                      isInvalid={touched.subCategoryId && !!errors.subCategoryId}
                      errorMessage={touched.subCategoryId && errors.subCategoryId}
                    >
                      {subcategories?.map((sub) => (
                        <SelectItem
                          value={sub.id.toString()}
                          key={sub.id}
                          className="dark:text-white"
                        >
                          {sub.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="py-2">
                    <Textarea
                      label="Descripción"
                      labelPlacement="outside"
                      name="description"
                      value={values.description}
                      onChange={handleChange('description')}
                      onBlur={handleBlur('description')}
                      placeholder="Ingresa la descripción"
                      classNames={{
                        label: 'font-semibold text-sm ',
                      }}
                      variant="bordered"
                      className="dark:text-white"
                      isInvalid={touched.description && !!errors.description}
                      errorMessage={touched.description && errors.description}
                    />
                  </div>
                  <div className="py-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          setFieldValue('supplierId', new Set([key]).values().next().value);
                        } else {
                          setFieldValue('supplierId', 0);
                        }
                      }}
                      onBlur={handleBlur('supplierId')}
                      label="Proveedor"
                      labelPlacement="outside"
                      placeholder={'Selecciona el proveedor'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      className="dark:text-white"
                      value={values.supplierId}
                      isInvalid={touched.supplierId && !!errors.supplierId}
                      errorMessage={touched.supplierId && errors.supplierId}
                    >
                      {supplier_list.map((bra) => (
                        <AutocompleteItem
                          value={bra.nombre}
                          key={bra.id ?? 0}
                          className="dark:text-white"
                        >
                          {bra.nombre}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  {!loading ? (
                    <Button
                      onClick={() => handleSubmit()}
                      className="w-full mt-4 text-sm font-semibold "
                      style={global_styles().thirdStyle}
                    >
                      Guardar
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="loaderBranch w-2 h-2 mt-2"></div>
                      <p className="mt-3 text-sm font-semibold">Cargando...</p>
                    </div>
                  )}
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
