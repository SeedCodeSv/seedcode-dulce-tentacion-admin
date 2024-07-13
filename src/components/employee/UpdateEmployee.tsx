import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import { ArrowLeft } from 'lucide-react';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeePayload } from '../../types/employees.types';
import { toast } from 'sonner';
import { PropsUpdateEmployee } from '@/types/sub_categories.types';

function UpdateEmployee(props: PropsUpdateEmployee) {
  const { theme } = useContext(ThemeContext);
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, getCat013Municipios, cat_012_departamento, cat_013_municipios } =
    useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    getCat013Municipios(codeDepartamento);
    GetStudyLevel();
  }, [codeDepartamento, codigoGenerado]);
  const { patchEmployee } = useEmployeeStore();
  const [dataCreate, setDataCreate] = useState<EmployeePayload>({
    firstName: props.data?.firstName || '',
    secondName: props.data?.secondName || '',
    firstLastName: props.data?.firstLastName || '',
    secondLastName: props.data?.secondLastName || '',
    bankAccount: props.data?.bankAccount || '',
    chargeId: props.data?.chargeId || 0,
    nit: props.data?.nit || '',
    dui: props.data?.dui || '',
    isss: props.data?.isss || '',
    afp: props.data?.afp || '',
    code: props.data?.code || '',
    phone: props.data?.phone || '',
    age: props.data?.age || '',
    salary: props.data?.salary || '',
    dateOfBirth: props.data?.dateOfBirth || '',
    dateOfEntry: props.data?.dateOfEntry || '',
    dateOfExit: props.data?.dateOfExit || '',
    responsibleContact: props.data?.responsibleContact || '',
    statusId: props.data?.employeeStatusId || 0,
    studyLevelId: props.data?.studyLevelId || 0,
    addressId: props.data?.addressId || 0,
    contractTypeId: props.data?.contractTypeId || 0,
    department: props.data?.address.departamento || '',
    departmentName: props.data?.address.nombreDepartamento || '',
    municipality: props.data?.address.municipio || '',
    municipalityName: props.data?.address.nombreMunicipio || '',
    complement: props.data?.address.complemento || '',
    branchId: props.data?.branchId || 0,
  });
  const createEmployee = async () => {
    try {
      const data = await patchEmployee(dataCreate, props.data?.id || 0);
      console.log("jaime lechiga",data)
      if (data) {
        props.id(0);
      } else {
        toast.error('Error al crear el empleado');
      }
    } catch (error) {
      toast.error('Error al crear el empleado');
    }
  };
  const generateCode = () => {
    const name = dataCreate.firstName;
    const lastName = dataCreate.firstLastName;
    const initials = name.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${initials}-${randomNum}`;
    dataCreate.code = code;
    setCodigoGenerado(code);
    return code;
  };

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <Button onClick={() => props.id(0)} className="bg-transparent dark:text-white">
          <ArrowLeft className="dark:text-white" />
          Atras
        </Button>
        <div className="p-2 overflow-y-auto dark:text-white">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col mt-3">
                  <Input
                    onChange={(e) => setDataCreate({ ...dataCreate, firstName: e.target.value })}
                    name="firstName"
                    defaultValue={props.data?.firstName}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, secondName: e.target.value })}
                    name="secondName"
                    defaultValue={props.data?.secondName}
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
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, firstLastName: e.target.value })
                    }
                    name="firstLastName"
                    defaultValue={props.data?.firstLastName}
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
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, secondLastName: e.target.value })
                    }
                    defaultValue={props.data?.secondLastName}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, bankAccount: e.target.value })}
                    name="bankAccount"
                    defaultValue={props.data?.bankAccount}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, dui: e.target.value })}
                    name="dui"
                    defaultValue={props.data?.dui}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, nit: e.target.value })}
                    name="nit"
                    defaultValue={props.data?.nit}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, isss: e.target.value })}
                    name="isss"
                    labelPlacement="outside"
                    defaultValue={props.data?.isss}
                    placeholder="Ingresa el numero de ISSS"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    variant="bordered"
                    label="ISSS"
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    onChange={(e) => setDataCreate({ ...dataCreate, afp: e.target.value })}
                    name="afp"
                    defaultValue={props.data?.afp}
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
                      onChange={(e) => setDataCreate({ ...dataCreate, code: e.target.value })}
                      name="code"
                      defaultValue={props.data?.code}
                      labelPlacement="outside"
                      placeholder="Ingresa el codigo"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      variant="bordered"
                      label="Codigo Empleado"
                    />
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        generateCode();
                      }}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, phone: e.target.value })}
                    type="number"
                    name="name"
                    defaultValue={props.data?.phone}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, age: e.target.value })}
                    type="number"
                    name="age"
                    defaultValue={props.data?.age}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, salary: e.target.value })}
                    type="number"
                    name="salary"
                    defaultValue={props.data?.salary}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfBirth: e.target.value })}
                    type="date"
                    name="dateOfBirth"
                    defaultValue={props.data?.dateOfBirth}
                    labelPlacement="outside"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    variant="bordered"
                    label="Fecha de Nacimiento"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfEntry: e.target.value })}
                    type="date"
                    name="dateOfEntry"
                    defaultValue={props.data?.dateOfEntry}
                    labelPlacement="outside"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    variant="bordered"
                    label="Fecha de Ingreso"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfExit: e.target.value })}
                    type="date"
                    defaultValue={props.data?.dateOfExit}
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
                    placeholder={props.data?.studyLevel.name ?? 'Seleccione el nivel de estudio'}
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                  >
                    {study_level?.map((item) => (
                      <AutocompleteItem
                        onClick={() => setDataCreate({ ...dataCreate, studyLevelId: item.id })}
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
                    placeholder={
                      props.data?.employeeStatus.name ?? ' Seleccione el estado del empleado'
                    }
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                  >
                    {employee_status?.map((item) => (
                      <AutocompleteItem
                        onClick={() => setDataCreate({ ...dataCreate, statusId: item.id })}
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
                    placeholder={props.data?.contractType.name ?? ' Seleccione el tipo de contrato'}
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                  >
                    {contract_type.map((item) => (
                      <AutocompleteItem
                        onClick={() => setDataCreate({ ...dataCreate, contractTypeId: item.id })}
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
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, responsibleContact: e.target.value })
                    }
                    type="text"
                    defaultValue={props.data?.responsibleContact}
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
                    placeholder={props.data?.charge.name ?? 'Seleccione el cargo'}
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                  >
                    {charges.map((item) => (
                      <AutocompleteItem
                        onClick={() => setDataCreate({ ...dataCreate, chargeId: item.id })}
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
                    placeholder={props.data?.branch.name ?? 'Selecciona la sucursal'}
                    variant="bordered"
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                  >
                    {branch_list.map((bra) => (
                      <AutocompleteItem
                        onClick={() => setDataCreate({ ...dataCreate, branchId: bra.id })}
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
                    placeholder={
                      props.data?.address.nombreDepartamento ?? ' Selecciona el departamento'
                    }
                    variant="bordered"
                    onChange={(e) => setCodeDepartamento(e.target.value)}
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    className="dark:text-white"
                  >
                    {cat_012_departamento.map((dep) => (
                      <AutocompleteItem
                        onClick={() => {
                          setCodeDepartamento(dep.codigo),
                            setDataCreate({
                              ...dataCreate,
                              department: dep.codigo,
                              departmentName: dep.valores,
                            });
                        }}
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
                    placeholder={props.data?.address.nombreMunicipio ?? 'Seleccione el municipio'}
                    className="dark:text-white"
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                  >
                    {cat_013_municipios.map((dep) => (
                      <AutocompleteItem
                        onClick={() => {
                          setCodeDepartamento(dep.codigo),
                            setDataCreate({
                              ...dataCreate,
                              municipality: dep.codigo,
                              municipalityName: dep.valores,
                            });
                        }}
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
                    onChange={(e) => setDataCreate({ ...dataCreate, complement: e.target.value })}
                    label="Complemento de dirección"
                    defaultValue={props.data?.address.complemento}
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
                    onClick={createEmployee}
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
  );
}
export default UpdateEmployee;
