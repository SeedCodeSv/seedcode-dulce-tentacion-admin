import { Input, Autocomplete, AutocompleteItem, Textarea, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { useBillingStore } from '@/store/facturation/billing.store';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { CodigoActividadEconomica } from '@/types/billing/cat-019-codigo-de-actividad-economica.types';
import { useCustomerStore } from '@/store/customers.store';
import { PayloadCustomer } from '@/types/customers.types';
// import { contributorTypes } from '@/utils/constants';
import { useNavigate, useParams } from 'react-router';
import { Loader } from 'lucide-react';
import useGlobalStyles from '@/components/global/global.styles';
import { Branch } from '@/types/auth.types';
import { useBranchesStore } from '@/store/branches.store';

function AddClientContributor() {
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);
  const navigate = useNavigate();
  const { postCustomer, patchCustomer, customer, getCustomerById, loading } = useCustomerStore();
  const styles = useGlobalStyles();

  const { id } = useParams();

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
  const [selectedCodeDep, setSelectedCodeDep] = useState('0');

  useEffect(() => {
    getCustomerById(Number(id));
    getCat012Departamento();
  }, []);

  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat019CodigoActividadEconomica();
  }, []);

  useEffect(() => {
    getCat013Municipios(
      selectedCodeDep === '0' ? (customer?.direccion?.departamento ?? '') : selectedCodeDep
    );
  }, [selectedCodeDep, customer?.direccion]);

  const initialValues = {
    nombre: customer?.nombre ?? '',
    nombreComercial: customer?.nombreComercial ?? '',
    correo: customer?.correo ?? '',
    telefono: customer?.telefono ?? '',
    numDocumento: customer?.numDocumento ?? '',
    nrc: customer?.nrc ?? '',
    nit: customer?.nit ?? '',
    tipoDocumento: customer?.tipoDocumento ?? '',
    bienTitulo: '05',
    codActividad: customer?.codActividad ?? '',
    esContribuyente: 1,
    descActividad: customer?.descActividad ?? '',
    municipio: customer?.direccion?.municipio ?? '',
    nombreMunicipio: customer?.direccion.nombreMunicipio ?? '',
    departamento: customer?.direccion?.departamento ?? '',
    nombreDepartamento: customer?.direccion?.nombreDepartamento ?? '',
    complemento: customer?.direccion?.complemento ?? '',
    branchId: 0,
    // tipoContribuyente: customer?.tipoContribuyente ?? '',
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    nombreComercial: yup.string().required('**El nombre comercial es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    telefono: yup
      .string()
      .required('**Este campo solo permite números sin guiones**')
      .matches(/^[0-9]{8}$/, '**El telefono no es valido**'),
    tipoDocumento: yup.string().required('**Tipo de documento es requerido**'),
    numDocumento: yup
      .string()
      .required('**Número de documento es requerido**')
      .test('noSelectedTypeDocument', 'Debe seleccionar un tipo de documento', function () {
        const { tipoDocumento } = this.parent;
        return tipoDocumento !== '' ? true : false;
      })
      .test('validar-documento', 'Número de documento no válido', function (value) {
        const { tipoDocumento } = this.parent;
        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value);
        }
        if (tipoDocumento === '36') {
          return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
        }
        return true; // Si tipoDocumento no es relevante para validación, se considera válido
      }),
    nit: yup
      .string()
      .required('**El NIT es requerido **')
      .matches(/^([0-9]{9}|[0-9]{14})$/, '**El NIT no es valido, 14 caracteres sin guiones**'),
    nrc: yup
      .string()
      .required('**El NRC es requerido**')
      .matches(/^[0-9]{1,8}$/, '**El NRC no es valido**'),
    codActividad: yup
      .string()
      .required('**La actividad economica es requerida**')
      .matches(/^[0-9]{2,6}$/, '**La actividad no es valida**'),
    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string().required('**El complemento es requerido**'),
    // tipoContribuyente: yup.string().required('**El tipo de contribuyente es requerido**'),
  });

  const [isClicked, setIsClicked] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const onSubmit = (payload: PayloadCustomer) => {
    if (Number(id) > 0 || Number(id) !== 0) {
      const values = {
        ...payload,
        esContribuyente: 1,
        // branchId: Number(user?.correlative.branchId),
        // transmitterId: Number(user?.transmitterId),
      };
      patchCustomer(values, Number(id))
        .then((res) => {
          setIsClicked(false);
          res && navigate('/clients');
          if (button.current) button.current.disabled = false;
        })
        .catch(() => {
          if (button.current) button.current.disabled = false;
        });
    } else {
      const values = {
        ...payload,
        esContribuyente: 1,
        // branchId: Number(user?.correlative.branchId),
        // transmitterId: Number(user?.transmitterId),
      };
      postCustomer(values)
        .then((res) => {
          setIsClicked(false);
          res && navigate('/clients');
          if (button.current) button.current.disabled = false;
        })
        .catch(() => {
          if (button.current) button.current.disabled = false;
        });
    }
  };
  const selectedKeyCodActivity = useMemo(() => {
    if (customer) {
      const code_activity = cat_019_codigo_de_actividad_economica.find(
        (department) => department.codigo === customer?.codActividad
      );

      return JSON.stringify(code_activity);
    }
  }, [
    customer,
    cat_019_codigo_de_actividad_economica,
    cat_019_codigo_de_actividad_economica.length,
  ]);
  const handleFilter = (name = '') => {
    getCat019CodigoActividadEconomica(name);
  };

  return (
    <div className="dark:bg-gray-900">
      {loading ? (
        <strong>Cargando...</strong>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validationOnMount={false}
          onSubmit={(values) => onSubmit(values)}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            validateForm,
          }) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                <div className="">
                  <div className="2">
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
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.nombre}
                      isInvalid={!!errors.nombre && touched.nombre}
                    />
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
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.nombreComercial}
                      isInvalid={!!errors.nombreComercial && touched.nombreComercial}
                    />
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
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.correo}
                      isInvalid={!!errors.correo && touched.correo}
                    />
                  </div>
                  {/* Tipo de documento */}
                  <div className="pt-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_022_tipo_de_documentoDeIde.find(
                            (dep) => dep.codigo === key
                          );
                          setFieldValue('tipoDocumento', depSelected?.codigo);
                        }
                      }}
                      placeholder="Selecciona el tipo de documento"
                      onBlur={handleBlur('tipoDocumento')}
                      label="Tipo de documento"
                      labelPlacement="outside"
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                      selectedKey={values.tipoDocumento}
                      errorMessage={errors.tipoDocumento}
                      isInvalid={!!errors.tipoDocumento && touched.tipoDocumento}
                    >
                      {cat_022_tipo_de_documentoDeIde.map((dep) => (
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
                    <Input
                      type="text"
                      label="Numero documento"
                      labelPlacement="outside"
                      name="numDocumento"
                      value={values.numDocumento}
                      onChange={({ currentTarget }) => {
                        setFieldValue('numDocumento', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                      onBlur={handleBlur('numDocumento')}
                      placeholder="Ingresa el numero documento"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.numDocumento}
                      isInvalid={!!errors.numDocumento && touched.numDocumento}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <Input
                      label="NIT"
                      labelPlacement="outside"
                      name="nit"
                      value={values.nit}
                      onChange={({ currentTarget }) => {
                        setFieldValue('nit', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                      onBlur={handleBlur('nit')}
                      placeholder="Ingresa el nit"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.nit}
                      isInvalid={!!errors.nit && touched.nit}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      label="NRC"
                      labelPlacement="outside"
                      name="nrc"
                      value={values.nrc}
                      onChange={({ currentTarget }) => {
                        setFieldValue('nrc', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                      onBlur={handleBlur('nrc')}
                      placeholder="Ingresa el nrc"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.nrc}
                      isInvalid={!!errors.nrc && touched.nrc}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      type="number"
                      label="Teléfono"
                      labelPlacement="outside"
                      name="telefono"
                      value={values.telefono}
                      onChange={({ currentTarget }) => {
                        setFieldValue('telefono', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                      onBlur={handleBlur('telefono')}
                      placeholder="Ingresa el telefono"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      variant="bordered"
                      errorMessage={errors.telefono}
                      isInvalid={!!errors.telefono && touched.telefono}
                    />
                  </div>
                  <div className="pt-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_019_codigo_de_actividad_economica.find(
                            (dep) => dep.codigo === (key as string)
                          ) as CodigoActividadEconomica;
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
                      selectedKey={values.codActividad}
                      value={selectedKeyCodActivity}
                      onInputChange={(e) => handleFilter(e)}
                      errorMessage={errors.codActividad}
                      isInvalid={!!errors.codActividad && touched.codActividad}
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
                  </div>
                  <div className="pt-2">
                    <Autocomplete
                      value={values.branchId}
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(key as string) as Branch;
                          handleChange('branchId')(depSelected?.id?.toString() ?? '');
                        }
                      }}
                      // defaultSelectedKey={isEditing ? values.branchId : undefined}
                      onBlur={handleBlur('branchId')}
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder="Selecciona la sucursal"
                      variant="bordered"
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          className="dark:text-white"
                          value={bra.name}
                          key={JSON.stringify(bra)}
                        >
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                </div>
              </div>
              <p className="text-xl font-semibold py-3 dark:text-white">Direccion</p>
              <div className="w-full border shadow p-5 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_012_departamento.find(
                            (dep) => dep.codigo === (key as string)
                          ) as Municipio;
                          setSelectedCodeDep(depSelected.codigo);
                          setFieldValue(
                            'municipio',
                            depSelected.codigo === customer?.direccion.departamento
                              ? customer.direccion.municipio
                              : '01'
                          );
                          handleChange('departamento')(depSelected.codigo);
                          handleChange('nombreDepartamento')(depSelected.valores);
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
                      errorMessage={errors.departamento}
                      isInvalid={!!errors.departamento && touched.departamento}
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
                  </div>
                  <div>
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_013_municipios.find(
                            (dep) => dep.codigo === (key as string)
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
                      errorMessage={errors.municipio}
                      isInvalid={!!errors.municipio && touched.municipio}
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

                  <div className="pt-2 md:col-span-2">
                    <Textarea
                      label="Complemento de dirección"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'min-h-[90px] dark:text-white',
                        base: 'font-semibold',
                      }}
                      labelPlacement="outside"
                      variant="bordered"
                      placeholder="Ingresa el complemento de dirección"
                      name="complemento"
                      value={values.complemento}
                      onChange={handleChange('complemento')}
                      onBlur={handleBlur('complemento')}
                      errorMessage={errors.complemento}
                      isInvalid={!!errors.complemento && touched.complemento}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end mt-5">
                <div className="pt-4 w-full flex justify-end">
                  {isClicked ? (
                    <div className="mt-4 flex justify-center items-center">
                      <Loader size={35} className="animate-spin dark:text-white" />
                    </div>
                  ) : (
                    <Button
                      onClick={async (e) => {
                        e.preventDefault();
                        const valid = await validateForm().then((error) => {
                          return !error;
                        });
                        if (valid) {
                          setIsClicked(true);
                        }
                        handleSubmit();
                      }}
                      className="w-full md:w-96 font-semibold"
                      ref={button}
                      style={styles.darkStyle}
                    >
                      Guardar
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </Formik>
      )}
    </div>
  );
}

export default AddClientContributor;

// import { isValidDUI } from '@avalontechsv/idsv';
// import { Input, Autocomplete, AutocompleteItem, Textarea, Button } from '@nextui-org/react';
// import { Formik } from 'formik';
// import { useContext, useEffect, useState } from 'react';
// import * as yup from 'yup';
// import { useBillingStore } from '../../store/facturation/billing.store';
// import { useCustomerStore } from '../../store/customers.store';
// import { PayloadCustomer } from '../../types/customers.types';
// import { ThemeContext } from '../../hooks/useTheme';
// import { ITipoDocumento } from '../../types/DTE/tipo_documento.types';
// import Layout from '@/layout/Layout';
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { useBranchesStore } from '@/store/branches.store';
// import { Branch } from '@/types/auth.types';

// interface Props {
//   customer?: PayloadCustomer;
//   id?: number;
// }

// function AddClientContributor(props: Props) {
//   const { theme } = useContext(ThemeContext);
//   const { getBranchesList, branch_list } = useBranchesStore();
//   useEffect(() => {
//     getBranchesList();
//   }, []);

//   const initialValues = {
//     nombre: '',
//     nombreComercial: '',
//     correo: '',
//     telefono: '',
//     numDocumento: '',
//     nrc: '',
//     nit: '',
//     tipoDocumento: '',
//     bienTitulo: '05',
//     codActividad: '',
//     esContribuyente: 1,
//     descActividad: '',
//     municipio: '',
//     nombreMunicipio: '',
//     departamento: '',
//     nombreDepartamento: '',
//     complemento: '',
//     branchId: 0,
//   };

//   const validationSchema = yup.object().shape({
//     nombre: yup.string().required('**El nombre es requerido**'),
//     nombreComercial: yup.string().required('**El nombre comercial es requerido**'),
//     correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
//     telefono: yup
//       .string()
//       .required('Este campo solo permite números sin guiones')
//       .test('length', 'Debe ser de 8 dígitos', (value) => {
//         return value?.length === 8;
//       }),
//     numDocumento: yup
//       .string()
//       .required('Este campo es requerido')
//       .when('tipoDocumento', (tipoDocumento, schema) => {
//         const documentType = Array.isArray(tipoDocumento) ? tipoDocumento[0] : tipoDocumento;

//         if (documentType === '13') {
//           return schema
//             .matches(/^[0-9]{9}$/, 'El DUI debe tener 9 dígitos sin guiones')
//             .test('isValidDUI', 'El DUI no es válido', (value) => {
//               return value && value !== '' ? isValidDUI(value) : false;
//             });
//         }
//         if (documentType === '36') {
//           return schema
//             .matches(/^[0-9]{14}$/, 'El NIT debe tener 14 dígitos sin guiones')
//             .test('isValidNIT', 'El NIT no es válido', (value) => {
//               if (!value) return false;
//               return value.length === 14;
//             });
//         }
//         return schema.required('El número de documento es requerido');
//       }),
//     nit: yup
//       .string()
//       .required('**El NIT es requerido **')
//       .matches(/^([0-9]{14}|[0-9]{9})$/, 'El NIT debe tener 14 dígitos sin guiones'),

//     nrc: yup
//       .string()
//       .required('**El NRC es requerido**')
//       .matches(/^[0-9]{1,8}$/, '**El NRC no es valido**'),
//     codActividad: yup
//       .string()
//       .required('**La actividad es requerida**')
//       .matches(/^[0-9]{2,6}$/, '**La actividad no es valida**'),
//     departamento: yup.string().required('**Debes seleccionar el departamento**'),
//     municipio: yup.string().required('**Debes seleccionar el municipio**'),
//     complemento: yup.string().required('**El complemento es requerida**'),
//     branchId: yup.number().required('**Debes seleccionar la sucursal**'),
//   });
//   const {
//     getCat012Departamento,
//     cat_012_departamento,
//     getCat013Municipios,
//     cat_013_municipios,
//     getCat019CodigoActividadEconomica,
//     cat_019_codigo_de_actividad_economica,
//     getCat022TipoDeDocumentoDeIde,
//     cat_022_tipo_de_documentoDeIde,
//   } = useBillingStore();

//   const [selectedCodeDep, setSelectedCodeDep] = useState(props.customer?.departamento ?? '0');

//   useEffect(() => {
//     getCat012Departamento();
//     getCat019CodigoActividadEconomica();
//   }, []);

//   useEffect(() => {
//     if (selectedCodeDep !== '0') {
//       getCat013Municipios(selectedCodeDep);
//     }
//   }, [selectedCodeDep]);

//   useEffect(() => {
//     getCat022TipoDeDocumentoDeIde();
//   }, [selectedCodeDep]);
//   const { postCustomer } = useCustomerStore();

//   const onSubmit = async (payload: PayloadCustomer) => {
//     const values = {
//       ...payload,
//       esContribuyente: 1,
//     };

//     await postCustomer(values);

//     navigate('/clients');
//   };

//   const navigate = useNavigate();

//   return (
//     <Layout title="Contribuyente">
//       <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
//         <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
//           <button
//             onClick={() => navigate('/clients')}
//             className="flex items-center gap-2 bg-transparent"
//           >
//             <ArrowLeft />
//             <span>Volver</span>
//           </button>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={(values) => onSubmit(values)}
//             enableReinitialize={true}
//           >
//             {({
//               values,
//               errors,
//               touched,
//               handleBlur,
//               setFieldValue,
//               handleChange,
//               handleSubmit,
//             }) => (
//               <>
//                 <div className="grid grid-cols-2 gap-5 p-4">
//                   <div>
//                     <div className="mt-10">
//                       <Input
//                         label="Nombre"
//                         labelPlacement="outside"
//                         name="name"
//                         value={values.nombre}
//                         onChange={handleChange('nombre')}
//                         onBlur={handleBlur('nombre')}
//                         placeholder="Ingresa el nombre"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.nombre && touched.nombre && (
//                         <span className="text-sm font-semibold text-red-500">{errors.nombre}</span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         label="Nombre comercial"
//                         labelPlacement="outside"
//                         name="name"
//                         value={values.nombreComercial}
//                         onChange={handleChange('nombreComercial')}
//                         onBlur={handleBlur('nombreComercial')}
//                         placeholder="Ingresa el nombre comercial"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.nombreComercial && touched.nombreComercial && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.nombreComercial}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         label="Correo electrónico"
//                         labelPlacement="outside"
//                         name="correo"
//                         value={values.correo}
//                         onChange={handleChange('correo')}
//                         onBlur={handleBlur('correo')}
//                         placeholder="Ingresa el correo"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.correo && touched.correo && (
//                         <span className="text-sm font-semibold text-red-500">{errors.correo}</span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         type="number"
//                         label="Teléfono"
//                         labelPlacement="outside"
//                         name="telefono"
//                         value={values.telefono}
//                         onChange={handleChange('telefono')}
//                         onBlur={handleBlur('telefono')}
//                         placeholder="Ingresa el telefono"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.telefono && touched.telefono && (
//                         <span className="text-xs font-semibold text-red-500">
//                           {errors.telefono}
//                         </span>
//                       )}
//                     </div>

//                     {/* Tipo de documento */}
//                     <div className="pt-2">
//                       <div className="flex flex-col">
//                         <label className="font-semibold text-gray-900 text-sm mb-1">
//                           Tipo de documento
//                         </label>
//                         <Autocomplete
//                           onSelectionChange={(key) => {
//                             if (key) {
//                               const depSelected = JSON.parse(key as string) as ITipoDocumento;
//                               handleChange('tipoDocumento')(depSelected.codigo);
//                             }
//                           }}
//                           onBlur={handleBlur('tipoDocumento')}
//                           placeholder="Selecciona el tipo de documento"
//                           variant="bordered"
//                           classNames={{
//                             base: 'font-semibold text-gray-500 text-sm',
//                           }}
//                           className="dark:text-white"
//                           defaultSelectedKey={values.tipoDocumento}
//                         >
//                           {cat_022_tipo_de_documentoDeIde.map((dep) => (
//                             <AutocompleteItem
//                               value={dep.codigo}
//                               key={JSON.stringify(dep)}
//                               className="dark:text-white"
//                             >
//                               {dep.valores}
//                             </AutocompleteItem>
//                           ))}
//                         </Autocomplete>
//                       </div>

//                       {errors.tipoDocumento && touched.tipoDocumento && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.tipoDocumento}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         type="text"
//                         label="Numero documento"
//                         labelPlacement="outside"
//                         name="numDocumento"
//                         value={values.numDocumento}
//                         onChange={handleChange('numDocumento')}
//                         onBlur={handleBlur('numDocumento')}
//                         placeholder="Ingresa el numero documento"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.numDocumento && touched.numDocumento && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.numDocumento}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Autocomplete
//                         label="Actividad"
//                         labelPlacement="outside"
//                         placeholder="Ingresa la actividad"
//                         variant="bordered"
//                         onSelectionChange={(key) => {
//                           if (key) {
//                             const depSelected = cat_019_codigo_de_actividad_economica.find(
//                               (dep) => dep.codigo === new Set([key]).values().next().value
//                             );

//                             handleChange('codActividad')(depSelected?.codigo as string);
//                             handleChange('descActividad')(depSelected?.valores || '');
//                           }
//                         }}
//                         classNames={{
//                           base: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         className="dark:text-white"
//                       >
//                         {cat_019_codigo_de_actividad_economica.map((dep) => (
//                           <AutocompleteItem
//                             key={dep.codigo}
//                             value={dep.codigo}
//                             className="dark:text-white"
//                           >
//                             {dep.valores}
//                           </AutocompleteItem>
//                         ))}
//                       </Autocomplete>
//                       {errors.codActividad && touched.codActividad && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.codActividad}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="mt-4">
//                       <Autocomplete
//                         onSelectionChange={(key) => {
//                           if (key) {
//                             const depSelected = cat_012_departamento.find(
//                               (dep) => dep.codigo === new Set([key]).values().next().value
//                             );
//                             console.log('Departamento seleccionado:', depSelected);
//                             setSelectedCodeDep(depSelected?.codigo as string);
//                             handleChange('departamento')(depSelected?.codigo as string);
//                             handleChange('nombreDepartamento')(depSelected?.valores || '');
//                           }
//                         }}
//                         onBlur={handleBlur('departamento')}
//                         label="Departamento"
//                         labelPlacement="outside"
//                         placeholder="Selecciona el departamento"
//                         variant="bordered"
//                         className="dark:text-white"
//                         value={values.departamento}
//                       >
//                         {cat_012_departamento.map((dep) => (
//                           <AutocompleteItem
//                             value={dep.codigo}
//                             key={dep.codigo}
//                             className="dark:text-white"
//                           >
//                             {dep.valores}
//                           </AutocompleteItem>
//                         ))}
//                       </Autocomplete>
//                       {errors.departamento && touched.departamento && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.departamento}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Autocomplete
//                         onSelectionChange={(key) => {
//                           if (key) {
//                             const munSelected = cat_013_municipios.find(
//                               (mun) => mun.codigo === key
//                             );
//                             console.log('Municipio seleccionado:', munSelected);
//                             handleChange('municipio')(munSelected?.codigo || '');
//                             handleChange('nombreMunicipio')(munSelected?.valores || '');
//                           }
//                         }}
//                         onBlur={handleBlur('municipio')}
//                         label="Municipio"
//                         labelPlacement="outside"
//                         placeholder="Selecciona el municipio"
//                         variant="bordered"
//                         className="dark:text-white"
//                         value={values.municipio}
//                       >
//                         {cat_013_municipios.map((mun) => (
//                           <AutocompleteItem
//                             value={mun.codigo}
//                             key={mun.codigo}
//                             className="dark:text-white"
//                           >
//                             {mun.valores}
//                           </AutocompleteItem>
//                         ))}
//                       </Autocomplete>
//                       {errors.municipio && touched.municipio && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.municipio}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Textarea
//                         label="Complemento de dirección"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                           input: 'min-h-[90px]',
//                         }}
//                         labelPlacement="outside"
//                         variant="bordered"
//                         placeholder="Ingresa el complemento de dirección"
//                         name="complemento"
//                         value={values.complemento}
//                         onChange={handleChange('complemento')}
//                         onBlur={handleBlur('complemento')}
//                       />
//                       {errors.complemento && touched.complemento && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.complemento}
//                         </span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         label="NIT"
//                         labelPlacement="outside"
//                         name="nit"
//                         value={values.nit}
//                         onChange={(e) =>
//                           setFieldValue('nit', e.currentTarget.value.replace(/[^0-9]/g, ''))
//                         }
//                         onBlur={handleBlur('nit')}
//                         placeholder="Ingresa el nit"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.nit && touched.nit && (
//                         <span className="text-xs font-semibold text-red-500">{errors.nit}</span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Input
//                         type="number"
//                         label="NRC"
//                         labelPlacement="outside"
//                         name="nrc"
//                         value={values.nrc}
//                         onChange={handleChange('nrc')}
//                         onBlur={handleBlur('nrc')}
//                         placeholder="Ingresa el nrc"
//                         classNames={{
//                           label: 'font-semibold text-gray-500 text-sm',
//                         }}
//                         variant="bordered"
//                       />
//                       {errors.nrc && touched.nrc && (
//                         <span className="text-xs font-semibold text-red-500">{errors.nrc}</span>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <Autocomplete
//                         value={values.branchId}
//                         onSelectionChange={(key) => {
//                           if (key) {
//                             const depSelected = JSON.parse(key as string) as Branch;
//                             handleChange('branchId')(depSelected?.id?.toString() ?? '');
//                           }
//                         }}
//                         // defaultSelectedKey={isEditing ? values.branchId : undefined}
//                         onBlur={handleBlur('branchId')}
//                         label="Sucursal"
//                         labelPlacement="outside"
//                         placeholder="Selecciona la sucursal"
//                         variant="bordered"
//                         className="dark:text-white"
//                         classNames={{
//                           base: 'font-semibold text-sm',
//                         }}
//                       >
//                         {branch_list.map((bra) => (
//                           <AutocompleteItem
//                             className="dark:text-white"
//                             value={bra.name}
//                             key={JSON.stringify(bra)}
//                           >
//                             {bra.name}
//                           </AutocompleteItem>
//                         ))}
//                       </Autocomplete>

//                       {errors.branchId && touched.branchId && (
//                         <span className="text-sm font-semibold text-red-500">
//                           {errors.branchId}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="pt-4 p-4">
//                   <Button
//                     onClick={() => handleSubmit()}
//                     className="w-full font-semibold"
//                     style={{
//                       backgroundColor: theme.colors.dark,
//                       color: theme.colors.primary,
//                     }}
//                   >
//                     Guardar
//                   </Button>
//                 </div>
//               </>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default AddClientContributor;
