import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { ThemeContext } from '../../hooks/useTheme';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import Layout from '../../layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeePayload } from '../../types/employees.types';
import { toast } from 'sonner';
import { Formik } from 'formik';
import { Branch } from '@/types/auth.types';
import { Municipio } from '@/types/billing/cat-013-municipio.types';
import { Departamento } from '@/types/billing/cat-012-departamento.types';
function AddEmployee() {
  const { theme } = useContext(ThemeContext);
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, getCat013Municipios, cat_012_departamento, cat_013_municipios } =
    useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState('');

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('**Primer nombre es requerido**'),
    secondName: yup.string().required('**Segundo nombre es requerido**'),
    firstLastName: yup.string().required('**Primer apellido es requerido**'),
    secondLastName: yup.string().required('**Segundo apellido es requerido**'),
    bankAccount: yup.string().required('**Número de cuenta es requerido**'),
    dui: yup
      .string()
      .required('**Número de DUI es requerido**')
      .matches(/^\d{9}$/, '**Formato de DUI incorrecto**'),
    nit: yup
      .string()
      .notRequired()
      .matches(/^[0-9]{14}$/, '**Formato de NIT incorrecto**'),
    afp: yup.string().notRequired(),
    phone: yup.string().required('**Número de telefono es requerido**'),
    age: yup.string().required('**Edad es requerida**'),
    salary: yup.string().required('**Salario es requerido**'),
    dateOfBirth: yup.string().required('**Fecha de nacimiento es requerida**'),
    dateOfEntry: yup.string().required('**Fecha de ingreso es requerida**'),
    code: yup.string().required('**Campo requerido**'),
    responsibleContact: yup.string().required('**Contacto responsable es requerido**'),
    studyLevelId: yup
      .number()
      .required('**Nivel de estudios es requerido**')
      .min(1, '**Nivel de estudios es requerido**'),
    statusId: yup.number().required('**Estatus es requerido**').min(1, '**Estatus es requerido**'),
    contractTypeId: yup
      .number()
      .required('**Tipo de contrato es requerido**')
      .min(1, '**Tipo de contrato es requerido**'),
    chargeId: yup.number().required('**Cargo es requerido**').min(1, '**Cargo es requerido**'),
    branchId: yup
      .number()
      .required('**Sucursal es requerida**')
      .min(1, '**Sucursal es requerida**'),
    department: yup.string().required('El departamento es requerido'),
    municipality: yup.string().required('El municipio es requerido'),
  });

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

  const generateCode = (setFieldValue: any) => {
    if (!firstName || !lastName) {
      toast.error(
        'Necesitas ingresar el primer nombre y el primer apellido para generar el código.'
      );
      return;
    }
    const firstNameInitial = firstName.charAt(0).toUpperCase();
    const lastNameInitial = lastName.charAt(0).toUpperCase();
    const randomNumber = Math.floor(10 + Math.random() * 90);

    const generatedCode = `${firstNameInitial}${lastNameInitial}${randomNumber}`;
    setCodigoGenerado(generatedCode);

    setFieldValue('code', generatedCode);
  };

  const navigate = useNavigate();
  return (
    <Layout title="Agregar Empleado">
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border p-2 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <Button
            onClick={() => navigate('/employees')}
            className=" bg-transparent dark:text-white text-black"
          >
            <ArrowLeft className="dark:text-white text-black" />
            Regresar
          </Button>
          <div className="overflow-y-auto dark:text-white mt-0">
            <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
              <Formik
                initialValues={dataCreate}
                validationSchema={validationSchema}
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
                          value={values.firstName}
                          onChange={(e) => {
                            handleChange('firstName')(e);
                            setFirstName(e.target.value);
                          }}
                          onBlur={handleBlur('firstName')}
                          name="firstName"
                          labelPlacement="outside"
                          className="font-semibold"
                          isInvalid={touched.firstName && !!errors.firstName}
                          errorMessage={touched.firstName && errors.firstName}
                          placeholder="Ingresa el primer nombre"
                          classNames={{
                            label: 'text-gray-500 text-sm font-semibold',
                          }}
                          variant="bordered"
                          label="Primer Nombre"
                          autoComplete="off"
                        />
                        {/* {errors.firstName && touched.firstName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.firstName}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.secondName}
                          onChange={handleChange('secondName')}
                          onBlur={handleBlur('secondName')}
                          name="secondName"
                          labelPlacement="outside"
                          className="dark:text-white font-semibold"
                          placeholder="Ingresa el segundo nombre"
                          isInvalid={touched.secondName && !!errors.secondName}
                          errorMessage={touched.secondName && errors.secondName}
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Segundo Nombre"
                          autoComplete="off"
                        />
                        {/* {errors.secondName && touched.secondName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.secondName}
                          </span>
                        )} */}
                      </div>
                      <div className="mt-3">
                        <Input
                          value={values.firstLastName}
                          // onChange={handleChange('firstLastName')}
                          onChange={(e) => {
                            handleChange('firstLastName')(e);
                            setLastName(e.target.value);
                          }}
                          onBlur={handleBlur('firstLastName')}
                          name="firstLastName"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          placeholder="Ingresa el primer apellido"
                          isInvalid={touched.firstLastName && !!errors.firstLastName}
                          errorMessage={touched.firstLastName && errors.firstLastName}
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Primer Apellido"
                          autoComplete="off"
                        />
                        {/* {errors.firstLastName && touched.firstLastName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.firstLastName}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.secondLastName}
                          onChange={handleChange('secondLastName')}
                          onBlur={handleBlur('secondLastName')}
                          name="secondLastName"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          placeholder="Ingresa el segundo apellido"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          isInvalid={touched.secondLastName && !!errors.secondLastName}
                          errorMessage={touched.secondLastName && errors.secondLastName}
                          variant="bordered"
                          label="Segundo Apellido"
                          autoComplete="off"
                        />
                        {/* {errors.secondLastName && touched.secondLastName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.secondLastName}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.bankAccount}
                          onChange={handleChange('bankAccount')}
                          onBlur={handleBlur('bankAccount')}
                          name="bankAccount"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de cuenta"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          isInvalid={touched.bankAccount && !!errors.bankAccount}
                          errorMessage={touched.bankAccount && errors.bankAccount}
                          variant="bordered"
                          label="Número de cuenta bancaria"
                          autoComplete="off"
                        />
                        {/* {errors.bankAccount && touched.bankAccount && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.bankAccount}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dui}
                          onChange={handleChange('dui')}
                          onBlur={handleBlur('dui')}
                          name="dui"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de DUI"
                          isInvalid={touched.dui && !!errors.dui}
                          errorMessage={touched.dui && errors.dui}
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="DUI"
                          autoComplete="off"
                        />
                        {/* {errors.dui && touched.dui && (
                          <span className="text-sm font-semibold text-red-500">{errors.dui}</span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.nit}
                          onChange={handleChange('nit')}
                          onBlur={handleBlur('nit')}
                          name="nit"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de NIT"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="NIT"
                          autoComplete="off"
                        />
                        {errors.nit && touched.nit && (
                          <span className="text-sm font-semibold text-red-500">{errors.nit}</span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.isss}
                          onChange={handleChange('isss')}
                          onBlur={handleBlur('isss')}
                          name="isss"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de ISSS"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="ISSS"
                        />
                        {/* {errors.isss && touched.isss && (
                          <span className="text-sm font-semibold text-red-500">{errors.isss}</span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.afp}
                          onChange={handleChange('afp')}
                          onBlur={handleBlur('afp')}
                          name="afp"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de AFP"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="AFP"
                        />
                        {errors.afp && touched.afp && (
                          <span className="text-sm font-semibold text-red-500">{errors.afp}</span>
                        )}
                      </div>
                      <div className="flex flex-row gap-1 mt-3 w-full">
                        <div>
                          <Input
                            className="xl:w-full w-[150px] font-semibold"
                            value={codigo || dataCreate.code}
                            onBlur={handleBlur('code')}
                            onChange={(e) => {
                              handleChange('code')(e);
                              setCodigoGenerado(e.target.value);
                            }}
                            isInvalid={touched.code && !!errors.code}
                            errorMessage={touched.code && errors.code}
                            name="code"
                            labelPlacement="outside"
                            placeholder="Ingresa el código"
                            classNames={{
                              label: 'font-semibold text-sm text-gray-600',
                            }}
                            variant="bordered"
                            label="Código "
                          />
                        </div>
                        <div className="mt-3">
                          <Button
                            onClick={() => generateCode(setFieldValue)}
                            className="xl:w-full w-[140px] mt-3 text-sm font-semibold bg-blue-400"
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
                          value={values.phone}
                          onChange={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          type="number"
                          name="phone"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          placeholder="Ingresa el número de teléfono"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Teléfono"
                          autoComplete="off"
                          isInvalid={touched.phone && !!errors.phone}
                          errorMessage={touched.phone && errors.phone}
                        />
                        {/* {errors.phone && touched.phone && (
                          <span className="text-sm font-semibold text-red-500">{errors.phone}</span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.age}
                          onChange={handleChange('age')}
                          onBlur={handleBlur('age')}
                          type="number"
                          name="age"
                          labelPlacement="outside"
                          placeholder="Ingresa la edad"
                          className="dark:text-white font-semibold"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Edad"
                          autoComplete="off"
                          isInvalid={touched.age && !!errors.age}
                          errorMessage={touched.age && errors.age}
                        />
                        {/* {errors.age && touched.age && (
                          <span className="text-sm font-semibold text-red-500">{errors.age}</span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.salary}
                          onChange={handleChange('salary')}
                          onBlur={handleBlur('salary')}
                          type="number"
                          name="salary"
                          labelPlacement="outside"
                          className="dark:text-white font-semibold"
                          placeholder="Ingresa el salario mensual"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          isInvalid={touched.salary && !!errors.salary}
                          errorMessage={touched.salary && errors.salary}
                          variant="bordered"
                          label="Salario Mensual"
                          autoComplete="off"
                        />
                        {/* {errors.salary && touched.salary && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.salary}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dateOfBirth}
                          onChange={handleChange('dateOfBirth')}
                          onBlur={handleBlur('dateOfBirth')}
                          type="date"
                          name="dateOfBirth"
                          className="dark:text-white font-semibold"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                          errorMessage={touched.dateOfBirth && errors.dateOfBirth}
                          variant="bordered"
                          label="Fecha de Nacimiento"
                          autoComplete="off"
                        />
                        {/* {errors.dateOfBirth && touched.dateOfBirth && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.dateOfBirth}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dateOfEntry}
                          onChange={handleChange('dateOfEntry')}
                          onBlur={handleBlur('dateOfEntry')}
                          type="date"
                          className="dark:text-white font-semibold"
                          name="dateOfEntry"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          isInvalid={touched.dateOfEntry && !!errors.dateOfEntry}
                          errorMessage={touched.dateOfEntry && errors.dateOfEntry}
                          variant="bordered"
                          label="Fecha de Ingreso"
                          autoComplete="off"
                        />
                        {/* {errors.dateOfEntry && touched.dateOfEntry && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.dateOfEntry}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.complement}
                          onChange={handleChange('complement')}
                          onBlur={handleBlur('complement')}
                          label="Complemento de dirección"
                          classNames={{
                            label: 'font-semibold text-gray-500 text-sm',
                          }}
                          labelPlacement="outside"
                          variant="bordered"
                          placeholder="Ingresa el complemento de dirección"
                          name="complement"
                        />
                        {errors.complement && touched.complement && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.complement}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col mt-3">
                        <Autocomplete
                          value={values.studyLevelId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as EmployeePayload;
                              handleChange('studyLevelId')(depSelected?.id?.toString() ?? '');
                            }
                          }}
                          onChange={handleChange('studyLevelId')}
                          onBlur={handleBlur('studyLevelId')}
                          variant="bordered"
                          isInvalid={touched.studyLevelId && !!errors.studyLevelId}
                          errorMessage={touched.studyLevelId && errors.studyLevelId}
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
                              onClick={() =>
                                setDataCreate({
                                  ...dataCreate,
                                  studyLevelId: item.id,
                                })
                              }
                              key={JSON.stringify(item)}
                              value={item.name}
                              className="dark:text-white"
                            >
                              {item.name}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                        {/* {errors.studyLevelId && touched.studyLevelId && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.studyLevelId}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Autocomplete
                          value={values.statusId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as EmployeePayload;
                              handleChange('statusId')(depSelected?.id?.toString() ?? '');
                            }
                          }}
                          onChange={handleChange('statusId')}
                          onBlur={handleBlur('statusId')}
                          variant="bordered"
                          label="Estado del Empleado"
                          labelPlacement="outside"
                          className="dark:text-white"
                          placeholder="Seleccione el estado del empleado"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
                          isInvalid={touched.statusId && !!errors.statusId}
                          errorMessage={touched.statusId && errors.statusId}
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
                        {/* {errors.statusId && touched.statusId && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.statusId}
                          </span>
                        )} */}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Autocomplete
                          value={values.contractTypeId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as EmployeePayload;
                              handleChange('contractTypeId')(depSelected?.id?.toString() ?? '');
                            }
                          }}
                          onChange={handleChange('contractTypeId')}
                          onBlur={handleBlur('contractTypeId')}
                          variant="bordered"
                          label="Tipo de contratacion"
                          labelPlacement="outside"
                          className="dark:text-white"
                          placeholder="Seleccione el tipo de contrato"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
                          isInvalid={touched.contractTypeId && !!errors.contractTypeId}
                          errorMessage={touched.contractTypeId && errors.contractTypeId}
                        >
                          {contract_type.map((item) => (
                            <AutocompleteItem
                              onClick={() =>
                                setDataCreate({
                                  ...dataCreate,
                                  contractTypeId: item.id,
                                })
                              }
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
                          value={values.responsibleContact}
                          onChange={handleChange('responsibleContact')}
                          onBlur={handleBlur('responsibleContact')}
                          className="dark:text-white font-semibold"
                          type="text"
                          name="responsibleContact"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Contacto Responsable"
                          isInvalid={touched.responsibleContact && !!errors.responsibleContact}
                          errorMessage={touched.responsibleContact && errors.responsibleContact}
                          placeholder="Ingresa el contacto responsable"
                          autoComplete="off"
                        />
                        {/* {errors.responsibleContact && touched.responsibleContact && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.responsibleContact}
                          </span>
                        )} */}
                      </div>

                      <div className="flex flex-col mt-3">
                        <Autocomplete
                          value={values.chargeId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as EmployeePayload;
                              handleChange('chargeId')(depSelected?.id?.toString() ?? '');
                            }
                          }}
                          onChange={handleChange('chargeId')}
                          onBlur={handleBlur('chargeId')}
                          variant="bordered"
                          label="Cargo"
                          labelPlacement="outside"
                          className="dark:text-white"
                          placeholder="Seleccione el cargo"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
                          isInvalid={touched.chargeId && !!errors.chargeId}
                          errorMessage={touched.chargeId && errors.chargeId}
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
                        {/* {errors.chargeId && touched.chargeId && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.chargeId}
                          </span>
                        )} */}
                      </div>

                      <div className="mt-3">
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as Municipio;
                              // setSelectedCodeDep(depSelected.codigo);
                              handleChange('department')(depSelected.codigo);
                              handleChange('departmentName')(depSelected.valores);
                            }
                          }}
                          label="Departamento"
                          labelPlacement="outside"
                          placeholder="Selecciona el departamento"
                          variant="bordered"
                          onChange={(e) => setCodeDepartamento(e.target.value)}
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          isInvalid={touched.department && !!errors.department}
                          errorMessage={touched.department && errors.department}
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
                        {/* {errors.department && touched.department && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.department}
                          </span>
                        )} */}
                      </div>
                      <div className="mt-3">
                        <Autocomplete
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as Departamento;
                              handleChange('municipality')(depSelected.codigo);
                              handleChange('municipalityName')(depSelected.valores);
                            }
                          }}
                          label="Municipio"
                          labelPlacement="outside"
                          placeholder="Municipio"
                          className="dark:text-white"
                          variant="bordered"
                          classNames={{
                            base: 'font-semibold text-gray-500 text-sm',
                          }}
                          isInvalid={touched.municipality && !!errors.municipality}
                          errorMessage={touched.municipality && errors.municipality}
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
                        {/* {errors.municipality && touched.municipality && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.municipality}
                          </span>
                        )} */}
                      </div>
                      <div className="mt-3">
                        <Autocomplete
                          value={values.branchId}
                          onSelectionChange={(key) => {
                            if (key) {
                              const depSelected = JSON.parse(key as string) as Branch;
                              handleChange('branchId')(depSelected?.id?.toString() ?? '');
                            }
                          }}
                          onChange={handleChange('branchId')}
                          onBlur={handleBlur('branchId')}
                          label="Sucursal"
                          labelPlacement="outside"
                          placeholder="Selecciona la sucursal"
                          variant="bordered"
                          className="dark:text-white"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
                          isInvalid={touched.branchId && !!errors.branchId}
                          errorMessage={touched.branchId && errors.branchId}
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
                        <Button
                          onClick={() => handleSubmit()}
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
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default AddEmployee;
