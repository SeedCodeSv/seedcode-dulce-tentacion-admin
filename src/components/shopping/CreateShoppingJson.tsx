import { Button, Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeadlessModal from '../global/HeadlessModal';
import ERROR from '../../assets/error.png';
import { useNavigate } from 'react-router';
import { ArrowLeft, CloudUpload, X } from 'lucide-react';
import { create_shopping, isErrorSupplier } from '@/services/shopping.service';
import { useAuthStore } from '@/store/auth.store';
import Layout from '@/layout/Layout';
import useGlobalStyles from '../global/global.styles';
import { formatCurrency } from '@/utils/dte';
import { IResponseFromDigitalOceanDTE } from '@/store/types/sub_interface_shopping/response_from_digitalocean_DTE_types';
import AddTributeSupplier from './AddSupplier';
import CreateShoppingManual from './CreateShoppingManual';
import { useViewsStore } from '@/store/views.store';
import NoAuthorization from '@/pages/NoAuthorization';

function CreateShopping() {
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  const navigate = useNavigate();
  return (
    <>
      {actionView.includes('Agregar') ? (
        <Layout title="Agregar">
          <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
              <div
                className="flex w-24 items-center cursor-pointer mb-4"
                onClick={() => navigate('/shopping')}
              >
                <ArrowLeft onClick={() => navigate('/shopping')} className="mr-2" />
                <p>Regresar</p>
              </div>
              <Tabs
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
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<IResponseFromDigitalOceanDTE>();
  const { user } = useAuthStore();

  const styles = useGlobalStyles();
  const [modalSupplier, setModalSupplier] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setJsonData(undefined);
    }
  };
  const [providerModal, setProviderModal] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('branchId', user?.correlative.branchId.toString() ?? '0');
    if (file) {
      formData.append('dte', file);
    }
    try {
      create_shopping(formData).then(({ data }) => {
        if (data.ok) {
          toast.success('Información guardada correctamente');
          navigate('/shopping');
        } else {
          if (isErrorSupplier(data as unknown as { supplier: boolean })) {
            toast.error('Proveedor no encontrado');
            setProviderModal(true);
          }
        }
      });
    } catch (error) {
      toast.error('Ocurrió un error al guardar la información');
    }
  };
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          setJsonData(JSON.parse(content) as IResponseFromDigitalOceanDTE);
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

  const clearAllData = () => {
    setFile(null);
    setJsonData(undefined);
  };

  return (
    <>
      {actionView.includes('Agregar') ? (
        <>
          <HeadlessModal
            title="Registrar proveedor"
            isOpen={modalSupplier}
            onClose={() => setModalSupplier(false)}
            size="w-full md:w-[200px] lg:w-[400px] xl:w-[6000px]"
          >
            <AddTributeSupplier
              closeModal={() => setModalSupplier(false)}
              supplier={{
                nit: jsonData?.emisor.nit ?? '',
                tipoDocumento: jsonData?.emisor.tipoDocumento ?? '',
                numDocumento: jsonData?.emisor.numDocumento ?? '',
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
              <div className="flex flex-row h-full w-full">
                <div className="w-full flex justify-between mt-3 ">
                  <Button
                    onClick={() => setIsOpen(true)}
                    style={styles.darkStyle}
                    className="px-4 py-2"
                  >
                    Cargar Archivo JSON
                  </Button>

                  <X className="cursor-pointer" onClick={clearAllData} />
                </div>
              </div>
              <div className="flex flex-col mt-4 gap-4 p-6 border border-white rounded-lg shadow-lg  text-white">
                <div className="mt-4">
                  <p className="dark:text-white  text-black">DATOS OBTENIDOS DE LA COMPRA</p>
                  <div className="grid grid-cols-2 gap-6 mt-2">
                    <p className="text-sm font-semibold dark:text-white text-black">
                      Tipo de documento:{' '}
                      <span className="text-sm font-normal dark:text-white text-black">
                        {jsonData?.identificacion.tipoDte === '01'
                          ? 'Factura'
                          : jsonData?.identificacion.tipoDte === '03'
                            ? 'Crédito Fiscal'
                            : 'Desconocido'}
                      </span>
                    </p>
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
                      <span className="font-normal dark:text-white  text-black">{TotalLetras}</span>
                    </p>
                    <p className="text-sm font-semibold dark:text-white  text-black">
                      Sub-Total:
                      <span className="text-sm font-normal dark:text-white  text-black">
                        {formatCurrency(Number(SubTotal))}
                      </span>
                    </p>
                    <p className="text-sm font-semibold dark:text-white  text-black">
                      IVA:{' '}
                      <span className="text-sm font-normal dark:text-white  text-black">
                        {jsonData?.identificacion.tipoDte === '03'
                          ? formatCurrency(
                              Number(
                                jsonData?.resumen.tributos
                                  ?.map((trib) => Number(trib.valor))
                                  .reduce((a, b) => a + b, 0)
                              )
                            )
                          : formatCurrency(Number(jsonData?.resumen.totalIva))}
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
            </div>
            {jsonData && (
              <div className="flex justify-end">
                <Button style={styles.thirdStyle} onClick={handleSubmit} type="submit">
                  Guardar
                </Button>
              </div>
            )}
          </div>
          <HeadlessModal
            size={
              window.innerWidth < 700
                ? 'w-full md:w-[600px]   lg:w-[800px]  xl:w-[7000px] '
                : 'w-full md:w-[500px] md:h-[260px] lg:w-[700px] xl:w-[500px]'
            }
            title=""
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <label
              htmlFor="uploadFile1"
              className=" text-gray-500 font-semibold text-base rounded  mt-1 h-52 flex flex-col items-center justify-center cursor-pointer border dark:border-white mx-auto font-[sans-serif]"
            >
              <CloudUpload className="dark:text-white" size={40} />
              <p className="dark:text-white"> Selecciona un archivo JSON</p>
              <input onChange={handleFileChange} type="file" id="uploadFile1" className="hidden" />
            </label>
          </HeadlessModal>
        </>
      ) : (
        <NoAuthorization />
      )}
    </>
  );
};
