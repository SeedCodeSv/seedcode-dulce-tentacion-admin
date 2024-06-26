import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useRolesStore } from '../../store/roles.store';
// import { useEmployeeStore } from '../../store/employee.store';
// import { Employee } from '../../types/employees.types';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { UserPayload } from '../../types/users.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchesStore } from '../../store/branches.store';
import { useCorrelativesStore } from '../../store/correlatives.store';
import { Branches } from '../../types/branches.types';
import { Correlatives } from '../../types/correlatives.types';

interface Props {
  onClose: () => void;
}

function AddUsers(props: Props) {
  const { theme } = useContext(ThemeContext);
  const [selectedIdBranch, setSelectedIdBranch] = useState(0);
  const { getBranchesList, branch_list } = useBranchesStore();
  const { get_correlativesByBranch, list_correlatives } = useCorrelativesStore();

  useEffect(() => {
    getBranchesList();
    get_correlativesByBranch(selectedIdBranch);
  }, [selectedIdBranch]);

  const initialValues = {
    userName: '',
    password: '',
    roleId: 0,
    // employeeId: 0,
    correlativeId: 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida'),
    roleId: yup.number().required('El rol es requerido').min(1, 'El rol es requerido'),
    // employeeId: yup
    //   .number()
    //   .required('El empleado es requerido')
    //   .min(1, 'El empleado es requerido'),
  });

  const { roles_list, getRolesList } = useRolesStore();
  // const { employee_list, getEmployeesList } = useEmployeeStore();
  const { postUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
    // getEmployeesList();
  }, []);

  const handleSubmit = (values: UserPayload) => {
    postUser(values);
    props.onClose();
  };

  const selectedKeyBranch = useMemo(() => {
    const branchCorrelative = branch_list.find((branchC) => branchC.id);
    return JSON.stringify(branchCorrelative);
  }, [branch_list, branch_list.length]);

  const selectedKeyCorrelative = useMemo(() => {
    const correlativeBranch = list_correlatives.find((correlativesB) => correlativesB.id);
    return JSON.stringify(correlativeBranch);
  }, [list_correlatives, list_correlatives.length]);

  return (
    <div className="p-4 dark:text-white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="mt-10">
              <Input
                label="Nombre de usuario"
                labelPlacement="outside"
                name="userName"
                value={values.userName}
                onChange={handleChange('userName')}
                onBlur={handleBlur('userName')}
                placeholder="Ingresa el nombre de usuario"
                classNames={{
                  label: 'text-gray-500 text-base',
                }}
                variant="bordered"
              />
              {errors.userName && touched.userName && (
                <span className="text-sm font-semibold text-red-500">{errors.userName}</span>
              )}
            </div>
            <div className="pt-2">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                name="userName"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Ingresa la Contraseña"
                type="password"
                classNames={{
                  label: 'text-gray-500 text-base',
                }}
                variant="bordered"
              />
              {errors.password && touched.password && (
                <span className="text-sm font-semibold text-red-500">{errors.password}</span>
              )}
            </div>
            {/* <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Employee;
                    handleChange('employeeId')(depSelected.id.toString());
                  }
                }}
                onBlur={handleBlur('employeeId')}
                label="Empleado"
                labelPlacement="outside"
                className="dark:text-white"
                placeholder="Selecciona el empleado"
                variant="bordered"
                classNames={{
                  base: 'text-gray-500 text-sm',
                }}
              >
                {employee_list.map((dep) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    value={dep.id}
                    key={JSON.stringify(dep)}
                  >
                    {dep.firstName}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.employeeId && touched.employeeId && (
                <span className="text-sm font-semibold text-red-500">{errors.employeeId}</span>
              )}
            </div> */}
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Role;
                    handleChange('roleId')(depSelected.id.toString());
                  }
                }}
                onBlur={handleBlur('roleId')}
                label="Rol"
                labelPlacement="outside"
                placeholder="Selecciona el rol"
                variant="bordered"
                className="dark:text-white"
                classNames={{
                  base: 'text-gray-500 text-sm',
                }}
              >
                {roles_list.map((dep) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    value={dep.id}
                    key={JSON.stringify(dep)}
                  >
                    {dep.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.roleId && touched.roleId && (
                <span className="text-sm font-semibold text-red-500">{errors.roleId}</span>
              )}
            </div>
            {/* Seleccionar sucursal */}
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Correlatives;
                    setSelectedIdBranch(depSelected.id);
                    handleChange('branchId')(depSelected.id.toString());
                    handleChange('branchName')(depSelected.code.toString());
                  }
                }}
                onBlur={handleBlur('branchId')}
                className="font-semibold"
                label="Sucursal"
                labelPlacement="outside"
                // placeholder={
                //   valu
                // }
                placeholder="Selecciona la sucursal"
                variant="bordered"
                defaultSelectedKey={selectedKeyBranch}
                value={selectedKeyBranch}
              >
                {branch_list.map((branch) => (
                  <AutocompleteItem
                    // onClick={() => setBranchId(branch.id)}
                    className="dark:text-white"
                    key={JSON.stringify(branch)}
                    value={branch.id}
                  >
                    {branch.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {/* {errors.branchId && touched.branchId && (
                <span className="text-sm font-semibold text-red-500">{errors.branchId}</span>
              )} */}
            </div>
            {/* Seleccionar spunto de venta  es correlativo en base a la sucursal*/}
            <div className="pt-2">
              <Autocomplete
                onSelectionChange={(key) => {
                  if (key) {
                    const depSelected = JSON.parse(key as string) as Branches;
                    handleChange('correlativeId')(depSelected.id.toString());
                    handleChange('code')(depSelected.name.toString());
                  }
                }}
                onBlur={handleBlur('municipio')}
                label="Correlativo"
                labelPlacement="outside"
                className="dark:text-white"
                // placeholder={
                //   values. ? values.nombreMunicipio : 'Selecciona el municipio'
                // }
                placeholder="Selecciona el correlativo"
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
                defaultSelectedKey={selectedKeyCorrelative}
                value={selectedKeyCorrelative}
              >
                {list_correlatives.map((cor) => (
                  <AutocompleteItem
                    value={cor.id}
                    key={JSON.stringify(cor)}
                    className="dark:text-white"
                  >
                    {cor.typeVoucher} + {cor.code}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {/* {errors.employeeId && touched.employeeId && (
                <span className="text-sm font-semibold text-red-500">{errors.employeeId}</span>
              )} */}
            </div>
            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
            >
              Guardar
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddUsers;
