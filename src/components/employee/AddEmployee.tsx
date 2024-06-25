import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useBranchesStore } from '../../store/branches.store';
import { useContext, useEffect, useMemo } from 'react';
import { Branches } from '../../types/branches.types';
import { Employee, EmployeePayload } from '../../types/employees.types';
import { useEmployeeStore } from '../../store/employee.store';
import { ThemeContext } from '../../hooks/useTheme';
import { useChargeStore} from '../../store/charges.store';

interface Props {
  closeModal: () => void;
  employee: Employee | undefined;
}

function AddEmployee(props: Props) {
  const { theme } = useContext(ThemeContext);

  const initialValues = {
    firstName: props.employee?.firstName ?? '',
    firstLastName: props.employee?.firstLastName ?? '',
    secondName: props.employee?.secondName ?? '',
    bankAccount: props.employee?.bankAccount ?? '',
    secondLastName: props.employee?.secondLastName ?? '',
    nit: props.employee?.nit ?? '',
    chargeId: props.employee?.chargeId ?? 0,
    isss: props.employee?.isss ?? '',
    dui: props.employee?.dui ?? '',
    phone: props.employee?.phone ?? '',
    branchId: props.employee?.branchId ?? 0,
  };

  const { getBranchesList, branch_list } = useBranchesStore();
  const { patchEmployee, postEmployee } = useEmployeeStore();
  const { getChargesList, charges } = useChargeStore();

  useEffect(() => {
    getBranchesList();
    getChargesList();
  }, []);

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

  return (
    <div className="p-4 dark:text-white grid grid-cols-2 gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col mt-4">
              <Input
                name="firstName"
                labelPlacement="outside"
                value={values.firstName}
                onChange={handleChange('firstName')}
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
            <div className="flex flex-col mt-4">
              <Input
                name="secondName"
                labelPlacement="outside"
                value={values.secondName}
                onChange={handleChange('secondName')}
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
            <div className="flex flex-col mt-4">
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
                  <span className="text-sm font-semibold text-red-600">{errors.firstLastName}</span>
                </>
              )}
            </div>
            <div className="flex flex-col mt-4">
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
                  <span className="text-sm font-semibold text-red-600">{errors.secondLastName}</span>
                </>
              )}
            </div>
            <div className="flex flex-col mt-4">
              <Input
                name="bankAccount"
                labelPlacement="outside"
                value={values.bankAccount}
                onChange={handleChange('bankAccount')}
                onBlur={handleBlur('bankAccount')}
                placeholder="Ingresa el numero de cuenta"
                classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                variant="bordered"
                label="Numero de Cuenta"
                autoComplete="off"
              />
              {errors.bankAccount && touched.bankAccount && (
                <>
                  <span className="text-sm font-semibold text-red-600">{errors.bankAccount}</span>
                </>
              )}
            </div>
            <div className="flex flex-col mt-4">
              <Input
                name="dui"
                labelPlacement="outside"
                value={values.dui}
                onChange={handleChange('dui')}
                onBlur={handleBlur('dui')}
                placeholder="Ingresa el numero de dui"
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
            <div className="flex flex-col mt-4">
              <Input
                name="nit"
                labelPlacement="outside"
                value={values.nit}
                onChange={handleChange('nit')}
                onBlur={handleBlur('nit')}
                placeholder="Ingresa el numero de nit"
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
            <div className="flex flex-col mt-4">
              <Input
                name="isss"
                labelPlacement="outside"
                value={values.isss}
                onChange={handleChange('isss')}
                onBlur={handleBlur('isss')}
                placeholder="Ingresa el numero de isss"
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
            <div className="flex flex-col mt-4">
            <Autocomplete
                    variant="bordered"
                    label="Cargo"
                    labelPlacement="outside"
                    className="dark:text-white"
                    placeholder='Seleccione el cargo'
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
            <div className="flex flex-col mt-4">
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
            
            <div className="mt-4">
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
                placeholder='Selecciona la sucursal'
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
            <div className='mt-0 md:mt-6'>
            <Button
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.dark,
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

export default AddEmployee;
