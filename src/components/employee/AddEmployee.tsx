import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useState } from 'react';
import { EmployeePayload } from '../../types/employees.types';
import { useEmployeeStore } from '../../store/employee.store';
import { ThemeContext } from '../../hooks/useTheme';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';

import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import { toast } from 'sonner';
import Layout from '../../layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

function AddEmployee() {
  const { theme } = useContext(ThemeContext);
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { postEmployee } = useEmployeeStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, cat_012_departamento, getCat013Municipios, cat_013_municipios } =
    useBillingStore();
  const service = new SeedcodeCatalogosMhService();
  const data = service.get013Municipio('');
  data?.map((r) => r.departamento);
  const [nameDepartamento, setDepartamento] = useState('');

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    service.get013Municipio('014');
    GetStudyLevel();
  }, [nameDepartamento]);
  const handleSubmit = (values: EmployeePayload) => {
    postEmployee(values);
  };

  const navigate = useNavigate();
  return (
    <Layout title="Agregar Empleado">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <Button onClick={() => navigate('/employees')} className="dark:text-white bg-transparent">
            <ArrowLeft className="dark:text-white" />
            Atras
          </Button>
          <div className="p-2 dark:text-white overflow-y-auto">
            <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col mt-3">
                    <Input
                      name="firstName"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer nombre"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Primer Nombre"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="secondName"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo nombre"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Segundo Nombre"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-3">
                    <Input
                      name="firstLastName"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer apellido"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Primer Apellido"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="secondLastName"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo apellido"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Segundo Apellido"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="bankAccount"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de cuenta"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Numero de cuenta bancaria"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="dui"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de DUI"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="DUI"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="nit"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de NIT"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="NIT"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="isss"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de ISSS"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="ISSS"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      name="afp"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de AFP"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="AFP"
                    />
                  </div>
                  <div className="flex flex-row gap-1 mt-3">
                    <div>
                      <Input
                        name="code"
                        labelPlacement="outside"
                        placeholder="Ingresa el codigo"
                        classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                        variant="bordered"
                        label="Codigo Empleado"
                      />
                    </div>
                    <div className="mt-3">
                      <Button
                        className="w-full mt-3 text-sm font-semibold bg-blue-400"
                        style={{
                          backgroundColor: theme.colors.dark,
                          color: theme.colors.primary,
                        }}
                      >
                        Generar
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="number"
                      name="name"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de teléfono"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Teléfono"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="number"
                      name="age"
                      labelPlacement="outside"
                      placeholder="Ingresa la edad"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Edad"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="number"
                      name="salary"
                      labelPlacement="outside"
                      placeholder="Ingresa el salario mensual"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Salario Mensual"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="date"
                      name="dateOfBirth"
                      labelPlacement="outside"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Fecha de Nacimiento"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="date"
                      name="dateOfEntry"
                      labelPlacement="outside"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Fecha de Ingreso"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="date"
                      name="dateOfExit"
                      labelPlacement="outside"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Fecha de Salida"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      variant="bordered"
                      label="Nivel de Estudio"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder="Seleccione el nivel de estudio"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {study_level?.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.name}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      variant="bordered"
                      label="Estado del Empleado"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder="Seleccione el estado del empleado"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {employee_status?.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.name}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      variant="bordered"
                      label="Tipo de contratacion"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder="Seleccione el tipo de contrato"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {contract_type.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.name}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      type="text"
                      name="responsibleContact"
                      labelPlacement="outside"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Contacto Responsable"
                      placeholder="Ingresa el contacto responsable"
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      variant="bordered"
                      label="Cargo"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder="Seleccione el cargo"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {charges.map((item) => (
                        <AutocompleteItem
                          key={JSON.stringify(item)}
                          value={item.name}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder="Selecciona la sucursal"
                      variant="bordered"
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          className="dark:text-white"
                          value={bra.name}
                          key={JSON.stringify(bra)}
                        >
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      label="Departamento"
                      labelPlacement="outside"
                      placeholder="Selecciona el departamento"
                      variant="bordered"
                      onChange={(e) => setDepartamento(e.target.value)}
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      className="dark:text-white"
                    >
                      {cat_012_departamento.map((dep) => (
                        <AutocompleteItem
                          onClick={() => setDepartamento(dep.valores)}
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder="Municipio"
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

                {/* <span className="flex flex-col mt-4">-- Dirección --</span> */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Input
                      label="Complemento de dirección"
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      labelPlacement="outside"
                      variant="bordered"
                      placeholder="Ingresa el complemento de dirección"
                      name="complement"
                    />
                  </div>

                  <div className="mt-0 md:mt-3">
                    <Button
                      className="w-full mt-3 text-sm font-semibold"
                      style={{
                        backgroundColor: theme.colors.dark,
                        color: theme.colors.primary,
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default AddEmployee;
