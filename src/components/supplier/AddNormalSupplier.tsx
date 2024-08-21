import { useEffect, useState } from 'react';
import { useBillingStore } from '../../store/facturation/billing.store';
import { Autocomplete, AutocompleteItem, Button, Input, Textarea, user } from '@nextui-org/react';
import { global_styles } from '../../styles/global.styles';
import { useSupplierStore } from '../../store/supplier.store';
import Layout from '@/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
function AddNormalSupplier() {
  const [selectedCodeDep, setSelectedCodeDep] = useState('');
  useEffect(() => {
    if (selectedCodeDep !== '0') {
      getCat013Municipios(selectedCodeDep);
    }
    getCat013Municipios(selectedCodeDep);
  }, [selectedCodeDep]);
  const { getCat012Departamento, cat_012_departamento, getCat013Municipios, cat_013_municipios } =
    useBillingStore();
  useEffect(() => {
    getCat012Departamento();
  }, []);
  const { user } = useAuthStore();
  const { onPostSupplier } = useSupplierStore();
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
    esContribuyente: 0,
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
  const handleChangeAutocomplete = (name: string, value: string) => {
    setDataCreateSupplier({ ...dataCreateSupplier, [name]: value });
  };
  const navigate = useNavigate();
  const hanledSaveSupplier = () => {
    try {
      onPostSupplier(dataCreateSupplier);
      navigate(-1);
    } catch (error) {
      console.log(error);
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
            <div className="pt-3">
              <Input
                label="Nombre"
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
                  type="number"
                  className="dark:text-white"
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
              <div>
                <Input
                  onChange={handleChange}
                  type="number"
                  label="Numero documento"
                  labelPlacement="outside"
                  className="dark:text-white"
                  name="numDocumento"
                  placeholder="Ingresa el numero documento"
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
                      (dep) => dep.codigo === new Set([value]).values().next().value
                    );
                    if (selectedDepartment) {
                      setSelectedCodeDep(selectedDepartment.codigo);
                    }
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
              <div>
                <Autocomplete
                  label="Municipio"
                  labelPlacement="outside"
                  className="dark:text-white"
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                >
                  {cat_013_municipios.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                      className="dark:text-white"
                    >
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="pt-2">
              <Textarea
                onChange={handleChange}
                label="Complemento de dirección"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                labelPlacement="outside"
                variant="bordered"
                placeholder="Ingresa el complemento de dirección"
                name="complemento"
                className="dark:text-white"
              />
            </div>
            <Button
              onClick={hanledSaveSupplier}
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

export default AddNormalSupplier;
