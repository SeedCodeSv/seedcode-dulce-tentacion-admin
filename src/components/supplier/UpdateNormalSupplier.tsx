import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useAuthStore } from '@/store/auth.store';
import { useSupplierStore } from '@/store/supplier.store';
import { global_styles } from '@/styles/global.styles';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { useFormik } from 'formik';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import { SelectedItem } from './select-account';
function UpdateNormalSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { supplier, patchSupplier, OnGetBySupplier } = useSupplierStore();
  const [selectedDepartment, setSelectedDepartment] = useState(supplier?.direccion?.departamento);

  useEffect(() => {
    if (id) {
      OnGetBySupplier(Number(id));
    }
  }, [id]);

  const { user } = useAuthStore();

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const { getAccountCatalogs } = useAccountCatalogsStore();

  useEffect(() => {
    getAccountCatalogs('', '');
  }, []);

  const municipios = useMemo(() => {
    if (selectedDepartment) {
      const mun = services.get013Municipio(selectedDepartment);

      return mun ?? [];
    }

    return [];
  }, [selectedDepartment]);

  const formik = useFormik({
    initialValues: {
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
    },
    onSubmit(values, formikHelpers) {
      patchSupplier({ ...values, id: supplier?.id, nrc: supplier?.nrc }, supplier?.id ?? 0);
      formikHelpers.setSubmitting(false);
      toast.success('Proveedor actualizado correctamente');
      navigate('/suppliers');
    },
  });

  useEffect(() => {
    formik.setValues({
      nombre: supplier.nombre,
      nombreComercial: supplier.nombreComercial,
      correo: supplier.correo,
      telefono: supplier.telefono,
      numDocumento: supplier.numDocumento,
      nit: supplier.nit,
      tipoDocumento: supplier.tipoDocumento,
      bienTitulo: supplier.bienTitulo,
      codActividad: supplier.codActividad,
      esContribuyente: 0,
      descActividad: supplier.descActividad,
      municipio: supplier.direccion?.municipio ?? '',
      departamento: supplier.direccion?.departamento ?? '',
      complemento: supplier.direccion?.complemento ?? '',
      codCuenta: supplier.codCuenta,
      transmitterId:
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
    });
  }, [supplier]);

  return (
    <Layout title="Actualizar Consumidor Final">
      <div className=" w-full h-full xl:p-10 p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div
            onClick={() => {
              navigate('/suppliers');
            }}
            className="w-32 flex gap-2 mb-4 cursor-pointer"
          >
            <ArrowLeft className="dark:text-white" size={20} />
            <p className="dark:text-white">Regresar</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <div className="grid xl:grid-cols-2 gap-5 pt-3">
              <div className="pt-3">
                <Input
                  label="Nombre"
                  labelPlacement="outside"
                  className="dark:text-white"
                  placeholder="Ingresa el nombre"
                  classNames={{
                    label: 'font-semibold  text-sm',
                  }}
                  variant="bordered"
                  {...formik.getFieldProps('nombre')}
                  isInvalid={!!formik.touched.nombre && !!formik.errors.nombre}
                  errorMessage={formik.errors.nombre}
                />
              </div>
              <div className="pt-3">
                <Input
                  className="dark:text-white"
                  label="Correo electrónico"
                  labelPlacement="outside"
                  placeholder="Ingresa el correo"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  variant="bordered"
                  {...formik.getFieldProps('correo')}
                  isInvalid={formik.touched.correo && !!formik.errors.correo}
                  errorMessage={formik.errors.correo}
                />
              </div>
              <div>
                <Input
                  type="number"
                  className="dark:text-white"
                  label="Teléfono"
                  labelPlacement="outside"
                  placeholder="Ingresa el teléfono"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  variant="bordered"
                  {...formik.getFieldProps('telefono')}
                  isInvalid={formik.touched.telefono && !!formik.errors.telefono}
                  errorMessage={formik.errors.telefono}
                />
              </div>
              <div className="pt-2">
                <Autocomplete
                  label="Tipo de documento"
                  labelPlacement="outside"
                  onSelectionChange={(value) => {
                    const selected = services
                      .get022TipoDeDocumentoDeIde()
                      .find((dep) => dep.codigo === value);
                    formik.setFieldValue('tipoDocumento', selected?.codigo ?? '');
                  }}
                  selectedKey={formik.values.tipoDocumento}
                  placeholder="Selecciona el tipo de documento"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  className="dark:text-white"
                  isInvalid={formik.touched.tipoDocumento && !!formik.errors.tipoDocumento}
                  errorMessage={formik.errors.tipoDocumento}
                >
                  {services.get022TipoDeDocumentoDeIde().map((dep) => (
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
                  type="number"
                  label="Número documento"
                  labelPlacement="outside"
                  className="dark:text-white"
                  placeholder="Ingresa el número documento"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  variant="bordered"
                  {...formik.getFieldProps('numDocumento')}
                  isInvalid={formik.touched.numDocumento && !!formik.errors.numDocumento}
                  errorMessage={formik.errors.numDocumento}
                />
              </div>
              <div className="w-full flex items-end gap-2">
                <Input
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  placeholder="Ingresa el código de la cuenta"
                  {...formik.getFieldProps('codCuenta')}
                  variant="bordered"
                  label="Cuenta"
                  labelPlacement="outside"
                  className="w-full"
                />
                <SelectedItem
                  code={formik.values.codCuenta}
                  setCode={(value) => formik.setFieldValue('codCuenta', value)}
                />
              </div>
              <div>
                <Autocomplete
                  label="Departamento"
                  labelPlacement="outside"
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = services
                        .get012Departamento()
                        .find((dep) => dep.codigo === new Set([key]).values().next().value);

                      setSelectedDepartment(depSelected?.codigo as string);
                      formik.handleChange('departamento')(depSelected?.codigo as string);
                      formik.handleChange('nombreDepartamento')(depSelected?.valores || '');
                    }
                  }}
                  placeholder="Selecciona el departamento"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  className="dark:text-white"
                  selectedKey={formik.values.departamento}
                  isInvalid={formik.touched.departamento && !!formik.errors.departamento}
                  errorMessage={formik.touched.departamento && formik.errors.departamento}
                >
                  {services.get012Departamento().map((dep) => (
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
                  label="Municipio"
                  labelPlacement="outside"
                  name="municipio"
                  placeholder="Selecciona el municipio"
                  className="dark:text-white font-semibold"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  selectedKey={formik.values.municipio}
                  onSelectionChange={(key) => {
                    if (key) {
                      const selected = municipios.find((mun) => mun.codigo === key);
                      if (selected) {
                        formik.setFieldValue('municipio', selected.codigo);
                        formik.setFieldValue('nombreMunicipio', selected.valores);
                      }
                    }
                  }}
                  isInvalid={formik.touched.municipio && !!formik.errors.municipio}
                  errorMessage={formik.errors.municipio}
                >
                  {municipios.map((mun) => (
                    <AutocompleteItem
                      key={mun.codigo}
                      value={mun.codigo}
                      className="dark:text-white"
                    >
                      {mun.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <div className="pt-2">
                <Textarea
                  label="Complemento de dirección"
                  className="dark:text-white"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Ingresa el complemento de dirección"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  {...formik.getFieldProps('complemento')}
                  isInvalid={formik.touched.complemento && !!formik.errors.complemento}
                  errorMessage={formik.errors.complemento}
                />
              </div>
              <div className="w-full mt-5 flex justify-end gap-5">
                <Button
                  onClick={() => navigate('/suppliers')}
                  className="px-20 font-semibold"
                  style={global_styles().dangerStyles}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-20 font-semibold"
                  style={global_styles().darkStyle}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateNormalSupplier;
