import * as yup from 'yup';
import { Formik } from 'formik';
import { CustomerDirection, PayloadCustomer } from '../../types/customers.types';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { useCustomerStore } from '../../store/customers.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Municipio } from '../../types/billing/cat-013-municipio.types';
import { Departamento } from '../../types/billing/cat-012-departamento.types';
import { ThemeContext } from '../../hooks/useTheme';
import { ITipoDocumento } from '@/types/DTE/tipo_documento.types';
import Layout from '@/layout/Layout';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useBranchesStore } from '@/store/branches.store';
import { Branch } from '@/types/auth.types';

interface Props {
  customer?: PayloadCustomer;
  customer_direction?: CustomerDirection;
  id?: number;
  typeDocumento?: string;
}

const UpdateClientNormal = (props: Props) => {
  console.log('props', props.customer_direction);
  console.log('props', props.typeDocumento);
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
    branchId: yup
      .number()
      .typeError('La sucursal es requerida')
      .required('La sucursal es requerida')
      .min(1, 'Selecciona una sucursal válida'),
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
    if (selectedKeyDepartment) {
      getCat013Municipios(selectedKeyDepartment);
    }
  }, [selectedKeyDepartment]);

  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
  }, [selectedCodeDep]);

  const { patchCustomer } = useCustomerStore();

  const onSubmit = async (payload: PayloadCustomer) => {
    const finalPayload = {
      ...payload,
      correo: payload.correo || 'N/A@gmail.com',
      telefono: payload.telefono || '0',
      numDocumento: payload.numDocumento || '0',
      municipio: payload.CustomerDirection?.municipio || 'N/A',
      tipoDocumento: payload.tipoDocumento || 'N/A',
      nombreMunicipio: payload.CustomerDirection?.nombreMunicipio || 'N/A',
      departamento: payload.CustomerDirection?.departamento || 'N/A',
      nombreDepartamento: payload.CustomerDirection?.nombreDepartamento || 'N/A',
      complemento: payload.CustomerDirection?.complemento || 'N/A',
      branchId: payload.branchId,
    };

    if (isEditing && id && id !== '0') {
      await patchCustomer(finalPayload, parseInt(id));
    }

    navigate('/clients');
  };

  console.log(selectedKeyDepartment);

  const selectedKeyCity = useMemo(() => {
    if (user_by_id) {
      const city = cat_013_municipios.find(
        (department) => department.codigo === user_by_id.direccion.municipio
      );
      return city?.codigo;
    }
  }, [user_by_id, cat_013_municipios.length, selectedKeyDepartment]);

  console.log(selectedKeyCity);

  const selectedKeyTypeOfDocument = useMemo(() => {
    if (user_by_id) {
      const typeOfDocument = cat_022_tipo_de_documentoDeIde.find(
        (typeOfDocument) => typeOfDocument.codigo === user_by_id.tipoDocumento
      );
      return typeOfDocument?.codigo;
    }
  }, [user_by_id, cat_022_tipo_de_documentoDeIde.length]);

  console.log(selectedKeyTypeOfDocument);

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
              // validateOnMount={false}
              // validateOnBlur={false}
              enableReinitialize={true}
            >
              {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
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
                              const depSelected = JSON.parse(key as string) as ITipoDocumento;
                              handleChange('tipoDocumento')(depSelected.codigo);
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
                              const depSelected = JSON.parse(key as string) as Municipio;
                              setSelectedCodeDep(depSelected.codigo);
                              handleChange('departamento')(depSelected.codigo);
                              handleChange('nombreDepartamento')(depSelected.valores);
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
                        {selectedKeyCity && (
                          <Autocomplete
                            onSelectionChange={(key) => {
                              if (key) {
                                const depSelected = JSON.parse(key as string) as Departamento;
                                handleChange('municipio')(depSelected.codigo);
                                handleChange('nombreMunicipio')(depSelected.valores);
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
                            defaultSelectedKey={`${selectedKeyCity}`}
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
                        )}
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
                        <Autocomplete
                          value={values.branchId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as Branch;
                              handleChange('branchId')(depSelected?.id?.toString() ?? '');
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
