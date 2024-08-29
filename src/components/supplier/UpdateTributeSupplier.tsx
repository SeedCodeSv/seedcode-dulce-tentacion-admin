import { useBillingStore } from '../../store/facturation/billing.store';
import { Key, useEffect, useMemo, useState } from 'react';
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
  const [selectedDepartment, setSelectedDepartment] = useState(supplier?.direccion?.departamento);
  const [selectedMunicipio, setSelectedMunicipio] = useState(supplier?.direccion?.municipio);
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

    getCat019CodigoActividadEconomica();
  }, [getCat012Departamento, getCat022TipoDeDocumentoDeIde, getCat013Municipios, supplier]);
  useEffect(() => {
    if (id) {
      OnGetBySupplier(Number(id));
    }
  }, [id]);
  useEffect(() => {
    if (supplier.direccion) {
      setSelectedDepartment(supplier.direccion.departamento);
      setSelectedMunicipio(supplier.direccion.municipio);

      getCat013Municipios(supplier?.direccion?.departamento ?? '');
    }
  }, [supplier.direccion]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'complemento') {
      setDataCreateSupplier((prev) => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          complemento: value,
        },
        complemento: value,
      }));
    } else {
      setDataCreateSupplier((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeAutocomplete = (name: string, value: string) => {
    setDataCreateSupplier((prev) => ({ ...prev, [name]: value }));
  };
  const handleDepartmentSelect = (key: Key | null) => {
    const selected = cat_012_departamento.find((dep) => dep.codigo === key);
    if (selected) {
      setSelectedDepartment(selected.codigo);
      setDataCreateSupplier((prev) => ({
        ...prev,
        departamento: selected.codigo,
        nombreDepartamento: selected.valores,
      }));
      getCat013Municipios(selected.codigo);
    }
  };
  const handleMunicipioSelect = (key: Key | null) => {
    const selected = cat_013_municipios.find((mun) => mun.codigo === key);
    if (selected) {
      setSelectedMunicipio(selected.codigo);
      setDataCreateSupplier((prev) => ({
        ...prev,
        municipio: selected.codigo,
        nombreMunicipio: selected.valores,
      }));
    }
  };
  const handleUpdateSupplier = () => {
    try {
      if (dataCreateSupplier) {
        patchSupplier(
          { ...dataCreateSupplier, esContribuyente: true },
          dataCreateSupplier?.id ?? 0
        );
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
    <Layout title="Actualizar  Contribuyente">
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div onClick={() => navigate(-1)} className="w-32  flex gap-2 mb-4 cursor-pointer">
            <ArrowLeft className="dark:text-white" size={20} />
            <p className="dark:text-white">Regresar</p>
          </div>
          <div className="grid xl:grid-cols-2 gap-5">
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
              <div className="xl:mt-10">
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
                  label="Departamento"
                  labelPlacement="outside"
                  name="departamento"
                  className="dark:text-white"
                  variant="bordered"
                  selectedKey={selectedDepartment}
                  onSelectionChange={handleDepartmentSelect}
                >
                  {cat_012_departamento.map((dep) => (
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
                  label="Municipio"
                  labelPlacement="outside"
                  name="municipio"
                  className="dark:text-white"
                  variant="bordered"
                  selectedKey={selectedMunicipio}
                  onSelectionChange={handleMunicipioSelect}
                >
                  {cat_013_municipios.map((mun) => (
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
          </div>

          <div className="pt-2">
            <Textarea
              name="complemento"
              onChange={handleChange}
              value={dataCreateSupplier.direccion?.complemento || ''}
              label="Complemento de dirección"
              className="dark:text-white"
              labelPlacement="outside"
              defaultValue={dataCreateSupplier.direccion?.complemento}
              variant="bordered"
              placeholder="Ingresa el complemento de dirección"
              classNames={{
                label: 'font-semibold text-gray-500 text-sm',
              }}
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
    </Layout>
  );
}

export default UpdateTributeSupplier;
