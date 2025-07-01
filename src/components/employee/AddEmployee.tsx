import { Autocomplete, AutocompleteItem, Button, Checkbox, Input } from '@heroui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Formik } from 'formik';

import { useBranchesStore } from '../../store/branches.store';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import Layout from '../../layout/Layout';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeePayload } from '../../types/employees.types';

import { SetFieldValue } from './types/employee.types';
import { validationEmployeeSchema } from './validation-employee';

import { Branch } from '@/types/auth.types';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';


function AddEmployee() {
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, getCat013Municipios, cat_012_departamento, cat_013_municipios } =
    useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState('');
  const [isCutResponsible, setIsCutResponsible] = useState(false)

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    getCat013Municipios(codeDepartamento);
    GetStudyLevel();
  }, [codeDepartamento]);
  const { postEmployee, verifyCode } = useEmployeeStore();

  const [dataCreate, setDataCreate] = useState<EmployeePayload>({
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    bankAccount: '',
    chargeId: 0,
    nit: '',
    dui: '',
    isss: '',
    afp: '',
    code: '',
    phone: '',
    age: '',
    salary: '',
    dateOfBirth: '',
    dateOfEntry: '',
    dateOfExit: '',
    responsibleContact: '',
    statusId: 0,
    studyLevelId: 0,
    contractTypeId: 0,
    department: '',
    departmentName: '',
    municipality: '',
    municipalityName: '',
    complement: '',
    branchId: 0,
    isResponsibleCutZ: isCutResponsible
  });

  const createEmployee = async (values: EmployeePayload) => {
    const codigoFinal = values.code || codigo;
    const verify = await verifyCode(codigoFinal);

    if (!verify) {
      toast.error('Ya existe un empleado con este código');

      return;
    }
    const updatedValues = {
      ...values,
      isss: values.isss || '0',
      afp: values.afp || '0',
      complement: values.complement || 'N/A',
      nit: values.nit || '0',
      code: codigoFinal,
      isResponsibleCutZ: isCutResponsible ?? false
    };

    try {
      const data = await postEmployee(updatedValues);

      if (data) {
        navigate('/employees');
      }
    } catch (error) {
      toast.error('Error al crear el empleado');
    }
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [codigo, setCodigoGenerado] = useState('');
  const generateCode = (
    setFieldValue: SetFieldValue,
    firstName: string,
    lastName: string,
    setCodigoGenerado: Dispatch<SetStateAction<string>>
  ) => {
    if (!firstName || !lastName) {
      toast.error(
        'Necesitas ingresar el primer nombre y el primer apellido para generar el código.'
      );

      return;
    }

    const firstNamePart = firstName.slice(0, 2).toUpperCase();
    const lastNamePart = lastName.slice(0, 2).toUpperCase();

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const generatedCode = `${firstNamePart}${lastNamePart}${randomNumber}`;

    setCodigoGenerado(generatedCode);
    setFieldValue('code', generatedCode);
  };

  const navigate = useNavigate();

  return (
    <Layout title="Agregar Empleado">
      <DivGlobal>
        <div className='w-full flex flex-row justify-between'>
          <Button
            className=" bg-transparent dark:text-white text-black"
            onPress={() => navigate('/employees')}
          >
            <ArrowLeft className="dark:text-white text-black" />
            Regresar
          </Button>
          <button
            className='flex flex-row justify-start mr-8 border border-sky-200 rounded-xl p-2'>
            <Checkbox
              checked={isCutResponsible}
              size='md'
              color={'warning'}
              onChange={() => setIsCutResponsible(!isCutResponsible)}
            />
            <p className='dark:text-white mt-1 text-sky-500'>Responsable de corte Z</p>
          </button>
        </div>
        <div className="overflow-y-auto dark:text-white mt-0">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
            <Formik
              initialValues={dataCreate}
              validationSchema={validationEmployeeSchema}
              onSubmit={createEmployee}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
              }) => (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="font-semibold"
                        classNames={{
                          label: 'text-gray-500 text-sm font-semibold',
                        }}
                        errorMessage={touched.firstName && errors.firstName}
                        isInvalid={touched.firstName && !!errors.firstName}
                        label="Primer Nombre"
                        labelPlacement="outside"
                        name="firstName"
                        placeholder="Ingresa el primer nombre"
                        value={values.firstName}
                        variant="bordered"
                        onBlur={handleBlur('firstName')}
                        onChange={(e) => {
                          handleChange('firstName')(e);
                          setFirstName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.secondName && errors.secondName}
                        isInvalid={touched.secondName && !!errors.secondName}
                        label="Segundo Nombre"
                        labelPlacement="outside"
                        name="secondName"
                        placeholder="Ingresa el segundo nombre"
                        value={values.secondName}
                        variant="bordered"
                        onBlur={handleBlur('secondName')}
                        onChange={handleChange('secondName')}
                      />
                    </div>
                    <div className="mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.firstLastName && errors.firstLastName}
                        isInvalid={touched.firstLastName && !!errors.firstLastName}
                        label="Primer Apellido"
                        labelPlacement="outside"
                        name="firstLastName"
                        placeholder="Ingresa el primer apellido"
                        value={values.firstLastName}
                        variant="bordered"
                        onBlur={handleBlur('firstLastName')}
                        onChange={(e) => {
                          handleChange('firstLastName')(e);
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.secondLastName && errors.secondLastName}
                        isInvalid={touched.secondLastName && !!errors.secondLastName}
                        label="Segundo Apellido"
                        labelPlacement="outside"
                        name="secondLastName"
                        placeholder="Ingresa el segundo apellido"
                        value={values.secondLastName}
                        variant="bordered"
                        onBlur={handleBlur('secondLastName')}
                        onChange={handleChange('secondLastName')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.bankAccount && errors.bankAccount}
                        isInvalid={touched.bankAccount && !!errors.bankAccount}
                        label="Número de cuenta bancaria"
                        labelPlacement="outside"
                        name="bankAccount"
                        placeholder="Ingresa el número de cuenta"
                        value={values.bankAccount}
                        variant="bordered"
                        onBlur={handleBlur('bankAccount')}
                        onChange={handleChange('bankAccount')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.dui && errors.dui}
                        isInvalid={touched.dui && !!errors.dui}
                        label="DUI"
                        labelPlacement="outside"
                        name="dui"
                        placeholder="Ingresa el número de DUI"
                        value={values.dui}
                        variant="bordered"
                        onBlur={handleBlur('dui')}
                        onChange={handleChange('dui')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.nit && errors.nit}
                        isInvalid={touched.nit && !!errors.nit}
                        label="NIT"
                        labelPlacement="outside"
                        name="nit"
                        placeholder="Ingresa el número de NIT"
                        value={values.nit}
                        variant="bordered"
                        onBlur={handleBlur('nit')}
                        onChange={handleChange('nit')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        label="ISSS"
                        labelPlacement="outside"
                        name="isss"
                        placeholder="Ingresa el número de ISSS"
                        value={values.isss}
                        variant="bordered"
                        onBlur={handleBlur('isss')}
                        onChange={handleChange('isss')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        label="AFP"
                        labelPlacement="outside"
                        name="afp"
                        placeholder="Ingresa el número de AFP"
                        value={values.afp}
                        variant="bordered"
                        onBlur={handleBlur('afp')}
                        onChange={handleChange('afp')}
                      />
                      {errors.afp && touched.afp && (
                        <span className="text-sm font-semibold text-red-500">{errors.afp}</span>
                      )}
                    </div>
                    <div className="flex flex-row gap-1 mt-3 w-full">
                      <div>
                        <Input
                          className="xl:w-full w-[150px] font-semibold"
                          classNames={{
                            label: 'font-semibold text-sm text-gray-600',
                          }}
                          errorMessage={touched.code && errors.code}
                          isInvalid={touched.code && !!errors.code}
                          label="Código "
                          labelPlacement="outside"
                          name="code"
                          placeholder="Ingresa el código"
                          value={codigo || dataCreate.code}
                          variant="bordered"
                          onBlur={handleBlur('code')}
                          onChange={(e) => {
                            handleChange('code')(e);
                            setCodigoGenerado(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <ButtonUi
                          className="xl:w-full w-[140px] mt-3"
                          theme={Colors.Info}
                          onPress={() =>
                            generateCode(
                              setFieldValue,
                              firstName,
                              lastName,
                              setCodigoGenerado
                            )
                          }
                        >
                          Generar
                        </ButtonUi>
                      </div>
                    </div>

                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.phone && errors.phone}
                        isInvalid={touched.phone && !!errors.phone}
                        label="Teléfono"
                        labelPlacement="outside"
                        name="phone"
                        placeholder="Ingresa el número de teléfono"
                        type="number"
                        value={values.phone}
                        variant="bordered"
                        onBlur={handleBlur('phone')}
                        onChange={handleChange('phone')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.age && errors.age}
                        isInvalid={touched.age && !!errors.age}
                        label="Edad"
                        labelPlacement="outside"
                        name="age"
                        placeholder="Ingresa la edad"
                        type="number"
                        value={values.age}
                        variant="bordered"
                        onBlur={handleBlur('age')}
                        onChange={handleChange('age')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.salary && errors.salary}
                        isInvalid={touched.salary && !!errors.salary}
                        label="Salario Mensual"
                        labelPlacement="outside"
                        name="salary"
                        placeholder="Ingresa el salario mensual"
                        type="number"
                        value={values.salary}
                        variant="bordered"
                        onBlur={handleBlur('salary')}
                        onChange={handleChange('salary')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.dateOfBirth && errors.dateOfBirth}
                        isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                        label="Fecha de Nacimiento"
                        labelPlacement="outside"
                        name="dateOfBirth"
                        type="date"
                        value={values.dateOfBirth}
                        variant="bordered"
                        onBlur={handleBlur('dateOfBirth')}
                        onChange={handleChange('dateOfBirth')}
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.dateOfEntry && errors.dateOfEntry}
                        isInvalid={touched.dateOfEntry && !!errors.dateOfEntry}
                        label="Fecha de Ingreso"
                        labelPlacement="outside"
                        name="dateOfEntry"
                        type="date"
                        value={values.dateOfEntry}
                        variant="bordered"
                        onBlur={handleBlur('dateOfEntry')}
                        onChange={handleChange('dateOfEntry')}
                      />

                    </div>
                    <div className="flex flex-col mt-3">
                      <Input
                        autoComplete="off"
                        className="dark:text-white font-semibold"
                        classNames={{
                          label: 'font-semibold text-sm  text-gray-600',
                        }}
                        errorMessage={touched.responsibleContact && errors.responsibleContact}
                        isInvalid={touched.responsibleContact && !!errors.responsibleContact}
                        label="Contacto Responsable"
                        labelPlacement="outside"
                        name="responsibleContact"
                        placeholder="Ingresa el contacto responsable"
                        type="text"
                        value={values.responsibleContact}
                        variant="bordered"
                        onBlur={handleBlur('responsibleContact')}
                        onChange={handleChange('responsibleContact')}
                      />
                    </div>

                    <div className="flex flex-col mt-3">
                      <Autocomplete
                        className="dark:text-white"
                        classNames={{
                          base: 'font-semibold text-sm',
                        }}
                        errorMessage={touched.studyLevelId && errors.studyLevelId}
                        isInvalid={touched.studyLevelId && !!errors.studyLevelId}
                        label="Nivel de Estudio"
                        labelPlacement="outside"
                        placeholder="Seleccione el nivel de estudio"
                        value={values.studyLevelId}
                        variant="bordered"
                        onBlur={handleBlur('studyLevelId')}
                        onChange={handleChange('studyLevelId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as EmployeePayload;

                            handleChange('studyLevelId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                      >
                        {study_level?.map((item) => (
                          <AutocompleteItem
                            key={JSON.stringify(item)}
                            className="dark:text-white"
                            onPress={() =>
                              setDataCreate({
                                ...dataCreate,
                                studyLevelId: item.id,
                              })
                            }
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
                        errorMessage={touched.statusId && errors.statusId}
                        isInvalid={touched.statusId && !!errors.statusId}
                        label="Estado del Empleado"
                        labelPlacement="outside"
                        placeholder="Seleccione el estado del empleado"
                        value={values.statusId}
                        variant="bordered"
                        onBlur={handleBlur('statusId')}
                        onChange={handleChange('statusId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as EmployeePayload;

                            handleChange('statusId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                      >
                        {employee_status?.map((item) => (
                          <AutocompleteItem
                            key={JSON.stringify(item)}
                            className="dark:text-white"
                            onPress={() => setDataCreate({ ...dataCreate, statusId: item.id })}
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
                        errorMessage={touched.contractTypeId && errors.contractTypeId}
                        isInvalid={touched.contractTypeId && !!errors.contractTypeId}
                        label="Tipo de contratacion"
                        labelPlacement="outside"
                        placeholder="Seleccione el tipo de contrato"
                        value={values.contractTypeId}
                        variant="bordered"
                        onBlur={handleBlur('contractTypeId')}
                        onChange={handleChange('contractTypeId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as EmployeePayload;

                            handleChange('contractTypeId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                      >
                        {contract_type.map((item) => (
                          <AutocompleteItem
                            key={JSON.stringify(item)}
                            className="dark:text-white"
                            onPress={() =>
                              setDataCreate({
                                ...dataCreate,
                                contractTypeId: item.id,
                              })
                            }
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
                        errorMessage={touched.branchId && errors.branchId}
                        isInvalid={touched.branchId && !!errors.branchId}
                        label="Sucursal"
                        labelPlacement="outside"
                        placeholder="Selecciona la sucursal"
                        value={values.branchId}
                        variant="bordered"
                        onBlur={handleBlur('branchId')}
                        onChange={handleChange('branchId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as Branch;

                            handleChange('branchId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                      >
                        {branch_list.map((bra) => (
                          <AutocompleteItem
                            key={JSON.stringify(bra)}
                            className="dark:text-white"
                            onPress={() => setDataCreate({ ...dataCreate, branchId: bra.id })}
                          >
                            {bra.name}
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
                        errorMessage={touched.chargeId && errors.chargeId}
                        isInvalid={touched.chargeId && !!errors.chargeId}
                        label="Cargo"
                        labelPlacement="outside"
                        placeholder="Seleccione el cargo"
                        value={values.chargeId}
                        variant="bordered"
                        onBlur={handleBlur('chargeId')}
                        onChange={handleChange('chargeId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as EmployeePayload;

                            handleChange('chargeId')(depSelected?.id?.toString() ?? '');
                          }
                        }}
                      >
                        {charges.map((item) => (
                          <AutocompleteItem
                            key={JSON.stringify(item)}
                            className="dark:text-white"
                            onPress={() => setDataCreate({ ...dataCreate, chargeId: item.id })}
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
                          base: 'font-semibold text-gray-500 text-sm',
                        }}
                        errorMessage={touched.department && errors.department}
                        isInvalid={touched.department && !!errors.department}
                        label="Departamento"
                        labelPlacement="outside"
                        placeholder="Selecciona el departamento"
                        variant="bordered"
                        onChange={(e) => setCodeDepartamento(e.target.value)}
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as Municipio;

                            // setSelectedCodeDep(depSelected.codigo);
                            handleChange('department')(depSelected.codigo);
                            handleChange('departmentName')(depSelected.valores);
                          }
                        }}
                      >
                        {cat_012_departamento.map((dep) => (
                          <AutocompleteItem
                            key={JSON.stringify(dep)}
                            className="dark:text-white"
                            onPress={() => {
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
                        errorMessage={touched.municipality && errors.municipality}
                        isInvalid={touched.municipality && !!errors.municipality}
                        label="Municipio"
                        labelPlacement="outside"
                        placeholder="Municipio"
                        variant="bordered"
                        onSelectionChange={(key) => {
                          if (key) {
                            const depSelected = JSON.parse(key as string) as Departamento;

                            handleChange('municipality')(depSelected.codigo);
                            handleChange('municipalityName')(depSelected.valores);
                          }
                        }}
                      >
                        {cat_013_municipios.map((dep) => (
                          <AutocompleteItem
                            key={JSON.stringify(dep)}
                            className="dark:text-white"
                            onPress={() => {
                              setCodeDepartamento(dep.codigo),
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
                      {/* {errors.municipality && touched.municipality && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.municipality}
                          </span>
                        )} */}
                    </div>
                    <div className="mt-3">
                      <Input
                        classNames={{
                          label: 'font-semibold text-gray-500 text-sm',
                        }}
                        label="Complemento de dirección"
                        labelPlacement="outside"
                        name="complement"
                        placeholder="Ingresa el complemento de dirección"
                        value={values.complement}
                        variant="bordered"
                        onBlur={handleBlur('complement')}
                        onChange={handleChange('complement')}
                      />
                      {errors.complement && touched.complement && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.complement}
                        </span>
                      )}

                      {/* {errors.branchId && touched.branchId && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.branchId}
                          </span>
                        )} */}
                    </div>
                  </div>

                  {/* <span className="flex flex-col mt-4">-- Dirección --</span> */}
                  <div className="grid grid-cols-1 gap-4 mt-3 md:grid-cols-2">
                    <div className="mt-0 md:mt-3">
                      <ButtonUi
                        className="w-full mt-3 text-sm font-semibold"
                        theme={Colors.Primary}
                        onPress={() => handleSubmit()}
                      >
                        Guardar
                      </ButtonUi>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </DivGlobal>
    </Layout>
  );
}
export default AddEmployee;
