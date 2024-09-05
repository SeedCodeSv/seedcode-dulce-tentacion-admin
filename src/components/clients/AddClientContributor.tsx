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
    branchId: customer?.branchId,
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
      .required('**Número de documento es requerido, no debe tener guiones**')
      .test('noSelectedTypeDocument', 'Debe seleccionar un tipo de documento', function () {
        const { tipoDocumento } = this.parent;
        return tipoDocumento !== '' ? true : false;
      })
      .test(
        'validar-documento',
        'Número de documento no válido, no debe tener guiones',
        function (value) {
          const { tipoDocumento } = this.parent;
          if (tipoDocumento === '13') {
            return /^([0-9]{9})$/.test(value);
          }
          if (tipoDocumento === '36') {
            return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
          }
          return true; // Si tipoDocumento no es relevante para validación, se considera válido
        }
      ),
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
    branchId: yup.number().required('**Debes seleccionar la sucursal**'),
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
                          handleChange('branchId')(key as string);
                        }
                      }}
                      onBlur={handleBlur('branchId')}
                      label="Sucursal"
                      labelPlacement="outside"
                      // placeholder="Selecciona la sucursal"
                      placeholder={customer?.branch?.name ?? 'Selecciona la sucursal'}
                      variant="bordered"
                      className="dark:text-white font-semibold"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      // selectedKey={}
                      // defaultSelectedKey={values.branchId}
                      defaultSelectedKey={customer?.branch?.name}
                      errorMessage={errors.branchId}
                      isInvalid={!!errors.branchId && !!touched.branchId}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          className="dark:text-white"
                          value={bra.id.toString()}
                          key={bra.id.toString()}
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
