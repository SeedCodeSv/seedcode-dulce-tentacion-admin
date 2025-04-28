import { Input } from '@heroui/react';
import { Formik, FormikHelpers } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import * as yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';

import { useBranchesStore } from '@/store/branches.store';
import { PointOfSalePayload, BranchPointOfSale } from '@/types/point-of-sales.types';
import { verify_code_correlatives } from '@/services/point-of-sales.service';
import { usePointOfSales } from '@/store/point-of-sales.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  onClose: () => void;
  branchPointOfSales?: BranchPointOfSale;
  branchId: number;
}

function AddPointOfSales(props: Props) {
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
    // code: yup.string().required('**Debes especificar el punto de venta**'),
    code: yup
      .string()
      .required('**Debes especificar el punto de venta**')
      .test('unique-code', 'Este código ya está en uso', async function (value) {
        const { branchId } = this.parent;

        try {
          const data = await verify_code_correlatives(branchId, value);

          if (data.data.ok) {
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      }),
    codPuntoVenta: yup.string().required('**Debes especificar el punto de venta**'),
    userName: yup.string().required('**Debes especificar el nombre de usuario**'),
    password: yup.string().required('**Debes especificar la contraseña**'),
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

  // const handleSubmit = (values: PointOfSalePayload) => {
  //   const payload: PointOfSalePayload = {
  //     ...values,
  //     branchId: selectedIdBranch,
  //   };
  //   postPointOfSales(payload);
  //   setLastCode(lastCode + 1);
  //   props.onClose();
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
  const handleSubmit = async (values: PointOfSalePayload) => {
    const payload: PointOfSalePayload = {
      ...values,
      branchId: selectedIdBranch,
    };

    try {
      await verifyCode(selectedIdBranch, values.code);
      postPointOfSales(payload);
      setLastCode(lastCode + 1);
      props.onClose();
    } catch (error) {
      toast.error('No se puede guardar. El código ya está en uso.');
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
          <>
            <div className="pt-2">
              <Input
                readOnly
                className="dark:text-white"
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                  base: 'font-semibold text-sm',
                }}
                label="Sucursal"
                labelPlacement="outside"
                placeholder="Seleccione una sucursal"
                value={selectedBranch ? selectedBranch.name : ''}
                variant="bordered"
              />
            </div>
            <div className="w-full pt-3">
              <Input
                classNames={{
                  label: 'font-semibold text-sm',
                  base: 'font-semibold',
                }}
                errorMessage={errors.codPuntoVenta}
                isInvalid={touched.codPuntoVenta && !!errors.codPuntoVenta}
                label="Código de punto de venta"
                labelPlacement="outside"
                placeholder="Código de punto de venta"
                value={values.codPuntoVenta}
                variant="bordered"
                onBlur={handleBlur('codPuntoVenta')}
                onChange={(e) => {
                  handleChange('codPuntoVenta')(e);
                  setFieldValue('code', '');
                }}
              />
            </div>

            <div className="w-full pt-3 flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1 w-full">
                <Input
                  classNames={{
                    label: 'font-semibold text-sm',
                    base: 'font-semibold',
                  }}
                  errorMessage={errors.code}
                  isInvalid={touched.code && !!errors.code}
                  label="Código"
                  labelPlacement="outside"
                  placeholder="Código"
                  value={values.code}
                  variant="bordered"
                  onBlur={handleBlur('code')}
                  onChange={handleChange('code')}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                <ButtonUi
                  className="text-sm font-semibold"
                  theme={Colors.Secondary}
                  onPress={() => generateCode(setFieldValue, values.codPuntoVenta)}
                >
                  Generar Código
                </ButtonUi>
                <ButtonUi
                  className="text-sm font-semibold"
                  theme={Colors.Secondary}
                  onPress={() => {
                    verifyCode(selectedIdBranch, values.code);
                  }}
                >
                  Verificar Código
                </ButtonUi>
              </div>
            </div>

            <div className="pt-2">
              <Input
                classNames={{
                  base: 'text-gray-500 text-sm font-semibold',
                }}
                errorMessage={touched.userName && errors.userName}
                isInvalid={touched.userName && !!errors.userName}
                label="Nombre de usuario"
                labelPlacement="outside"
                name="userName"
                placeholder="Ingresa el nombre de usuario"
                value={values.userName}
                variant="bordered"
                onBlur={handleBlur('userName')}
                onChange={handleChange('userName')}
              />
            </div>

            <div className="pt-2">
              <Input
                className="w-full dark:text-white font-semibold border border-white rounded-xl"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                endContent={
                  <button className="px-4 text-gray-600" type="button" onClick={toggleShowPassword}>
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                }
                errorMessage={touched.password && errors.password}
                isClearable={false}
                isInvalid={touched.password && !!errors.password}
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Ingresa la Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                variant="bordered"
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
              />
            </div>

            <ButtonUi
              className="w-full mt-4 text-sm font-semibold"
              theme={Colors.Secondary}
              onPress={() => handleSubmit()}
            >
              Guardar
            </ButtonUi>
          </>
        )}
      </Formik>
    </div>
  );
}

export default AddPointOfSales;
