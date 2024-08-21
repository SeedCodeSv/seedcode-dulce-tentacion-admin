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
import { ITipoDocumento } from '../../types/DTE/tipo_documento.types';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useBranchesStore } from '@/store/branches.store';
import { Branch } from '@/types/auth.types';

interface Props {
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id?: number;
  typeDocumento?: string;
}

function AddClientContributor(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { get_customer_by_id, user_by_id } = useCustomerStore();
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  console.log('user_by_id', user_by_id);
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    nombreComercial: '',
    correo: '',
    telefono: '',
    numDocumento: '',
    nrc: '',
    nit: '',
    tipoDocumento: '',
    bienTitulo: '05',
    codActividad: '',
    esContribuyente: 1,
    descActividad: '',
    municipio: '',
    nombreMunicipio: '',
    departamento: '',
    nombreDepartamento: '',
    complemento: '',
    branchId: 0,
  });

  useEffect(() => {
    if (isEditing && id && id !== '0') {
      get_customer_by_id(parseInt(id)).then((customer) => {
        if (customer) {
          setInitialValues({
            nombre: customer.nombre ?? '',
            nombreComercial: customer.nombreComercial ?? '',
            correo: customer.correo ?? '',
            telefono: customer.telefono ?? '',
            numDocumento: customer.numDocumento ?? '',
            nrc: customer.nrc ?? '',
            nit: customer.nit ?? '',
            tipoDocumento: customer.tipoDocumento ?? '',
            bienTitulo: '05',
            codActividad: customer.codActividad ?? '',
            esContribuyente: 1,
            descActividad: customer.descActividad ?? '',
            municipio: customer.direccion.municipio ?? '',
            nombreMunicipio: customer.direccion.nombreMunicipio ?? '',
            departamento: customer.direccion.departamento ?? '',
            nombreDepartamento: customer.direccion.nombreDepartamento ?? '',
            complemento: customer.direccion.complemento ?? '',
            branchId: customer.branchId ?? 0,
          });
        }
      });
    } else {
      setInitialValues({
        nombre: '',
        nombreComercial: '',
        correo: '',
        telefono: '',
        numDocumento: '',
        nrc: '',
        nit: '',
        tipoDocumento: '',
        bienTitulo: '05',
        codActividad: '',
        esContribuyente: 1,
        descActividad: '',
        municipio: '',
        nombreMunicipio: '',
        departamento: '',
        nombreDepartamento: '',
        complemento: '',
        branchId: 0,
      });
    }
  }, [id, isEditing, get_customer_by_id]);
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
      .required('Este campo es requerido')
      .when('tipoDocumento', (tipoDocumento, schema) => {
        const documentType = Array.isArray(tipoDocumento) ? tipoDocumento[0] : tipoDocumento;

        if (documentType === '13') {
          return schema
            .matches(/^[0-9]{9}$/, 'El DUI debe tener 9 dígitos sin guiones')
            .test('isValidDUI', 'El DUI no es válido', (value) => {
              return value && value !== '' ? isValidDUI(value) : false;
            });
        }
        if (documentType === '36') {
          return schema
            .matches(/^[0-9]{14}$/, 'El NIT debe tener 14 dígitos sin guiones')
            .test('isValidNIT', 'El NIT no es válido', (value) => {
              if (!value) return false;
              return value.length === 14;
            });
        }
        return schema.required('El número de documento es requerido');
      }),
    nit: yup
      .string()
      .required('**El NIT es requerido **')
      .matches(/^([0-9]{14}|[0-9]{9})$/, 'El NIT debe tener 14 dígitos sin guiones'),

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

  const onSubmit = async (payload: PayloadCustomer) => {
    const values = {
      ...payload,
      esContribuyente: 1,
      // branchId: Number(user?.correlative.branch.id),
    };

    if (isEditing && id && id !== '0') {
      // Editar cliente existente
      await patchCustomer(values, parseInt(id)); // Asegúrate de pasar el `id` correctamente como número
    } else {
      // Crear nuevo cliente
      console.log('DATOS DEL CLIENTE A CREAR', values);
      await postCustomer(values);
    }
    navigate('/clients');
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
  const navigate = useNavigate();

  return (
    <Layout title="Contribuyente">
      <div className="w-full h-full p-4 md:p-10 md:px-12">
        <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft />
            <span>Volver</span>
          </button>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              setFieldValue,
              handleChange,
              handleSubmit,
            }) => (
              <>
                <div className="grid grid-cols-2 gap-5 p-4">
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
                        <span className="text-xs font-semibold text-red-500">
                          {errors.telefono}
                        </span>
                      )}
                    </div>

                    {/* Tipo de documento */}
                    <div className="pt-2">
                      <div className="flex flex-col">
                        <label className="font-semibold text-gray-900 text-sm mb-1">
                          Tipo de documento
                        </label>
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as ITipoDocumento;
                              handleChange('tipoDocumento')(depSelected.codigo);
                            }
                          }}
                          onBlur={handleBlur('tipoDocumento')}
                          placeholder="Selecciona el tipo de documento"
                          variant="bordered"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          className="dark:text-white"
                          defaultSelectedKey={values.tipoDocumento}
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
                      </div>

                      {errors.tipoDocumento && touched.tipoDocumento && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.tipoDocumento}
                        </span>
                      )}
                    </div>
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
                            const depSelected = JSON.parse(
                              key as string
                            ) as CodigoActividadEconomica;
                            handleChange('codActividad')(depSelected.codigo);
                            handleChange('descActividad')(depSelected.valores);
                          }
                        }}
                        onBlur={handleBlur('codActividad')}
                        label="Actividad"
                        labelPlacement="outside"
                        placeholder={
                          isEditing && values.descActividad
                            ? values.descActividad
                            : 'Selecciona el actividad'
                        }
                        defaultSelectedKey={isEditing ? values.descActividad : undefined}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
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
                      )}
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
                          isEditing && values.nombreDepartamento
                            ? values.nombreDepartamento
                            : 'Selecciona el departamento'
                        }
                        defaultSelectedKey={isEditing ? values.departamento : undefined}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
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
                          isEditing && values.nombreMunicipio
                            ? values.nombreMunicipio
                            : 'Selecciona el municipio'
                        }
                        defaultSelectedKey={isEditing ? values.municipio : undefined}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
                        defaultInputValue={props.customer_direction?.nombreMunicipio}
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
                        <span className="text-sm font-semibold text-red-500">
                          {errors.municipio}
                        </span>
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
                        onChange={(e) =>
                          setFieldValue('nit', e.currentTarget.value.replace(/[^0-9]/g, ''))
                        }
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
                    <div className="pt-2">
                      <Autocomplete
                        value={values.branchId}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as Branch;
                            handleChange('branchId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                        defaultSelectedKey={isEditing ? values.branchId : undefined}
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
                            key={bra.id}
                          >
                            {bra.name}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>

                      {errors.branchId && touched.branchId && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.branchId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-4 p-4">
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
      </div>
    </Layout>
  );
}

export default AddClientContributor;
