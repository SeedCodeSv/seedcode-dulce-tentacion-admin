import { Autocomplete, AutocompleteItem, Button, Input } from '@heroui/react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { useBranchesStore } from '../../store/branches.store';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeePayload } from '../../types/employees.types';


import { PropsUpdateEmployee } from '@/types/sub_categories.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function UpdateEmployee(props: PropsUpdateEmployee) {
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, getCat013Municipios, cat_012_departamento, cat_013_municipios } =
    useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState(props.data?.address?.departamento ?? '');
  const [codigoGenerado, setCodigoGenerado] = useState('');

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    // getCat013Municipios(codeDepartamento);
    GetStudyLevel();
  }, [codeDepartamento, codigoGenerado]);
  useEffect(() => {
    if (codeDepartamento !== '0') {
      getCat013Municipios(props.data?.department ?? codeDepartamento);
    }
    getCat013Municipios(codeDepartamento);
  }, [codeDepartamento, props.data?.address?.departamento]);
  const { patchEmployee, verifyCode } = useEmployeeStore();
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
    contractTypeId: props.data?.contractTypeId || 0,
    department: props.data?.address?.departamento || '',
    departmentName: props.data?.address?.nombreDepartamento || '',
    municipality: props.data?.address?.municipio || '',
    municipalityName: props.data?.address?.nombreMunicipio || '',
    complement: props.data?.address?.complemento || '',
    branchId: props.data?.branchId || 0,
  });

  const defaultValues = {
    secondName: 'N/A',
    secondLastName: 'N/A',
    bankAccount: '000000000',
    phone: '0',
    age: '0',
    salary: '0',
    dateOfBirth: '0000-00-00',
    responsibleContact: 'No Contacto',
    complement: 'No complemento',
  };

  const [error, setError] = useState(false);

  const filledData = {
    ...dataCreate,
    secondName: dataCreate.secondName || defaultValues.secondName,
    secondLastName: dataCreate.secondLastName || defaultValues.secondLastName,
    bankAccount: dataCreate.bankAccount || defaultValues.bankAccount,
    phone: dataCreate.phone || defaultValues.phone,
    age: dataCreate.age || defaultValues.age,
    salary: dataCreate.salary || defaultValues.salary,
    dateOfBirth: dataCreate.dateOfBirth || defaultValues.dateOfBirth,
    responsibleContact: dataCreate.responsibleContact || defaultValues.responsibleContact,
    complement: dataCreate.complement || defaultValues.complement,
  };

  const createEmployee = async () => {
    try {
      const data = await patchEmployee(filledData, props.data?.id || 0);

      if (data) {
        props.id(0);
      }
    } catch (error) {
      toast.error('Error al editar el empleado');
    }
  };
  const generateCode = async () => {
    const name = dataCreate.firstName;
    const lastName = dataCreate.firstLastName;
    const initials = name.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${initials}-${randomNum}`;

    dataCreate.code = code;
    setCodigoGenerado(code);
    const verify = await verifyCode(code);

    if (verify) {
      toast.success('Código disponible');
      setError(false);
    } else {
      setError(true);
    }

    return code;
  };

  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full  border border-white p-2 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <Button className="bg-transparent dark:text-white" onClick={() => props.id(0)}>
          <ArrowLeft className="dark:text-white" />
          Atras
        </Button>
        <div className=" overflow-y-auto dark:text-white">
          <div className="w-full h-full p-5 overflow-y-auto custom-scrollbar1 bg-white rounded-xl dark:bg-transparent">
            <>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.firstName}
                    label="Primer Nombre"
                    labelPlacement="outside"
                    name="firstName"
                    placeholder="Ingresa el primer nombre"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, firstName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.secondName}
                    label="Segundo Nombre"
                    labelPlacement="outside"
                    name="secondName"
                    placeholder="Ingresa el segundo nombre"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, secondName: e.target.value })}
                  />
                </div>
                <div className="mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.firstLastName}
                    label="Primer Apellido"
                    labelPlacement="outside"
                    name="firstLastName"
                    placeholder="Ingresa el primer apellido"
                    variant="bordered"
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, firstLastName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.secondLastName}
                    label="Segundo Apellido"
                    labelPlacement="outside"
                    name="secondLastName"
                    placeholder="Ingresa el segundo apellido"
                    variant="bordered"
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, secondLastName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.bankAccount}
                    label="Numero de cuenta bancaria"
                    labelPlacement="outside"
                    name="bankAccount"
                    placeholder="Ingresa el numero de cuenta"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, bankAccount: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.dui}
                    label="DUI"
                    labelPlacement="outside"
                    name="dui"
                    placeholder="Ingresa el numero de DUI"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, dui: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.nit}
                    label="NIT"
                    labelPlacement="outside"
                    name="nit"
                    placeholder="Ingresa el numero de NIT"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, nit: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.isss}
                    label="ISSS"
                    labelPlacement="outside"
                    name="isss"
                    placeholder="Ingresa el numero de ISSS"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, isss: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.afp}
                    label="AFP"
                    labelPlacement="outside"
                    name="afp"
                    placeholder="Ingresa el numero de AFP"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, afp: e.target.value })}
                  />
                </div>
                <div className="flex flex-row gap-1 mt-3">
                  <div>
                    <Input
                      className="w-[150px] xl:w-full"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Codigo"
                      labelPlacement="outside"
                      name="code"
                      placeholder="Ingresa el codigo"
                      value={dataCreate.code}
                      variant="bordered"
                      onChange={(e) => setDataCreate({ ...dataCreate, code: e.target.value })}
                    />
                    {error && <p className="text-xs text-red-500">{'Este código ya existe'}</p>}
                  </div>
                  <div className="mt-3">
                    <ButtonUi
                      className="xl:w-full w-[140px] mt-3 text-sm"
                      theme={Colors.Info}
                      onPress={() => {
                        generateCode();
                      }}
                    >
                      Generar
                    </ButtonUi>
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.phone}
                    label="Teléfono"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Ingresa el numero de teléfono"
                    type="number"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, phone: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.age}
                    label="Edad"
                    labelPlacement="outside"
                    name="age"
                    placeholder="Ingresa la edad"
                    type="number"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, age: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.salary}
                    label="Salario Mensual"
                    labelPlacement="outside"
                    name="salary"
                    placeholder="Ingresa el salario mensual"
                    type="number"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, salary: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.dateOfBirth}
                    label="Fecha de Nacimiento"
                    labelPlacement="outside"
                    name="dateOfBirth"
                    type="date"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.dateOfEntry}
                    label="Fecha de Ingreso"
                    labelPlacement="outside"
                    name="dateOfEntry"
                    type="date"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfEntry: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.dateOfExit}
                    label="Fecha de Salida"
                    labelPlacement="outside"
                    name="dateOfExit"
                    type="date"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, dateOfExit: e.target.value })}
                  />
                </div>
                <div className="flex flex-col mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                    defaultInputValue={props.data?.studyLevel.name ?? ''}
                    label="Nivel de Estudio"
                    labelPlacement="outside"
                    placeholder={props.data?.studyLevel.name ?? 'Seleccione el nivel de estudio'}
                    variant="bordered"
                  >
                    {study_level?.map((item) => (
                      <AutocompleteItem
                        key={JSON.stringify(item)}
                        className="dark:text-white"
                        onClick={() => setDataCreate({ ...dataCreate, studyLevelId: item.id })}
                      >
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="flex flex-col mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                    defaultInputValue={props.data?.employeeStatus.name ?? ''}
                    label="Estado del Empleado"
                    labelPlacement="outside"
                    placeholder={
                      props.data?.employeeStatus.name ?? ' Seleccione el estado del empleado'
                    }
                    variant="bordered"
                  >
                    {employee_status?.map((item) => (
                      <AutocompleteItem
                        key={JSON.stringify(item)}
                        className="dark:text-white"
                        onClick={() => setDataCreate({ ...dataCreate, statusId: item.id })}
                      >
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="flex flex-col mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                    defaultInputValue={props.data?.contractType.name ?? ''}
                    label="Tipo de contratacion"
                    labelPlacement="outside"
                    placeholder={props.data?.contractType.name ?? ' Seleccione el tipo de contrato'}
                    variant="bordered"
                  >
                    {contract_type.map((item) => (
                      <AutocompleteItem
                        key={JSON.stringify(item)}
                        className="dark:text-white"
                        onClick={() => setDataCreate({ ...dataCreate, contractTypeId: item.id })}
                      >
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="flex flex-col mt-3">
                  <Input
                    autoComplete="off"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    defaultValue={props.data?.responsibleContact}
                    label="Contacto Responsable"
                    labelPlacement="outside"
                    name="responsibleContact"
                    placeholder="Ingresa el contacto responsable"
                    type="text"
                    variant="bordered"
                    onChange={(e) =>
                      setDataCreate({ ...dataCreate, responsibleContact: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                    defaultInputValue={props.data?.charge.name ?? ''}
                    label="Cargo"
                    labelPlacement="outside"
                    placeholder={props.data?.charge.name ?? 'Seleccione el cargo'}
                    variant="bordered"
                  >
                    {charges.map((item) => (
                      <AutocompleteItem
                        key={JSON.stringify(item)}
                        className="dark:text-white"
                        onClick={() => setDataCreate({ ...dataCreate, chargeId: item.id })}
                      >
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm',
                    }}
                    defaultInputValue={props.data?.branch.name ?? ''}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder={props.data?.branch.name ?? 'Selecciona la sucursal'}
                    variant="bordered"
                  >
                    {branch_list.map((bra) => (
                      <AutocompleteItem
                        key={JSON.stringify(bra)}
                        className="dark:text-white"
                        onClick={() => setDataCreate({ ...dataCreate, branchId: bra.id })}
                      >
                        {bra.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    defaultInputValue={props.data?.address?.nombreDepartamento ?? ''}
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder={
                      props.data?.address?.nombreDepartamento ?? ' Selecciona el departamento'
                    }
                    variant="bordered"
                    onChange={(e) => setCodeDepartamento(e.target.value)}
                  >
                    {cat_012_departamento.map((dep) => (
                      <AutocompleteItem
                        key={JSON.stringify(dep)}
                        className="dark:text-white"
                        onClick={() => {
                          setCodeDepartamento(dep.codigo),
                            setDataCreate({
                              ...dataCreate,
                              department: dep.codigo,
                              departmentName: dep.valores,
                            });
                        }}
                      >
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="mt-3">
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                    defaultInputValue={props.data?.address?.nombreMunicipio ?? ''}
                    label="Municipio"
                    labelPlacement="outside"
                    placeholder={props.data?.address?.nombreMunicipio ?? 'Seleccione el municipio'}
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, municipality: e.target.value })}
                  >
                    {cat_013_municipios.map((dep) => (
                      <AutocompleteItem
                        key={JSON.stringify(dep)}
                        className="dark:text-white"
                        onClick={() => {
                          setDataCreate({
                            ...dataCreate,
                            municipality: dep.codigo,
                            municipalityName: dep.valores,
                          });
                        }}
                      >
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>

              {/* <span className="flex flex-col mt-4">-- Dirección --</span> */}
              <div className="grid xl:grid-cols-2 gap-4 mt-5">
                <div>
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    defaultValue={props.data?.address?.complemento ?? ''}
                    label="Complemento de dirección"
                    labelPlacement="outside"
                    name="complement"
                    placeholder="Ingresa el complemento de dirección"
                    variant="bordered"
                    onChange={(e) => setDataCreate({ ...dataCreate, complement: e.target.value })}
                  />
                </div>

                <div className="mt-3 md:mt-3">
                  <ButtonUi
                    className="w-full mt-3 text-sm font-semibold"
                    theme={Colors.Primary}
                    onPress={createEmployee}
                  >
                    Guardar
                  </ButtonUi>
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
