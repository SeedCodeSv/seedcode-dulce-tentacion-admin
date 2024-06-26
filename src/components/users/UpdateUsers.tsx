import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useRolesStore } from '../../store/roles.store';
import { useEmployeeStore } from '../../store/employee.store';
// import { Employee } from '../../types/employees.types';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { User, UserUpdate } from '../../types/users.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchesStore } from '../../store/branches.store';
import { useCorrelativesStore } from '../../store/correlatives.store';
import { Correlatives } from '../../types/correlatives.types';
import { Branches } from '../../types/branches.types';

interface Props {
  onClose: () => void;
  user?: User;
}

function AddUsers(props: Props) {
  const { theme } = useContext(ThemeContext);
  const [selectedIdBranch, setSelectedIdBranch] = useState(0);
  const { getBranchesList, branch_list } = useBranchesStore();
  const { get_correlativesByBranch, list_correlatives } = useCorrelativesStore();

  useEffect(() => {
    getBranchesList();
    if (selectedIdBranch !== 0) {
      get_correlativesByBranch(Number(selectedIdBranch));
    }
  }, [selectedIdBranch]);

  const initialValues = {
    userName: props.user?.userName ?? '',
    roleId: props.user?.roleId ?? 0,
    correlativeId: props.user?.correlativeId ?? 0,

    // employeeId: props.user?.employeeId ?? 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    roleId: yup.number().required('El rol es requerido').min(1, 'El rol es requerido'),
    // employeeId: yup.number().required('El usuario es requerido').min(1, 'El usuario es requerido'),
  });

  const { roles_list, getRolesList } = useRolesStore();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { patchUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
    getEmployeesList();
  }, []);

  const handleSubmit = (values: UserUpdate) => {
    patchUser(values, Number(props?.user?.id));
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
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div>
              <Input
                label="Nombre de usuario"
                labelPlacement="outside"
                name="userName"
                value={values.userName}
                onChange={handleChange('userName')}
                onBlur={handleBlur('userName')}
                placeholder="Ingresa el nombre de usuario"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                }}
                variant="bordered"
              />
              {errors.userName && touched.userName && (
                <span className="text-sm font-semibold text-red-500">{errors.userName}</span>
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
                placeholder={
                  props.user?.employee.fullName
                    ? props.user?.employee.fullName
                    : 'Selecciona el empleado'
                }
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
              >
                {employee_list.map((dep) => (
                  <AutocompleteItem value={dep.id} key={JSON.stringify(dep)}>
                    {dep.fullName}
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
                placeholder={props.user?.role.name ? props.user?.role.name : 'Selecciona el rol'}
                variant="bordered"
                classNames={{
                  base: 'font-semibold text-gray-500 text-sm',
                }}
              >
                {roles_list.map((dep) => (
                  <AutocompleteItem value={dep.id} key={JSON.stringify(dep)}>
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
                    // handleChange('branchId')(depSelected.id.toString());
                    handleChange('branchName')(depSelected.branch.name);
                  }
                }}
                onBlur={handleBlur('branchId')}
                className="font-semibold"
                label="Sucursal"
                labelPlacement="outside"
                // placeholder={
                //   valu
                // }
                // placeholder={
                //   props.user?.correlatives.branch.name
                //     ? props.user?.correlatives.branch.name
                //     : 'Selecciona la sucursal'
                // }
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
                    handleChange('name')(depSelected.name);
                  }
                }}
                onBlur={handleBlur('correlativeId')}
                label="Correlativo"
                labelPlacement="outside"
                className="dark:text-white"
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
                    {cor.code}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {errors.correlativeId && touched.correlativeId && (
                <span className="text-sm font-semibold text-red-500">{errors.correlativeId}</span>
              )}
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
