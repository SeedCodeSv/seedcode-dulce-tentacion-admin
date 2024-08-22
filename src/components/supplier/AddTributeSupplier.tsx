import { useBillingStore } from '../../store/facturation/billing.store';
import { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { get_user } from '../../storage/localStorage';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSupplierStore } from '@/store/supplier.store';

function AddTributeSupplier() {
  const [selectedCodeDep, setSelectedCodeDep] = useState('');
  const {
    getCat012Departamento,
    cat_012_departamento,
    getCat013Municipios,
    cat_013_municipios,
    getCat019CodigoActividadEconomica,
    cat_019_codigo_de_actividad_economica,
    getCat022TipoDeDocumentoDeIde,
    cat_022_tipo_de_documentoDeIde,
  } = useBillingStore();
  useEffect(() => {
    getCat022TipoDeDocumentoDeIde();
    getCat012Departamento();
    getCat019CodigoActividadEconomica();
  }, []);
  const { onPostSupplier } = useSupplierStore();
  useEffect(() => {
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const user = get_user();
  const navigate = useNavigate();
  const [dataCreateSupplier, setDataCreateSupplier] = useState({
    transmitterId: user?.correlative.branch.transmitterId ?? 0,
    nombre: 'N/A',
    nombreComercial: 'N/A',
    correo: 'N/A',
    telefono: '0000-0000',
    numDocumento: '0000000000',
    nit: '000000000',
    tipoDocumento: '13',
    bienTitulo: '05',
    codActividad: 'N/A',
    esContribuyente: 1,
    descActividad: 'N/A',
    municipio: 'N/A',
    nombreMunicipio: 'N/A',
    departamento: 'N/A',
    nombreDepartamento: 'N/A',
    complemento: 'N/A',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataCreateSupplier({ ...dataCreateSupplier, [name]: value });
  };
  const handleChangeAutocomplete = (field: string, value: string) => {
    setDataCreateSupplier((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleSupplier = async () => {
    try {
      await onPostSupplier(dataCreateSupplier);
      navigate(-1);
    } catch (error) {
      return;
    }
  };
  return (
    <Layout title="Nuevo Proveedor">
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
                      const selectedValue = String(e).trim();
                      const selectActividad = cat_019_codigo_de_actividad_economica.find(
                        (dep) => dep.codigo.trim() === selectedValue
                      );
                      if (selectActividad) {
                        handleChangeAutocomplete('codActividad', selectActividad.codigo);
                        handleChangeAutocomplete('descActividad', selectActividad.valores);
                      }
                    }}
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
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
                    onSelectionChange={(e) => {
                      const selectedTypeDocument = cat_022_tipo_de_documentoDeIde.find(
                        (dep) => dep.codigo === new Set([e]).values().next().value
                      );
                      if (selectedTypeDocument)
                        handleChangeAutocomplete('tipoDocumento', selectedTypeDocument.codigo);
                    }}
                    placeholder={'Selecciona el tipo de documento'}
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                  >
                    {cat_022_tipo_de_documentoDeIde.map((dep) => (
                      <AutocompleteItem key={dep.codigo} className="dark:text-white">
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
                      const selectdValue = String(value).trim();
                      const selectActividad = cat_012_departamento.find(
                        (dep) => dep.codigo.trim() === selectdValue
                      );
                      if (selectActividad)
                        handleChangeAutocomplete('departamento', selectActividad.codigo);
                      handleChangeAutocomplete(
                        'nombreDepartamento',
                        selectActividad?.valores ?? ''
                      );
                      setSelectedCodeDep(selectActividad?.codigo ?? '');
                    }}
                    placeholder="Ingresa el departamento"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
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
                    placeholder="Ingresa el municipio"
                    labelPlacement="outside"
                    onSelectionChange={(value) => {
                      const selectdValue = String(value).trim();
                      const selectActividad = cat_013_municipios.find(
                        (dep) => dep.codigo.trim() === selectdValue
                      );
                      if (selectActividad)
                        handleChangeAutocomplete('municipio', selectActividad.codigo);
                      handleChangeAutocomplete('nombreMunicipio', selectActividad?.valores ?? '');
                    }}
                    className="dark:text-white"
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                  >
                    {cat_013_municipios.map((dep) => (
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
              </div>
            </div>

            <div className="pt-2">
              <Textarea
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
                onClick={handleSupplier}
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

export default AddTributeSupplier;
