import * as yup from 'yup';
import { Formik } from 'formik';
import { Autocomplete, AutocompleteItem, Input, Textarea } from "@heroui/react";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { useCustomerStore } from '../../store/customers.store';
import { useBillingStore } from '../../store/facturation/billing.store';


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

const UpdateClientNormal = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { get_customer_by_id, user_by_id, getCustomersPagination } = useCustomerStore();
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);

  const [initialValues, setInitialValues] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    numDocumento: '',
    municipio: '',
    tipoDocumento: '',
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
            correo: customer.customer.correo ?? '',
            telefono: customer.customer.telefono ?? '',
            numDocumento: customer.customer.numDocumento ?? '',
            tipoDocumento: customer.customer.tipoDocumento ?? '',
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
    // branchId: yup.number().required('**Campo requerido**').min(1, '**Campo requerido**'),
    nombre: yup.string().required('El nombre es requerido'),
    correo: yup.string().notRequired().email('El correo es inválido'),
    telefono: yup.string().notRequired(),
    numDocumento: yup.string().when('tipoDocumento', {
      is: (tipoDocumento: string | undefined) => tipoDocumento === '13' || tipoDocumento === '36',
      then: (schema) =>
        schema.required('El número de documento es requerido').test({
          name: 'documentValidation',
          message: 'El número de documento no es válido',
          test: (value, context) => {
            const { tipoDocumento } = context.parent;

            if (tipoDocumento === '13') {
              return /^[0-9]{9}$/.test(value || '');
            } else if (tipoDocumento === '36') {
              return /^[0-9]{14}$/.test(value || '');
            }

            return true;
          },
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
    departamento: yup.string().notRequired(),
    municipio: yup.string().notRequired(),
    complemento: yup.string().notRequired(),
  });

  const [selectedCodeDep, setSelectedCodeDep] = useState(
    props.customer_direction?.departamento ?? '0'
  );
  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat022TipoDeDocumentoDeIde,
    cat_022_tipo_de_documentoDeIde,
  } = useBillingStore();

  useEffect(() => {
    getCat012Departamento();
    getCat022TipoDeDocumentoDeIde();
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

  useEffect(() => {
    getCustomersPagination(1, 5, '', '', '', '', 1);
  }, []);

  const onSubmit = async (payload: PayloadCustomer) => {
    const finalPayload = {
      ...payload,
      correo: payload.correo || 'N/A@gmail.com',
      telefono: payload.telefono || '0',
      branchId: payload.branchId,
    };

    if (isEditing && id && id !== '0') {
      await patchCustomer(finalPayload, parseInt(id));
    }

    navigate('/clients');
    await get_customer_by_id(parseInt(id || ''));
  };

  const selectedKeyTypeOfDocument = useMemo(() => {
    if (user_by_id) {
      const typeOfDocument = cat_022_tipo_de_documentoDeIde.find(
        (typeOfDocument) => typeOfDocument.codigo === user_by_id?.customer?.tipoDocumento
      );

      return typeOfDocument?.codigo;
    }
  }, [user_by_id, cat_022_tipo_de_documentoDeIde.length]);

  const navigate = useNavigate();

  return (
    <Layout title="Cliente">
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button
            className="flex items-center gap-2 bg-transparent"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft />
            <span>Volver</span>
          </button>
          {user_by_id && (
            <Formik
              enableReinitialize={true}
              initialValues={{ ...initialValues }}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              {({
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <>
                  <div className="mt-10">
                    <div className="">
                      <Input
                        className="dark:text-white"
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
                    <div className="pt-3">
                      <Input
                        className="dark:text-white"
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
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div className="pt-2">
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
                      <div className="mt-2">
                        <Input
                          className="dark:text-white"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          label="Numero documento"
                          labelPlacement="outside"
                          name="numDocumento"
                          placeholder="Ingresa el número de documento"
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
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
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
                      <div>
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
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
                        <Input
                          className="dark:text-white"
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
                      <div>
                        <Autocomplete
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
                          defaultSelectedKey={user_by_id?.customer?.branch?.id.toString()}
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
                              setFieldValue('branchId', selectedBranch.id); // Actualiza branchId directamente con el ID numérico
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
                    <div className="pt-2">
                      <Textarea
                        className="dark:text-white"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Complemento"
                        labelPlacement="outside"
                        name="Complemento"
                        placeholder="Ingresa el complemento de la dirección"
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
                    <ButtonUi
                      className="w-full mt-4 text-sm font-semibold"
                      theme={Colors.Primary}
                      onPress={() => handleSubmit()}
                    >
                      Guardar
                    </ButtonUi>
                  </div>
                </>
              )}
            </Formik>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateClientNormal;
