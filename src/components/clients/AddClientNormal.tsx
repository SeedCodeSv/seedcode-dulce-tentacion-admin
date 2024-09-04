import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { useCustomerStore } from '@/store/customers.store';
import { useBillingStore } from '@/store/facturation/billing.store';
import { useEffect, useRef, useState } from 'react';
import { PayloadCustomer } from '@/types/customers.types';
import { useNavigate, useParams } from 'react-router';
import { useViewsStore } from '@/store/views.store';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
import { Loader } from 'lucide-react';
import useGlobalStyles from '@/components/global/global.styles';
import { useBranchesStore } from '@/store/branches.store';

const AddClientNormal = () => {
  const { getBranchesList, branch_list } = useBranchesStore();
  useEffect(() => {
    getBranchesList();
  }, []);
  const { postCustomer, getCustomerById, customer, loading, patchCustomer } = useCustomerStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const styles = useGlobalStyles();
  const [selectedCodeDep, setSelectedCodeDep] = useState('0');
  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat022TipoDeDocumentoDeIde,
    cat_022_tipo_de_documentoDeIde,
  } = useBillingStore();

  useEffect(() => {
    getCustomerById(Number(id));
    getCat012Departamento();
  }, []);

  useEffect(() => {
    customer && getCat013Municipios(customer.direccion.departamento);
  }, [customer]);

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
    getCat022TipoDeDocumentoDeIde();
  }, [selectedCodeDep]);

  const initialValues = {
    nombre: customer?.nombre ?? '',
    correo: customer?.correo ?? '',
    telefono: customer?.telefono ?? '',
    numDocumento: customer?.numDocumento ?? '',
    municipio: customer?.direccion?.municipio ?? '',
    tipoDocumento: customer?.tipoDocumento ?? '',
    nombreMunicipio: customer?.direccion?.nombreMunicipio ?? '',
    departamento: customer?.direccion?.departamento ?? '',
    nombreDepartamento: customer?.direccion?.nombreDepartamento ?? '',
    complemento: customer?.direccion?.complemento ?? '',
    branchId: customer?.branch?.id,
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    tipoDocumento: yup.string(),
    numDocumento: yup
      .string()
      .notRequired()
      .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
        const { tipoDocumento } = this.parent;
        return tipoDocumento !== '';
      })
      .test('validar-documento', '**Número de documento no válido**', function (value) {
        const { tipoDocumento } = this.parent;

        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value || '');
        }

        if (tipoDocumento === '36') {
          return value ? value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value) : false;
        }

        return true;
      }),

    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string(),
    branchId: yup.number().required('**Debes seleccionar la sucursal**'),
  });

  const [isClicked, setIsClicked] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const onSubmit = (payload: PayloadCustomer) => {
    if (Number(id) > 0 || Number(id) !== 0) {
      const values = {
        ...payload,
        esContribuyente: 0,
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
        tipoDocumento: payload.tipoDocumento || 'N/A',
        numDocumento: payload.numDocumento || 'N/A',
        telefono: payload.telefono || 0,
        esContribuyente: 0,
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
  const { viewasAction } = useViewsStore();
  const viewClientNormal = viewasAction.find((action) => action.view.name === 'Clientes');
  const actions = viewClientNormal?.actions.name || ['Agregar'];
  return (
    <>
      {actions.includes('Agregar') ? (
        <div className=" dark:bg-gray-900">
          {loading ? (
            <strong>Cargando...</strong>
          ) : (
            <Formik
              initialValues={initialValues}
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
                validateForm,
              }) => (
                <>
                  <div className="">
                    <div className="pt-2">
                      <Input
                        label="Nombre"
                        labelPlacement="outside"
                        name="nombre"
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
                        isInvalid={!!errors.nombre && !!touched.nombre}
                      />
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
                          input: 'dark:text-white',
                          base: 'font-semibold',
                        }}
                        variant="bordered"
                        errorMessage={errors.correo}
                        isInvalid={!!errors.correo && !!touched.correo}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              setFieldValue('tipoDocumento', key as string);
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
                          isInvalid={!!errors.tipoDocumento && !!touched.tipoDocumento}
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
                      <div>
                        <Input
                          type="text"
                          label="Numero documento"
                          labelPlacement="outside"
                          name="numDocumento"
                          value={values.numDocumento}
                          onChange={({ currentTarget }) => {
                            setFieldValue(
                              'numDocumento',
                              currentTarget.value.replace(/[^0-9]/g, '')
                            );
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
                          isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 pt-3">
                      <div>
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = cat_012_departamento.find(
                                (dep) => dep.codigo === key
                              ) as Departamento;
                              setSelectedCodeDep(depSelected.codigo);
                              handleChange('departamento')(depSelected.codigo);
                              handleChange('nombreDepartamento')(depSelected.valores);

                              if (key === customer?.direccion.departamento) {
                                setFieldValue('municipio', customer?.direccion.municipio);
                                setFieldValue(
                                  'nombreMunicipio',
                                  customer?.direccion.nombreMunicipio
                                );
                              } else {
                                setFieldValue('municipio', cat_013_municipios[0].codigo);
                                setFieldValue('nombreMunicipio', cat_013_municipios[0].valores);
                              }
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
                          isInvalid={!!errors.departamento && !!touched.departamento}
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
                                (dep) => dep.codigo === key
                              ) as Municipio;
                              handleChange('municipio')(depSelected.codigo);
                              handleChange('nombreMunicipio')(depSelected.valores);
                            }
                          }}
                          onBlur={handleBlur('municipio')}
                          label="Municipio"
                          labelPlacement="outside"
                          className="dark:text-white"
                          placeholder={'Selecciona el municipio'}
                          variant="bordered"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          defaultSelectedKey={customer?.direccion?.municipio}
                          value={values.municipio}
                          errorMessage={errors.municipio}
                          isInvalid={!!errors.municipio && !!touched.municipio}
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
                      <div>
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
                          isInvalid={!!errors.telefono && !!touched.telefono}
                        />
                      </div>

                      <div>
                        <Autocomplete
                          value={values.branchId}
                          onSelectionChange={(key) => {
                            if (key) {
                              handleChange('branchId')(key as string);
                            }
                          }}
                          onBlur={handleBlur('branchId')}
                          label="Sucursal"
                          labelPlacement="outside"
                          placeholder={customer?.branch?.name ?? 'Selecciona la sucursal'}
                          variant="bordered"
                          className="dark:text-white font-semibold"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          errorMessage={errors.branchId}
                          defaultSelectedKey={customer?.branch?.name}
                          isInvalid={!!errors.branchId && !!touched.branchId}
                        >
                          {branch_list.map((bra) => (
                            <AutocompleteItem
                              className="dark:text-white"
                              value={bra.name}
                              key={bra.id.toString()}
                            >
                              {bra.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Textarea
                        label="Complemento de dirección"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'dark:text-white',
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
                        isInvalid={!!errors.complemento && !!touched.complemento}
                      />
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
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddClientNormal;
