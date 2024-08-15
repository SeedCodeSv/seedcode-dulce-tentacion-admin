import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useState } from 'react';
// import { EmployeePayload } from '../../types/employees.types';
// import { useEmployeeStore } from '../../store/employee.store';
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
  const [codigoGenerado, setCodigoGenerado] = useState('');

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('**Campo requerido**'),
    secondName: yup.string().required('**Campo requerido**'),
    firstLastName: yup.string().required('**Campo requerido**'),
    secondLastName: yup.string().required('**Campo requerido**'),
    bankAccount: yup.string().required('**Campo requerido**'),
    dui: yup.string().required('**Campo requerido**'),
    nit: yup.string().required('**Campo requerido**'),
    isss: yup.string().required('**Campo requerido**'),
    afp: yup.string().required('**Campo requerido**'),
    code: yup.string().required('**Campo requerido**'),
    phone: yup.string().required('**Campo requerido**'),
    age: yup.string().required('**Campo requerido**'),
  });

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    getCat013Municipios(codeDepartamento);
    GetStudyLevel();
  }, [codeDepartamento, codigoGenerado]);
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
    // addressId: 0,
  });

  const createEmployee = async (values: EmployeePayload) => {
    const verify = await verifyCode(dataCreate.code);
    if (!verify) {
      toast.error('Ya existe un empleado con este código');
      return;
    }
    try {
      const data = await postEmployee(values);
      if (data) {
        navigate('/employees');
        // setError(false);
      }
    } catch (error) {
      toast.error('Error al crear el empleado');
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
      // setError(false);
    } else {
      // setError(true);
    }
    return code;
  };

  const navigate = useNavigate();
  return (
    <Layout title="Agregar Empleado">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <Button onClick={() => navigate('/employees')} className="bg-transparent dark:text-white">
            <ArrowLeft className="dark:text-white" />
            Atrás
          </Button>
          <div className="overflow-y-auto dark:text-white">
            <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
              <Formik
                initialValues={dataCreate}
                validationSchema={validationSchema}
                onSubmit={createEmployee}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.firstName}
                          onChange={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          name="firstName"
                          labelPlacement="outside"
                          placeholder="Ingresa el primer nombre"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Primer Nombre"
                          autoComplete="off"
                        />
                        {errors.firstName && touched.firstName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.firstName}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.secondName}
                          onChange={handleChange('secondName')}
                          onBlur={handleBlur('secondName')}
                          name="secondName"
                          labelPlacement="outside"
                          placeholder="Ingresa el segundo nombre"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Segundo Nombre"
                          autoComplete="off"
                        />
                        {errors.secondName && touched.secondName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.secondName}
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <Input
                          value={values.firstLastName}
                          onChange={handleChange('firstLastName')}
                          onBlur={handleBlur('firstLastName')}
                          name="firstLastName"
                          labelPlacement="outside"
                          placeholder="Ingresa el primer apellido"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Primer Apellido"
                          autoComplete="off"
                        />
                        {errors.firstLastName && touched.firstLastName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.firstLastName}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.secondLastName}
                          onChange={handleChange('secondLastName')}
                          onBlur={handleBlur('secondLastName')}
                          name="secondLastName"
                          labelPlacement="outside"
                          placeholder="Ingresa el segundo apellido"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Segundo Apellido"
                          autoComplete="off"
                        />
                        {errors.secondLastName && touched.secondLastName && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.secondLastName}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.bankAccount}
                          onChange={handleChange('bankAccount')}
                          onBlur={handleBlur('bankAccount')}
                          name="bankAccount"
                          labelPlacement="outside"
                          placeholder="Ingresa el numero de cuenta"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Numero de cuenta bancaria"
                          autoComplete="off"
                        />
                        {errors.bankAccount && touched.bankAccount && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.bankAccount}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dui}
                          onChange={handleChange('dui')}
                          onBlur={handleBlur('dui')}
                          name="dui"
                          labelPlacement="outside"
                          placeholder="Ingresa el numero de DUI"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="DUI"
                          autoComplete="off"
                        />
                        {errors.dui && touched.dui && (
                          <span className="text-sm font-semibold text-red-500">{errors.dui}</span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.nit}
                          onChange={handleChange('nit')}
                          onBlur={handleBlur('nit')}
                          name="nit"
                          labelPlacement="outside"
                          placeholder="Ingresa el numero de NIT"
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
                          placeholder="Ingresa el numero de ISSS"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="ISSS"
                        />
                        {errors.isss && touched.isss && (
                          <span className="text-sm font-semibold text-red-500">{errors.isss}</span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.afp}
                          onChange={handleChange('afp')}
                          onBlur={handleBlur('afp')}
                          name="afp"
                          labelPlacement="outside"
                          placeholder="Ingresa el numero de AFP"
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
                      <div className="flex flex-row gap-1 mt-3">
                        <div>
                          <Input
                            value={values.code}
                            onChange={handleChange('code')}
                            onBlur={handleBlur('code')}
                            name="code"
                            labelPlacement="outside"
                            placeholder="Ingresa el codigo"
                            classNames={{
                              label: 'font-semibold text-sm  text-gray-600',
                            }}
                            variant="bordered"
                            label="Codigo Empleado"
                          />
                          {errors.code && touched.code && (
                            <span className="text-sm font-semibold text-red-500">
                              {errors.code}
                            </span>
                          )}
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
                          value={values.phone}
                          onChange={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          type="number"
                          name="phone"
                          labelPlacement="outside"
                          placeholder="Ingresa el numero de teléfono"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Teléfono"
                          autoComplete="off"
                        />
                        {errors.phone && touched.phone && (
                          <span className="text-sm font-semibold text-red-500">{errors.phone}</span>
                        )}
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
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Edad"
                          autoComplete="off"
                        />
                        {errors.age && touched.age && (
                          <span className="text-sm font-semibold text-red-500">{errors.age}</span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.salary}
                          onChange={handleChange('salary')}
                          onBlur={handleBlur('salary')}
                          type="number"
                          name="salary"
                          labelPlacement="outside"
                          placeholder="Ingresa el salario mensual"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Salario Mensual"
                          autoComplete="off"
                        />
                        {errors.salary && touched.salary && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.salary}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dateOfBirth}
                          onChange={handleChange('dateOfBirth')}
                          onBlur={handleBlur('dateOfBirth')}
                          type="date"
                          name="dateOfBirth"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Fecha de Nacimiento"
                          autoComplete="off"
                        />
                        {errors.dateOfBirth && touched.dateOfBirth && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.dateOfBirth}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dateOfEntry}
                          onChange={handleChange('dateOfEntry')}
                          onBlur={handleBlur('dateOfEntry')}
                          type="date"
                          name="dateOfEntry"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Fecha de Ingreso"
                          autoComplete="off"
                        />
                        {errors.dateOfEntry && touched.dateOfEntry && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.dateOfEntry}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col mt-3">
                        <Input
                          value={values.dateOfExit}
                          onChange={handleChange('dateOfExit')}
                          onBlur={handleBlur('dateOfExit')}
                          type="date"
                          name="dateOfExit"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Fecha de Salida"
                          autoComplete="off"
                        />
                        {errors.dateOfExit && touched.dateOfExit && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.dateOfExit}
                          </span>
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
                          placeholder="Seleccione el tipo de contrato"
                          classNames={{
                            base: 'font-semibold text-sm',
                          }}
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
                          type="text"
                          name="responsibleContact"
                          labelPlacement="outside"
                          classNames={{
                            label: 'font-semibold text-sm  text-gray-600',
                          }}
                          variant="bordered"
                          label="Contacto Responsable"
                          placeholder="Ingresa el contacto responsable"
                          autoComplete="off"
                        />
                        {errors.responsibleContact && touched.responsibleContact && (
                          <span className="text-sm font-semibold text-red-500">
                            {errors.responsibleContact}
                          </span>
                        )}
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
                          placeholder="Selecciona la sucursal"
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
                          placeholder="Selecciona el departamento"
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
                          placeholder="Municipio"
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
                    <div className="grid grid-cols-1 gap-4 mt-3 md:grid-cols-2">
                      <div>
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

                      <div className="mt-0 md:mt-3">
                        <Button
                          onClick={handleSubmit}
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
