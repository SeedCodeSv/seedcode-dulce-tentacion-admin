import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useRolesStore } from '../../store/roles.store';
import { Role } from '../../types/roles.types';
import { useUsersStore } from '../../store/users.store';
import { UserPayload } from '../../types/users.types';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchesStore } from '../../store/branches.store';
import { useCorrelativesStore } from '../../store/correlatives.store';
import { Branches } from '../../types/branches.types';

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
  }, []);

  useEffect(() => {
    if (selectedIdBranch !== 0) {
      get_correlativesByBranch(Number(selectedIdBranch));
    }
  }, [selectedIdBranch, get_correlativesByBranch]);

  const validationSchema = yup.object().shape({
    userName: yup.string().required('**El usuario es requerido**'),
    password: yup.string().required('**La contraseña es requerida**'),
    roleId: yup.number().required('**El rol es requerido**').min(1, '**El rol es requerido**'),
    correlativeId: yup
      .number()
      .required('**El Correlativo es requerido, antes debes seleccionar una sucursal**')
      .min(1, '**El Correlativo es requerido, antes debes seleccionar una sucursal**'),
  });

  const initialValues = {
    userName: '',
    password: '',
    roleId: 0,
    correlativeId: 0,
  };

  const { roles_list, getRolesList } = useRolesStore();
  const { postUser } = useUsersStore();

  useEffect(() => {
    getRolesList();
  }, []);

  const handleSubmit = async (values: UserPayload, resetForm: () => void) => {
    await postUser(values);

    resetForm();
    props.onClose();
  };

  const selectedKeyBranch = useMemo(() => {
    const branchCorrelative = branch_list.find((branchC) => branchC.id === selectedIdBranch);
    return branchCorrelative ? JSON.stringify(branchCorrelative) : null;
  }, [branch_list, selectedIdBranch]);

  return (
    <div className="dark:text-white ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="mt-5 flex flex-col">
              <div className="pt-2">
                <Input
                  label="Nombre de usuario"
                  labelPlacement="outside"
                  name="userName"
                  value={values.userName}
                  onChange={handleChange('userName')}
                  onBlur={handleBlur('userName')}
                  isInvalid={touched.userName && !!errors.userName}
                  errorMessage={touched.userName && errors.userName}
                  placeholder="Ingresa el nombre de usuario"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  variant="bordered"
                />
                {/* {errors.userName && touched.userName && (
                  <span className="text-sm  font-normal text-red-500">{errors.userName}</span>
                )} */}
              </div>
              <div className="pt-2">
                <Input
                  label="Contraseña"
                  labelPlacement="outside"
                  name="password"
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Ingresa la Contraseña"
                  isInvalid={touched.password && !!errors.password}
                  errorMessage={touched.password && errors.password}
                  type="password"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
                  }}
                  variant="bordered"
                />
                {/* {errors.password && touched.password && (
                  <span className="text-sm  font-normal text-red-500">{errors.password}</span>
                )} */}
              </div>

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
                  isInvalid={touched.roleId && !!errors.roleId}
                  errorMessage={touched.roleId && errors.roleId}
                  className="dark:text-white"
                  classNames={{
                    base: 'text-gray-500 text-sm font-semibold',
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
                {/* {errors.roleId && touched.roleId && (
                  <span className="text-sm  font-normal text-red-500">{errors.roleId}</span>
                )} */}
              </div>
              {/* Seleccionar sucursal */}
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
                  labelPlacement="outside"
                  placeholder="Selecciona la sucursal"
                  variant="bordered"
                  className="dark:text-white text-sm font-semibold"
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
              {/* Seleccionar spunto de venta  es correlativo en base a la sucursal*/}
              <div className="pt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(key as string) as Branches;
                      handleChange('correlativeId')(depSelected.id.toString());
                      // handleChange('name')(depSelected.name);
                    }
                  }}
                  onBlur={handleBlur('correlativeId')}
                  label="Correlativo"
                  placeholder="Selecciona el correlativo"
                  labelPlacement="outside"
                  className="dark:text-white font-semibold"
                  variant="bordered"
                  classNames={{
                    base: ' text-gray-500 text-sm font-semibold',
                  }}
                  isInvalid={touched.correlativeId && !!errors.correlativeId}
                  errorMessage={touched.correlativeId && errors.correlativeId}
                  // defaultSelectedKey={selectedKeyCorrelative!}
                  // value={selectedKeyCorrelative!}
                >
                  {list_correlatives.map((cor) => (
                    <AutocompleteItem
                      key={JSON.stringify(cor)}
                      value={JSON.stringify(cor)}
                      className="dark:text-white"
                    >
                      {cor.code ? cor.code : cor.typeVoucher}
                      {/* {cor.code ? cor.code : `typeVouche: ${cor.typeVoucher}`} */}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>

                {/* {errors.correlativeId && touched.correlativeId && (
                  <span className="text-sm font-normal text-red-500">{errors.correlativeId}</span>
                )} */}
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
