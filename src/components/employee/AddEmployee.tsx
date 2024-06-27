import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Branches } from '../../types/branches.types';
import { Employee, EmployeePayload } from '../../types/employees.types';
import { useEmployeeStore } from '../../store/employee.store';
import { ThemeContext } from '../../hooks/useTheme';
import { useChargesStore } from '../../store/charges.store';
import { Municipio } from '../../types/billing/cat-013-municipio.types';
import { useBillingStore } from '../../store/facturation/billing.store';
import { Departamento } from '../../types/billing/cat-012-departamento.types';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';

interface Props {
  closeModal: () => void;
  employee: Employee | undefined;
}

function AddEmployee(props: Props) {
  const { theme } = useContext(ThemeContext);
  const [selectCodeDep, setSelectCodeDep] = useState('0');
  const [employee, setEmployee] = useState({ firstName: '', firstLastName: '', employeeCode: '' });
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { patchEmployee, postEmployee } = useEmployeeStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, cat_012_departamento, getCat013Municipios, cat_013_municipios } =
    useBillingStore();

  const initialValues = {
    firstName: props.employee?.firstName ?? '',
    firstLastName: props.employee?.firstLastName ?? '',
    secondName: props.employee?.secondName ?? '',
    bankAccount: props.employee?.bankAccount ?? '',
    secondLastName: props.employee?.secondLastName ?? '',
    nit: props.employee?.nit ?? '',
    chargeId: props.employee?.chargeId ?? 0,
    isss: props.employee?.isss ?? '',
    afp: props.employee?.afp ?? '',
    code: props.employee?.code ?? '',
    dui: props.employee?.dui ?? '',
    phone: props.employee?.phone ?? '',
    age: props.employee?.age ?? '',
    salary: props.employee?.salary ?? '',
    dateOfBirth: props.employee?.dateOfBirth ?? '',
    dateOfEntry: props.employee?.dateOfEntry ?? '',
    dateOfExit: props.employee?.dateOfExit ?? '',
    responsibleContact: props.employee?.responsibleContact ?? '',
    statusId: props.employee?.statusId ?? 0,
    studyLevelId: props.employee?.studyLevelId ?? 0,
    contractTypeId: props.employee?.contractTypeId ?? 0,
    department: props.employee?.address?.departamento ?? '',
    departmentName: props.employee?.address?.nombreDepartamento ?? '',
    municipality: props.employee?.address?.municipio ?? '',
    municipalityName: props.employee?.address?.nombreMunicipio ?? '',
    complement: props.employee?.address?.complemento ?? '',
    branchId: props.employee?.branchId ?? 0,
  };

  const generateEmployeeCode = () => {
    const { firstName, firstLastName } = employee;
    if (firstName && firstLastName) {
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = firstLastName.charAt(0).toUpperCase();
      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      const generatedCode = `${firstInitial}${lastInitial}${randomNumbers}`;
      setEmployee({ ...employee, employeeCode: generatedCode });
    } else {
      alert('Please enter first name and last name');
    }
  };

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    GetStudyLevel();
  }, []);

  useEffect(() => {
    getCat013Municipios(selectCodeDep);
  }, [selectCodeDep]);

  const validationSchema = yup.object().shape({
    phone: yup
      .string()
      .required('El teléfono es requerido')
      .matches(/^(?:[267][0-9]{7}|[78][0-9]{6})$/, 'El teléfono no es valido'),
    branchId: yup
      .number()
      .required('La sucursal es requerida')
      .typeError('La sucursal es requerida'),
  });

  const handleSubmit = (values: EmployeePayload) => {
    if (props.employee) {
      patchEmployee(values, props.employee.id);
    } else {
      postEmployee(values);
    }

    props.closeModal();
  };

  const selectedKeyBranch = useMemo(() => {
    if (props.employee) {
      const branch = branch_list.find((branch) => branch.id === props.employee?.branchId);

      return JSON.stringify(branch);
    }
  }, [props, props.employee, branch_list]);

  const selectedKeyDepartment = useMemo(() => {
    if (props.employee?.address) {
      const department = cat_012_departamento.find(
        (department) => department.codigo === props.employee?.address?.departamento
      );

      return JSON.stringify(department);
    }
  }, [props, props.employee?.address, cat_012_departamento, cat_012_departamento.length]);

  const selectedKeyCity = useMemo(() => {
    if (props.employee?.address) {
      const city = cat_013_municipios.find(
        (department) => department.codigo === props.employee?.address?.municipio
      );
      return JSON.stringify(city);
    }
  }, [props, props.employee?.address, cat_013_municipios, cat_013_municipios.length]);
  return (
    <div className="p-4 dark:text-white overflow-y-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col mt-3">
                <Input
                  name="firstName"
                  labelPlacement="outside"
                  value={values.firstName}
                  onChange={(e) => {
                    handleChange(e);
                    setEmployee({ ...employee, firstName: e.target.value });
                  }}
                  onBlur={handleBlur('firstName')}
                  placeholder="Ingresa el primer nombre"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Primer Nombre"
                  autoComplete="off"
                />
                {errors.firstName && touched.firstName && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.firstName}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="secondName"
                  labelPlacement="outside"
                  value={values.secondName}
                  onChange={(e) => {
                    handleChange(e);
                    setEmployee({ ...employee, firstLastName: e.target.value });
                  }}
                  onBlur={handleBlur('secondName')}
                  placeholder="Ingresa el segundo nombre"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Segundo Nombre"
                  autoComplete="off"
                />
                {errors.secondName && touched.secondName && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.secondName}</span>
                  </>
                )}
              </div>
              <div className="mt-3">
                <Input
                  name="firstLastName"
                  labelPlacement="outside"
                  value={values.firstLastName}
                  onChange={handleChange('firstLastName')}
                  onBlur={handleBlur('firstLastName')}
                  placeholder="Ingresa el primer apellido"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Primer Apellido"
                  autoComplete="off"
                />
                {errors.firstLastName && touched.firstLastName && (
                  <>
                    <span className="text-sm font-semibold text-red-600">
                      {errors.firstLastName}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="secondLastName"
                  labelPlacement="outside"
                  value={values.secondLastName}
                  onChange={handleChange('secondLastName')}
                  onBlur={handleBlur('secondLastName')}
                  placeholder="Ingresa el segundo apellido"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Segundo Apellido"
                  autoComplete="off"
                />
                {errors.secondLastName && touched.secondLastName && (
                  <>
                    <span className="text-sm font-semibold text-red-600">
                      {errors.secondLastName}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="bankAccount"
                  labelPlacement="outside"
                  value={values.bankAccount}
                  onChange={handleChange('bankAccount')}
                  onBlur={handleBlur('bankAccount')}
                  placeholder="Ingresa el numero de cuenta"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Numero de cuenta bancaria"
                  autoComplete="off"
                />
                {errors.bankAccount && touched.bankAccount && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.bankAccount}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="dui"
                  labelPlacement="outside"
                  value={values.dui}
                  onChange={handleChange('dui')}
                  onBlur={handleBlur('dui')}
                  placeholder="Ingresa el numero de DUI"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="DUI"
                  autoComplete="off"
                />
                {errors.dui && touched.dui && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.dui}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="nit"
                  labelPlacement="outside"
                  value={values.nit}
                  onChange={handleChange('nit')}
                  onBlur={handleBlur('nit')}
                  placeholder="Ingresa el numero de NIT"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="NIT"
                  autoComplete="off"
                />
                {errors.nit && touched.nit && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.nit}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="isss"
                  labelPlacement="outside"
                  value={values.isss}
                  onChange={handleChange('isss')}
                  onBlur={handleBlur('isss')}
                  placeholder="Ingresa el numero de ISSS"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="ISSS"
                />
                {errors.isss && touched.isss && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.isss}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  name="afp"
                  labelPlacement="outside"
                  value={values.afp}
                  onChange={handleChange('afp')}
                  onBlur={handleBlur('afp')}
                  placeholder="Ingresa el numero de AFP"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="AFP"
                />
                {errors.afp && touched.afp && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.afp}</span>
                  </>
                )}
              </div>
              <div className="flex flex-row gap-1 mt-3">
                <div>
                  <Input
                    name="code"
                    labelPlacement="outside"
                    value={values.code}
                    onChange={handleChange('code')}
                    onBlur={handleBlur('code')}
                    placeholder="Ingresa el codigo"
                    classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                    variant="bordered"
                    label="Codigo Empleado"
                  />
                </div>
                <div className="mt-3">
                  <Button
                    className="w-full mt-3 text-sm font-semibold bg-blue-400"
                    onClick={(e) => {
                      e.preventDefault();
                      generateEmployeeCode();
                      handleChange('code')(employee.employeeCode);
                    }}
                    style={{
                      backgroundColor: theme.colors.dark,
                      color: theme.colors.primary,
                    }}
                  >
                    Generar
                  </Button>
                </div>
                {errors.code && touched.code && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.code}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="number"
                  name="name"
                  labelPlacement="outside"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  placeholder="Ingresa el numero de teléfono"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Teléfono"
                  autoComplete="off"
                />
                {errors.phone && touched.phone && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.phone}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="number"
                  name="age"
                  labelPlacement="outside"
                  value={values.age}
                  onChange={handleChange('age')}
                  onBlur={handleBlur('age')}
                  placeholder="Ingresa la edad"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Edad"
                  autoComplete="off"
                />
                {errors.age && touched.age && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.age}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="number"
                  name="salary"
                  labelPlacement="outside"
                  value={values.salary}
                  onChange={handleChange('salary')}
                  onBlur={handleBlur('salary')}
                  placeholder="Ingresa el salario mensual"
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Salario Mensual"
                  autoComplete="off"
                />
                {errors.salary && touched.salary && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.salary}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="date"
                  name="dateOfBirth"
                  labelPlacement="outside"
                  value={values.dateOfBirth}
                  onChange={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Fecha de Nacimiento"
                  autoComplete="off"
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.dateOfBirth}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="date"
                  name="dateOfEntry"
                  labelPlacement="outside"
                  value={values.dateOfEntry}
                  onChange={handleChange('dateOfEntry')}
                  onBlur={handleBlur('dateOfEntry')}
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Fecha de Ingreso"
                  autoComplete="off"
                />
                {errors.dateOfEntry && touched.dateOfEntry && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.dateOfEntry}</span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="date"
                  name="dateOfExit"
                  labelPlacement="outside"
                  value={values.dateOfExit}
                  onChange={handleChange('dateOfExit')}
                  onBlur={handleBlur('dateOfExit')}
                  classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                  variant="bordered"
                  label="Fecha de Salida"
                  autoComplete="off"
                />
                {errors.dateOfExit && touched.dateOfExit && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.dateOfExit}</span>
                  </>
                )}
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
                  defaultInputValue={props.employee?.studyLevel?.name}
                >
                  {study_level?.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.name}
                      onClick={() => {
                        handleChange('studyLevelId')(item.id.toString());
                      }}
                      className="dark:text-white"
                    >
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.studyLevelId && touched.studyLevelId && (
                  <>
                    <span className="text-sm font-semibold text-red-600">
                      {errors.studyLevelId}
                    </span>
                  </>
                )}
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
                  defaultInputValue={props.employee?.employeeStatus?.name}
                >
                  {employee_status?.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.name}
                      onClick={() => {
                        handleChange('statusId')(item.id.toString());
                      }}
                      className="dark:text-white"
                    >
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.statusId && touched.statusId && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.statusId}</span>
                  </>
                )}
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
                  defaultInputValue={props.employee?.contractType?.name}
                >
                  {contract_type.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.name}
                      onClick={() => {
                        handleChange('contractTypeId')(item.id.toString());
                        console.log(item.id.toString());
                      }}
                      className="dark:text-white"
                    >
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.contractTypeId && touched.contractTypeId && (
                  <>
                    <span className="text-sm font-semibold text-red-600">
                      {errors.contractTypeId}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-3">
                <Input
                  type="text"
                  name="responsibleContact"
                  labelPlacement="outside"
                  value={values.responsibleContact}
                  onChange={handleChange('responsibleContact')}
                  onBlur={handleBlur('responsibleContact')}
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
                  defaultInputValue={props.employee?.charge?.name}
                >
                  {charges.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.name}
                      onClick={() => {
                        handleChange('chargeId')(item.id.toString());
                      }}
                      className="dark:text-white"
                    >
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.chargeId && touched.chargeId && (
                  <>
                    <span className="text-sm font-semibold text-red-600">{errors.chargeId}</span>
                  </>
                )}
              </div>
              <div className="mt-3">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const branchSelected = JSON.parse(key as string) as Branches;
                      handleChange('branchId')(branchSelected.id.toString());
                    }
                  }}
                  onBlur={handleBlur('branchId')}
                  label="Sucursal"
                  labelPlacement="outside"
                  placeholder="Selecciona la sucursal"
                  variant="bordered"
                  className="dark:text-white"
                  classNames={{
                    base: 'font-semibold text-sm',
                  }}
                  defaultSelectedKey={selectedKeyBranch}
                  value={selectedKeyBranch}
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
                {errors.branchId && touched.branchId && (
                  <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
                )}
              </div>
              <div className="mt-3">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Departamento;
                      setSelectCodeDep(depSelected.codigo);
                      handleChange('department')(depSelected.codigo);
                      handleChange('departmentName')(depSelected.valores);
                    }
                  }}
                  onBlur={handleBlur('department')}
                  label="Departamento"
                  labelPlacement="outside"
                  placeholder={
                    values.department ? values.departmentName : 'Selecciona el departamento'
                  }
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  className="dark:text-white"
                  defaultSelectedKey={selectedKeyDepartment}
                  value={selectedKeyDepartment}
                >
                  {cat_012_departamento.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                      className="dark:text-white"
                    >
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.department && touched.department && (
                  <span className="text-sm font-semibold text-red-500">{errors.department}</span>
                )}
              </div>
              <div className="mt-3">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Municipio;
                      handleChange('municipality')(depSelected.codigo);
                      handleChange('municipalityName')(depSelected.valores);
                    }
                  }}
                  onBlur={handleBlur('municipio')}
                  label="Municipio"
                  labelPlacement="outside"
                  className="dark:text-white"
                  placeholder={
                    values.municipality ? values.municipalityName : 'Selecciona el municipio'
                  }
                  variant="bordered"
                  classNames={{
                    base: 'font-semibold text-gray-500 text-sm',
                  }}
                  defaultSelectedKey={props.employee?.address?.municipio}
                  value={selectedKeyCity}
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
                {errors.municipality && touched.municipality && (
                  <span className="text-sm font-semibold text-red-500">{errors.municipality}</span>
                )}
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
                  value={values.complement}
                  onChange={handleChange('complement')}
                  onBlur={handleBlur('complement')}
                />
                {errors.complement && touched.complement && (
                  <span className="text-sm font-semibold text-red-500">{errors.complement}</span>
                )}
              </div>

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
  );
}

export default AddEmployee;
