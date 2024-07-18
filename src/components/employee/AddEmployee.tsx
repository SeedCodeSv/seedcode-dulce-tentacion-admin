import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { useBranchesStore } from "../../store/branches.store";
import { useContext, useEffect, useState } from "react";
// import { EmployeePayload } from '../../types/employees.types';
// import { useEmployeeStore } from '../../store/employee.store';
//import * as yup from 'yup';
import { ThemeContext } from "../../hooks/useTheme";
import { useChargesStore } from "../../store/charges.store";
import { useBillingStore } from "../../store/facturation/billing.store";
import { useEmployeeStatusStore } from "../../store/employee_status.store";
import { useContractTypeStore } from "../../store/contract_type.store";
import { useStudyLevelStore } from "../../store/study_level.store";
import Layout from "../../layout/Layout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEmployeeStore } from "../../store/employee.store";
import { EmployeePayload } from "../../types/employees.types";
import { toast } from "sonner";
function AddEmployee() {
  const { theme } = useContext(ThemeContext);
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const {
    getCat012Departamento,
    getCat013Municipios,
    cat_012_departamento,
    cat_013_municipios,
  } = useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");

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
  const [error, setError] = useState(false);
  const [dataCreate, setDataCreate] = useState<EmployeePayload>({
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    bankAccount: "",
    chargeId: 0,
    nit: "",
    dui: "",
    isss: "",
    afp: "",
    code: "",
    phone: "",
    age: "",
    salary: "",
    dateOfBirth: "",
    dateOfEntry: "",
    dateOfExit: "",
    responsibleContact: "",
    statusId: 0,
    studyLevelId: 0,
    contractTypeId: 0,
    department: "",
    departmentName: "",
    municipality: "",
    municipalityName: "",
    complement: "",
    branchId: 0,
    // addressId: 0,
  });

  // const validationSchema = yup.object().shape({
  //   firstName: yup.string().required('El primer nombre es requerido'),
  //   firstLastName: yup.string().required('El primer apellido es requerida'),
  //   phone: yup.string().required('El teléfono es requerido'),
  //   dui: yup.string().required('El DUI es requerido'),
  //   departamento: yup.string().required('El departamento es requerido'),
  //   municipio: yup.string().required('El municipio es requerido'),
  //   complemento: yup.string().required('El complemento es requerido'),
  // });

  const createEmployee = async () => {
    const verify = await verifyCode(dataCreate.code);
    if (!verify) {
      toast.error('Ya existe un empleado con este código');
      return;
     }
    try {
      const data = await postEmployee(dataCreate);
      if (data) {
        navigate("/employees");
        setError(false);
      } 
    } catch (error) {
      toast.error("Error al crear el empleado");
    }
  };
  const generateCode = async () => {
    const name = dataCreate.firstName;
    const lastName = dataCreate.firstLastName;
    const initials =
      name.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${initials}-${randomNum}`;
    dataCreate.code = code;
    setCodigoGenerado(code);
    const verify = await verifyCode(code);
    if (verify) {
      toast.success('Código disponible');
      setError(false);
    }
    else {
      setError(true);
    }
    return code;
  };

  const navigate = useNavigate();
  return (
    <Layout title="Agregar Empleado">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <Button
            onClick={() => navigate("/employees")}
            className="bg-transparent dark:text-white"
          >
            <ArrowLeft className="dark:text-white" />
            Atrás
          </Button>
          <div className="overflow-y-auto dark:text-white">
            <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          firstName: e.target.value,
                        })
                      }
                      name="firstName"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer nombre"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Primer Nombre"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          secondName: e.target.value,
                        })
                      }
                      name="secondName"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo nombre"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Segundo Nombre"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          firstLastName: e.target.value,
                        })
                      }
                      name="firstLastName"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer apellido"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Primer Apellido"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          secondLastName: e.target.value,
                        })
                      }
                      name="secondLastName"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo apellido"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Segundo Apellido"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          bankAccount: e.target.value,
                        })
                      }
                      name="bankAccount"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de cuenta"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Numero de cuenta bancaria"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, dui: e.target.value })
                      }
                      name="dui"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de DUI"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="DUI"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, nit: e.target.value })
                      }
                      name="nit"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de NIT"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="NIT"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, isss: e.target.value })
                      }
                      name="isss"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de ISSS"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="ISSS"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, afp: e.target.value })
                      }
                      name="afp"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de AFP"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="AFP"
                    />
                  </div>
                  <div className="flex flex-row gap-1 mt-3">
                    <div>
                      <Input
                        onChange={(e) =>
                          setDataCreate({ ...dataCreate, code: e.target.value })
                        }
                        name="code"
                        value={dataCreate.code}
                        labelPlacement="outside"
                        placeholder="Ingresa el codigo"
                        classNames={{
                          label: "font-semibold text-sm  text-gray-600",
                        }}
                        variant="bordered"
                        label="Codigo Empleado"
                      />
                      {error && (
                      <p className="text-xs text-red-500">{"Este código ya existe"}</p>)}
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
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, phone: e.target.value })
                      }
                      type="number"
                      name="name"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de teléfono"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Teléfono"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, age: e.target.value })
                      }
                      type="number"
                      name="age"
                      labelPlacement="outside"
                      placeholder="Ingresa la edad"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Edad"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({ ...dataCreate, salary: e.target.value })
                      }
                      type="number"
                      name="salary"
                      labelPlacement="outside"
                      placeholder="Ingresa el salario mensual"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Salario Mensual"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          dateOfBirth: e.target.value,
                        })
                      }
                      type="date"
                      name="dateOfBirth"
                      labelPlacement="outside"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Fecha de Nacimiento"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          dateOfEntry: e.target.value,
                        })
                      }
                      type="date"
                      name="dateOfEntry"
                      labelPlacement="outside"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
                      variant="bordered"
                      label="Fecha de Ingreso"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          dateOfExit: e.target.value,
                        })
                      }
                      type="date"
                      name="dateOfExit"
                      labelPlacement="outside"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
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
                        base: "font-semibold text-sm",
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
                        base: "font-semibold text-sm",
                      }}
                    >
                      {employee_status?.map((item) => (
                        <AutocompleteItem
                          onClick={() =>
                            setDataCreate({ ...dataCreate, statusId: item.id })
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
                      label="Tipo de contratacion"
                      labelPlacement="outside"
                      className="dark:text-white"
                      placeholder="Seleccione el tipo de contrato"
                      classNames={{
                        base: "font-semibold text-sm",
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
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          responsibleContact: e.target.value,
                        })
                      }
                      type="text"
                      name="responsibleContact"
                      labelPlacement="outside"
                      classNames={{
                        label: "font-semibold text-sm  text-gray-600",
                      }}
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
                        base: "font-semibold text-sm",
                      }}
                    >
                      {charges.map((item) => (
                        <AutocompleteItem
                          onClick={() =>
                            setDataCreate({ ...dataCreate, chargeId: item.id })
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
                  <div className="mt-3">
                    <Autocomplete
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder="Selecciona la sucursal"
                      variant="bordered"
                      className="dark:text-white"
                      classNames={{
                        base: "font-semibold text-sm",
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          onClick={() =>
                            setDataCreate({ ...dataCreate, branchId: bra.id })
                          }
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
                        base: "font-semibold text-gray-500 text-sm",
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
                        base: "font-semibold text-gray-500 text-sm",
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
                      onChange={(e) =>
                        setDataCreate({
                          ...dataCreate,
                          complement: e.target.value,
                        })
                      }
                      label="Complemento de dirección"
                      classNames={{
                        label: "font-semibold text-gray-500 text-sm",
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
    </Layout>
  );
}
export default AddEmployee;
