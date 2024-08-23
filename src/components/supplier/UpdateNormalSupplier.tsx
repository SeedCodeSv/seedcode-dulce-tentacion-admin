import Layout from '@/layout/Layout';
import { useBillingStore } from '@/store/facturation/billing.store';
import { useSupplierStore } from '@/store/supplier.store';
import { global_styles } from '@/styles/global.styles';
import { Supplier } from '@/types/supplier.types';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
function UpdateNormalSupplier() {
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
  } = useBillingStore();
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();

    getCat013Municipios(selectedCodeDep);
  }, [
    getCat012Departamento,
    getCat022TipoDeDocumentoDeIde,
    getCat013Municipios,
    selectedCodeDep,
    supplier,
  ]);
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
                  labelPlacement="outside"
                  variant="bordered"
                  label="Departamento"
                  onSelectionChange={(value) => {
                    const selectedDepartment = cat_012_departamento.find(
                      (dep) => dep.codigo === value
                    );
                    if (selectedDepartment) {
                      setSelectedCodeDep(selectedDepartment.codigo); // Actualiza el estado con el código seleccionado
                      handleAutocomplete('departamento', selectedDepartment.codigo); // Enviar solo el código
                      handleAutocomplete('nombreDepartamento', selectedDepartment.valores); // Enviar solo el nombre
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
                    handleAutocomplete('municipio', selectedMun.codigo);
                    handleAutocomplete('nombreMunicipio', selectedMun.valores);
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
                  <AutocompleteItem value={mun.codigo} key={mun.codigo} className="dark:text-white">
                    {mun.valores}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
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
