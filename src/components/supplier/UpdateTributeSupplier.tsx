import { useBillingStore } from '../../store/facturation/billing.store';
import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { Supplier } from '@/types/supplier.types';

import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useSupplierStore } from '@/store/supplier.store';

function UpdateTributeSupplier() {
  const { id } = useParams();
  const { supplier, patchSupplier, OnGetBySupplier } = useSupplierStore();
  const navigate = useNavigate();
  const [dataCreateSupplier, setDataCreateSupplier] = useState<Supplier>(supplier || {});
  const [selectedCodeDep, setSelectedCodeDep] = useState(supplier?.direccion?.departamento ?? '0');
  const {
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    getCat013Municipios,
    cat_012_departamento,
    cat_022_tipo_de_documentoDeIde,
    cat_013_municipios,
    cat_019_codigo_de_actividad_economica,
    getCat019CodigoActividadEconomica,
  } = useBillingStore();
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    setDataCreateSupplier(supplier);
    getCat013Municipios(selectedCodeDep);
    getCat019CodigoActividadEconomica();
  }, [
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    getCat013Municipios,
    selectedCodeDep,
    supplier,
  ]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataCreateSupplier((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || '',
    }));
  };
  const handleChangeAutocomplete = (name: string, value: string) => {
    setDataCreateSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSupplier = () => {
    try {
      if (dataCreateSupplier) {
        patchSupplier(dataCreateSupplier, dataCreateSupplier?.id ?? 0);
        navigate(-1);

        if (id) {
          OnGetBySupplier(Number(id));
        }
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const selectedTipoDocumento = useMemo(() => {
    return cat_022_tipo_de_documentoDeIde.find(
      (dep) => dep.codigo === dataCreateSupplier?.tipoDocumento
    );
  }, [cat_022_tipo_de_documentoDeIde, dataCreateSupplier?.tipoDocumento]);
  return (
    <Layout title="Actualizar Proveedor Contribuyente">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
          <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
            <div onClick={() => navigate(-1)} className="w-32  flex gap-2 mb-4 cursor-pointer">
              <ArrowLeft className="dark:text-white" size={20} />
              <p className="dark:text-white">Regresar</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="mt-10">
                  <Input
                    onChange={handleChange}
                    label="Nombre"
                    value={dataCreateSupplier?.nombre}
                    labelPlacement="outside"
                    className="dark:text-white"
                    name="nombre"
                    placeholder="Ingresa el nombre"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                </div>
                <div className="pt-2">
                  <Input
                    value={dataCreateSupplier?.correo}
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
                </div>
                <div className="pt-2">
                  <Input
                    value={dataCreateSupplier?.telefono}
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
                </div>

                <div className="pt-2">
                  <Input
                    value={dataCreateSupplier?.numDocumento}
                    onChange={handleChange}
                    type="number"
                    className="dark:text-white"
                    label="Numero documento"
                    labelPlacement="outside"
                    name="numDocumento"
                    placeholder="Ingresa el numero documento"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                </div>
                <div className="pt-2">
                  <Autocomplete
                    label="Actividad"
                    labelPlacement="outside"
                    placeholder="Ingresa la actividad"
                    variant="bordered"
                    onSelectionChange={(e) => {
                      const selectActividad = cat_019_codigo_de_actividad_economica.find(
                        (dep) => dep.codigo.trim() === e
                      );
                      if (selectActividad) {
                        handleChangeAutocomplete('codActividad', selectActividad.codigo);
                        handleChangeAutocomplete('descActividad', selectActividad.valores);
                      }
                    }}
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    defaultItems={cat_019_codigo_de_actividad_economica}
                    selectedKey={dataCreateSupplier?.codActividad}
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
                </div>
              </div>
              <div>
                <div className="mt-10">
                  <Input
                    value={dataCreateSupplier?.nombreComercial}
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
                </div>
                <div className="pt-2">
                  <Input
                    value={dataCreateSupplier?.nit}
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
                </div>
                <div className="pt-2">
                  <Input
                    value={dataCreateSupplier?.nrc}
                    className="dark:text-white"
                    onChange={handleChange}
                    type="number"
                    label="Nrc"
                    labelPlacement="outside"
                    name="numDocumento"
                    placeholder="Ingresa el numero de NRC"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                  />
                </div>
                <div className="pt-2">
                  <Autocomplete
                    label="Tipo de documento"
                    labelPlacement="outside"
                    onSelectionChange={(value) => {
                      const selected = cat_022_tipo_de_documentoDeIde.find(
                        (dep) => dep.codigo === value
                      );
                      handleChangeAutocomplete('tipoDocumento', selected?.codigo ?? '');
                    }}
                    defaultItems={cat_022_tipo_de_documentoDeIde}
                    selectedKey={selectedTipoDocumento?.codigo ?? dataCreateSupplier?.tipoDocumento}
                    placeholder="Selecciona el tipo de documento"
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
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
                <div className="pt-2">
                  <Autocomplete
                    labelPlacement="outside"
                    variant="bordered"
                    label="Departamento"
                    onSelectionChange={(value) => {
                      const selectedDepartment = cat_012_departamento.find(
                        (dep) => dep.codigo === value
                      );
                      if (selectedDepartment) {
                        setSelectedCodeDep(selectedDepartment.codigo); // Actualiza el estado con el código seleccionado
                        handleChangeAutocomplete('departamento', selectedDepartment.codigo); // Enviar solo el código
                        handleChangeAutocomplete('nombreDepartamento', selectedDepartment.valores); // Enviar solo el nombre
                      }
                    }}
                    selectedKey={selectedCodeDep} // Usa el valor de selectedCodeDep
                    defaultItems={cat_012_departamento}
                    placeholder="Selecciona el departamento"
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
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
                <div className="pt-2">
                  <Autocomplete
                    label="Municipio"
                    labelPlacement="outside"
                    name="municipio"
                    className="dark:text-white"
                    defaultItems={cat_013_municipios}
                    selectedKey={dataCreateSupplier?.direccion?.municipio}
                    onSelectionChange={(value) => {
                      const selectedMun = cat_013_municipios.find((mun) => mun.codigo === value);
                      if (selectedMun) {
                        handleChangeAutocomplete('municipio', selectedMun.codigo);
                        handleChangeAutocomplete('nombreMunicipio', selectedMun.valores);
                      }
                      if (selectedMun) {
                        setDataCreateSupplier((prev) => ({
                          ...prev,
                          direccion: {
                            ...prev.direccion,
                            municipio: selectedMun.codigo,
                            nombreMunicipio: selectedMun.valores,
                            departamento: prev.direccion?.departamento ?? '',
                            nombreDepartamento: prev.direccion?.nombreDepartamento ?? '',
                            complemento: prev.direccion?.complemento ?? '',
                            active: prev.direccion?.active ?? true,
                          },
                        }));
                      }
                    }}
                    variant="bordered"
                    placeholder="Ingresa el municipio"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                  >
                    {cat_013_municipios.map((mun) => (
                      <AutocompleteItem
                        value={mun.codigo}
                        key={mun.codigo}
                        className="dark:text-white"
                      >
                        {mun.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Textarea
                value={dataCreateSupplier?.direccion?.complemento}
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
            </div>
            <div className="pt-4">
              <Button
                onClick={handleUpdateSupplier}
                className="w-full font-semibold"
                style={global_styles().darkStyle}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateTributeSupplier;
