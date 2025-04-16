import { useEffect, useState } from 'react';
import { useBillingStore } from '../../store/facturation/billing.store';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react';
import { global_styles } from '../../styles/global.styles';
import { useSupplierStore } from '../../store/supplier.store';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { Formik, Form } from 'formik';
import { supplierSchemaNormal } from './types/validation_supplier_yup.types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { SelectedItem } from './select-account';
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
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    const transId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;
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
    <Layout title="Nuevo Consumidor Final">
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
          transmitterId:
            user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
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
              <div onClick={() => navigate(-1)} className="w-32  flex gap-2 mb-4 cursor-pointer">
                <ArrowLeft className="dark:text-white" size={20} />
                <p className="dark:text-white">Regresar</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-5 pt-3">
                <div>
                  <Input
                    onBlur={handleBlur}
                    label="Nombre"
                    onChange={handleChange}
                    labelPlacement="outside"
                    name="nombre"
                    className="dark:text-white font-semibold"
                    placeholder="Ingresa el nombre"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    isInvalid={touched.nombre && !!errors.nombre}
                    errorMessage={touched.nombre && errors.nombre}
                    variant="bordered"
                  />
                </div>
                <div>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="dark:text-white font-semibold"
                    label="Correo electrónico"
                    labelPlacement="outside"
                    name="correo"
                    isInvalid={touched.correo && !!errors.correo}
                    errorMessage={touched.correo && errors.correo}
                    placeholder="Ingresa el correo"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    variant="bordered"
                  />
                </div>

                <div>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    className="dark:text-white font-semibold"
                    label="Teléfono"
                    labelPlacement="outside"
                    name="telefono"
                    placeholder="Ingresa el telefono"
                    classNames={{
                      label: 'text-gray-500 text-sm font-semibold',
                    }}
                    isInvalid={touched.telefono && !!errors.telefono}
                    errorMessage={touched.telefono && errors.telefono}
                    variant="bordered"
                  />
                </div>

                <div>
                  <Autocomplete
                    onBlur={handleBlur}
                    label="Tipo de documento"
                    labelPlacement="outside"
                    onSelectionChange={(value) => {
                      const selectedTypeDocument = cat_022_tipo_de_documentoDeIde.find(
                        (dep) => dep.codigo === new Set([value]).values().next().value
                      );
                      if (selectedTypeDocument) {
                        setFieldValue('tipoDocumento', selectedTypeDocument.codigo);
                      }
                    }}
                    placeholder={'Selecciona el tipo de documento'}
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    isInvalid={touched.tipoDocumento && !!errors.tipoDocumento}
                    errorMessage={touched.tipoDocumento && errors.tipoDocumento}
                    className="dark:text-white font-semibold"
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
                    variant="bordered"
                    label="Cuenta"
                    labelPlacement="outside"
                    className="w-full"
                  />
                  <SelectedItem
                    code={values.codCuenta}
                    setCode={(value) => setFieldValue('codCuenta', value)}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    label="Numero documento"
                    labelPlacement="outside"
                    name="numDocumento"
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
                    isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                  />
                </div>
                <div>
                  <Autocomplete
                    onBlur={handleBlur}
                    label="Departamento"
                    labelPlacement="outside"
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
                    placeholder="Selecciona el departamento"
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    isInvalid={touched.departamento && !!errors.departamento}
                    errorMessage={touched.departamento && errors.departamento}
                    className="dark:text-white font-semibold"
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
                    label="Municipio"
                    labelPlacement="outside"
                    placeholder="Selecciona el municipio"
                    className="dark:text-white font-semibold"
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    isInvalid={touched.municipio && !!errors.municipio}
                    errorMessage={touched.municipio && errors.municipio}
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
                  onChange={handleChange}
                  label="Complemento de dirección"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  errorMessage={errors.complemento}
                  isInvalid={!!errors.complemento && !!touched.complemento}
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Ingresa el complemento de dirección"
                  name="complemento"
                  className="dark:text-white font-semibold"
                />
              </div>
              <div className="flex gap-4 justify-end w-full">
                <Button
                  type="submit"
                  className="mt-4 px-20 text-sm font-semibold"
                  style={global_styles().dangerStyles}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="mt-4 px-20 text-sm font-semibold"
                  style={global_styles().darkStyle}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default AddNormalSupplier;
