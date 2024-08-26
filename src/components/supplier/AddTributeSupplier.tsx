import { useBillingStore } from '../../store/facturation/billing.store';
import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { get_user } from '../../storage/localStorage';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSupplierStore } from '@/store/supplier.store';
import { Formik, Form } from 'formik';
import { supplierSchemaContribuyente } from './types/validation_supplier_yup.types';
function AddTributeSupplier() {
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
  }, []);
  const { onPostSupplier } = useSupplierStore();
  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const user = get_user();
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
          nrc: "",
          tipoDocumento: '',
          bienTitulo: '',
          codActividad: '',
          esContribuyente: 1,
          descActividad: '',
          municipio: '',
          departamento: '',
          complemento: '',
          transmitterId: user?.correlative.branch.transmitterId ?? 0
        }}
        validationSchema={supplierSchemaContribuyente}
        onSubmit={(values, { setSubmitting }) => {
          try {
            onPostSupplier(values);
            navigate(-1);
          } catch (error) {
            console.error(error);
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
                <div className="grid xl:grid-cols-3 gap-5">
                
                    <div >
                      <Input
                        onChange={handleChange}
                        label="Nombre"
                        labelPlacement="outside"
                        className="dark:text-white"
                        name="nombre"
                        placeholder="Ingresa el nombre"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                      {errors.nombre && touched.nombre && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nombre}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        onChange={handleChange}
                        label="Correo electrónico"
                        className="dark:text-white"
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
                        className="dark:text-white"
                        onChange={handleChange}
                        type="number"
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
                      )}
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
                      )}
                    </div>
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
                      )}
                    </div>
                    
                 
                  
                    <div >
                      <Input
                        onChange={handleChange}
                        label="Nombre comercial"
                        labelPlacement="outside"
                        className="dark:text-white"
                        name="nombreComercial"
                        placeholder="Ingresa el nombre comercial"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                      {errors.nombreComercial && touched.nombreComercial && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nombreComercial}
                        </span>
                      )}
                    </div>
                    <div>
                      <Input
                        className="dark:text-white"
                        onChange={handleChange}
                        type="number"
                        label="Nit"
                        labelPlacement="outside"
                        name="nit"
                        placeholder="Ingresa su numero de nit"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                      {errors.nit && touched.nit && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nit}
                        </span>
                      )}
                    </div>
                    <div >
                      <Input
                        className="dark:text-white"
                        onChange={handleChange}
                        type="number"
                        label="Nrc"
                        labelPlacement="outside"
                        name="nrc"
                        placeholder="Ingresa el numero de NRC"
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        variant="bordered"
                      />
                      {errors.nrc && touched.nrc && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nrc}
                        </span>
                      )}
                    </div>
                   





                    <div >
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
                        className="dark:text-white"
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
                      {errors.descActividad && touched.descActividad && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.descActividad}
                        </span>
                      )}
                    </div>









                    <div >
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
                    <div >
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
                      )}
                    </div>
                  </div>
                  <div>
                </div>

                <div className="pt-2">
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
                  />
                  {errors.complemento && touched.complemento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.complemento}
                    </span>
                  )}
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    style={global_styles().darkStyle}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </Form>

        )}
      </Formik>
    </Layout>
  );
}

export default AddTributeSupplier;
