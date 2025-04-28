import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Formik, Form } from 'formik';
import { toast } from 'sonner';

import { global_styles } from '../../styles/global.styles';
import { useBillingStore } from '../../store/facturation/billing.store';

import { supplierSchemaContribuyente } from './types/validation_supplier_yup.types';
import { SelectedItem } from './select-account';

import { useSupplierStore } from '@/store/supplier.store';
import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useAuthStore } from '@/store/auth.store';
function AddTributeSupplier() {
  const { getAccountCatalogs } = useAccountCatalogsStore();

  const [selectedCodeDep, setSelectedCodeDep] = useState('');
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

  const { user } = useAuthStore();

  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    getCat019CodigoActividadEconomica();
    const transId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

    getAccountCatalogs(transId, '', '');
  }, []);
  const { onPostSupplier } = useSupplierStore();

  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const navigate = useNavigate();

  return (
    <Layout title="Nuevo Contribuyente">
      <Formik
        initialValues={{
          nombre: '',
          nombreComercial: '',
          correo: '',
          telefono: '',
          numDocumento: '',
          nit: '',
          nrc: '',
          tipoDocumento: '',
          bienTitulo: '',
          codActividad: '',
          esContribuyente: 1,
          descActividad: '',
          municipio: '',
          departamento: '',
          complemento: '',
          codCuenta: '',
          transmitterId:
            user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
        }}
        validationSchema={supplierSchemaContribuyente}
        onSubmit={(values, { setSubmitting }) => {
          try {
            onPostSupplier(values);
            navigate(-1);
          } catch {
            toast.error('Error al crear el proveedor');
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
              <Card>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Input
                        className="dark:text-white font-bold"
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
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
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
                    <div>
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                          input: 'dark:text-white',
                          base: 'font-semibold',
                        }}
                        errorMessage={errors.numDocumento}
                        isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                        label="Número documento"
                        labelPlacement="outside"
                        name="numDocumento"
                        placeholder="Ingresa el número documento"
                        type="text"
                        variant="bordered"
                        onBlur={handleBlur('numDocumento')}
                        onChange={({ currentTarget }) => {
                          setFieldValue('numDocumento', currentTarget.value.replace(/[^0-9]/g, ''));
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        errorMessage={touched.nombreComercial && errors.nombreComercial}
                        isInvalid={touched.nombreComercial && !!errors.nombreComercial}
                        label="Nombre comercial"
                        labelPlacement="outside"
                        name="nombreComercial"
                        placeholder="Ingresa el nombre comercial"
                        variant="bordered"
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        errorMessage={touched.nit && errors.nit}
                        isInvalid={touched.nit && !!errors.nit}
                        label="NIT"
                        labelPlacement="outside"
                        name="nit"
                        placeholder="Ingresa su número de nit sin guiones"
                        variant="bordered"
                        onBlur={handleBlur('nit')}
                        onChange={handleChange('nit')}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        errorMessage={touched.nrc && errors.nrc}
                        isInvalid={touched.nrc && !!errors.nrc}
                        label="NRC"
                        labelPlacement="outside"
                        name="nrc"
                        placeholder="Ingresa el número de NRC"
                        type="number"
                        variant="bordered"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full">
                      <Autocomplete
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        errorMessage={touched.descActividad && errors.descActividad}
                        isInvalid={touched.descActividad && !!errors.descActividad}
                        label="Actividad"
                        labelPlacement="outside"
                        placeholder="Ingresa la actividad"
                        variant="bordered"
                        onInputChange={(text) => getCat019CodigoActividadEconomica(text)}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = cat_019_codigo_de_actividad_economica.find(
                              (dep) => dep.codigo === new Set([key]).values().next().value
                            );

                            handleChange('codActividad')(depSelected?.codigo as string);
                            handleChange('descActividad')(depSelected?.valores || '');
                          }
                        }}
                      >
                        {cat_019_codigo_de_actividad_economica.map((dep) => (
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
                  </div>
                </CardBody>
              </Card>
              <Card className="mt-4">
                <CardHeader>
                  <h1 className="text-xl font-semibold dark:text-white">Dirección</h1>
                </CardHeader>
                <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Autocomplete
                      className="dark:text-white"
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
                      className="dark:text-white"
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
                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      className="dark:text-white"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'max-h-[90px]',
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
                </CardBody>
                <CardFooter className="w-full grid grid-cols-2">
                  <div />
                  <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4">
                    <Button
                      className="w-full font-semibold"
                      style={global_styles().dangerStyles}
                      type="submit"
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="w-full font-semibold"
                      style={global_styles().darkStyle}
                      type="submit"
                    >
                      Guardar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              <div />
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default AddTributeSupplier;
