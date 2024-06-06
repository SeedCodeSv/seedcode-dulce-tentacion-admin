import { isValidDUI } from '@avalontechsv/idsv';
import { Input, Autocomplete, AutocompleteItem, Textarea, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useBillingStore } from '../../store/facturation/billing.store';
import { Departamento } from '../../types/billing/cat-012-departamento.types';
import { Municipio } from '../../types/billing/cat-013-municipio.types';
import { CodigoActividadEconomica } from '../../types/billing/cat-019-codigo-de-actividad-economica.types';
import { useCustomerStore } from '../../store/customers.store';
import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { ThemeContext } from '../../hooks/useTheme';
import { get_user } from '../../storage/localStorage';
import { ITipoDocumento } from '../../types/DTE/tipo_documento.types';
// import { ITipoDocumento } from '../../types/DTE/tipo_documento.types';

interface Props {
  closeModal: () => void;
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id: number;
}

function AddClientContributor(props: Props) {
  const { theme } = useContext(ThemeContext);
  const initialValues = {
    nombre: props.customer?.nombre ?? '',
    nombreComercial: props.customer?.nombreComercial ?? '',
    correo: props.customer?.correo ?? '',
    telefono: props.customer?.telefono ?? '',
    numDocumento: props.customer?.numDocumento ?? '',
    nrc: props.customer?.nrc ?? '',
    nit: props.customer?.nit ?? '',
    tipoDocumento: props.customer?.tipoDocumento ?? '',
    bienTitulo: '05',
    codActividad: props.customer?.codActividad ?? '',
    esContribuyente: 1,
    descActividad: props.customer?.descActividad ?? '',
    municipio: props.customer_direction?.municipio ?? '',
    nombreMunicipio: props.customer_direction?.nombreMunicipio ?? '',
    departamento: props.customer_direction?.departamento ?? '',
    nombreDepartamento: props.customer_direction?.nombreDepartamento ?? '',
    complemento: props.customer_direction?.complemento ?? '',
  };
  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    nombreComercial: yup.string().required('**El nombre comercial es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    telefono: yup
      .string()
      .required('Este campo solo permite números sin guiones')
      .test('length', 'Debe ser de 8 dígitos', (value) => {
        return value?.length === 8;
      }),
    numDocumento: yup
      .string()
      .required('Este campo solo permite números sin guiones')
      .test('no-dashes', 'El campo no permite guiones', (value) => {
        return !value?.includes('-');
      })
      .test('isValidDUI', '**El DUI no es valido**', (value) => {
        if (value && value !== '') {
          return isValidDUI(value);
        } else {
          return true;
        }
      }),
    nit: yup
      .string()
      .required('**El NIT es requerido **')
      .matches(/^([0-9]{14}|[0-9]{9})$/, '**El NIT no es valido, 9 caracteres sin giones**'),
    nrc: yup
      .string()
      .required('**El NRC es requerido**')
      .matches(/^[0-9]{1,8}$/, '**El NRC no es valido**'),
    codActividad: yup
      .string()
      .required('**La actividad es requerida**')
      .matches(/^[0-9]{2,6}$/, '**La actividad no es valida**'),
    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string().required('**El complemento es requerida**'),
  });
  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat019CodigoActividadEconomica,
    cat_019_codigo_de_actividad_economica,
    getCat022TipoDeDocumentoDeIde,
    cat_022_tipo_de_documentoDeIde,
  } = useBillingStore();
  const [selectedCodeDep, setSelectedCodeDep] = useState(
    props.customer_direction?.departamento ?? '0'
  );
  useEffect(() => {
    getCat012Departamento();
    getCat022TipoDeDocumentoDeIde();
    getCat019CodigoActividadEconomica();
  }, []);
  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(props.customer_direction?.departamento ?? selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep, props.customer_direction]);
  const { postCustomer, patchCustomer } = useCustomerStore();
  const user = get_user();
  const onSubmit = async (payload: PayloadCustomer) => {
    if (props.id || props.id !== 0) {
      const values = {
        ...payload,
        esContribuyente: 1,
        transmitterId: Number(user?.employee.branch.transmitterId),
      };
      patchCustomer(values, props.id!);
    } else {
      const values = {
        ...payload,
        esContribuyente: 1,
        transmitterId: Number(user?.employee.branch.transmitterId),
      };
      await postCustomer(values);
    }
    props.closeModal();
  };
  const selectedKeyDepartment = useMemo(() => {
    if (props.customer_direction) {
      const department = cat_012_departamento.find(
        (department) => department.codigo === props.customer_direction?.departamento
      );

      return JSON.stringify(department);
    }
  }, [props, props.customer_direction, cat_012_departamento, cat_012_departamento.length]);
  const selectedKeyCity = useMemo(() => {
    if (props.customer_direction) {
      const city = cat_013_municipios.find(
        (department) => department.codigo === props.customer_direction?.municipio
      );
      return JSON.stringify(city);
    }
  }, [props, props.customer_direction, cat_013_municipios, cat_013_municipios.length]);
  const selectedKeyCodActivity = useMemo(() => {
    if (props.customer_direction) {
      const code_activity = cat_019_codigo_de_actividad_economica.find(
        (department) => department.codigo === props.customer?.codActividad
      );

      return JSON.stringify(code_activity);
    }
  }, [
    props,
    props.customer,
    cat_019_codigo_de_actividad_economica,
    cat_019_codigo_de_actividad_economica.length,
  ]);
  const handleFilter = (name = '') => {
    getCat019CodigoActividadEconomica(name);
  };

  return (
    <div className='p-4 dark:text-white'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
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
                    type="number"
                    label="Teléfono"
                    labelPlacement="outside"
                    name="telefono"
                    value={values.telefono}
                    onChange={handleChange('telefono')}
                    onBlur={handleBlur('telefono')}
                    placeholder="Ingresa el telefono"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                  {errors.telefono && touched.telefono && (
                    <span className="text-xs font-semibold text-red-500">{errors.telefono}</span>
                  )}
                </div>

                {/* Tipo de documento */}
                <div className="pt-2">
                  <Autocomplete
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = JSON.parse(key as string) as ITipoDocumento;
                        handleChange('tipoDocumento')(depSelected.codigo);
                        handleChange('tipoDocumento')(depSelected.valores);
                      }
                    }}
                    onBlur={handleBlur('tipoDocumento')}
                    label="Tipo de documento"
                    labelPlacement="outside"
                    placeholder={
                      props.customer?.tipoDocumento
                        ? props.customer?.tipoDocumento
                        : 'Selecciona el tipo de documento'
                    }
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                    defaultSelectedKey={values.tipoDocumento}
                    value={selectedKeyCodActivity}
                    onInputChange={(e) => handleFilter(e)}
                  >
                    {cat_022_tipo_de_documentoDeIde.map((dep) => (
                      <AutocompleteItem
                        value={dep.codigo}
                        key={JSON.stringify(dep)}
                        className="dark:text-white"
                      >
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.tipoDocumento && touched.tipoDocumento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.tipoDocumento}
                    </span>
                  )}
                </div>

                {/* Fin de tipio de documento */}

                <div className="pt-2">
                  <Input
                    type="text"
                    label="Numero documento"
                    labelPlacement="outside"
                    name="numDocumento"
                    value={values.numDocumento}
                    onChange={handleChange('numDocumento')}
                    onBlur={handleBlur('numDocumento')}
                    placeholder="Ingresa el numero documento"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                  {errors.numDocumento && touched.numDocumento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.numDocumento}
                    </span>
                  )}
                </div>
                <div className="pt-2">
                  <Autocomplete
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
                    placeholder={
                      props.customer?.descActividad
                        ? props.customer?.descActividad
                        : 'Selecciona la actividad'
                    }
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                    // selectedKey={selectedKeyCodActivity}
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
                  {/* {errors.codActividad && touched.codActividad && (
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
                        const depSelected = JSON.parse(key as string) as Municipio;
                        setSelectedCodeDep(depSelected.codigo);
                        handleChange('departamento')(depSelected.codigo);
                        handleChange('nombreDepartamento')(depSelected.valores);
                      }
                    }}
                    onBlur={handleBlur('departamento')}
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder={
                      props.customer_direction?.nombreDepartamento
                        ? props.customer_direction?.nombreDepartamento
                        : 'Selecciona el departamento'
                    }
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                    // selectedKey={selectedKeyDepartment}
                    defaultSelectedKey={selectedKeyDepartment}
                    value={selectedKeyDepartment}
                  >
                    {cat_012_departamento.map((dep) => (
                      <AutocompleteItem
                        value={dep.codigo}
                        key={JSON.stringify(dep)}
                        className="dark:text-white"
                      >
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.departamento && touched.departamento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.departamento}
                    </span>
                  )}
                </div>
                <div className="pt-2">
                  <Autocomplete
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
                    placeholder={
                      props.customer_direction?.nombreMunicipio
                        ? props.customer_direction?.nombreMunicipio
                        : 'Selecciona el departamento'
                    }
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                    // selectedKey={selectedKeyCity}
                    defaultSelectedKey={props.customer_direction?.nombreMunicipio}
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
                  </Autocomplete>
                  {errors.municipio && touched.municipio && (
                    <span className="text-sm font-semibold text-red-500">{errors.municipio}</span>
                  )}
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
                    <span className="text-sm font-semibold text-red-500">{errors.complemento}</span>
                  )}
                </div>
                <div className="pt-2">
                  <Input
                    type="number"
                    label="NIT"
                    labelPlacement="outside"
                    name="nit"
                    value={values.nit}
                    onChange={handleChange('nit')}
                    onBlur={handleBlur('nit')}
                    placeholder="Ingresa el nit"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                  {errors.nit && touched.nit && (
                    <span className="text-xs font-semibold text-red-500">{errors.nit}</span>
                  )}
                </div>
                <div className="pt-2">
                  <Input
                    type="number"
                    label="NRC"
                    labelPlacement="outside"
                    name="nrc"
                    value={values.nrc}
                    onChange={handleChange('nrc')}
                    onBlur={handleBlur('nrc')}
                    placeholder="Ingresa el nrc"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                  {errors.nrc && touched.nrc && (
                    <span className="text-xs font-semibold text-red-500">{errors.nrc}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => handleSubmit()}
                className="w-full font-semibold"
                style={{
                  backgroundColor: theme.colors.dark,
                  color: theme.colors.primary,
                }}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddClientContributor;
