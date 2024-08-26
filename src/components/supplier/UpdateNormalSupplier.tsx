import Layout from '@/layout/Layout';
import { useBillingStore } from '@/store/facturation/billing.store';
import { useSupplierStore } from '@/store/supplier.store';

import { global_styles } from '@/styles/global.styles';
import { Supplier } from '@/types/supplier.types';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useMemo, Key } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
function UpdateNormalSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    supplier, patchSupplier, OnGetBySupplier,
  } = useSupplierStore();
  const {
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    getCat013Municipios,
    cat_012_departamento,
    cat_022_tipo_de_documentoDeIde,
    cat_013_municipios,
  } = useBillingStore();
  const [dataCreateSupplier, setDataCreateSupplier] = useState<Supplier>(supplier);
  const [selectedDepartment, setSelectedDepartment] = useState(supplier?.direccion?.departamento);
  const [selectedMunicipio, setSelectedMunicipio] = useState(supplier?.direccion?.municipio);
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    setDataCreateSupplier(supplier);
  }, [supplier]);
  useEffect(() => {
    if (id) {
      OnGetBySupplier(Number(id));
    }
  }, [id]);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'complemento') {
      setDataCreateSupplier(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          complemento: value
        },
        complemento: value
      }));
    } else {
      setDataCreateSupplier(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleAutocomplete = (name: string, value: string) => {
    setDataCreateSupplier(prev => ({ ...prev, [name]: value }));
  };
  const handleDepartmentSelect = (key: Key | null) => {
    const selected = cat_012_departamento.find(dep => dep.codigo === key);
    if (selected) {
      setSelectedDepartment(selected.codigo);
      setDataCreateSupplier(prev => ({
        ...prev,
        departamento: selected.codigo,
        nombreDepartamento: selected.valores,
      }));
      getCat013Municipios(selected.codigo);
    }
  };
  const handleMunicipioSelect = (key : Key | null) => {
    const selected = cat_013_municipios.find(mun => mun.codigo === key);
    if (selected) {
      setSelectedMunicipio(selected.codigo);
      setDataCreateSupplier(prev => ({
        ...prev,
        municipio: selected.codigo,
        nombreMunicipio: selected.valores,
      }));
    }
  };
  useEffect(() => {
    if (supplier.direccion) {
      setSelectedDepartment(supplier.direccion.departamento);
      setSelectedMunicipio(supplier.direccion.municipio);
      
      getCat013Municipios(supplier?.direccion?.departamento ?? "");
    }
  }, [supplier.direccion]);
  
  const handleUpdateSupplier = () => {
    try {
      if (dataCreateSupplier) {
        patchSupplier(dataCreateSupplier, dataCreateSupplier.id ?? 0);
        navigate(-1);
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };
  const selectedTipoDocumento = useMemo(() => {
    return cat_022_tipo_de_documentoDeIde.find(dep => dep.codigo === dataCreateSupplier?.tipoDocumento);
  }, [dataCreateSupplier?.tipoDocumento]);

  return (
    <Layout title="Actualizar Proveedor Consumidor Final">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-4 overflow-y-auto bg-white shadow custom-scrollbar md:p-8 dark:bg-gray-900">
          <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="w-32 flex gap-2 mb-4 cursor-pointer"
            >
              <ArrowLeft className="dark:text-white" size={20} />
              <p className="dark:text-white">Regresar</p>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-3">
              <div className="pt-3">
                <Input
                  onChange={handleOnChange}
                  value={dataCreateSupplier?.nombre || ''}
                  label="Nombre"
                  labelPlacement="outside"
                  name="nombre"
                  className="dark:text-white"
                  placeholder="Ingresa el nombre"
                  classNames={{
                    label: 'font-semibold  text-sm',
                  }}
                  variant="bordered"
                />
              </div>
              <div className="pt-3">
                <Input
                  value={dataCreateSupplier?.correo || ''}
                  onChange={handleOnChange}
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
              </div>
              <div>
                <Input
                  value={dataCreateSupplier?.telefono || ''}
                  onChange={handleOnChange}
                  type="number"
                  className="dark:text-white"
                  label="Teléfono"
                  labelPlacement="outside"
                  name="telefono"
                  placeholder="Ingresa el teléfono"
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
                    handleAutocomplete('tipoDocumento', selected?.codigo ?? '');
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
              <div>
                <Input
                  type="number"
                  label="Número documento"
                  labelPlacement="outside"
                  value={dataCreateSupplier?.numDocumento || ''}
                  onChange={handleOnChange}
                  className="dark:text-white"
                  name="numDocumento"
                  placeholder="Ingresa el número documento"
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                  }}
                  variant="bordered"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 pt-3">
              <div>
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
            <div className="pt-2">
            <Textarea
                name="complemento"
                onChange={handleOnChange}
                value={dataCreateSupplier.direccion?.complemento || ""}
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
            <Button
              onClick={handleUpdateSupplier}
              className="w-full mt-4 text-sm font-semibold"
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

export default UpdateNormalSupplier;
