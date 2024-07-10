import {
  Input,
  Textarea,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useCategoriesStore } from '../../store/categories.store';
import { Product, ProductPayloadFormik } from '../../types/products.types';
import { useProductsStore } from '../../store/products.store';
import { CategoryProduct } from '../../types/categories.types';
import { ThemeContext } from '../../hooks/useTheme';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { useBranchesStore } from '../../store/branches.store';
import { useSupplierStore } from '../../store/supplier.store';
import { Supplier } from '../../types/supplier.types';
import { useSubCategoriesStore } from '../../store/sub-categories.store';
import { verify_code_product } from '../../services/products.service';
import { toast } from 'sonner';
interface Props {
  product?: Product;
  onCloseModal: () => void;
}
function AddProducts(props: Props) {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getSupplierList, supplier_list } = useSupplierStore();
  const { getSubcategories, subcategories } = useSubCategoriesStore();
  const service = new SeedcodeCatalogosMhService();
  const unidadDeMedidaList = service.get014UnidadDeMedida();
  const itemTypes = service.get011TipoDeItem();

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
    minimumStock: yup.number().required('**Campo requerido**').typeError('**Campo requerido**'),
    code: yup.string().required('**El Código es requerido**'),
    // .length(12, '**El código debe tener exactamente 12 dígitos**'),
    subCategoryId: yup
      .number()
      .required('**Debes seleccionar la subcategoría**')
      .min(1, '**Debes seleccionar la subcategoría**'),
    tipoItem: yup
      .string()
      .required('**Debes seleccionar el tipo de item**')
      .min(1, '**Debes seleccionar el tipo de item**'),
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
    name: props.product?.name ?? '',
    description: props.product?.description ?? 'N/A',
    price: props.product?.price ?? '',
    priceA: props.product?.price ?? '',
    priceB: props.product?.price ?? '',
    priceC: props.product?.price ?? '',
    costoUnitario: props.product?.costoUnitario ?? '',
    minimumStock: props.product?.minimumStock ?? '',
    code: props.product?.code ?? 'N/A',
    subCategoryId: props.product?.subCategoryId ?? 0,
    tipoDeItem: props.product?.tipoDeItem ?? 'N/A',
    unidaDeMedida: props.product?.unidaDeMedida ?? 'N/A',
    tipoItem: props.product?.tipoItem ?? '',
    uniMedida: props.product?.uniMedida ?? '',
    branch: [],
    supplierId: 0,
  };
  const { list_categories, getListCategories } = useCategoriesStore();
  useEffect(() => {
    getListCategories();
    getSupplierList();
  }, []);

  const { postProducts, patchProducts, getCat011TipoDeItem } = useProductsStore();
  useEffect(() => {
    getCat011TipoDeItem();
    getBranchesList();
    getSubcategories(0);
  }, []);

  const { theme } = useContext(ThemeContext);
  const handleSave = (values: ProductPayloadFormik) => {
    const payload = {
      ...values,
      branch: selectedBranches.map((branch) => ({ id: Number(branch) })),
    };

    if (props.product) {
      patchProducts(payload, props.product.id);
    } else {
      postProducts(payload);
    }

    props.onCloseModal();
  };

  const [codigo, setCodigo] = useState('');

  const generarCodigo = () => {
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

    const codigoGenerado = makeid(12);
    setCodigo(codigoGenerado);

    return codigoGenerado;
  };

  const verifyCode = async () => {
    try {
      const data = await verify_code_product(codigo)
      if (data.data.ok === true) {
        toast.success('Codigo no registrado')
      }
    } catch (error) {
      toast.error('Codigo en uso')
    }
  }


  return (
    <div className="w-full">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue }) => (
          <>
            <div className="w-full">
              <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <Input
                    label="Nombre"
                    labelPlacement="outside"
                    name="name"
                    value={values.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Ingresa el nombre"
                    classNames={{
                      label: 'font-semibold dark:text-gray-200 text-sm',
                    }}
                    variant="bordered"
                  />
                  {errors.name && touched.name && (
                    <span className="text-sm font-semibold text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Autocomplete
                      variant="bordered"
                      label="Tipo de item"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder={
                        props.product?.tipoDeItem ??
                        props.product?.tipoDeItem ??
                        'Selecciona el item'
                      }
                    >
                      {itemTypes.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.codigo}
                          onClick={() => {
                            handleChange('tipoDeItem')(item.valores.toString());
                            handleChange('tipoItem')(item.codigo.toString());
                          }}
                          className="dark:text-white"
                        >
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.tipoItem && touched.tipoItem && (
                      <span className="text-sm font-semibold text-red-500">{errors.tipoItem}</span>
                    )}
                  </div>
                  <div>
                    <Autocomplete
                      className="dark:text-white"
                      variant="bordered"
                      name="unidaDeMedida"
                      label="Unidad de medida"
                      labelPlacement="outside"
                      placeholder="Selecciona unidad de medida"
                    >
                      {unidadDeMedidaList.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.valores}
                          onClick={() => {
                            handleChange('unidaDeMedida')(item.valores.toString());
                            handleChange('uniMedida')(item.codigo.toString());
                          }}
                          className="dark:text-white"
                        >
                          {item.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.uniMedida && touched.uniMedida && (
                      <span className="text-sm font-semibold text-red-500">{errors.uniMedida}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 mt-5">
                <div className="w-full grid grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 gap-5">
                  <div>
                    <Input
                      label="Costo unitario"
                      labelPlacement="outside"
                      name="costoUnitario"
                      value={values.costoUnitario.toString()}
                      onChange={handleChange('costoUnitario')}
                      onBlur={handleBlur('costoUnitario')}
                      placeholder="00.00"
                      classNames={{
                        label: 'font-semibold   text-sm',
                      }}
                      variant="bordered"
                      type="number"
                      startContent="$"
                    />
                    {errors.costoUnitario && touched.costoUnitario && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.costoUnitario}
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Precio"
                      labelPlacement="outside"
                      name="price"
                      value={values.price.toString()}
                      onChange={handleChange('price')}
                      onBlur={handleBlur('price')}
                      placeholder="00.00"
                      classNames={{
                        label: 'font-semibold   text-sm',
                      }}
                      variant="bordered"
                      type="number"
                      startContent="$"
                    />
                    {errors.price && touched.price && (
                      <span className="text-sm font-semibold text-red-500">{errors.price}</span>
                    )}
                  </div>
                  <div className="w-full">
                    <Input
                      label="Cantidad Minima"
                      labelPlacement="outside"
                      name="minimumStock"
                      value={values.minimumStock.toString()}
                      onChange={handleChange('minimumStock')}
                      onBlur={handleBlur('minimumStock')}
                      placeholder="0"
                      classNames={{
                        label: 'font-semibold   text-sm ',
                      }}
                      variant="bordered"
                      type="number"
                      startContent=""
                    />
                    {errors.minimumStock && touched.minimumStock && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.minimumStock}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Autocomplete
                    onSelectionChange={(key) => {
                      if (key) {
                        const branchSelected = JSON.parse(key as string) as CategoryProduct;
                        getSubcategories(branchSelected.id);
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
                      <AutocompleteItem
                        value={bra.name}
                        key={JSON.stringify(bra)}
                        className="dark:text-white"
                      >
                        {bra.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 mt-5">
                <div className="flex items-end gap-2">
                  <div className="w-full">
                    <Input
                      label="Código"
                      labelPlacement="outside"
                      name="code"
                      value={codigo || values.code}
                      onChange={(e) => {
                        handleChange('code')(e);
                        setCodigo(e.target.value);
                      }}
                      onBlur={handleBlur('code')}
                      placeholder="Ingresa o genera el código"
                      classNames={{
                        label: 'font-semibold text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.code && touched.code && (
                      <span className="text-sm font-semibold text-red-500">{errors.code}</span>
                    )}
                  </div>
                  <div className="w-25">
                    <Button
                      className="w-full text-sm font-semibold"
                      style={{
                        backgroundColor: theme.colors.third,
                        color: theme.colors.primary,
                      }}
                      onClick={() => {
                        const code = generarCodigo();
                        handleChange('code')(code);
                      }}
                    >
                      Generar Código
                    </Button>
                  </div>
                  <div className="w-25">
                    <Button
                      className="w-full text-sm font-semibold"
                      style={{
                        backgroundColor: theme.colors.warning,
                        color: theme.colors.primary
                      }}
                      onClick={() => {
                        verifyCode()
                      }}
                    >
                      Verificar Código
                    </Button>
                  </div>
                </div>
                <div>
                  <Autocomplete
                    name="subCategoryId"
                    label="Subcategoría"
                    labelPlacement="outside"
                    placeholder="Selecciona la subcategoria"
                    variant="bordered"
                    classNames={{ base: 'font-semibold text-sm' }}
                    className="dark:text-white"
                  >
                    {subcategories?.map((sub) => (
                      <AutocompleteItem
                        value={sub.id.toString()}
                        key={JSON.stringify(sub)}
                        onClick={() => {
                          handleChange('subCategoryId')(sub.id.toString());
                        }}
                        className="dark:text-white"
                      >
                        {sub.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.subCategoryId && touched.subCategoryId && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.subCategoryId}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 mt-5">
                <div className="w-full grid grid-cols-3 gap-5">
                  <div>
                    <Input
                      label="Precio A"
                      labelPlacement="outside"
                      name="priceA"
                      value={values.priceA.toString()}
                      onChange={handleChange('priceA')}
                      onBlur={handleBlur('priceA')}
                      placeholder="00.00"
                      classNames={{
                        label: 'font-semibold   text-sm',
                      }}
                      variant="bordered"
                      type="number"
                      startContent="$"
                    />
                    {errors.priceA && touched.priceA && (
                      <span className="text-sm font-semibold text-red-500">{errors.priceA}</span>
                    )}
                  </div>
                  <div>
                    <div>
                      <Input
                        label="Precio B"
                        labelPlacement="outside"
                        name="priceB"
                        value={values.priceB.toString()}
                        onChange={handleChange('priceB')}
                        onBlur={handleBlur('priceB')}
                        placeholder="00.00"
                        classNames={{
                          label: 'font-semibold   text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent="$"
                      />
                      {errors.priceB && touched.priceB && (
                        <span className="text-sm font-semibold text-red-500">{errors.priceB}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <Input
                        label="Precio C"
                        labelPlacement="outside"
                        name="priceC"
                        value={values.priceC.toString()}
                        onChange={handleChange('priceC')}
                        onBlur={handleBlur('priceC')}
                        placeholder="00.00"
                        classNames={{
                          label: 'font-semibold   text-sm',
                        }}
                        variant="bordered"
                        type="number"
                        startContent="$"
                      />
                      {errors.priceC && touched.priceC && (
                        <span className="text-sm font-semibold text-red-500">{errors.priceC}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
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
                  />
                  {errors.description && touched.description && (
                    <span className="text-sm font-semibold text-red-500">{errors.description}</span>
                  )}
                </div>
              </div>
              <div className="w-full gap-5 grid grid-cols-2 mt-5">
                <div className="flex flex-col justify-content-center">
                  <Select
                    multiple
                    variant="bordered"
                    placeholder="Selecciona la sucursal"
                    selectedKeys={selectedBranches}
                    label="Sucursales"
                    onBlur={handleBlur('branch')}
                    classNames={{
                      label: 'font-semibold   text-sm',
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
                    <span className="text-sm font-semibold text-red-500">{errors.branch}</span>
                  )}
                </div>
                <div>
                  <Autocomplete
                    onSelectionChange={(key) => {
                      if (key) {
                        const branchSelected = JSON.parse(key as string) as Supplier;
                        handleChange('supplierId')(branchSelected.id.toString());
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
                  >
                    {supplier_list.map((bra) => (
                      <AutocompleteItem
                        value={bra.nombre}
                        key={JSON.stringify(bra)}
                        className="dark:text-white"
                      >
                        {bra.nombre}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.supplierId && touched.supplierId && (
                    <span className="text-sm font-semibold text-red-500">{errors.supplierId}</span>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-end items-end gap-5 mt-5">
                <Button
                  onClick={() => handleSubmit()}
                  className="w-full sm:w-1/2 md:w-1/4 mt-4 text-sm font-semibold"
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
  );
}

export default AddProducts;
