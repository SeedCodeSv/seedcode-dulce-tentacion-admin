import { useBillingStore } from '../../store/facturation/billing.store';
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
} from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { get_user } from '../../storage/localStorage';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSupplierStore } from '@/store/supplier.store';
import { Formik, Form } from 'formik';
import { supplierSchemaContribuyente } from './types/validation_supplier_yup.types';
import { toast } from 'sonner';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { SelectedItem } from './select-account';
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
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    getCat019CodigoActividadEconomica();

    getAccountCatalogs('', '');
  }, []);
  const { onPostSupplier } = useSupplierStore();
  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const user = get_user();
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
              <div onClick={() => navigate(-1)} className="w-32  flex gap-2 mb-4 cursor-pointer">
                <ArrowLeft className="dark:text-white" size={20} />
                <p className="dark:text-white">Regresar</p>
              </div>
              <Card>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Input
                        onChange={handleChange}
                        label="Nombre"
                        labelPlacement="outside"
                        className="dark:text-white font-bold"
                        name="nombre"
                        placeholder="Ingresa el nombre"
                        isInvalid={touched.nombre && !!errors.nombre}
                        errorMessage={touched.nombre && errors.nombre}
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
                        label="Correo electrónico"
                        className="dark:text-white font-semibold"
                        labelPlacement="outside"
                        name="correo"
                        isInvalid={touched.correo && !!errors.correo}
                        errorMessage={touched.correo && errors.correo}
                        placeholder="Ingresa el correo"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        onChange={handleChange}
                        type="number"
                        label="Teléfono"
                        labelPlacement="outside"
                        name="telefono"
                        placeholder="Ingresa el telefono"
                        isInvalid={touched.telefono && !!errors.telefono}
                        errorMessage={touched.telefono && errors.telefono}
                        classNames={{
                          label: 'text-gray-500 text-sm font-semibold',
                        }}
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
                        isInvalid={touched.tipoDocumento && !!errors.tipoDocumento}
                        errorMessage={touched.tipoDocumento && errors.tipoDocumento}
                        variant="bordered"
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        className="dark:text-white font-semibold"
                      >
                        {cat_022_tipo_de_documentoDeIde.map((dep) => (
                          <AutocompleteItem
                            key={dep.codigo}
                            value={dep.codigo}
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
                        label="Número documento"
                        labelPlacement="outside"
                        name="numDocumento"
                        onChange={({ currentTarget }) => {
                          setFieldValue('numDocumento', currentTarget.value.replace(/[^0-9]/g, ''));
                        }}
                        onBlur={handleBlur('numDocumento')}
                        placeholder="Ingresa el número documento"
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
                      <Input
                        onChange={handleChange}
                        label="Nombre comercial"
                        labelPlacement="outside"
                        className="dark:text-white font-semibold"
                        name="nombreComercial"
                        placeholder="Ingresa el nombre comercial"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        isInvalid={touched.nombreComercial && !!errors.nombreComercial}
                        errorMessage={touched.nombreComercial && errors.nombreComercial}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        onChange={handleChange('nit')}
                        onBlur={handleBlur('nit')}
                        label="NIT"
                        labelPlacement="outside"
                        name="nit"
                        placeholder="Ingresa su número de nit sin guiones"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        isInvalid={touched.nit && !!errors.nit}
                        errorMessage={touched.nit && errors.nit}
                      />
                    </div>
                    <div>
                      <Input
                        className="dark:text-white font-semibold"
                        onChange={handleChange}
                        type="number"
                        label="NRC"
                        labelPlacement="outside"
                        name="nrc"
                        placeholder="Ingresa el número de NRC"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                        isInvalid={touched.nrc && !!errors.nrc}
                        errorMessage={touched.nrc && errors.nrc}
                      />
                    </div>
                    <div className="w-full">
                      <Autocomplete
                        label="Actividad"
                        labelPlacement="outside"
                        placeholder="Ingresa la actividad"
                        variant="bordered"
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = cat_019_codigo_de_actividad_economica.find(
                              (dep) => dep.codigo === new Set([key]).values().next().value
                            );

                            handleChange('codActividad')(depSelected?.codigo as string);
                            handleChange('descActividad')(depSelected?.valores || '');
                          }
                        }}
                        classNames={{
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        onInputChange={(text) => getCat019CodigoActividadEconomica(text)}
                        className="dark:text-white"
                        isInvalid={touched.descActividad && !!errors.descActividad}
                        errorMessage={touched.descActividad && errors.descActividad}
                      >
                        {cat_019_codigo_de_actividad_economica.map((dep) => (
                          <AutocompleteItem
                            key={dep.codigo}
                            value={dep.codigo}
                            className="dark:text-white"
                          >
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
                      className="dark:text-white"
                      isInvalid={touched.departamento && !!errors.departamento}
                      errorMessage={touched.departamento && errors.departamento}
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
                      isInvalid={touched.municipio && !!errors.municipio}
                      errorMessage={touched.municipio && errors.municipio}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder="Selecciona el municipio"
                      className="dark:text-white"
                      variant="bordered"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
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
                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      className="dark:text-white"
                      onChange={handleChange}
                      label="Complemento de dirección"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                        input: 'max-h-[90px]',
                      }}
                      labelPlacement="outside"
                      variant="bordered"
                      placeholder="Ingresa el complemento de dirección"
                      name="complemento"
                      errorMessage={errors.complemento}
                      isInvalid={!!errors.complemento && !!touched.complemento}
                    />
                  </div>
                </CardBody>
                <CardFooter className="w-full grid grid-cols-2">
                  <div></div>
                  <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      className="w-full font-semibold"
                      style={global_styles().dangerStyles}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="w-full font-semibold"
                      style={global_styles().darkStyle}
                    >
                      Guardar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              <div></div>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default AddTributeSupplier;
