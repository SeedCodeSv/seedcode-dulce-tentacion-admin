import { Button, Input } from '@nextui-org/react';
import { Formik, FormikHelpers } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import { useBranchesStore } from '@/store/branches.store';
import { toast } from 'sonner';
import * as yup from 'yup';
import { PointOfSalePayload, BranchPointOfSale } from '@/types/point-of-sales.types';
import { verify_code_correlatives } from '@/services/point-of-sales.service';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  onClose: () => void;
  branchPointOfSales?: BranchPointOfSale;
  branchId: number;
}

function AddPointOfSales(props: Props) {
  const { theme } = useContext(ThemeContext);
  const [selectedIdBranch] = useState(props.branchId);
  const [lastCode, setLastCode] = useState(0);

  const initialValues = {
    branchId: props.branchId,
    code: '',
    codPuntoVenta: '',
    userName: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    code: yup.string().required('**Debes especificar el punto de venta**'),
    codPuntoVenta: yup.string().required('**Debes especificar el punto de venta**'),
    // .matches(/^[A-Z0-9]{4}$/, '**El código debe ser de 4 dígitos**'),
  });

  const { getBranchesList, branch_list } = useBranchesStore();
  const { getPointOfSales, postPointOfSales } = usePointOfSales();

  useEffect(() => {
    getBranchesList();
  }, []);

  useEffect(() => {
    if (selectedIdBranch) {
      getPointOfSales(selectedIdBranch);
    }
  }, [selectedIdBranch]);

  const handleSubmit = (values: PointOfSalePayload) => {
    const payload: PointOfSalePayload = {
      ...values,
      branchId: selectedIdBranch,
    };
    postPointOfSales(payload);
    setLastCode(lastCode + 1);
    props.onClose();
  };

  // const handleSubmit = async (
  //   values: PointOfSalePayload & UserPayload,
  //   formikHelpers: FormikHelpers<any>
  // ) => {
  //   const payloadPointOfSale: PointOfSalePayload = {
  //     branchId: selectedIdBranch,
  //     code: values.code,
  //     codPuntoVenta: values.codPuntoVenta,
  //   };

  //   const payloadUser: UserPayload = {
  //     userName: values.userName,
  //     password: values.password,
  //     roleId: Number(user?.roleId),
  //     correlativeId: Number(user?.correlativeId),
  //   };

  //   try {
  //     // Crear punto de venta
  //     await postPointOfSales(payloadPointOfSale);

  //     // Crear usuario
  //     await postUser(payloadUser);

  //     // Mensaje de éxito
  //     toast.success('Punto de venta y usuario creados con éxito.');

  //     // Cerrar el formulario y reiniciar el formulario
  //     formikHelpers.resetForm();
  //     props.onClose();
  //   } catch (error) {
  //     // Manejar errores
  //     toast.error('Ocurrió un error al guardar los datos.');
  //   }
  // };

  const selectedBranch = useMemo(() => {
    return branch_list.find((branch) => branch.id === selectedIdBranch);
  }, [branch_list, selectedIdBranch]);

  const generateCode = (
    setFieldValue: FormikHelpers<{ code: string }>['setFieldValue'],
    codPuntoVenta: string
  ) => {
    if (selectedBranch && codPuntoVenta) {
      const branchId = selectedBranch.id;
      const code = `${branchId}-${codPuntoVenta}`;
      setFieldValue('code', code);
    } else {
      toast.error('Debe seleccionar una sucursal y completar el código de punto de venta.');
    }
  };

  const verifyCode = async (branchId: number, code: string) => {
    if (branchId) {
      try {
        const data = await verify_code_correlatives(branchId, code);
        if (data.data.ok) {
          toast.success('Código no registrado');
        }
      } catch (error) {
        toast.error('Este código ya se encuentra registrado');
      }
    } else {
      toast.error('Debe seleccionar una sucursal');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-4">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
          <>
            <div className="pt-2">
              <Input
                label="Sucursal"
                placeholder="Seleccione una sucursal"
                variant="bordered"
                readOnly
                value={selectedBranch ? selectedBranch.name : ''}
                className="dark:text-white"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                  base: 'font-semibold text-sm',
                }}
                labelPlacement="outside"
              />
            </div>
            <div className="w-full pt-3">
              <Input
                label="Código de punto de venta"
                placeholder="Código de punto de venta"
                variant="bordered"
                // onChange={handleChange('codPuntoVenta')}
                onChange={(e) => {
                  handleChange('codPuntoVenta')(e);
                  setFieldValue('code', ''); // Limpiar el código si se cambia el código del punto de venta
                }}
                onBlur={handleBlur('codPuntoVenta')}
                value={values.codPuntoVenta}
                classNames={{
                  label: 'font-semibold text-sm',
                  base: 'font-semibold',
                }}
                labelPlacement="outside"
                isInvalid={touched.codPuntoVenta && !!errors.codPuntoVenta}
                errorMessage={errors.codPuntoVenta}
              />
            </div>

            <div className="w-full pt-3 flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1 w-full">
                <Input
                  label="Código"
                  placeholder="Código"
                  variant="bordered"
                  onChange={handleChange('code')}
                  onBlur={handleBlur('code')}
                  value={values.code}
                  classNames={{
                    label: 'font-semibold text-sm',
                    base: 'font-semibold',
                  }}
                  labelPlacement="outside"
                  isInvalid={touched.code && !!errors.code}
                  errorMessage={errors.code}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                <Button
                  onClick={() => generateCode(setFieldValue, values.codPuntoVenta)}
                  className="text-sm font-semibold"
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                  }}
                >
                  Generar Código
                </Button>
                <Button
                  className="text-sm font-semibold"
                  style={{
                    backgroundColor: theme.colors.warning,
                    color: theme.colors.primary,
                  }}
                  onClick={() => {
                    verifyCode(selectedIdBranch, values.code);
                  }}
                >
                  Verificar Código
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Input
                label="Nombre de usuario"
                labelPlacement="outside"
                name="userName"
                // value={values.userName}
                onChange={handleChange('userName')}
                onBlur={handleBlur('userName')}
                // isInvalid={touched.userName && !!errors.userName}
                // errorMessage={touched.userName && errors.userName}
                placeholder="Ingresa el nombre de usuario"
                classNames={{
                  base: 'text-gray-500 text-sm font-semibold',
                }}
                variant="bordered"
              />
            </div>
            {/* <div className="pt-2">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                name="password"
                // value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Ingresa la Contraseña"
                // isInvalid={touched.password && !!errors.password}
                // errorMessage={touched.password && errors.password}
                type="password"
                classNames={{
                  base: 'text-gray-500 text-sm font-semibold',
                }}
                variant="bordered"
              />
            </div> */}

            <div className="pt-2">
              <Input
                endContent={
                  <button type="button" className="px-4 text-gray-600" onClick={toggleShowPassword}>
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                }
                className="w-full dark:text-white border border-white rounded-xl"
                variant="bordered"
                labelPlacement="outside"
                label="Contraseña"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                isClearable={false}
                type={showPassword ? 'text' : 'password'}
                // value={values.password}
                placeholder="Ingresa la Contraseña"
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                // isInvalid={touched.password && !!errors.password}
                // errorMessage={touched.password && errors.password}
              />
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

export default AddPointOfSales;
