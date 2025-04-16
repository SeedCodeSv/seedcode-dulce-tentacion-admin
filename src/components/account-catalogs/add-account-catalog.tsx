import { Input, Button, Select, SelectItem, Switch } from '@heroui/react';
import Layout from '@/layout/Layout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { AccountCatalogPayload } from '@/types/accountCatalogs.types';
import { API_URL } from '@/utils/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
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
        const transmitterId =
          user?.pointOfSale?.branch.transmitter.id ?? user?.correlative?.branch.transmitter.id;

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
    <Layout title="Catalogo de cuentas">
      <>
        <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
          <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="">
              <Button
                onClick={() => navigate('/account-catalogs')}
                className="bg-transparent dark:text-white flex"
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
                          label="Código"
                          placeholder="Ingrese el código"
                          variant="bordered"
                          value={formik.values.code}
                          name="code"
                          onChange={formik.handleChange('code')}
                          onBlur={formik.handleBlur('code')}
                          labelPlacement="outside"
                          isInvalid={!!formik.touched.code && !!formik.errors.code}
                          errorMessage={formik.errors.code}
                        />
                      </div>

                      <div className="pt-5 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          label="Nombre"
                          placeholder="Ingrese el nombre"
                          variant="bordered"
                          value={formik.values.name}
                          name="name"
                          onChange={formik.handleChange('name')}
                          onBlur={formik.handleBlur('name')}
                          labelPlacement="outside"
                          isInvalid={!!formik.touched.name && !!formik.errors.name}
                          errorMessage={formik.errors.name}
                        />
                      </div>

                      <div className="pt-1 pb-2">
                        <Input
                          label="Cuenta Mayor"
                          labelPlacement="outside"
                          name="majorAccount"
                          value={formik.values.majorAccount}
                          onChange={formik.handleChange('majorAccount')}
                          onBlur={formik.handleBlur('majorAccount')}
                          placeholder="Ingrese la cuenta mayor"
                          classNames={{ label: 'font-semibold' }}
                          variant="bordered"
                          isInvalid={!!formik.touched.majorAccount && !!formik.errors.majorAccount}
                          errorMessage={formik.errors.majorAccount}
                        />
                      </div>

                      <div className="pt-1 pb-2">
                        <div className="pt-1 pb-2 mb-1">
                          <label className="font-semibold block">Sub Cuenta</label>
                          <Switch
                            color="primary"
                            checked={formik.values.hasSub}
                            onChange={(e) => formik.setFieldValue('hasSub', e.target.checked)}
                            size="lg"
                          />
                        </div>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          variant="bordered"
                          label="Tipo de cuenta"
                          placeholder="Selecciona el tipo"
                          labelPlacement="outside"
                          defaultSelectedKeys={[`${formik.values.type}`]}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;
                            key
                              ? formik.setFieldValue('type', value)
                              : formik.setFieldValue('typeSale', '');
                          }}
                          onBlur={formik.handleBlur('type')}
                          isInvalid={!!formik.touched.type && !!formik.errors.type}
                          errorMessage={formik.errors.type}
                        >
                          {AccountTypes.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          variant="bordered"
                          label="Cargar como"
                          placeholder="Selecciona el tipo"
                          labelPlacement="outside"
                          defaultSelectedKeys={[`${formik.values.loadAs}`]}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;
                            key
                              ? formik.setFieldValue('loadAs', value)
                              : formik.setFieldValue('loadAs', '');
                          }}
                          onBlur={formik.handleBlur('loadAs')}
                          isInvalid={!!formik.touched.loadAs && !!formik.errors.loadAs}
                          errorMessage={formik.errors.loadAs}
                        >
                          {UploadAS.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="pt-1 pb-2">
                        <Select
                          classNames={{ label: 'font-semibold' }}
                          variant="bordered"
                          label="Elemento"
                          placeholder="Selecciona el Elemento"
                          labelPlacement="outside"
                          defaultSelectedKeys={[`${formik.values.item}`]}
                          onSelectionChange={(key) => {
                            const value = new Set(key).values().next().value;
                            key
                              ? formik.setFieldValue('item', value)
                              : formik.setFieldValue('item', '');
                          }}
                          onBlur={formik.handleBlur('item')}
                          isInvalid={!!formik.touched.item && !!formik.errors.item}
                          errorMessage={formik.errors.item}
                        >
                          {Item.map((type) => (
                            <SelectItem key={type.key}>{type.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="pt-1 pb-2">
                        <Input
                          classNames={{ label: 'font-semibold' }}
                          label="Nivel de Cuenta"
                          placeholder="Ingrese el nivel de cuenta"
                          variant="bordered"
                          value={formik.values.level}
                          name="level"
                          onChange={formik.handleChange('level')}
                          onBlur={formik.handleBlur('level')}
                          labelPlacement="outside"
                          isInvalid={!!formik.touched.level && !!formik.errors.level}
                          errorMessage={formik.errors.level}
                        />
                      </div>
                    </div>
                    <div className="pt-6 pb-2 w-full flex justify-end">
                      <ButtonUi
                        theme={Colors.Primary}
                        type="submit"
                        isLoading={formik.isSubmitting}
                        className="px-16"
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
    </Layout>
  );
}

export default AddAccountCatalogs;
