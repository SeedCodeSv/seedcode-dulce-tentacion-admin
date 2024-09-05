import { PayloadSupplier } from '../../types/supplier.types';
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { CodigoActividadEconomica } from '../../types/billing/cat-019-codigo-de-actividad-economica.types';
import { Departamento } from '../../types/billing/cat-012-departamento.types';
import { useSupplierStore } from '../../store/supplier.store';
import useGlobalStyles from '../global/global.styles';
import { get_user } from '@/storage/localStorage';
import { useBillingStore } from '@/store/facturation/billing.store';
import { typesDocumento } from '@/utils/constants';
import { useViewsStore } from '@/store/views.store';
import NoAuthorization from '@/pages/NoAuthorization';

interface PSuplier {
  nrc: string;
  nit: string;
  tipoDocumento: string;
  numDocumento: string;
  telefono: string;
  correo: string;
  nombre: string;
  nombreComercial: string;
  codActividad: string;
  descActividad: string;
}

interface Props {
  closeModal: () => void;
  supplier?: PSuplier;
  supplier_direction?: {
    municipio: string;
    departamento: string;
    complemento: string;
  };
  id?: number;
}

function AddTributeSupplier(props: Props) {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Proveedores');
  const actionView = viewName?.actions.name || [];
  const [nrc, setNrc] = useState<string>(props.supplier?.nrc ?? '');
  const initialValues = {
    nombre: props.supplier?.nombre ?? '',
    nombreComercial: props.supplier?.nombreComercial ?? '',
    correo: props.supplier?.correo ?? '',
    telefono: props.supplier?.telefono ?? '',
    numDocumento: props.supplier?.numDocumento ?? '',
    nrc: props.supplier?.nrc ?? '',
    nit: props.supplier?.nit ?? '',
    tipoDocumento: props.supplier?.tipoDocumento ?? '36',
    bienTitulo: '05',
    codActividad: props.supplier?.codActividad ?? '',
    esContribuyente: 1,
    descActividad: props.supplier?.descActividad ?? '',
    municipio: props.supplier_direction?.municipio ?? '',
    nombreMunicipio: '',
    departamento: props.supplier_direction?.departamento ?? '',
    nombreDepartamento: '',
    complemento: props.supplier_direction?.complemento,
  };

  console.log('initialValues', initialValues);

  const styles = useGlobalStyles();

  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    nombreComercial: yup.string().required('**El nombre comercial es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    telefono: yup.string().required('**El teléfono es requerido**'),

    nit: yup
      .string()
      .required('**El NIT es requerido sin guiones**')
      .matches(/^([0-9]{14}|[0-9]{9})$/, '**El NIT no es valido ingresar sin guiones**'),

    codActividad: yup
      .string()
      .required('**La actividad es requerida**')
      .matches(/^[0-9]{2,6}$/, '**La actividad no es valida**'),
    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string().required('**El complemento es requerida**'),
    tipoDocumento: yup.string().required('**Tipo de documento es requerido**'),
    numDocumento: yup
      .string()
      .required('**Número de documento es requerido**')
      .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
        const { tipoDocumento } = this.parent;
        return tipoDocumento !== '' ? true : false;
      })
      .test('validar-documento', '**Número de documento no válido**', function (value) {
        const { tipoDocumento } = this.parent;
        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value);
        }
        if (tipoDocumento === '36') {
          return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
        }
        return true; // Si tipoDocumento no es relevante para validación, se considera válido
      }),
  });

  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat019CodigoActividadEconomica,
    cat_019_codigo_de_actividad_economica,
  } = useBillingStore();

  const [selectedCodeDep, setSelectedCodeDep] = useState('0');

  useEffect(() => {
    getCat012Departamento();
    getCat019CodigoActividadEconomica();
  }, []);

  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  useEffect(() => {
    if (props.supplier) {
      getCat019CodigoActividadEconomica(props.supplier.descActividad);
      getCat013Municipios(props.supplier_direction?.departamento ?? '');
    }
  }, [props.supplier, props.supplier_direction]);

  const selectedKeyCodActivity = useMemo(() => {
    if (props.supplier_direction) {
      const code_activity = cat_019_codigo_de_actividad_economica.find(
        (department) => department.codigo === props.supplier?.codActividad
      );

      return JSON.stringify(code_activity);
    }
    return undefined;
  }, [
    props,
    props.supplier,
    cat_019_codigo_de_actividad_economica,
    cat_019_codigo_de_actividad_economica.length,
  ]);

  const handleFilter = (name = '') => {
    getCat019CodigoActividadEconomica(name);
  };

  const { onPostSupplier } = useSupplierStore();
  const user = get_user();
  const transmiter = Number(user?.correlative.branch.transmitterId);

  const onSubmit = async (payload: PayloadSupplier) => {
    const values = {
      ...payload,
      // tipoDocumento: selectTypeDocumento,
      // numDocumento: numDocumento,
      nrc: nrc,
      esContribuyente: 1,
      transmitterId: transmiter,
    };
    await onPostSupplier(values);

    props.closeModal();
  };

  return (
    <div className="p-4 dark:text-white">
      {actionView.includes('Agregar') ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ values, errors, touched, handleBlur, setFieldValue, handleChange, handleSubmit }) => (
            <>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="mt-10">
                    <Input
                      label="Nombre"
                      labelPlacement="outside"
                      name="name"
                      value={values.nombre}
                      onChange={handleChange('nombre')}
                      onBlur={handleBlur('nombre')}
                      placeholder="Ingresa el nombre"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.nombre && touched.nombre && (
                      <span className="text-sm font-semibold text-red-500">{errors.nombre}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Input
                      label="Nombre comercial"
                      labelPlacement="outside"
                      name="name"
                      value={values.nombreComercial}
                      onChange={handleChange('nombreComercial')}
                      onBlur={handleBlur('nombreComercial')}
                      placeholder="Ingresa el nombre comercial"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.nombreComercial && touched.nombreComercial && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.nombreComercial}
                      </span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Input
                      label="Correo electrónico"
                      labelPlacement="outside"
                      name="correo"
                      value={values.correo}
                      onChange={handleChange('correo')}
                      onBlur={handleBlur('correo')}
                      placeholder="Ingresa el correo"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.correo && touched.correo && (
                      <span className="text-sm font-semibold text-red-500">{errors.correo}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Input
                      label="Teléfono"
                      labelPlacement="outside"
                      name="telefono"
                      value={values.telefono}
                      // onChange={handleChange('telefono')}
                      onChange={(e) => setFieldValue('telefono', e.currentTarget.value)}
                      onBlur={handleBlur('telefono')}
                      placeholder="Ingresa el teléfono"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                      errorMessage={errors.telefono}
                      isInvalid={!!errors.telefono && !!touched.telefono}
                      disabled={false}
                    />
                    {/* {errors.telefono && touched.telefono && (
                      <span className="text-sm font-semibold text-red-500">{errors.telefono}</span>
                    )} */}
                  </div>
                  <div className="pt-2">
                    <Autocomplete
                      label="Tipo de documento"
                      labelPlacement="outside"
                      placeholder={'Selecciona el tipo de documento'}
                      onSelectionChange={(key) => {
                        if (key) {
                          setFieldValue('tipoDocumento', key as string);
                        }
                      }}
                      onBlur={handleBlur('tipoDocumento')}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      value={values.tipoDocumento}
                      className="dark:text-white"
                      isInvalid={!!errors.tipoDocumento && !!touched.tipoDocumento}
                      errorMessage={errors.tipoDocumento}
                      selectedKey={values.tipoDocumento}
                    >
                      {typesDocumento.map((dep) => (
                        <AutocompleteItem
                          value={dep.code}
                          key={dep.code}
                          className="dark:text-white"
                        >
                          {dep.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {/* <Autocomplete
                      label="Tipo de documento"
                      labelPlacement="outside"
                      placeholder={'Selecciona el tipo de documento'}
                      variant="bordered"
                      defaultSelectedKey={selectTypeDocumento}
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                    >
                      {typesDocumento.map((dep) => (
                        <AutocompleteItem
                          onClick={() => setSelectTypeDocumento(dep.code)}
                          value={selectTypeDocumento}
                          key={JSON.stringify(dep)}
                          className="dark:text-white"
                        >
                          {dep.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete> */}
                    {/* {errors.codActividad && touched.codActividad && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.codActividad}
                      </span>
                    )} */}
                  </div>
                  <div className="pt-2">
                    {/* <Input
                      type="number"
                      label="Número documento"
                      labelPlacement="outside"
                      defaultValue={props.supplier?.numDocumento ?? ''}
                      value={props.supplier?.numDocumento ?? ''}
                      onChange={(e) => setNumDocumento(e.target.value)}
                      placeholder="Ingresa el número documento"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.numDocumento && touched.numDocumento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.numDocumento}
                      </span>
                    )} */}
                    <Input
                      type="number"
                      label="Número documento"
                      labelPlacement="outside"
                      value={values.numDocumento}
                      onBlur={handleBlur('numDocumento')}
                      onChange={handleChange('numDocumento')}
                      placeholder="Ingresa el número documento"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.numDocumento}
                      isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                    />
                  </div>
                  <div className="pt-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(key as string) as CodigoActividadEconomica;
                          setFieldValue('codActividad', depSelected.codigo);
                          setFieldValue('descActividad', depSelected.valores);
                        }
                      }}
                      onBlur={handleBlur('codActividad')}
                      label="Actividad"
                      labelPlacement="outside"
                      placeholder={'Selecciona la actividad'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      value={selectedKeyCodActivity}
                      selectedKey={values.codActividad}
                      onInputChange={(e) => handleFilter(e)}
                      isInvalid={!!errors.codActividad && !!touched.codActividad}
                      errorMessage={errors.codActividad}
                    >
                      {cat_019_codigo_de_actividad_economica.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={dep.codigo}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {/* <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(key as string) as CodigoActividadEconomica;
                          handleChange('codActividad')(depSelected.codigo);
                          handleChange('descActividad')(depSelected.valores);
                        }
                      }}
                      onBlur={handleBlur('codActividad')}
                      label="Actividad"
                      labelPlacement="outside"
                      placeholder={'Selecciona la actividad'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      defaultSelectedKey={values.descActividad}
                      value={selectedKeyCodActivity}
                      onInputChange={(e) => handleFilter(e)}
                    >
                      {cat_019_codigo_de_actividad_economica.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.codActividad && touched.codActividad && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.codActividad}
                      </span>
                    )} */}
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_012_departamento.find(
                            (dep) => dep.codigo === key
                          ) as CodigoActividadEconomica;
                          setSelectedCodeDep(depSelected.codigo);
                          setFieldValue('departamento', depSelected.valores);
                          setFieldValue('nombreDepartamento', depSelected.valores);
                        }
                      }}
                      onBlur={handleBlur('departamento')}
                      label="Departamento"
                      labelPlacement="outside"
                      placeholder={'Selecciona el departamento'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      selectedKey={values.departamento}
                      isInvalid={!!errors.departamento && !!touched.departamento}
                      errorMessage={errors.departamento}
                    >
                      {cat_012_departamento.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={dep.codigo}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {/* {errors.departamento && touched.departamento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.departamento}
                      </span>
                    )} */}
                  </div>
                  <div className="pt-2">
                    {/* <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(key as string) as Departamento;
                          handleChange('municipio')(depSelected.codigo);
                          handleChange('nombreMunicipio')(depSelected.valores);
                        }
                      }}
                      onBlur={handleBlur('municipio')}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder={'Selecciona el municipio'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      // selectedKey={selectedKeyCity}

                      value={selectedKeyCity}
                    >
                      {cat_013_municipios.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete> */}
                    {/* {errors.municipio && touched.municipio && (
                      <span className="text-sm font-semibold text-red-500">{errors.municipio}</span>
                    )} */}
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_013_municipios.find(
                            (dep) => dep.codigo === key
                          ) as Departamento;
                          handleChange('municipio')(depSelected.codigo);
                          handleChange('nombreMunicipio')(depSelected.valores);
                        }
                      }}
                      onBlur={handleBlur('municipio')}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder={'Selecciona el municipio'}
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      selectedKey={values.municipio}
                      isInvalid={!!errors.municipio && !!touched.municipio}
                      errorMessage={errors.municipio}
                    >
                      {cat_013_municipios.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={dep.codigo}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="pt-2">
                    <Textarea
                      label="Complemento de dirección"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'min-h-[90px]',
                      }}
                      labelPlacement="outside"
                      variant="bordered"
                      placeholder="Ingresa el complemento de dirección"
                      name="complemento"
                      value={values.complemento}
                      onChange={handleChange('complemento')}
                      onBlur={handleBlur('complemento')}
                    />
                    {errors.complemento && touched.complemento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.complemento}
                      </span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Input
                      label="NIT"
                      labelPlacement="outside"
                      name="nit"
                      value={values.nit}
                      onChange={handleChange('nit')}
                      onBlur={handleBlur('nit')}
                      placeholder="Ingresa su número de nit"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.nit && touched.nit && (
                      <span className="text-sm font-semibold text-red-500">{errors.nit}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    {/* <Input
                      type="number"
                      label="NRC"
                      labelPlacement="outside"
                      name="numDocumento"
                      onChange={(e) => setNrc(e.target.value)}
                      placeholder="Ingresa el número de NRC"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    /> */}
                    <Input
                      type="number"
                      label="NRC"
                      labelPlacement="outside"
                      name="nrc"
                      value={values.nrc}
                      onChange={(e) => setNrc(e.target.value)}
                      placeholder="Ingresa el número de NRC"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                      isInvalid={!!errors.nrc && !!touched.nrc}
                      errorMessage={errors.nrc}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => handleSubmit()}
                  className="w-full font-semibold"
                  style={styles.darkStyle}
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        </Formik>
      ) : (
        <NoAuthorization />
      )}
    </div>
  );
}

export default AddTributeSupplier;
