import * as yup from 'yup';
import { Formik } from 'formik';
import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { useCustomerStore } from '../../store/customers.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import Layout from '@/layout/Layout';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useBranchesStore } from '@/store/branches.store';
// import { Branch } from '@/types/auth.types';

interface Props {
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id?: number;
  typeDocumento?: string;
}

const UpdateClientNormal = (props: Props) => {
  const { theme } = useContext(ThemeContext);
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
            nombre: customer.nombre ?? '',
            correo: customer.correo ?? '',
            telefono: customer.telefono ?? '',
            numDocumento: customer.numDocumento ?? '',
            tipoDocumento: customer.tipoDocumento ?? '',
            municipio: customer.direccion.municipio ?? '',
            nombreMunicipio: customer.direccion.nombreMunicipio ?? '',
            departamento: customer.direccion.departamento ?? '',
            nombreDepartamento: customer.direccion.nombreDepartamento ?? '',
            complemento: customer.direccion.complemento ?? '',
            branchId: customer.branchId ?? 0,
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
        (department) => department.codigo === user_by_id.direccion.departamento
      );
      return department?.codigo;
    }
    return;
  }, [user_by_id, cat_012_departamento.length]);

  useEffect(() => {
    getCat013Municipios(user_by_id?.direccion.departamento || '0');
  }, [user_by_id]);

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  const { patchCustomer } = useCustomerStore();

  useEffect(() => {
    getCustomersPagination(1, 5, '', '', '', '', 1);
  }, []);

  const onSubmit = async (payload: PayloadCustomer) => {
    console.log('Tipo dedocumento seleccionado:', payload.tipoDocumento);
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
        (typeOfDocument) => typeOfDocument.codigo === user_by_id.tipoDocumento
      );
      return typeOfDocument?.codigo;
    }
  }, [user_by_id, cat_022_tipo_de_documentoDeIde.length]);

  const navigate = useNavigate();
  return (
    <Layout title="Cliente">
      <div className="w-full h-full p-4 md:p-10 md:px-12">
        <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft />
            <span>Volver</span>
          </button>
          {user_by_id && (
            <Formik
              initialValues={{ ...initialValues }}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
              enableReinitialize={true}
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
                    <div className="pt-3">
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
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div className="pt-2">
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_022_tipo_de_documentoDeIde.find(
                                (dep) => dep.codigo === key
                              );
                              if (depSelected) {
                                setFieldValue('tipoDocumento', depSelected.codigo); // Actualiza el valor de tipoDocumento
                                console.log('Tipo de documento seleccionado:', depSelected.codigo); // Verifica el valor
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
                      <div className="mt-2">
                        <Input
                          type="text"
                          label="Numero documento"
                          labelPlacement="outside"
                          name="numDocumento"
                          value={values.numDocumento}
                          onChange={handleChange('numDocumento')}
                          onBlur={handleBlur('numDocumento')}
                          placeholder="Ingresa el número de documento"
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
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
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
                      <div>
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
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
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
                      <div>
                        {/* <Autocomplete

                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as Branch;
                              handleChange('branchId')(depSelected?.id?.toString() ?? '');
                              console.log('Sucursal seleccionada:', depSelected);
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
                          defaultSelectedKey={user_by_id.branch.id.toString()}
                        >
                          {branch_list.map((bra) => (
                            <AutocompleteItem
                              className="dark:text-white"
                              value={bra.id}
                              key={bra.id}
                            >
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete> */}

                        <Autocomplete
                          onSelectionChange={(key) => {
                            const selectedBranch = branch_list.find(
                              (branch) => branch.id.toString() === key
                            );
                            if (selectedBranch) {
                              console.log('Sucursal seleccionada:', selectedBranch.id); // Verifica el ID seleccionado
                              setFieldValue('branchId', selectedBranch.id); // Actualiza branchId directamente con el ID numérico
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
                          defaultSelectedKey={user_by_id?.branch?.id.toString()}
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
                    <div className="pt-2">
                      <Textarea
                        label="Complemento"
                        labelPlacement="outside"
                        name="Complemento"
                        value={values.complemento}
                        onChange={handleChange('complemento')}
                        onBlur={handleBlur('complemento')}
                        placeholder="Ingresa el complemento de la dirección"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                      {errors.complemento && touched.complemento && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.complemento}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSubmit()}
                      className="w-full mt-4 text-sm font-semibold"
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateClientNormal;
