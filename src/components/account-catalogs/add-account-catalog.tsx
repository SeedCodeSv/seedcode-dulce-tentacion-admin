import { Input, Button, Select, SelectItem, Switch } from '@heroui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { API_URL } from '@/utils/constants';
import { AccountCatalogPayload } from '@/types/accountCatalogs.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useAuthStore } from '@/store/auth.store';

function AddAccountCatalogs() {
  const navigate = useNavigate();
  const AccountTypes = [
    { key: 'Rubro', value: 'Rubro', label: 'Rubro' },
    { key: 'Mayor', value: 'Mayor', label: 'Mayor' },
    { key: 'SubCuenta', value: 'SubCuenta', label: 'SubCuenta' },
  ];

  const UploadAS = [
    { key: 'Activo', value: 'Activo', label: 'Activo' },
    { key: 'Pasivo', value: 'Pasivo', label: 'Pasivo' },
    { key: 'Patrimonio', value: 'Patrimonio', label: 'Patrimonio' },
    { key: 'Resultado Deudoras', value: 'Resultado Deudoras', label: 'Resultado Deudoras' },
    { key: 'Resultado Acreedoras', value: 'Resultado Acreedoras', label: 'Resultado Acreedoras' },
    { key: 'Cuentas de Cierre', value: 'Cuentas De Cierre', label: 'Cuentas de Cierre' },
    { key: 'Orden Deudoras', value: 'Orden Deudoras', label: 'Orden Deudoras' },
    { key: 'Orden Acreedoras', value: 'Orden Acreedoras', label: 'Orden Acreedoras' },
  ];

  const Item = [
    { key: 'N/A', value: 'N/A', label: 'N/A' },
    { key: 'Ingreso', value: 'Ingreso', label: 'Ingreso' },
    { key: 'Costo', value: 'Costo', label: 'Costo' },
    { key: 'Gasto', value: 'Gasto', label: 'Gasto' },
  ];

  const { user } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      majorAccount: '',
      level: '',
      hasSub: false,
      type: '',
      loadAs: '',
      item: '',
    },
    validationSchema: yup.object().shape({
      code: yup.string().required('**Campo requerido**'),
      name: yup.string().required('**Campo requerido**'),
      majorAccount: yup.string().required('**Campo requerido**'),
      level: yup.string().required('**Campo requerido**'),
      hasSub: yup.boolean().required('**Campo requerido**'),
      type: yup.string().required('**Campo requerido**'),
      loadAs: yup.string().required('**Campo requerido**'),
      item: yup.string().required('**Campo requerido**'),
    }),
    onSubmit(values, formikHelpers) {
      try {
        const transmitterId = user?.pointOfSale?.branch.transmitter.id

        const payload: AccountCatalogPayload = {
          ...values,
          transmitterId: Number(transmitterId ?? 0),
        };

        axios
          .post(API_URL + '/account-catalogs', payload)
          .then(() => {
            toast.success('Operación realizada con éxito');
            formikHelpers.setSubmitting(false);
            navigate('/accountCatalogs');
          })
          .catch(() => {
            toast.error('Error al guardar la compra');
            formikHelpers.setSubmitting(false);
          });
      } catch (error) {
        toast.error('Error al guardar la compra');
      }
    },
  });

  return (
    <>
      <>
        <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
          <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="">
              <Button
                className="bg-transparent dark:text-white flex"
                onPress={() => navigate('/account-catalogs')}
              >
                <ArrowLeft /> Regresar
              </Button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.submitForm();
                }}
              >
                <>
                  <div className="w-full">
                    <div className="grid w-full grid-cols-1 gap-5 mt-2 md:grid-cols-2">
                      <div className="pt-5 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.code}
                          isInvalid={!!formik.touched.code && !!formik.errors.code}
                          label="Código"
                          labelPlacement="outside"
                          name="code"
                          placeholder="Ingrese el código"
                          value={formik.values.code}
                          variant="bordered"
                          onBlur={formik.handleBlur('code')}
                          onChange={formik.handleChange('code')}
                        />
                      </div>

                      <div className="pt-5 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.name}
                          isInvalid={!!formik.touched.name && !!formik.errors.name}
                          label="Nombre"
                          labelPlacement="outside"
                          name="name"
                          placeholder="Ingrese el nombre"
                          value={formik.values.name}
                          variant="bordered"
                          onBlur={formik.handleBlur('name')}
                          onChange={formik.handleChange('name')}
                        />
                      </div>

                      <div className="pt-1 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.majorAccount}
                          isInvalid={!!formik.touched.majorAccount && !!formik.errors.majorAccount}
                          label="Cuenta Mayor"
                          labelPlacement="outside"
                          name="majorAccount"
                          placeholder="Ingrese la cuenta mayor"
                          value={formik.values.majorAccount}
                          variant="bordered"
                          onBlur={formik.handleBlur('majorAccount')}
                          onChange={formik.handleChange('majorAccount')}
                        />
                      </div>

                      <div className="pt-1 pb-2">
                        <div className="pt-1 pb-2 mb-1">
                          <span className="font-semibold block">Sub Cuenta</span>
                          <Switch
                            checked={formik.values.hasSub}
                            color="primary"
                            size="lg"
                            onChange={(e) => formik.setFieldValue('hasSub', e.target.checked)}
                          />
                        </div>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.type}`]}
                          errorMessage={formik.errors.type}
                          isInvalid={!!formik.touched.type && !!formik.errors.type}
                          label="Tipo de cuenta"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo"
                          variant="bordered"
                          onBlur={formik.handleBlur('type')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('type', value)
                              : formik.setFieldValue('typeSale', '');
                          }}
                        >
                          {AccountTypes.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.loadAs}`]}
                          errorMessage={formik.errors.loadAs}
                          isInvalid={!!formik.touched.loadAs && !!formik.errors.loadAs}
                          label="Cargar como"
                          labelPlacement="outside"
                          placeholder="Selecciona el tipo"
                          variant="bordered"
                          onBlur={formik.handleBlur('loadAs')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('loadAs', value)
                              : formik.setFieldValue('loadAs', '');
                          }}
                        >
                          {UploadAS.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          defaultSelectedKeys={[`${formik.values.item}`]}
                          errorMessage={formik.errors.item}
                          isInvalid={!!formik.touched.item && !!formik.errors.item}
                          label="Elemento"
                          labelPlacement="outside"
                          placeholder="Selecciona el Elemento"
                          variant="bordered"
                          onBlur={formik.handleBlur('item')}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;

                            key
                              ? formik.setFieldValue('item', value)
                              : formik.setFieldValue('item', '');
                          }}
                        >
                          {Item.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="pt-1 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          errorMessage={formik.errors.level}
                          isInvalid={!!formik.touched.level && !!formik.errors.level}
                          label="Nivel de Cuenta"
                          labelPlacement="outside"
                          name="level"
                          placeholder="Ingrese el nivel de cuenta"
                          value={formik.values.level}
                          variant="bordered"
                          onBlur={formik.handleBlur('level')}
                          onChange={formik.handleChange('level')}
                        />
                      </div>
                    </div>
                    <div className="pt-6 pb-2 w-full flex justify-end">
                      <ButtonUi
                        className="px-16"
                        isLoading={formik.isSubmitting}
                        theme={Colors.Primary}
                        type="submit"
                      >
                        Guardar
                      </ButtonUi>
                    </div>
                  </div>
                </>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default AddAccountCatalogs;
