import { Input, Autocomplete, AutocompleteItem, Textarea } from "@heroui/react";
import { Formik } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router';
import { Loader } from 'lucide-react';

import { useBillingStore } from '@/store/facturation/billing.store';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { CodigoActividadEconomica } from '@/types/billing/cat-019-codigo-de-actividad-economica.types';
import { useCustomerStore } from '@/store/customers.store';
import { PayloadCustomer } from '@/types/customers.types';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

function AddClientContributor() {
  const { getBranchesList, branch_list } = useBranchesStore();

  useEffect(() => {
    getBranchesList();
  }, []);
  const navigate = useNavigate();
  const { postCustomer, patchCustomer, customer, getCustomerById, loading } = useCustomerStore();

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
      .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
        const { tipoDocumento } = this.parent;

        return tipoDocumento !== '' ? true : false;
      })
      .test('validar-documento', '**Número de documento no válido**', function (value) {
        const { tipoDocumento } = this.parent;

        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value!);
        }
        if (tipoDocumento === '36') {
          return value!.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value!);
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
    <div className="">
      {loading ? (
        <strong>Cargando...</strong>
      ) : (
        <Formik
          initialValues={initialValues}
          validationOnMount={false}
          validationSchema={validationSchema}
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
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.nombre}
                      isInvalid={!!errors.nombre && touched.nombre}
                      label="Nombre"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Ingresa el nombre"
                      value={values.nombre}
                      variant="bordered"
                      onBlur={handleBlur('nombre')}
                      onChange={handleChange('nombre')}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.nombreComercial}
                      isInvalid={!!errors.nombreComercial && touched.nombreComercial}
                      label="Nombre comercial"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Ingresa el nombre comercial"
                      value={values.nombreComercial}
                      variant="bordered"
                      onBlur={handleBlur('nombreComercial')}
                      onChange={handleChange('nombreComercial')}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.correo}
                      isInvalid={!!errors.correo && touched.correo}
                      label="Correo electrónico"
                      labelPlacement="outside"
                      name="correo"
                      placeholder="Ingresa el correo"
                      value={values.correo}
                      variant="bordered"
                      onBlur={handleBlur('correo')}
                      onChange={handleChange('correo')}
                    />
                  </div>
                  {/* Tipo de documento */}
                  <div className="pt-2">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      errorMessage={errors.tipoDocumento}
                      isInvalid={!!errors.tipoDocumento && touched.tipoDocumento}
                      label="Tipo de documento"
                      labelPlacement="outside"
                      placeholder="Selecciona el tipo de documento"
                      selectedKey={values.tipoDocumento}
                      variant="bordered"
                      onBlur={handleBlur('tipoDocumento')}
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_022_tipo_de_documentoDeIde.find(
                            (dep) => dep.codigo === key
                          );

                          setFieldValue('tipoDocumento', depSelected?.codigo);
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

                  <div className="pt-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.numDocumento}
                      isInvalid={!!errors.numDocumento && touched.numDocumento}
                      label="Numero documento"
                      labelPlacement="outside"
                      name="numDocumento"
                      placeholder="Ingresa el numero documento"
                      type="text"
                      value={values.numDocumento}
                      variant="bordered"
                      onBlur={handleBlur('numDocumento')}
                      onChange={({ currentTarget }) => {
                        setFieldValue('numDocumento', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.nit}
                      isInvalid={!!errors.nit && touched.nit}
                      label="NIT"
                      labelPlacement="outside"
                      name="nit"
                      placeholder="Ingresa el nit"
                      value={values.nit}
                      variant="bordered"
                      onBlur={handleBlur('nit')}
                      onChange={({ currentTarget }) => {
                        setFieldValue('nit', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.nrc}
                      isInvalid={!!errors.nrc && touched.nrc}
                      label="NRC"
                      labelPlacement="outside"
                      name="nrc"
                      placeholder="Ingresa el nrc"
                      value={values.nrc}
                      variant="bordered"
                      onBlur={handleBlur('nrc')}
                      onChange={({ currentTarget }) => {
                        setFieldValue('nrc', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                    />
                  </div>
                  <div className="pt-2">
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.telefono}
                      isInvalid={!!errors.telefono && touched.telefono}
                      label="Teléfono"
                      labelPlacement="outside"
                      name="telefono"
                      placeholder="Ingresa el telefono"
                      type="number"
                      value={values.telefono}
                      variant="bordered"
                      onBlur={handleBlur('telefono')}
                      onChange={({ currentTarget }) => {
                        setFieldValue('telefono', currentTarget.value.replace(/[^0-9]/g, ''));
                      }}
                    />
                  </div>
                  <div className="pt-2">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      errorMessage={errors.codActividad}
                      isInvalid={!!errors.codActividad && touched.codActividad}
                      label="Actividad"
                      labelPlacement="outside"
                      placeholder={'Selecciona la actividad'}
                      selectedKey={values.codActividad}
                      value={selectedKeyCodActivity}
                      variant="bordered"
                      onBlur={handleBlur('codActividad')}
                      onInputChange={(e) => handleFilter(e)}
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_019_codigo_de_actividad_economica.find(
                            (dep) => dep.codigo === (key as string)
                          ) as CodigoActividadEconomica;

                          setFieldValue('codActividad', depSelected.codigo);
                          setFieldValue('descActividad', depSelected.valores);
                        }
                      }}
                    >
                      {cat_019_codigo_de_actividad_economica.map((dep) => (
                        <AutocompleteItem
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
                      className="dark:text-white font-semibold"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      defaultSelectedKey={customer?.branch?.name}
                      errorMessage={errors.branchId}
                      isInvalid={!!errors.branchId && !!touched.branchId}
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder={customer?.branch?.name ?? 'Selecciona la sucursal'}
                      value={values.branchId}
                      variant="bordered"
                      onBlur={handleBlur('branchId')}
                      onSelectionChange={(key) => {
                        if (key) {
                          handleChange('branchId')(key as string);
                        }
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          key={bra.id.toString()}
                          className="dark:text-white"
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
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      errorMessage={errors.departamento}
                      isInvalid={!!errors.departamento && touched.departamento}
                      label="Departamento"
                      labelPlacement="outside"
                      placeholder={'Selecciona el departamento'}
                      selectedKey={values.departamento}
                      variant="bordered"
                      onBlur={handleBlur('departamento')}
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
                  </div>
                  <div>
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      errorMessage={errors.municipio}
                      isInvalid={!!errors.municipio && touched.municipio}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder={'Selecciona el municipio'}
                      selectedKey={values.municipio}
                      variant="bordered"
                      onBlur={handleBlur('municipio')}
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = cat_013_municipios.find(
                            (dep) => dep.codigo === (key as string)
                          ) as Departamento;

                          handleChange('municipio')(depSelected.codigo);
                          handleChange('nombreMunicipio')(depSelected.valores);
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
                  </div>

                  <div className="pt-2 md:col-span-2">
                    <Textarea
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'min-h-[90px] dark:text-white',
                        base: 'font-semibold',
                      }}
                      errorMessage={errors.complemento}
                      isInvalid={!!errors.complemento && touched.complemento}
                      label="Complemento de dirección"
                      labelPlacement="outside"
                      name="complemento"
                      placeholder="Ingresa el complemento de dirección"
                      value={values.complemento}
                      variant="bordered"
                      onBlur={handleBlur('complemento')}
                      onChange={handleChange('complemento')}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end mt-5">
                <div className="pt-4 w-full flex justify-end">
                  {isClicked ? (
                    <div className="mt-4 flex justify-center items-center">
                      <Loader className="animate-spin dark:text-white" size={35} />
                    </div>
                  ) : (
                    <ButtonUi
                      ref={button}
                      className="w-full md:w-96 font-semibold"
                      theme={Colors.Primary}
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
                    >
                      Guardar
                    </ButtonUi>
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
