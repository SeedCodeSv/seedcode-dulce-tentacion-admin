import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useRolesStore } from '../../store/roles.store';
// import { useEmployeeStore } from '../../store/employee.store';
// import { Employee } from '../../types/employees.types';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { User, UserUpdate } from '../../types/users.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchesStore } from '../../store/branches.store';
import { useCorrelativesStore } from '../../store/correlatives.store';

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

  console.log('list_correlatives', list_correlatives);

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    if (selectedIdBranch !== 0) {
      get_correlativesByBranch(Number(selectedIdBranch));
    }
  }, [selectedIdBranch, get_correlativesByBranch]);

  const initialValues = {
    userName: props.user?.userName ?? '',
    roleId: props.user?.roleId ?? 0,
    correlativeId: props.user?.correlativeId ?? 0,
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    roleId: yup.number().required('El rol es requerido').min(1, 'El rol es requerido'),

    correlativeId: yup
      .number()
      .required('El correlativo es requerido')
      .min(1, 'El correlativo es requerido'),
  });

  const { roles_list, getRolesList } = useRolesStore();
  const { patchUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const handleSubmit = (values: UserUpdate) => {
    patchUser(values, Number(props?.user?.id));
    props.onClose();
  };

  const selectedKeyBranch = useMemo(() => {
    const branchCorrelative = branch_list.find((branchC) => branchC.id === selectedIdBranch);
    return branchCorrelative ? JSON.stringify(branchCorrelative) : null;
  }, [branch_list, selectedIdBranch]);

  const selectedKeyCorrelative = useMemo(() => {
    const correlativeBranch = list_correlatives.find((correlativesB) => correlativesB);
    return correlativeBranch ? JSON.stringify(correlativeBranch) : null;
  }, [list_correlatives]);
  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="mt-5 flex flex-col">
              <div className="mt-2">
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
              <div className="mt-2  ">
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
                    base: 'font-semibold text-sm',
                  }}
                  defaultInputValue={props.user?.role.name || ''}
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
              <div className="pt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Branches;
                      setSelectedIdBranch(depSelected.id);
                    }
                  }}
                  onBlur={handleBlur('branchId')}
                  label="Sucursal"
                  className='font-semibold text-gray-500 text-sm'
                  placeholder="Selecciona la sucursal"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultInputValue={props.user?.correlative.branch.name || ''}
                  defaultSelectedKey={selectedKeyBranch!}
                  value={selectedKeyBranch!}
                >
                  {branch_list.map((branch) => (
                    <AutocompleteItem key={JSON.stringify(branch)} value={JSON.stringify(branch)}>
                      {branch.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div className="pt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Branches;
                      handleChange('correlativeId')(depSelected.id.toString());
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
                  defaultInputValue={props.user?.correlative.code || ''}
                  defaultSelectedKey={selectedKeyCorrelative!}
                  value={selectedKeyCorrelative!}
                >
                  {list_correlatives.map((cor) => (
                    <AutocompleteItem
                      key={JSON.stringify(cor)}
                      value={JSON.stringify(cor)}
                      className="dark:text-white"
                    >
                      {cor.code ? cor.code : cor.typeVoucher}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.correlativeId && touched.correlativeId && (
                  <span className="text-sm font-semibold text-red-500">{errors.correlativeId}</span>
                )}
              </div>

              <Button
                onClick={() => handleSubmit()}
                className="w-full mt-4 text-sm font-semibold mb-3"
                style={{
                  backgroundColor: theme.colors.third,
                  color: theme.colors.primary,
                }}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddUsers;
