import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { Autocomplete, AutocompleteItem, Input, Textarea } from '@heroui/react';

import { PayloadSupplier } from '../../types/supplier.types';
import { CodigoActividadEconomica } from '../../types/billing/cat-019-codigo-de-actividad-economica.types';
import { Departamento } from '../../types/billing/cat-012-departamento.types';
import { useSupplierStore } from '../../store/supplier.store';
import { SelectedItem } from '../supplier/select-account';

import { AddSupplierProps } from './types/shopping-manual.types';

import { get_user } from '@/storage/localStorage';
import { useBillingStore } from '@/store/facturation/billing.store';
import { typesDocumento } from '@/utils/constants';
import { useViewsStore } from '@/store/views.store';
import NoAuthorization from '@/pages/NoAuthorization';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function AddTributeSupplier(props: AddSupplierProps) {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Proveedores');
  const actionView = viewName?.actions.name || [];
  const [nrc, setNrc] = useState<string>(props.supplier?.nrc ?? '');

  const { account_catalog_pagination } = useAccountCatalogsStore();
  const initialValues = {
    nombre: props.supplier?.nombre ?? '',
    nombreComercial: props.supplier?.nombreComercial ?? '',
    correo: props.supplier?.correo ?? '',
    telefono: props.supplier?.telefono ?? '',
    numDocumento: props.supplier?.numDocumento
      ? props.supplier.numDocumento
      : (props.supplier?.nit ?? ''),
    nrc: props.supplier?.nrc ?? '',
    nit: props.supplier?.nit ?? '',
    tipoDocumento: props.supplier?.tipoDocumento || '36',
    bienTitulo: '05',
    codActividad: props.supplier?.codActividad ?? '',
    esContribuyente: 1,
    descActividad: props.supplier?.descActividad ?? '',
    municipio: props.supplier_direction?.municipio ?? '',
    nombreMunicipio: '',
    departamento: props.supplier_direction?.departamento ?? '',
    nombreDepartamento: '',
    complemento: props.supplier_direction?.complemento,
    codCuenta: '',
  };

  const validationSchema = yup.object().shape({
    nombre: yup.string().required('**El nombre es requerido**'),
    nombreComercial: yup.string().required('**El nombre comercial es requerido**'),
    correo: yup.string().required('**El correo es requerido**').email('**El correo es invalido**'),
    telefono: yup.string().required('**El teléfono es requerido**'),
    nit: yup
      .string()
      .required('**El NIT es requerido sin guiones**')
      .matches(/^([0-9]{14}|[0-9]{9})$/, '**El NIT no es valido ingresar sin guiones**'),
    codActividad: yup
      .string()
      .required('**La actividad es requerida**')
      .matches(/^[0-9]{2,6}$/, '**La actividad no es valida**'),
    departamento: yup.string().required('**Debes seleccionar el departamento**'),
    municipio: yup.string().required('**Debes seleccionar el municipio**'),
    complemento: yup.string().required('**El complemento es requerida**'),
    tipoDocumento: yup.string().required('**Tipo de documento es requerido**'),
    numDocumento: yup
      .string()
      .required('**Número de documento es requerido**')
      .test('noSelectedTypeDocument', '**Debe seleccionar un tipo de documento**', function () {
        const { tipoDocumento } = this.parent;

        return tipoDocumento !== '' ? true : false;
      })
      .test('validar-documento', '**Número de documento no válido**', function (value) {
        const { tipoDocumento } = this.parent;

        if (tipoDocumento === '13') {
          return /^([0-9]{9})$/.test(value);
        }
        if (tipoDocumento === '36') {
          return value.length >= 9 && /^([0-9]{9}|[0-9]{14})$/.test(value);
        }

        return true;
      }),
  });

  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat019CodigoActividadEconomica,
    cat_019_codigo_de_actividad_economica,
  } = useBillingStore();

  const [selectedCodeDep, setSelectedCodeDep] = useState('0');

  useEffect(() => {
    getCat012Departamento();
    getCat019CodigoActividadEconomica();
  }, []);

  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);

  useEffect(() => {
    if (props.supplier) {
      getCat019CodigoActividadEconomica(props.supplier.descActividad);
      getCat013Municipios(props.supplier_direction?.departamento ?? '');
    }
  }, [props.supplier, props.supplier_direction]);

  const selectedKeyCodActivity = useMemo(() => {
    if (props.supplier_direction) {
      const code_activity = cat_019_codigo_de_actividad_economica.find(
        (department) => department.codigo === props.supplier?.codActividad
      );

      return JSON.stringify(code_activity);
    }

    return undefined;
  }, [
    props,
    props.supplier,
    cat_019_codigo_de_actividad_economica,
    cat_019_codigo_de_actividad_economica.length,
  ]);

  const handleFilter = (name = '') => {
    getCat019CodigoActividadEconomica(name);
  };

  const { onPostSupplier } = useSupplierStore();
  const user = get_user();
  const transmiter = Number(
    user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
  );

  const onSubmit = async (payload: PayloadSupplier) => {
    const values = {
      ...payload,
      nrc: nrc,
      esContribuyente: 1,
      transmitterId: transmiter,
    };

    await onPostSupplier(values);

    const find = account_catalog_pagination.accountCatalogs.find(
      (item) => item.code === values.codCuenta
    );

    if (find) {
      props.setCode(find.code, find.name);
    }

    props.closeModal();
  };

  return (
    <div className="dark:text-white">
      {actionView.includes('Agregar') ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            setFieldValue,
            handleChange,
            handleSubmit,
            getFieldProps,
          }) => (
            <>
              <div className="grid grid-cols-2 gap-5 gap-y-2">
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    label="Nombre"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Ingresa el nombre"
                    value={values.nombre}
                    variant="bordered"
                    onBlur={handleBlur('nombre')}
                    onChange={handleChange('nombre')}
                  />
                  {errors.nombre && touched.nombre && (
                    <span className="text-sm font-semibold text-red-500">{errors.nombre}</span>
                  )}
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    label="Nombre comercial"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Ingresa el nombre comercial"
                    value={values.nombreComercial}
                    variant="bordered"
                    onBlur={handleBlur('nombreComercial')}
                    onChange={handleChange('nombreComercial')}
                  />
                  {errors.nombreComercial && touched.nombreComercial && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.nombreComercial}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    label="Correo electrónico"
                    labelPlacement="outside"
                    name="correo"
                    placeholder="Ingresa el correo"
                    value={values.correo}
                    variant="bordered"
                    onBlur={handleBlur('correo')}
                    onChange={handleChange('correo')}
                  />
                  {errors.correo && touched.correo && (
                    <span className="text-sm font-semibold text-red-500">{errors.correo}</span>
                  )}
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    disabled={false}
                    errorMessage={errors.telefono}
                    isInvalid={!!errors.telefono && !!touched.telefono}
                    label="Teléfono"
                    labelPlacement="outside"
                    name="telefono"
                    placeholder="Ingresa el teléfono"
                    value={values.telefono}
                    variant="bordered"
                    onBlur={handleBlur('telefono')}
                    onChange={(e) => setFieldValue('telefono', e.currentTarget.value)}
                  />
                </div>
                <div>
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={errors.tipoDocumento}
                    isInvalid={!!errors.tipoDocumento && !!touched.tipoDocumento}
                    label="Tipo de documento"
                    labelPlacement="outside"
                    placeholder={'Selecciona el tipo de documento'}
                    selectedKey={values.tipoDocumento} // Asegúrate de que esto esté correcto
                    value={values.tipoDocumento} // Asegúrate de que esto esté correcto
                    variant="bordered"
                    onBlur={handleBlur('tipoDocumento')}
                    onSelectionChange={(key) => {
                      if (key) {
                        setFieldValue('tipoDocumento', key as string);
                      }
                    }}
                  >
                    {typesDocumento.map((dep) => (
                      <AutocompleteItem key={dep.code} className="dark:text-white">
                        {dep.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                      base: 'font-semibold',
                    }}
                    errorMessage={errors.numDocumento}
                    isInvalid={!!errors.numDocumento && !!touched.numDocumento}
                    label="Número documento"
                    labelPlacement="outside"
                    placeholder="Ingresa el número documento"
                    type="number"
                    value={values.numDocumento}
                    variant="bordered"
                    onBlur={handleBlur('numDocumento')}
                    onChange={handleChange('numDocumento')}
                  />
                </div>
                <div>
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={errors.codActividad}
                    isInvalid={!!errors.codActividad && !!touched.codActividad}
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
                        const depSelected = JSON.parse(key as string) as CodigoActividadEconomica;

                        setFieldValue('codActividad', depSelected.codigo);
                        setFieldValue('descActividad', depSelected.valores);
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

                <div>
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={errors.departamento}
                    isInvalid={!!errors.departamento && !!touched.departamento}
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder={'Selecciona el departamento'}
                    selectedKey={values.departamento}
                    variant="bordered"
                    onBlur={handleBlur('departamento')}
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = cat_012_departamento.find(
                          (dep) => dep.codigo === key
                        ) as CodigoActividadEconomica;

                        setSelectedCodeDep(depSelected.codigo);
                        setFieldValue('departamento', depSelected.valores);
                        setFieldValue('nombreDepartamento', depSelected.valores);
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
                    errorMessage={errors.municipio}
                    isInvalid={!!errors.municipio && !!touched.municipio}
                    label="Municipio"
                    labelPlacement="outside"
                    placeholder={'Selecciona el municipio'}
                    selectedKey={values.municipio}
                    variant="bordered"
                    onBlur={handleBlur('municipio')}
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = cat_013_municipios.find(
                          (dep) => dep.codigo === key
                        ) as Departamento;

                        handleChange('municipio')(depSelected.codigo);
                        handleChange('nombreMunicipio')(depSelected.valores);
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

                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    label="NIT"
                    labelPlacement="outside"
                    name="nit"
                    placeholder="Ingresa su número de nit"
                    value={values.nit}
                    variant="bordered"
                    onBlur={handleBlur('nit')}
                    onChange={handleChange('nit')}
                  />
                  {errors.nit && touched.nit && (
                    <span className="text-sm font-semibold text-red-500">{errors.nit}</span>
                  )}
                </div>
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    errorMessage={errors.nrc}
                    isInvalid={!!errors.nrc && !!touched.nrc}
                    label="NRC"
                    labelPlacement="outside"
                    name="nrc"
                    placeholder="Ingresa el número de NRC"
                    type="number"
                    value={values.nrc}
                    variant="bordered"
                    onChange={(e) => setNrc(e.target.value)}
                  />
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
              <div>
                <Textarea
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                    input: 'min-h-[90px]',
                  }}
                  label="Complemento de dirección"
                  labelPlacement="outside"
                  name="complemento"
                  placeholder="Ingresa el complemento de dirección"
                  value={values.complemento}
                  variant="bordered"
                  onBlur={handleBlur('complemento')}
                  onChange={handleChange('complemento')}
                />
                {errors.complemento && touched.complemento && (
                  <span className="text-sm font-semibold text-red-500">{errors.complemento}</span>
                )}
              </div>
              <div className="pt-4 flex justify-end">
                <ButtonUi
                  className="px-20 font-semibold"
                  theme={Colors.Primary}
                  onPress={() => handleSubmit()}
                >
                  Guardar
                </ButtonUi>
              </div>
            </>
          )}
        </Formik>
      ) : (
        <NoAuthorization />
      )}
    </div>
  );
}

export default AddTributeSupplier;
