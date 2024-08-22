import Layout from '@/layout/Layout';
import { useBillingStore } from '@/store/facturation/billing.store';
import { useSupplierStore } from '@/store/supplier.store';
import { global_styles } from '@/styles/global.styles';
import { Supplier } from '@/types/supplier.types';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { Key, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
function UpdateNormalSupplier() {
  const { supplier, patchSupplier } = useSupplierStore();
  const navigate = useNavigate();
  const [dataCreateSupplier, setDataCreateSupplier] = useState<Supplier>(supplier || {});
  const [selectedCodeDep, setSelectedCodeDep] = useState(supplier?.direccion?.departamento ?? '0');
  const [selectedMunicipio, setSelectedMunicipio] = useState(supplier?.direccion?.municipio ?? '');
  const {
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    getCat013Municipios,
    cat_012_departamento,
    cat_022_tipo_de_documentoDeIde,
    cat_013_municipios,
  } = useBillingStore();
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
  }, [getCat012Departamento, getCat022TipoDeDocumentoDeIde, getCat013Municipios, selectedCodeDep]);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataCreateSupplier((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || '',
    }));
  };
  const handleAutocomplete = (name: string, value: string) => {
    setDataCreateSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDepartmentChange = (value: Key | null) => {
    if (value !== null) {
      const selectedDepartment = cat_012_departamento.find((dep) => dep.codigo === value);
      if (selectedDepartment) {
        setSelectedCodeDep(selectedDepartment.codigo);
        handleAutocomplete('departamento', selectedDepartment.codigo);
        setSelectedMunicipio('');
      }
    }
  };
  const handleUpdateSupplier = () => {
    try {
      if (dataCreateSupplier) {
        patchSupplier(dataCreateSupplier, dataCreateSupplier?.id ?? 0);
        navigate(-1);
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

  const selectedMunicipioData = useMemo(() => {
    return cat_013_municipios.find((mun) => mun.codigo === selectedMunicipio);
  }, [cat_013_municipios, selectedMunicipio]);

  return (
    <Layout title="">
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

            <div className="grid grid-cols-2 gap-5 pt-3">
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
                  labelPlacement="outside"
                  variant="bordered"
                  label="Departamento"
                  onSelectionChange={(value) => {
                    handleDepartmentChange;
                    if (value !== null) {
                      handleAutocomplete('departamento', value.toString());
                      handleAutocomplete('nombreDepartamento', value.toString());
                      setSelectedCodeDep(value.toString());
                    }
                  }}
                  defaultItems={cat_012_departamento}
                  selectedKey={selectedCodeDep}
                  placeholder="Ingresa el departamento"
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
              <div>
                <Autocomplete
                  label="Municipio"
                  labelPlacement="outside"
                  name="municipio"
                  className="dark:text-white"
                  defaultItems={cat_013_municipios}
                  selectedKey={selectedMunicipioData?.codigo ?? ''}
                  onSelectionChange={(value) => {
                    if (value !== null) {
                      setSelectedMunicipio(value.toString());
                      handleAutocomplete('municipio', value.toString());
                      handleAutocomplete('nombreMunicipio', value.toString());
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
            <div className="pt-2">
              <Textarea
                onChange={handleOnChange}
                value={dataCreateSupplier?.direccion?.complemento || ''}
                label="Complemento de dirección"
                className="dark:text-white"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Ingresa el complemento de dirección"
                name="complemento"
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
