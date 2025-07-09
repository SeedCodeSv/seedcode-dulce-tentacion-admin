import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Formik, Form } from 'formik';

import { useBillingStore } from '../../store/facturation/billing.store';
import { global_styles } from '../../styles/global.styles';
import { useSupplierStore } from '../../store/supplier.store';

import { supplierSchemaNormal } from './types/validation_supplier_yup.types';
import { SelectedItem } from './select-account';

import { useAuthStore } from '@/store/auth.store';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import useWindowSize from '@/hooks/useWindowSize';

function AddNormalSupplier() {
  const [selectedCodeDep, setSelectedCodeDep] = useState('');
  const {
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    cat_012_departamento,
    getCat013Municipios,
    cat_022_tipo_de_documentoDeIde,
    cat_013_municipios,
  } = useBillingStore();

  const { getAccountCatalogs } = useAccountCatalogsStore();
  const { user } = useAuthStore();
  const { windowSize } = useWindowSize()

  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    const transId = user?.pointOfSale.branch.transmitter.id ?? 0

    getAccountCatalogs(transId, '', '');
  }, []);
  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  const { onPostSupplier } = useSupplierStore();
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          nombre: '',
          nombreComercial: '',
          correo: '',
          telefono: '',
          numDocumento: '',
          nit: '',
          tipoDocumento: '',
          bienTitulo: '',
          codActividad: '',
          esContribuyente: 0,
          descActividad: '',
          municipio: '',
          departamento: '',
          complemento: '',
          codCuenta: '',
          transmitterId: user?.pointOfSale.branch.transmitter.id ?? 0,
        }}
        validationSchema={supplierSchemaNormal}
        onSubmit={(values, { setSubmitting }) => {
          try {
            onPostSupplier(values);
            navigate(-1);
          } catch (error) {
            return;
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleChange, handleBlur, setFieldValue, values, getFieldProps }) => (
          <Form className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
              <button className="w-32  flex gap-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
                <ArrowLeft className="dark:text-white" size={20} />
                <p className="dark:text-white">Regresar</p>
              </button>

              <div className="grid lg:grid-cols-2 gap-5 pt-3">
                <div>
                  <Input
                    className="dark:text-white font-semibold"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    errorMessage={touched.nombre && errors.nombre}
                    isInvalid={touched.nombre && !!errors.nombre}
                    label="Nombre"
                    labelPlacement="outside"
                    name="nombre"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Input
                    className="dark:text-white font-semibold"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    errorMessage={touched.correo && errors.correo}
                    isInvalid={touched.correo && !!errors.correo}
                    label="Correo electrónico"
                    labelPlacement="outside"
                    name="correo"
                    placeholder="Ingresa el correo"
                    variant="bordered"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Input
                    className="dark:text-white font-semibold"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    errorMessage={touched.telefono && errors.telefono}
                    isInvalid={touched.telefono && !!errors.telefono}
                    label="Teléfono"
                    labelPlacement="outside"
                    name="telefono"
                    placeholder="Ingresa el telefono"
                    type="number"
                    variant="bordered"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Autocomplete
                    className="dark:text-white font-semibold"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={touched.tipoDocumento && errors.tipoDocumento}
                    isInvalid={touched.tipoDocumento && !!errors.tipoDocumento}
                    label="Tipo de documento"
                    labelPlacement="outside"
                    placeholder={'Selecciona el tipo de documento'}
                    variant="bordered"
                    onBlur={handleBlur}
                    onSelectionChange={(value) => {
                      const selectedTypeDocument = cat_022_tipo_de_documentoDeIde.find(
                        (dep) => dep.codigo === new Set([value]).values().next().value
                      );

                      if (selectedTypeDocument) {
                        setFieldValue('tipoDocumento', selectedTypeDocument.codigo);
                      }
                    }}
                  >
                    {cat_022_tipo_de_documentoDeIde.map((dep) => (
                      <AutocompleteItem key={dep.codigo} className="dark:text-white">
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="w-full flex items-end gap-2">
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    placeholder="Ingresa el código de la cuenta"
                    {...getFieldProps('codCuenta')}
                    className="w-full"
                    label="Cuenta"
                    labelPlacement="outside"
                    variant="bordered"
                  />
                  <SelectedItem
                    code={values.codCuenta}
                    setCode={(value) => setFieldValue('codCuenta', value)}
                  />
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                      input: 'dark:text-white',
                      base: 'font-semibold',
                    }}
                    errorMessage={errors.numDocumento}
                    isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                    label="Numero documento"
                    labelPlacement="outside"
                    name="numDocumento"
                    placeholder="Ingresa el numero documento"
                    type="text"
                    variant="bordered"
                    onBlur={handleBlur('numDocumento')}
                    onChange={({ currentTarget }) => {
                      setFieldValue('numDocumento', currentTarget.value.replace(/[^0-9]/g, ''));
                    }}
                  />
                </div>
                <div>
                  <Autocomplete
                    className="dark:text-white font-semibold"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={touched.departamento && errors.departamento}
                    isInvalid={touched.departamento && !!errors.departamento}
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder="Selecciona el departamento"
                    variant="bordered"
                    onBlur={handleBlur}
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = cat_012_departamento.find(
                          (dep) => dep.codigo === new Set([key]).values().next().value
                        );

                        setSelectedCodeDep(depSelected?.codigo as string);
                        handleChange('departamento')(depSelected?.codigo as string);
                        handleChange('nombreDepartamento')(depSelected?.valores || '');
                      }
                    }}
                  >
                    {cat_012_departamento.map((dep) => (
                      <AutocompleteItem key={dep.codigo} className="dark:text-white">
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div>
                  <Autocomplete
                    className="dark:text-white font-semibold"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={touched.municipio && errors.municipio}
                    isInvalid={touched.municipio && !!errors.municipio}
                    label="Municipio"
                    labelPlacement="outside"
                    placeholder="Selecciona el municipio"
                    variant="bordered"
                    onBlur={handleBlur}
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = cat_013_municipios.find(
                          (dep) => dep.codigo === new Set([key]).values().next().value
                        );

                        handleChange('municipio')(depSelected?.codigo as string);
                        handleChange('nombreMunicipio')(depSelected?.valores || '');
                      }
                    }}
                  >
                    {cat_013_municipios.map((dep) => (
                      <AutocompleteItem key={dep.codigo} className="dark:text-white">
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>

              <div className="grid xl:grid-cols-1 gap-5 pt-3">
                <Textarea
                  className="dark:text-white font-semibold"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  errorMessage={errors.complemento}
                  isInvalid={!!errors.complemento && !!touched.complemento}
                  label="Complemento de dirección"
                  labelPlacement="outside"
                  name="complemento"
                  placeholder="Ingresa el complemento de dirección"
                  variant="bordered"
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4 justify-end w-full">
                {/* <Button
                  className="mt-4 px-20 text-sm font-semibold"
                  style={global_styles().dangerStyles}
                  type="submit"
                >
                  Cancelar
                </Button> */}

                <Button
                  className={`${windowSize.width < 768 ? 'w-full font-semibold mt-4' : 'mt-4 px-20 text-sm font-semibold"'}`}
                  style={global_styles().dangerStyles}
                  type="submit"
                >
                  Cancelar
                </Button>
                <Button
                  className="mt-4 px-20 text-sm font-semibold"
                  style={global_styles().darkStyle}
                  type="submit"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default AddNormalSupplier;
