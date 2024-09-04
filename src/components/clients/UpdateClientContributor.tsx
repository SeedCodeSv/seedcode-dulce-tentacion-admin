import { isValidDUI } from '@avalontechsv/idsv';
import { Input, Autocomplete, AutocompleteItem, Textarea, Button } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useCustomerStore } from '../../store/customers.store';
import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { ThemeContext } from '../../hooks/useTheme';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useBranchesStore } from '@/store/branches.store';

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
    if (initialValues.departamento) {
      setSelectedCodeDep(initialValues.departamento); // Asegura que se setea el código del departamento correcto al cargar los valores
      getCat013Municipios(initialValues.departamento); // Obtén los municipios correspondientes al departamento inicial
    }
  }, [initialValues.departamento]);

  useEffect(() => {
    if (isEditing && id && id !== '0') {
      get_customer_by_id(parseInt(id)).then((customer) => {
        if (customer) {
          setInitialValues({
            nombre: customer.customer.nombre ?? '',
            nombreComercial: customer.customer.nombreComercial ?? '',
            correo: customer.customer.correo ?? '',
            telefono: customer.customer.telefono ?? '',
            numDocumento: customer.customer.numDocumento ?? '',
            nrc: customer.customer.nrc ?? '',
            nit: customer.customer.nit ?? '',
            tipoDocumento: customer.customer.tipoDocumento ?? '',
            bienTitulo: '05',
            codActividad: customer.customer.codActividad ?? '',
            esContribuyente: 1,
            descActividad: customer.customer.descActividad ?? '',
            municipio: customer.customer.direccion.municipio ?? '',
            nombreMunicipio: customer.customer.direccion.nombreMunicipio ?? '',
            departamento: customer.customer.direccion.departamento ?? '',
            nombreDepartamento: customer.customer.direccion.nombreDepartamento ?? '',
            complemento: customer.customer.direccion.complemento ?? '',
            branchId: customer.customer.branchId ?? 0,
          });
        }
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

  const [selectedCodeDep, setSelectedCodeDep] = useState(
    props.customer_direction?.departamento ?? '0'
  );

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

  useEffect(() => {
    getCat012Departamento();
    getCat022TipoDeDocumentoDeIde();
    getCat019CodigoActividadEconomica();
  }, []);

  const selectedKeyDepartment = useMemo(() => {
    if (user_by_id) {
      const department = cat_012_departamento.find(
        (department) => department.codigo === user_by_id?.customer?.direccion?.departamento
      );
      return department?.codigo;
    }
    return;
  }, [user_by_id, cat_012_departamento.length]);

  useEffect(() => {
    getCat013Municipios(user_by_id?.customer?.direccion?.departamento || '0');
  }, [user_by_id]);

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  const { patchCustomer } = useCustomerStore();

  const onSubmit = async (payload: PayloadCustomer) => {
    const values = {
      ...payload,
      esContribuyente: 1,
    };

    if (isEditing && id && id !== '0') {
      await patchCustomer(values, parseInt(id));
    }
    navigate('/clients');
    await get_customer_by_id(parseInt(id || ''));
  };

  const selectedKeyTypeOfDocument = useMemo(() => {
    if (user_by_id) {
      const typeOfDocument = cat_022_tipo_de_documentoDeIde.find(
        (typeOfDocument) => typeOfDocument.codigo === user_by_id.customer.tipoDocumento
      );
      return typeOfDocument?.codigo;
    }
  }, [user_by_id, cat_022_tipo_de_documentoDeIde.length]);

  const selectedKeyCodActivity = useMemo(() => {
    if (user_by_id) {
      const codActivity = cat_019_codigo_de_actividad_economica.find(
        (codActivity) => codActivity.codigo === user_by_id.customer.codActividad
      );
      return codActivity?.codigo;
    }
  }, [user_by_id, cat_019_codigo_de_actividad_economica.length]);

  const navigate = useNavigate();

  return (
    <Layout title="Contribuyente">
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border  p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
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
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_022_tipo_de_documentoDeIde.find(
                                (dep) => dep.codigo === key
                              );
                              if (depSelected) {
                                setFieldValue('tipoDocumento', depSelected.codigo);
                                console.log('Tipo de documento seleccionado:', depSelected.codigo);
                              }
                            }
                          }}
                          onBlur={handleBlur('tipoDocumento')}
                          label="Tipo de documento"
                          placeholder="Selecciona el tipo de documento"
                          variant="bordered"
                          labelPlacement="outside"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          className="dark:text-white"
                          defaultSelectedKey={`${selectedKeyTypeOfDocument}`}
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
                            const depSelected = cat_019_codigo_de_actividad_economica.find(
                              (dep) => dep.codigo === key
                            );
                            if (depSelected) {
                              setFieldValue('codActividad', depSelected.codigo); // Actualiza el valor del código
                              setFieldValue('descActividad', depSelected.valores); // Actualiza el valor de la descripción

                              console.log('Código de actividad seleccionado:', depSelected.codigo); // Verifica el valor del código
                              console.log(
                                'Descripción de actividad seleccionada:',
                                depSelected.valores
                              ); // Verifica el valor de la descripción
                            }
                          }
                        }}
                        onBlur={handleBlur('codActividad')}
                        label="Actividad"
                        labelPlacement="outside"
                        placeholder="Selecciona la actividad"
                        defaultSelectedKey={`${selectedKeyCodActivity}`}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
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
                            const depSelected = cat_012_departamento.find(
                              (dep) => dep.codigo === key
                            );
                            console.log('Departamento seleccionado:', depSelected);
                            setSelectedCodeDep(depSelected?.codigo as string);
                            handleChange('departamento')(depSelected?.codigo as string);
                            handleChange('nombreDepartamento')(depSelected?.valores || '');
                            setFieldValue('municipio', '01');
                          }
                        }}
                        onBlur={handleBlur('departamento')}
                        label="Departamento"
                        labelPlacement="outside"
                        placeholder="Selecciona el departamento"
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white"
                        defaultSelectedKey={`${selectedKeyDepartment}`}
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
                            const munSelected = cat_013_municipios.find(
                              (mun) => mun.codigo === key
                            );
                            console.log('Municipio seleccionado:', munSelected);
                            setFieldValue('municipio', munSelected?.codigo);
                            setFieldValue('nombreMunicipio', munSelected?.valores);
                          }
                        }}
                        label="Municipio"
                        labelPlacement="outside"
                        className="dark:text-white"
                        variant="bordered"
                        placeholder="Selecciona el municipio"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        onBlur={handleBlur('municipio')}
                        selectedKey={`${values.municipio}`}
                      >
                        {cat_013_municipios.map((dep) => (
                          <AutocompleteItem
                            value={dep.id}
                            key={dep.codigo}
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
                        onSelectionChange={(key) => {
                          const selectedBranch = branch_list.find(
                            (branch) => branch.id.toString() === key
                          );
                          if (selectedBranch) {
                            console.log('Sucursal seleccionada:', selectedBranch.id);
                            setFieldValue('branchId', selectedBranch.id);
                          }
                        }}
                        onBlur={handleBlur('branchId')}
                        label="Sucursal"
                        labelPlacement="outside"
                        placeholder="Selecciona la sucursal"
                        variant="bordered"
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-sm',
                        }}
                        defaultSelectedKey={user_by_id?.customer.branch?.id.toString()}
                      >
                        {branch_list.map((bra) => (
                          <AutocompleteItem
                            className="dark:text-white"
                            value={bra.id.toString()}
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
