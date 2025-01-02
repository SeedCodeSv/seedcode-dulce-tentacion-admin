import { Button, Card, CardBody, Input, Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeadlessModal from '../global/HeadlessModal';
import ERROR from '../../assets/error.png';
import { X } from 'lucide-react';
import { create_shopping, isErrorSupplier, verify_code } from '@/services/shopping.service';
import { useAuthStore } from '@/store/auth.store';
import Layout from '@/layout/Layout';
import useGlobalStyles from '../global/global.styles';
import { formatCurrency } from '@/utils/dte';
import { IResponseFromDigitalOceanDTE } from '@/store/types/sub_interface_shopping/response_from_digitalocean_DTE_types';
import AddTributeSupplier from './AddSupplier';
import CreateShoppingManual from './CreateShoppingManual';
import { useViewsStore } from '@/store/views.store';
import NoAuthorization from '@/pages/NoAuthorization';
import {
  ClassDocumentCode,
  ClassDocuments,
  ClassDocumentValue,
  ClassificationCode,
  Classifications,
  ClassificationValue,
  OperationTypeCode,
  OperationTypes,
  OperationTypeValue,
  SectorCode,
  Sectors,
  SectorValue,
  TypeCostSpentCode,
  TypeCostSpents,
  TypeCostSpentValue,
} from '@/enums/shopping.enum';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { formatDate } from '@/utils/dates';
import { useAlert } from '@/lib/alert';
// import { useAlert } from '@/lib/alert';

function CreateShopping() {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  return (
    <>
      {actionView.includes('Agregar') ? (
        <Layout title="Agregar">
          <div className="">
            <div className="w-full h-full border border-white p-5 overflow-y-auto bg-white dark:bg-gray-900">
              <Tabs
                classNames={{
                  base: 'w-full flex justify-center',
                }}
                aria-label="Dynamic tabs"
                items={[
                  {
                    id: 1,
                    label: 'Manual',
                    content: <CreateShoppingManual />,
                  },
                  { id: 2, label: 'Archivo JSON', content: <JSONMode /> },
                ]}
              >
                {(item) => (
                  <Tab key={item.id} title={item.label}>
                    <Card className="bg-white border border-white dark:bg-gray-900">
                      <CardBody>{item.content}</CardBody>
                    </Card>
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
        </Layout>
      ) : (
        <NoAuthorization />
      )}
    </>
  );
}
export default CreateShopping;
const JSONMode = () => {
  const { user } = useAuthStore();
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<IResponseFromDigitalOceanDTE>();
  const styles = useGlobalStyles();
  const [modalSupplier, setModalSupplier] = useState(false);

  const { show } = useAlert();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setJsonData(undefined);
    }
  };
  const formik = useFormik({
    initialValues: {
      operationTypeCode: OperationTypeCode.GRAVADA,
      operationTypeValue: OperationTypeValue.Gravada,
      classificationCode: ClassificationCode.GASTO,
      classificationValue: ClassificationValue.Gasto,
      sectorCode: SectorCode.SERVICIOS_PROF_ART_OFF,
      sectorValue: SectorValue.SERVICIOS_PROF_ART_OFF,
      typeCostSpentCode: TypeCostSpentCode.GASTO_VENTA_SIN_DONACION,
      typeCostSpentValue: TypeCostSpentValue.GASTO_VENTA_SIN_DONACION,
      classDocumentCode: ClassDocumentCode.DOCUMENTO_TRIBUTARIO_ELECTRONICO,
      classDocumentValue: ClassDocumentValue.DOCUMENTO_TRIBUTARIO_ELECTRONICO,
      typeSale: 'interna',
      declarationDate: formatDate(),
      branchId: user?.correlative?.branchId ?? 0,
    },
    validationSchema: yup.object().shape({
      operationTypeCode: yup.string().required('**El tipo de operación es requerido**'),
      operationTypeValue: yup.string().required('**El tipo de operación es requerido**'),
      classificationCode: yup.string().required('**La clasificación es requerida**'),
      classificationValue: yup.string().required('**La clasificación es requerida**'),
      sectorCode: yup.string().required('**El sector es requerido**'),
      sectorValue: yup.string().required('**El sector es requerido**'),
      typeCostSpentCode: yup.string().required('**El tipo de gasto es requerido**'),
      typeCostSpentValue: yup.string().required('**El tipo de gasto es requerido**'),
      classDocumentCode: yup.string().required('**La clasificación es requerida**'),
      classDocumentValue: yup.string().required('**La clasificación es requerida**'),
      typeSale: yup.string().required('**El tipo de venta es requerido**'),
      declarationDate: yup.string().required('**La fecha es requerida**'),
      branchId: yup.string().required('**Selecciona la sucursal**'),
    }),
    onSubmit(values, formikHelpers) {
      const formData = new FormData();
      formData.append('operationTypeCode', values.operationTypeCode);
      formData.append('operationTypeValue', values.operationTypeValue);
      formData.append('classificationCode', values.classificationCode);
      formData.append('classificationValue', values.classificationValue);
      formData.append('sectorCode', values.sectorCode);
      formData.append('sectorValue', values.sectorValue);
      formData.append('typeCostSpentCode', values.typeCostSpentCode);
      formData.append('typeCostSpentValue', values.typeCostSpentValue);
      formData.append('classDocumentCode', values.classDocumentCode);
      formData.append('classDocumentValue', values.classDocumentValue);
      formData.append('typeSale', values.typeSale);
      formData.append('branchId', values.branchId.toString());
      formData.append('declarationDate', values.declarationDate);
      if (file) {
        formData.append('dte', file);
      }
      try {
        verify_code(jsonData?.identificacion.codigoGeneracion ?? '').then(({ data }) => {
          if (data.shopping) {
            toast.error('El código de generación ya existe');
            return;
          } else {
            create_shopping(formData).then(({ data }) => {
              if (data.ok) {
                formikHelpers.resetForm();
                formik.setSubmitting(false);
                toast.success('Información guardada correctamente');
                navigate('/shopping');
              } else {
                formik.setSubmitting(false);
                if (isErrorSupplier(data as unknown as { supplier: boolean })) {
                  toast.error('Proveedor no encontrado');
                  setProviderModal(true);
                }
              }
            });
          }
        });
      } catch (error) {
        formik.setSubmitting(false);
        toast.error('Ocurrió un error al guardar la información');
      }
    },
  });
  const [providerModal, setProviderModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const result = JSON.parse(content) as IResponseFromDigitalOceanDTE;
          if (result.identificacion.tipoDte === '01' || result.identificacion.tipoDte === '14') {
            setFile(null);
            setIsOpen(false);
            show({
              type: 'error',
              title: 'Archivo no valido!',
              message: 'No puedes agregar documentos con el tipo de DTE 01 o 14',
              isAutoClose: false,
            });
            toast.error('DTE Invalido');
            return;
          }
          setJsonData(result);
          setIsOpen(false);
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  const SubTotal = jsonData?.resumen?.subTotal ?? 0;
  const TotalLetras = jsonData?.resumen?.totalLetras ?? '';
  const MontoDeOperacion = jsonData?.resumen?.totalPagar ?? 0;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {actionView.includes('Agregar') ? (
        <>
          <HeadlessModal
            title="Registrar proveedor"
            isOpen={modalSupplier}
            onClose={() => setModalSupplier(false)}
            size="w-full md:w-[600px] lg:w-[800px] xl:w-[1000px]"
          >
            <AddTributeSupplier
              closeModal={() => setModalSupplier(false)}
              supplier={{
                nit: jsonData?.emisor.nit ?? '',
                tipoDocumento: jsonData?.emisor.tipoDocumento ?? '36',
                numDocumento: jsonData?.emisor.nit ?? '',
                nrc: jsonData?.emisor.nrc ?? '',
                nombre: jsonData?.emisor.nombre ?? '',
                telefono: jsonData?.emisor.telefono ?? '',
                correo: jsonData?.emisor.correo ?? '',
                nombreComercial: jsonData?.emisor.nombreComercial ?? '',
                codActividad: jsonData?.emisor.codActividad ?? '',
                descActividad: jsonData?.emisor.descActividad ?? '',
              }}
              supplier_direction={{
                municipio: jsonData?.emisor.direccion.municipio ?? '',
                departamento: jsonData?.emisor.direccion.departamento ?? '',
                complemento: jsonData?.emisor.direccion.complemento ?? '',
              }}
            />
          </HeadlessModal>
          <HeadlessModal
            isOpen={providerModal}
            onClose={() => setProviderModal(false)}
            title="Proveedor no encontrado"
            size="w-96"
          >
            <div className="w-full flex flex-col justify-center items-center">
              <img className="w-32" src={ERROR} alt="" />
              <p className="font-semibold pt-3">El proveedor no se encontró en los registros</p>
              <p className="font-semibold pb-3">¿Deseas registrarlo?</p>
              <div className="w-full grid grid-cols-2 gap-5">
                <Button onClick={() => setProviderModal(false)} style={styles.dangerStyles}>
                  Aceptar
                </Button>
                <Button onClick={() => setModalSupplier(true)} style={styles.thirdStyle}>
                  Registrar
                </Button>
              </div>
            </div>
          </HeadlessModal>
          <div className="w-full h-full p-4 overflow-y-auto">
            <div className=" justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
              <div className="flex flex-row w-full">
                <div className="w-full flex justify-between mt-3 ">
                  <Button
                    onClick={() => setIsOpen(true)}
                    style={styles.darkStyle}
                    className="px-4 py-2"
                  >
                    Cargar Archivo JSON
                  </Button>
                  <X className="cursor-pointer" onClick={() => navigate('/shopping')} />
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.submitForm();
                }}
              >
                <div className="flex flex-col mt-4 gap-4 p-6 border rounded-lg shadow-lg  dark:text-white">
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                    <div className="">
                      <Input
                        {...formik.getFieldProps('declarationDate')}
                        isInvalid={
                          !!formik.touched.declarationDate && !!formik.errors.declarationDate
                        }
                        errorMessage={formik.errors.declarationDate}
                        type="date"
                        variant="bordered"
                        label="Fecha de declaración"
                        labelPlacement='outside'
                        className='dark:text-white'
                        classNames={{ label: 'font-semibold' }}
                      />
                    </div>
                    <div>
                      <Select
                        classNames={{ label: 'font-semibold' }}
                        variant="bordered"
                        label="Tipo"
                        placeholder="Selecciona el tipo"
                        labelPlacement="outside"
                        defaultSelectedKeys={[`${formik.values.typeSale}`]}
                        onSelectionChange={(key) => {
                          const value = new Set(key).values().next().value;
                          key
                            ? formik.setFieldValue('typeSale', value)
                            : formik.setFieldValue('typeSale', '');
                        }}
                        onBlur={formik.handleBlur('typeSale')}
                        isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                        errorMessage={formik.errors.typeSale}
                      >
                        <SelectItem key={'interna'} value="interna">
                          Interna
                        </SelectItem>
                        <SelectItem key={'internacion'} value="internacion">
                          Internación
                        </SelectItem>
                        <SelectItem key={'importacion'} value="importacion">
                          Importación
                        </SelectItem>
                      </Select>
                    </div>

                    <Select
                      onBlur={formik.handleBlur('classDocumentCode')}
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set(key).values().next().value;
                          const code = ClassDocuments.find((item) => item.code === value);
                          if (code) {
                            formik.setFieldValue('classDocumentCode', code.code);
                            formik.setFieldValue('classDocumentValue', code.value);
                          } else {
                            formik.setFieldValue('classDocumentCode', '');
                            formik.setFieldValue('classDocumentValue', '');
                          }
                        } else {
                          formik.setFieldValue('classDocumentCode', '');
                          formik.setFieldValue('classDocumentValue', '');
                        }
                      }}
                      selectedKeys={formik.values.classDocumentCode}
                      classNames={{ label: 'font-semibold' }}
                      className="w-full"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      label="Clase del documento"
                      isInvalid={
                        !!formik.touched.classDocumentCode && !!formik.errors.classDocumentCode
                      }
                      errorMessage={formik.errors.classDocumentCode}
                    >
                      {ClassDocuments.map((item) => (
                        <SelectItem value={item.code} key={item.code}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      onBlur={formik.handleBlur('operationTypeCode')}
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set(key).values().next().value;
                          const code = OperationTypes.find((item) => item.code === value);
                          if (code) {
                            formik.setFieldValue('operationTypeCode', code.code);
                            formik.setFieldValue('operationTypeValue', code.value);
                          } else {
                            formik.setFieldValue('operationTypeCode', '');
                            formik.setFieldValue('operationTypeValue', '');
                          }
                        } else {
                          formik.setFieldValue('operationTypeCode', '');
                        }
                      }}
                      selectedKeys={formik.values.operationTypeCode}
                      classNames={{ label: 'font-semibold' }}
                      className="w-full"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      label="Tipo de operación"
                      isInvalid={
                        !!formik.touched.operationTypeCode && !!formik.errors.operationTypeCode
                      }
                      errorMessage={formik.errors.operationTypeCode}
                    >
                      {OperationTypes.map((item) => (
                        <SelectItem value={item.code} key={item.code}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      classNames={{ label: 'font-semibold' }}
                      className="w-full"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      label="Clasificación"
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set(key).values().next().value;
                          const code = Classifications.find((item) => item.code === value);
                          if (code) {
                            formik.setFieldValue('classificationCode', code.code);
                            formik.setFieldValue('classificationValue', code.value);
                          } else {
                            formik.setFieldValue('classificationCode', '');
                            formik.setFieldValue('classificationValue', '');
                          }
                        } else {
                          formik.setFieldValue('classificationCode', '');
                        }
                      }}
                      selectedKeys={formik.values.classificationCode}
                      onBlur={formik.handleBlur('classificationCode')}
                      isInvalid={
                        !!formik.touched.classificationCode && !!formik.errors.classificationCode
                      }
                      errorMessage={formik.errors.classificationCode}
                    >
                      {Classifications.map((item) => (
                        <SelectItem value={item.code} key={item.code}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      classNames={{ label: 'font-semibold' }}
                      className="w-full"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      label="Sector"
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set(key).values().next().value;
                          const code = Sectors.find((item) => item.code === value);
                          if (code) {
                            formik.setFieldValue('sectorCode', code.code);
                            formik.setFieldValue('sectorValue', code.value);
                          } else {
                            formik.setFieldValue('sectorCode', '');
                            formik.setFieldValue('sectorValue', '');
                          }
                        } else {
                          formik.setFieldValue('sectorCode', '');
                        }
                      }}
                      selectedKeys={formik.values.sectorCode}
                      onBlur={formik.handleBlur('sectorCode')}
                      isInvalid={!!formik.touched.sectorCode && !!formik.errors.sectorCode}
                      errorMessage={formik.errors.sectorCode}
                    >
                      {Sectors.map((item) => (
                        <SelectItem value={item.code} key={item.code}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      classNames={{ label: 'font-semibold' }}
                      className="w-full"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      label="Tipo de costo/gasto"
                      onSelectionChange={(key) => {
                        if (key) {
                          const value = new Set(key).values().next().value;
                          const code = TypeCostSpents.find((item) => item.code === value);
                          if (code) {
                            formik.setFieldValue('typeCostSpentCode', code.code);
                            formik.setFieldValue('typeCostSpentValue', code.value);
                          } else {
                            formik.setFieldValue('typeCostSpentCode', '');
                            formik.setFieldValue('typeCostSpentValue', '');
                          }
                        } else {
                          formik.setFieldValue('typeCostSpentCode', '');
                        }
                      }}
                      selectedKeys={formik.values.typeCostSpentCode}
                      onBlur={formik.handleBlur('typeCostSpentCode')}
                      isInvalid={
                        !!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode
                      }
                      errorMessage={formik.errors.typeCostSpentCode}
                    >
                      {TypeCostSpents.map((item) => (
                        <SelectItem value={item.code} key={item.code}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="mt-4">
                    <p className="dark:text-white  text-black">DATOS OBTENIDOS DE LA COMPRA</p>
                    <div className="grid grid-cols-2 gap-6 mt-2">
                      <p className="text-sm font-semibold dark:text-white text-black ">
                        Número de control:{' '}
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {jsonData?.identificacion.numeroControl}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Fecha y hora:{' '}
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {jsonData?.identificacion.fecEmi} {jsonData?.identificacion.horEmi}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Código de generación:{' '}
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {jsonData?.identificacion.codigoGeneracion}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Tipo de documento:{' '}
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {(() => {
                            switch (jsonData?.identificacion.tipoDte) {
                              case '01':
                                return 'Consumidor Final';
                              case '03':
                                return 'Crédito fiscal';
                              case '05':
                                return 'Nota de Crédito';
                              case '06':
                                return 'Nota de Débito';
                              default:
                                return '';
                            }
                          })()}
                        </span>
                      </p>
                    </div>
                    <div className="border-t border-gray-400 my-4"></div>
                    <p className="text-lg font-bold dark:text-white  text-black">Emisor</p>
                    <div className="grid grid-cols-2 gap-6 mt-2">
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Nombre: <span className="font-bold">{jsonData?.emisor.nombre}</span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Descripción:{' '}
                        <span className="font-normal dark:text-white  text-black ">
                          {jsonData?.emisor.descActividad}
                        </span>
                      </p>
                      <p className="text-sm font-semibold col-span-2 dark:text-white  text-black">
                        Dirección:{' '}
                        <span className="font-normal marker:dark:text-white dark:text-white  text-black">
                          {jsonData?.emisor.direccion.departamento},{' '}
                          {jsonData?.emisor.direccion.municipio},{' '}
                          {jsonData?.emisor.direccion.complemento}
                        </span>
                      </p>
                    </div>
                    <div className="border-t border-gray-400 my-4"></div>
                    <div className="grid grid-cols-2 gap-6 mt-2">
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Total Letras:{' '}
                        <span className="font-normal dark:text-white  text-black">
                          {TotalLetras}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Sub-Total:
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {formatCurrency(Number(SubTotal))}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        IVA:
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {jsonData?.identificacion.tipoDte === '03' ? (
                            <div className="flex flex-col gap-2">
                              {jsonData.resumen.tributos?.map((trib, key) => (
                                <p className="" key={key}>
                                  - {trib.codigo} - {trib.descripcion}:{' '}
                                  <span className="font-semibold">
                                    {formatCurrency(trib.valor)}
                                  </span>
                                </p>
                              ))}
                            </div>
                          ) : (
                            formatCurrency(Number(jsonData?.resumen.totalIva))
                          )}
                        </span>
                      </p>
                      <p className="text-sm font-semibold dark:text-white  text-black">
                        Monto total de la operación:
                        <span className="text-sm font-normal dark:text-white  text-black">
                          {formatCurrency(Number(MontoDeOperacion))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {jsonData && (
                  <div>
                    <p className="mt-4 font-semibold  dark:text-white  text-black justify-center text-lg">
                      DATOS DEL PRODUCTO
                    </p>
                    <div className="flex flex-col items-end ">
                      <DataTable
                        className="w-full max-h-[400px] lg:max-h-[500px] 2xl:max-h-[600px] mt-5 shadow dark:text-white"
                        emptyMessage="Aun no agregar productos o servicios"
                        tableStyle={{ minWidth: '50rem' }}
                        scrollable
                        value={jsonData.cuerpoDocumento}
                        scrollHeight="flex"
                      >
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                            borderTopLeftRadius: '5px',
                          }}
                          header="Tipo de item"
                          field="tipoItem"
                        />
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                          }}
                          header="Unidad de medida"
                          field="uniMedida"
                        />
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                          }}
                          header="Cantidad"
                          field="cantidad"
                        />
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                          }}
                          header="Codigo"
                          body={(rowData) => (rowData.codigo ? rowData.codigo : 'Sin Código')}
                        />
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                          }}
                          header="Descripción"
                          field="descripcion"
                        />
                        <Column
                          className="dark:text-white  text-black"
                          headerClassName="text-sm font-semibold"
                          bodyClassName="text-sm"
                          headerStyle={{
                            ...styles.darkStyle,
                          }}
                          header="Precio unitario"
                          body={(rowData) => `$ ${rowData.precioUni}`}
                        />
                      </DataTable>
                    </div>
                  </div>
                )}
                {jsonData && (
                  <div className="flex justify-end">
                    <Button style={styles.thirdStyle} type="submit">
                      Guardar
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
          <HeadlessModal
            size={
              window.innerWidth < 700
                ? 'w-full md:w-[600px] lg:w-[800px] xl:w-[7000px]'
                : 'w-full md:w-[500px] lg:w-[700px] xl:w-[500px]'
            }
            title=""
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Selecciona un archivo JSON
              <input
                onChange={handleFileChange}
                type="file"
                accept=".json"
                id="uploadFile1"
                className="hidden"
              />
            </label>
          </HeadlessModal>
        </>
      ) : (
        <NoAuthorization />
      )}
    </>
  );
};
