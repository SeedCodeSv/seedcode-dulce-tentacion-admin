import { useEffect, useState } from 'react';
import { useBillingStore } from '../../store/facturation/billing.store';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { useSupplierStore } from '../../store/supplier.store';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { Formik, Form } from 'formik';
import { supplierSchemaNormal } from './types/validation_supplier_yup.types';
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

  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
  }, []);
  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const { user } = useAuthStore();
  const { onPostSupplier } = useSupplierStore();
  const navigate = useNavigate();
  return (
    <Layout title="Nuevo Proveedor">
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
          transmitterId: user?.correlative.branch.transmitterId ?? 0
        }}
        validationSchema={supplierSchemaNormal}
        onSubmit={(values, { setSubmitting }) => {
          try {
            onPostSupplier(values);
            navigate(-1);
          } catch (error) {
            return
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleChange, handleBlur, setFieldValue }) => (

          <Form className="w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">


              <div className="border dark:border-white   h-full shadow rounded-2xl bg-white dark:bg-gray-900 p-8">
                <div onClick={() => navigate(-1)} className="w-32  flex gap-2 mb-4 cursor-pointer">
                  <ArrowLeft className="dark:text-white" size={20} />
                  <p className="dark:text-white">Regresar</p>
                </div>



                <div className="grid xl:grid-cols-3 gap-5 pt-3">
                  <div >
                    <Input
                      onBlur={handleBlur}
                      label="Nombre"
                      onChange={handleChange}
                      labelPlacement="outside"
                      name="nombre"
                      className="dark:text-white"
                      placeholder="Ingresa el nombre"
                      classNames={{
                        label: 'font-semibold  text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.nombre && touched.nombre && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.nombre}
                      </span>
                    )}                </div>
                  <div >
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="dark:text-white"
                      label="Correo electrónico"
                      labelPlacement="outside"
                      name="correo"
                      placeholder="Ingresa el correo"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.correo && touched.correo && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.correo}
                      </span>
                    )}
                  </div>

                  <div >
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      className="dark:text-white"
                      label="Teléfono"
                      labelPlacement="outside"
                      name="telefono"
                      placeholder="Ingresa el telefono"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.telefono && touched.telefono && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.telefono}
                      </span>
                    )}                  </div>


                </div>
                <div className="grid xl:grid-cols-2 gap-5 pt-3">
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
                      className="dark:text-white"
                    >
                      {cat_022_tipo_de_documentoDeIde.map((dep) => (
                        <AutocompleteItem key={dep.codigo} value={dep.codigo} className="dark:text-white">
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                    {errors.tipoDocumento && touched.tipoDocumento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.tipoDocumento}
                      </span>
                    )}                  </div>

                  <div >
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      label="Numero documento"
                      labelPlacement="outside"
                      className="dark:text-white"
                      name="numDocumento"
                      placeholder="Ingresa el numero documento"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      variant="bordered"
                    />
                    {errors.numDocumento && touched.numDocumento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.numDocumento}
                      </span>
                    )}                  </div>
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
                      placeholder='Selecciona el municipio'
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
                    {errors.municipio && touched.municipio && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.municipio}
                      </span>
                    )}                  </div>
                </div>

                <div className="grid xl:grid-cols-1 gap-5 pt-3">
                  <Textarea
                    onChange={handleChange}

                    label="Complemento de dirección"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Ingresa el complemento de dirección"
                    name="complemento"
                    className="dark:text-white"
                  />
                  {errors.complemento && touched.complemento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.complemento}
                    </span>
                  )}                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 text-sm font-semibold"
                  style={global_styles().darkStyle}
                >
                  Guardar
                </Button>
              </div>
            </div>



          </Form >

        )}
      </Formik>

    </Layout>
  );
}

export default AddNormalSupplier;
