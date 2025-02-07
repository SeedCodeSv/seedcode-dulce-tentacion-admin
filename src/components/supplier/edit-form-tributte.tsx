import { useFormikContext } from 'formik';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { EditSupplierPayload } from './types/edit-supplier';
import { Autocomplete, AutocompleteItem, Input, Textarea } from '@nextui-org/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { SelectedItem } from './select-account';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';

interface Props {
  selectedDepartment: string | undefined;
  setSelectedDepartment: Dispatch<SetStateAction<string | undefined>>;
}

function EditFormTributte({ selectedDepartment, setSelectedDepartment }: Props) {
  const formik = useFormikContext<EditSupplierPayload>();
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

  const [searchActivitie, setSearchActivitie] = useState('');

  const ITEMS_TO_SHOW = 40;

  const economicActivities = useMemo(() => {
    const activities = services.get019CodigoDeActividaEcono(searchActivitie);
    return activities.slice(0, ITEMS_TO_SHOW);
  }, [searchActivitie]);
  return (
    <>
      <div className="grid xl:grid-cols-2 gap-5">
        <div>
          <Input
            labelPlacement="outside"
            label="Nombre"
            className="dark:text-white"
            placeholder="Ingresa el nombre"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('nombre')}
            isInvalid={formik.touched.nombre && !!formik.errors.nombre}
            errorMessage={formik.errors.nombre}
          />
        </div>
        <div>
          <Input
            label="Correo electrónico"
            className="dark:text-white"
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
            className="dark:text-white"
            type="number"
            label="Teléfono"
            labelPlacement="outside"
            placeholder="Ingresa el telefono"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('telefono')}
            isInvalid={formik.touched.telefono && !!formik.errors.telefono}
            errorMessage={formik.errors.telefono}
          />
        </div>

        <div>
          <Autocomplete
            label="Tipo de documento"
            labelPlacement="outside"
            onSelectionChange={(value) => {
              const selected = services
                .get022TipoDeDocumentoDeIde()
                .find((dep) => dep.codigo === value);
              if (selected) {
                formik.setFieldValue('tipoDocumento', selected.codigo);
              }
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
              <AutocompleteItem key={dep.codigo} value={dep.codigo} className="dark:text-white">
                {dep.valores}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <div>
          <Input
            label="Nombre comercial"
            labelPlacement="outside"
            className="dark:text-white"
            placeholder="Ingresa el nombre comercial"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('nombreComercial')}
            isInvalid={formik.touched.nombreComercial && !!formik.errors.nombreComercial}
            errorMessage={formik.errors.nombreComercial}
          />
        </div>
        <div>
          <Input
            className="dark:text-white"
            type="number"
            label="Nit"
            labelPlacement="outside"
            placeholder="Ingresa su número de nit"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('nit')}
            isInvalid={formik.touched.nit && !!formik.errors.nit}
            errorMessage={formik.errors.nit}
          />
        </div>
        <div>
          <Input
            className="dark:text-white"
            type="number"
            label="NRC"
            labelPlacement="outside"
            placeholder="Ingresa el número de NRC"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('nrc')}
            isInvalid={formik.touched.nrc && !!formik.errors.nrc}
            errorMessage={formik.errors.nrc}
          />
        </div>
        <div>
          <Input
            type="number"
            className="dark:text-white"
            label="Número documento"
            labelPlacement="outside"
            placeholder="Ingresa el número de documento"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            variant="bordered"
            {...formik.getFieldProps('numDocumento')}
            isInvalid={formik.touched.numDocumento && !!formik.errors.numDocumento}
            errorMessage={formik.errors.numDocumento}
          />
        </div>
        <div>
          <Autocomplete
            label="Actividad"
            labelPlacement="outside"
            placeholder="Ingresa la actividad"
            variant="bordered"
            onSelectionChange={(e) => {
              const selectActividad = economicActivities.find((dep) => dep.codigo.trim() === e);
              if (selectActividad) {
                formik.setFieldValue('codActividad', selectActividad.codigo);
                formik.setFieldValue('descActividad', selectActividad.valores);
              }
            }}
            classNames={{
              base: 'font-semibold text-gray-500 text-sm',
            }}
            selectedKey={formik.values.codActividad}
            className="dark:text-white"
            onInputChange={(e) => setSearchActivitie(e)}
            isInvalid={formik.touched.codActividad && !!formik.errors.codActividad}
            errorMessage={formik.errors.codActividad}
          >
            {economicActivities.map((dep) => (
              <AutocompleteItem key={dep.codigo} value={dep.codigo} className="dark:text-white">
                {dep.valores}
              </AutocompleteItem>
            ))}
          </Autocomplete>
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
              <AutocompleteItem value={dep.codigo} key={dep.codigo} className="dark:text-white">
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
              <AutocompleteItem key={mun.codigo} value={mun.codigo} className="dark:text-white">
                {mun.valores}
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
      </div>
      <div className="mt-4">
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
    </>
  );
}

export default EditFormTributte;
