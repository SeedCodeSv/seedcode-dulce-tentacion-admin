import { isValidDUI } from '@avalontechsv/idsv';
import { Input, Autocomplete, AutocompleteItem, Textarea } from "@heroui/react";
import { Formik } from 'formik';
import {  useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { useBillingStore } from '../../store/facturation/billing.store';
import { useCustomerStore } from '../../store/customers.store';
import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';

import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id?: number;
  typeDocumento?: string;
}

function AddClientContributor(props: Props) {
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

  const services = useMemo(() => new SeedcodeCatalogosMhService(), [])

  const [activityName, setActivityName] = useState('')

  const cat_19 = useMemo(() => {

    return services.get019CodigoDeActividaEcono(activityName)
  }, [activityName])

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
      const codActivity = cat_19.find(
        (codActivity) => codActivity.codigo === user_by_id.customer.codActividad
      );

      return codActivity?.codigo;
    }
  }, [user_by_id, cat_19.length]);

  const navigate = useNavigate();

  return (
    <Layout title="Contribuyente">
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border  p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft />
            <span>Volver</span>
          </button>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
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
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Nombre"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Ingresa el nombre"
                        value={values.nombre}
                        variant="bordered"
                        onBlur={handleBlur('nombre')}
                        onChange={handleChange('nombre')}
                      />
                      {errors.nombre && touched.nombre && (
                        <span className="text-sm font-semibold text-red-500">{errors.nombre}</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Nombre comercial"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Ingresa el nombre comercial"
                        value={values.nombreComercial}
                        variant="bordered"
                        onBlur={handleBlur('nombreComercial')}
                        onChange={handleChange('nombreComercial')}
                      />
                      {errors.nombreComercial && touched.nombreComercial && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nombreComercial}
                        </span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Correo electrónico"
                        labelPlacement="outside"
                        name="correo"
                        placeholder="Ingresa el correo"
                        value={values.correo}
                        variant="bordered"
                        onBlur={handleBlur('correo')}
                        onChange={handleChange('correo')}
                      />
                      {errors.correo && touched.correo && (
                        <span className="text-sm font-semibold text-red-500">{errors.correo}</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Teléfono"
                        labelPlacement="outside"
                        name="telefono"
                        placeholder="Ingresa el telefono"
                        type="number"
                        value={values.telefono}
                        variant="bordered"
                        onBlur={handleBlur('telefono')}
                        onChange={handleChange('telefono')}
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
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultSelectedKey={`${selectedKeyTypeOfDocument}`}
                          label="Tipo de documento"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo de documento"
                          variant="bordered"
                          onBlur={handleBlur('tipoDocumento')}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_022_tipo_de_documentoDeIde.find(
                                (dep) => dep.codigo === key
                              );

                              if (depSelected) {
                                setFieldValue('tipoDocumento', depSelected.codigo);
                              }
                            }
                          }}
                        >
                          {cat_022_tipo_de_documentoDeIde.map((dep) => (
                            <AutocompleteItem
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
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Numero documento"
                        labelPlacement="outside"
                        name="numDocumento"
                        placeholder="Ingresa el numero documento"
                        type="text"
                        value={values.numDocumento}
                        variant="bordered"
                        onBlur={handleBlur('numDocumento')}
                        onChange={handleChange('numDocumento')}
                      />
                      {errors.numDocumento && touched.numDocumento && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.numDocumento}
                        </span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Autocomplete
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        defaultSelectedKey={`${selectedKeyCodActivity}`}
                        label="Actividad"
                        labelPlacement="outside"
                        placeholder="Selecciona la actividad"
                        variant="bordered"
                        onBlur={handleBlur('codActividad')}
                        onInputChange={(e) => setActivityName(e)}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = cat_019_codigo_de_actividad_economica.find(
                              (dep) => dep.codigo === key
                            );

                            if (depSelected) {
                              setFieldValue('codActividad', depSelected.codigo); // Actualiza el valor del código
                              setFieldValue('descActividad', depSelected.valores); // Actualiza el valor de la descripción
                            }
                          }
                        }}
                      >
                        {cat_19.map((dep) => (
                          <AutocompleteItem
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
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        defaultSelectedKey={`${selectedKeyDepartment}`}
                        label="Departamento"
                        labelPlacement="outside"
                        placeholder="Selecciona el departamento"
                        variant="bordered"
                        onBlur={handleBlur('departamento')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = cat_012_departamento.find(
                              (dep) => dep.codigo === key
                            );

                            setSelectedCodeDep(depSelected?.codigo as string);
                            handleChange('departamento')(depSelected?.codigo as string);
                            handleChange('nombreDepartamento')(depSelected?.valores || '');
                            setFieldValue('municipio', '01');
                          }
                        }}
                      >
                        {cat_012_departamento.map((dep) => (
                          <AutocompleteItem
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
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Municipio"
                        labelPlacement="outside"
                        placeholder="Selecciona el municipio"
                        selectedKey={`${values.municipio}`}
                        variant="bordered"
                        onBlur={handleBlur('municipio')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const munSelected = cat_013_municipios.find(
                              (mun) => mun.codigo === key
                            );

                            setFieldValue('municipio', munSelected?.codigo);
                            setFieldValue('nombreMunicipio', munSelected?.valores);
                          }
                        }}
                      >
                        {cat_013_municipios.map((dep) => (
                          <AutocompleteItem
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
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'min-h-[90px]',
                        }}
                        label="Complemento de dirección"
                        labelPlacement="outside"
                        name="complemento"
                        placeholder="Ingresa el complemento de dirección"
                        value={values.complemento}
                        variant="bordered"
                        onBlur={handleBlur('complemento')}
                        onChange={handleChange('complemento')}
                      />
                      {errors.complemento && touched.complemento && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.complemento}
                        </span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="NIT"
                        labelPlacement="outside"
                        name="nit"
                        placeholder="Ingresa el nit"
                        value={values.nit}
                        variant="bordered"
                        onBlur={handleBlur('nit')}
                        onChange={(e) =>
                          setFieldValue('nit', e.currentTarget.value.replace(/[^0-9]/g, ''))
                        }
                      />
                      {errors.nit && touched.nit && (
                        <span className="text-xs font-semibold text-red-500">{errors.nit}</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="NRC"
                        labelPlacement="outside"
                        name="nrc"
                        placeholder="Ingresa el nrc"
                        type="number"
                        value={values.nrc}
                        variant="bordered"
                        onBlur={handleBlur('nrc')}
                        onChange={handleChange('nrc')}
                      />
                      {errors.nrc && touched.nrc && (
                        <span className="text-xs font-semibold text-red-500">{errors.nrc}</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Autocomplete
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-sm',
                        }}
                        defaultSelectedKey={user_by_id?.customer.branch?.id.toString()}
                        label="Sucursal"
                        labelPlacement="outside"
                        placeholder="Selecciona la sucursal"
                        variant="bordered"
                        onBlur={handleBlur('branchId')}
                        onSelectionChange={(key) => {
                          const selectedBranch = branch_list.find(
                            (branch) => branch.id.toString() === key
                          );

                          if (selectedBranch) {
                            setFieldValue('branchId', selectedBranch.id);
                          }
                        }}
                      >
                        {branch_list.map((bra) => (
                          <AutocompleteItem
                            key={bra.id}
                            className="dark:text-white"
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
                  <ButtonUi
                    className="w-full font-semibold"
                    theme={Colors.Primary}
                    onPress={() => handleSubmit()}
                  >
                    Guardar
                  </ButtonUi>
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
