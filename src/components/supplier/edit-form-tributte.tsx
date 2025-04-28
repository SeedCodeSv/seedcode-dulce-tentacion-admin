import { useFormikContext } from 'formik';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Input, Textarea } from '@heroui/react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { EditSupplierPayload } from './types/edit-supplier';
import { SelectedItem } from './select-account';

import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useAuthStore } from '@/store/auth.store';

interface Props {
  selectedDepartment: string | undefined;
  setSelectedDepartment: Dispatch<SetStateAction<string | undefined>>;
}

function EditFormTributte({ selectedDepartment, setSelectedDepartment }: Props) {
  const formik = useFormikContext<EditSupplierPayload>();
  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const { getAccountCatalogs } = useAccountCatalogsStore();

  const { user } = useAuthStore();

  useEffect(() => {
    const transId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

    getAccountCatalogs(transId, '', '');
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
            className="dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            label="Nombre"
            labelPlacement="outside"
            placeholder="Ingresa el nombre"
            variant="bordered"
            {...formik.getFieldProps('nombre')}
            errorMessage={formik.errors.nombre}
            isInvalid={formik.touched.nombre && !!formik.errors.nombre}
          />
        </div>
        <div>
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
            placeholder="Ingresa el telefono"
            type="number"
            variant="bordered"
            {...formik.getFieldProps('telefono')}
            errorMessage={formik.errors.telefono}
            isInvalid={formik.touched.telefono && !!formik.errors.telefono}
          />
        </div>

        <div>
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

              if (selected) {
                formik.setFieldValue('tipoDocumento', selected.codigo);
              }
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
            label="Nombre comercial"
            labelPlacement="outside"
            placeholder="Ingresa el nombre comercial"
            variant="bordered"
            {...formik.getFieldProps('nombreComercial')}
            errorMessage={formik.errors.nombreComercial}
            isInvalid={formik.touched.nombreComercial && !!formik.errors.nombreComercial}
          />
        </div>
        <div>
          <Input
            className="dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            label="Nit"
            labelPlacement="outside"
            placeholder="Ingresa su número de nit"
            type="number"
            variant="bordered"
            {...formik.getFieldProps('nit')}
            errorMessage={formik.errors.nit}
            isInvalid={formik.touched.nit && !!formik.errors.nit}
          />
        </div>
        <div>
          <Input
            className="dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            label="NRC"
            labelPlacement="outside"
            placeholder="Ingresa el número de NRC"
            type="number"
            variant="bordered"
            {...formik.getFieldProps('nrc')}
            errorMessage={formik.errors.nrc}
            isInvalid={formik.touched.nrc && !!formik.errors.nrc}
          />
        </div>
        <div>
          <Input
            className="dark:text-white"
            classNames={{
              label: 'font-semibold text-gray-500 text-sm',
            }}
            label="Número documento"
            labelPlacement="outside"
            placeholder="Ingresa el número de documento"
            type="number"
            variant="bordered"
            {...formik.getFieldProps('numDocumento')}
            errorMessage={formik.errors.numDocumento}
            isInvalid={formik.touched.numDocumento && !!formik.errors.numDocumento}
          />
        </div>
        <div>
          <Autocomplete
            className="dark:text-white"
            classNames={{
              base: 'font-semibold text-gray-500 text-sm',
            }}
            errorMessage={formik.errors.codActividad}
            isInvalid={formik.touched.codActividad && !!formik.errors.codActividad}
            label="Actividad"
            labelPlacement="outside"
            placeholder="Ingresa la actividad"
            selectedKey={formik.values.codActividad}
            variant="bordered"
            onInputChange={(e) => setSearchActivitie(e)}
            onSelectionChange={(e) => {
              const selectActividad = economicActivities.find((dep) => dep.codigo.trim() === e);

              if (selectActividad) {
                formik.setFieldValue('codActividad', selectActividad.codigo);
                formik.setFieldValue('descActividad', selectActividad.valores);
              }
            }}
          >
            {economicActivities.map((dep) => (
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
      </div>
      <div className="mt-4">
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
    </>
  );
}

export default EditFormTributte;
