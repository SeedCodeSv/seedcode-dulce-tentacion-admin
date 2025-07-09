import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react';
import { useFormik } from 'formik';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';

import { SelectedItem } from './select-account';

import { global_styles } from '@/styles/global.styles';
import { useSupplierStore } from '@/store/supplier.store';
import { useAuthStore } from '@/store/auth.store';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import DivGlobal from '@/themes/ui/div-global';
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
    const transId =
      user?.pointOfSale?.branch.transmitter.id ?? 0;

    getAccountCatalogs(transId, '', '');
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
        user?.pointOfSale.branch.transmitter.id ?? 0,
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
      transmitterId: user?.pointOfSale.branch.transmitter.id ?? 0,
    });
  }, [supplier]);

  return (
    <>
      <DivGlobal>
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <button
            className="w-32 flex gap-2 mb-4 cursor-pointer"
            onClick={() => {
              navigate('/suppliers');
            }}
          >
            <ArrowLeft className="dark:text-white" size={20} />
            <p className="dark:text-white">Regresar</p>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <div className="grid xl:grid-cols-2 gap-5 pt-3">
              <div className="pt-3">
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold  text-sm',
                  }}
                  label="Nombre"
                  labelPlacement="outside"
                  placeholder="Ingresa el nombre"
                  variant="bordered"
                  {...formik.getFieldProps('nombre')}
                  errorMessage={formik.errors.nombre}
                  isInvalid={!!formik.touched.nombre && !!formik.errors.nombre}
                />
              </div>
              <div className="pt-3">
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  label="Correo electrónico"
                  labelPlacement="outside"
                  placeholder="Ingresa el correo"
                  variant="bordered"
                  {...formik.getFieldProps('correo')}
                  errorMessage={formik.errors.correo}
                  isInvalid={formik.touched.correo && !!formik.errors.correo}
                />
              </div>
              <div>
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  label="Teléfono"
                  labelPlacement="outside"
                  placeholder="Ingresa el teléfono"
                  type="number"
                  variant="bordered"
                  {...formik.getFieldProps('telefono')}
                  errorMessage={formik.errors.telefono}
                  isInvalid={formik.touched.telefono && !!formik.errors.telefono}
                />
              </div>
              <div className="pt-2">
                <Autocomplete
                  className="dark:text-white"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  errorMessage={formik.errors.tipoDocumento}
                  isInvalid={formik.touched.tipoDocumento && !!formik.errors.tipoDocumento}
                  label="Tipo de documento"
                  labelPlacement="outside"
                  placeholder="Selecciona el tipo de documento"
                  selectedKey={formik.values.tipoDocumento}
                  variant="bordered"
                  onSelectionChange={(value) => {
                    const selected = services
                      .get022TipoDeDocumentoDeIde()
                      .find((dep) => dep.codigo === value);

                    formik.setFieldValue('tipoDocumento', selected?.codigo ?? '');
                  }}
                >
                  {services.get022TipoDeDocumentoDeIde().map((dep) => (
                    <AutocompleteItem key={dep.codigo} className="dark:text-white">
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div>
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  label="Número documento"
                  labelPlacement="outside"
                  placeholder="Ingresa el número documento"
                  type="number"
                  variant="bordered"
                  {...formik.getFieldProps('numDocumento')}
                  errorMessage={formik.errors.numDocumento}
                  isInvalid={formik.touched.numDocumento && !!formik.errors.numDocumento}
                />
              </div>
              <div className="w-full flex items-end gap-2">
                <Input
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  placeholder="Ingresa el código de la cuenta"
                  {...formik.getFieldProps('codCuenta')}
                  className="w-full"
                  label="Cuenta"
                  labelPlacement="outside"
                  variant="bordered"
                />
                <SelectedItem
                  code={formik.values.codCuenta}
                  setCode={(value) => formik.setFieldValue('codCuenta', value)}
                />
              </div>
              <div>
                <Autocomplete
                  className="dark:text-white"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  errorMessage={formik.touched.departamento && formik.errors.departamento}
                  isInvalid={formik.touched.departamento && !!formik.errors.departamento}
                  label="Departamento"
                  labelPlacement="outside"
                  placeholder="Selecciona el departamento"
                  selectedKey={formik.values.departamento}
                  variant="bordered"
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
                >
                  {services.get012Departamento().map((dep) => (
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
                  errorMessage={formik.errors.municipio}
                  isInvalid={formik.touched.municipio && !!formik.errors.municipio}
                  label="Municipio"
                  labelPlacement="outside"
                  name="municipio"
                  placeholder="Selecciona el municipio"
                  selectedKey={formik.values.municipio}
                  variant="bordered"
                  onSelectionChange={(key) => {
                    if (key) {
                      const selected = municipios.find((mun) => mun.codigo === key);

                      if (selected) {
                        formik.setFieldValue('municipio', selected.codigo);
                        formik.setFieldValue('nombreMunicipio', selected.valores);
                      }
                    }
                  }}
                >
                  {municipios.map((mun) => (
                    <AutocompleteItem key={mun.codigo} className="dark:text-white">
                      {mun.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <div className="pt-2">
                <Textarea
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  label="Complemento de dirección"
                  labelPlacement="outside"
                  placeholder="Ingresa el complemento de dirección"
                  variant="bordered"
                  {...formik.getFieldProps('complemento')}
                  errorMessage={formik.errors.complemento}
                  isInvalid={formik.touched.complemento && !!formik.errors.complemento}
                />
              </div>
              <div className="w-full mt-5 flex justify-end gap-5">
                <Button
                  className="px-20 font-semibold"
                  style={global_styles().dangerStyles}
                  onClick={() => navigate('/suppliers')}
                >
                  Cancelar
                </Button>
                <Button
                  className="px-20 font-semibold"
                  style={global_styles().darkStyle}
                  type="submit"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DivGlobal>
    </>
  );
}

export default UpdateNormalSupplier;
