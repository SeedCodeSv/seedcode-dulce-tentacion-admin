import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { LockIcon, UnlockIcon, X } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

import HeadlessModal from '../global/HeadlessModal';
import ERROR from '../../assets/error.png';
import useGlobalStyles from '../global/global.styles';

import AddTributeSupplier from './add-supplier';
import CreateShoppingManual from './create-shopping-manual';
import AccountItem from './manual/account-item';
import CatalogItemsPaginated from './manual/catalog-items-paginated';

import { create_shopping, isErrorSupplier, verify_code } from '@/services/shopping.service';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency } from '@/utils/dte';
import { IResponseFromDigitalOceanDTE } from '@/store/types/sub_interface_shopping/response_from_digitalocean_DTE_types';
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
import { formatDate } from '@/utils/dates';
import { useAlert } from '@/lib/alert';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import { useBranchesStore } from '@/store/branches.store';
import { get_supplier_by_nit } from '@/services/supplier.service';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';

function CreateShopping() {
  const { actions } = useViewsStore();
  const styles = useGlobalStyles()
  const navigate = useNavigate()
  const viewName = actions.find((v) => v.view.name === 'Compras');
  const actionView = Array.isArray(viewName?.actions?.name)
    ? viewName.actions.name
    : [];

  const [activeTab, setActiveTab] = useState(1);

  if (!actionView.includes('Agregar')) {
    return <NoAuthorization />;
  }

  const tabs = [
    { id: 1, label: 'Manual', content: <CreateShoppingManual /> },
    { id: 2, label: 'Archivo JSON', content: <JSONMode /> },
  ];

  const handleTabChange = (value: number) => {
    setActiveTab(value);
  };

  return (
    <DivGlobal className="flex flex-col items-center p-5 xl:p-8">
      <div className='grid grid-cols-2 w-full items-center'>
        <X className="cursor-pointer" onClick={() => {
          navigate('/shopping')
        }} />
        <div className='flex'>
          <div className="bg-slate-100 shadow rounded-[15px] flex gap-2 p-1 ">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                style={activeTab === tab.id ? {
                  ...styles.thirdStyle,
                  opacity: 10
                } : {
                  background: styles.thirdStyle.color,
                  color: styles.thirdStyle.backgroundColor
                }}
                onPress={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Card className="bg-white dark:bg-gray-900 w-full mt-4 mx-auto">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </Card>
    </DivGlobal>
  );
}

export default CreateShopping;

const JSONMode = () => {
  const [errorP, setErrorP] = useState(false)
  const { user } = useAuthStore();
  const { actions } = useViewsStore();
  const viewName = actions.find((v) => v.view.name == 'Compras');
  const actionView = viewName?.actions.name || [];
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<IResponseFromDigitalOceanDTE>();
  const [modalSupplier, setModalSupplier] = useState(false);
  const { show } = useAlert();
  const { getAccountCatalogs, account_catalog_pagination } = useAccountCatalogsStore();
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();
  const { branch_list, getBranchesList } = useBranchesStore();

  useEffect(() => {
    if (user) {
      const transId = user.pointOfSale ? user.pointOfSale.branch.transmitter.id : 0;

      getFiscalDataAndParameter(transId);
      getAccountCatalogs(transId ?? 0, '', '');
      getBranchesList();
    }
  }, [user]);

  useEffect(() => {
    if (fiscalDataAndParameter) {
      const itemss = [...items];

      if (fiscalDataAndParameter) {
        const findedO = account_catalog_pagination.accountCatalogs.find(
          (acc) => acc.code === (fiscalDataAndParameter.ivaLocalShopping || '110901')
        );
        const findedI = account_catalog_pagination.accountCatalogs.find(
          (acc) => acc.code === '21020101'
        );

        if (findedO) {
          itemss[1].codCuenta = findedO.code;
          itemss[1].descCuenta = findedO.name;
        }
        if (findedI) {
          itemss[2].codCuenta = findedI.code;
          itemss[2].descCuenta = findedI.name;
        }
      }
      setItems([...itemss]);
    }
  }, [fiscalDataAndParameter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setJsonData(undefined);
    }
  };

  const [branchName, setBranchSelected] = useState<string>('');

  const [items, setItems] = useState<Items[]>([
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
      itemId: 0,
    },
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
      itemId: 0,
    },
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
      itemId: 0,
    },
  ]);

  const addItem = () => {
    const itemss = [...items];

    itemss.unshift({
      no: items.length + 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
      itemId: 0,
    });
    setItems(itemss);
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const catalogModal = useDisclosure();
  const [description, setDescription] = useState('');
  const [dateItem, setDateItem] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);

  const $debe = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.debe), 0);
  }, [items]);

  const $haber = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.haber), 0);
  }, [items]);

  const $total = useMemo(() => {
    return Number((Number($debe.toFixed(2)) - Number($haber.toFixed(2))).toFixed(2));
  }, [$debe, $haber]);

  const openCatalogModal = (index: number) => {
    setEditIndex(index);
    catalogModal.onOpen();
  };

  useEffect(() => {
    if (user) {
      setBranchSelected(user?.pointOfSale?.branch.name ?? '');
    }
  }, [user]);
  const navigate = useNavigate();

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
      branchId: 0,
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
      branchId: yup
        .number()
        .required('**Selecciona la sucursal**')
        .min(1, '**Selecciona la sucursal**'),
    }),
    onSubmit(values, formikHelpers) {
      if (items.some((item) => !item.codCuenta || item.codCuenta === '')) {
        toast.error('Revisa los datos de la partida hay lineas sin código de cuenta');
        formik.setSubmitting(false);
        setErrorP(true)

        return;
      }

      if (!selectedType) {
        toast.warning('Debes seleccionar el tipo de partida');
        setErrorP(true)

        return;
      }

      const transmitterId = user?.pointOfSale?.branch.transmitter.id ?? 0;

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
      formData.append('transmitterId', transmitterId.toString());

      const itemsS = {
        transmitterId: transmitterId,
        date: dateItem,
        typeOfAccountId: selectedType,
        concepOfTheItem: description,
        totalDebe: $debe,
        totalHaber: $haber,
        difference: $total,
        itemDetails: items.map((item, index) => ({
          numberItem: (index + 1).toString(),
          catalog: item.codCuenta,
          branchId: values.branchId ?? undefined,
          should: Number(item.debe),
          see: Number(item.haber),
          itemId: 0,
          conceptOfTheTransaction: item.descTran.length > 0 ? item.descTran : 'N/A',
        })),
      };

      formData.append('itemCatalog', JSON.stringify(itemsS));

      if (jsonData) {
        const updatedBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const updatedFile = new File([updatedBlob], file?.name ?? 'dte.json', { type: 'application/json' });

        formData.append('dte', updatedFile);
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

  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const result = JSON.parse(content) as IResponseFromDigitalOceanDTE;

          if (!['03', '05', '06'].includes(result.identificacion.tipoDte)) {
            setFile(null);
            setIsOpen(false);
            show({
              type: 'error',
              title: 'Archivo no valido!',
              message: 'No puedes agregar este tipo de DTE',
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

  useEffect(() => {
    if (jsonData) {
      const total = jsonData.resumen.montoTotalOperacion ?? 0;
      const iva =
        jsonData.resumen.tributos && jsonData.resumen.tributos.length > 0
          ? jsonData.resumen.tributos?.map((item) => item.valor).reduce((a, b) => a + b, 0)
          : 0;
      const totalWithoutIva = total - iva;

      const itemss = [...items];

      itemss[0].debe = totalWithoutIva.toFixed(2);
      itemss[0].haber = '0';
      itemss[1].debe = iva.toFixed(2);
      itemss[1].haber = '0';
      itemss[2].debe = '0';
      itemss[2].haber = total.toFixed(2);
      setItems([...itemss]);

      get_supplier_by_nit(jsonData.emisor.nit!)
        .then((res) => {
          const find = account_catalog_pagination.accountCatalogs.find(
            (item) => item.code === res.data.supplier.codCuenta
          );

          if (find) {
            const itemss = [...items];

            itemss[2].codCuenta = find.code;
            itemss[2].descCuenta = find.name;
            setItems([...itemss]);
          }
        })
        .catch(() => {
          toast.error('Proveedor no encontrado');
          setProviderModal(true);
        });
    }
  }, [jsonData]);

  const SubTotal = jsonData?.resumen?.subTotal ?? 0;
  const TotalLetras = jsonData?.resumen?.totalLetras ?? '';
  const MontoDeOperacion = jsonData?.resumen?.totalPagar ?? 0;
  const [isOpen, setIsOpen] = useState(false);

  const [lockedStates, setLockedStates] = useState<boolean[]>([]);
  const [locksInitialized, setLocksInitialized] = useState(false);

  useEffect(() => {
    if (!locksInitialized && jsonData?.cuerpoDocumento) {
      setLockedStates(jsonData.cuerpoDocumento.map(() => true));
      setLocksInitialized(true);
    }
  }, [jsonData, locksInitialized]);


  const toggleLock = (index: number) => {
    setLockedStates((prev) => {
      const newState = [...prev];

      newState[index] = !newState[index];

      return newState;
    });
  };


  return (
    <>
      {actionView.includes('Agregar') ? (
        <>
          <Modal
            isDismissable={false}
            isOpen={modalSupplier}
            size="3xl"
            onClose={() => setModalSupplier(false)}
          >
            <ModalContent>
              {() => (
                <>
                  <ModalHeader>Registrar proveedor</ModalHeader>
                  <ModalBody>
                    <AddTributeSupplier
                      closeModal={() => {
                        setProviderModal(false);
                        setModalSupplier(false);
                      }}
                      setCode={(code, description) => {
                        const itemss = [...items];

                        itemss[2].codCuenta = code;
                        itemss[2].descCuenta = description;
                        setItems(itemss);
                      }}
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
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal closeButton={<></>} isDismissable={false} isOpen={providerModal}>
            <ModalContent>
              {() => (
                <>
                  <ModalHeader>Proveedor no encontrado</ModalHeader>
                  <ModalBody className="flex flex-col justify-center items-center dark:text-white">
                    <img alt="" className="w-32" src={ERROR} />
                    <p className="font-semibold pt-3">
                      El proveedor no se encontró en los registros
                    </p>
                    <p className="font-semibold pb-3">¿Deseas registrarlo?</p>
                  </ModalBody>
                  <ModalFooter>
                    <ButtonUi
                      className="px-20"
                      theme={Colors.Info}
                      onPress={() => {
                        setModalSupplier(true);
                        setProviderModal(false);
                      }}
                    >
                      Registrar
                    </ButtonUi>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="w-full h-full p-4 overflow-y-auto">
            <div className=" justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
              <div className="flex flex-row w-full">
                <div className="w-full flex justify-between mt-3 ">
                  <ButtonUi
                    className="px-4 py-2"
                    theme={Colors.Info}
                    onPress={() => setIsOpen(true)}
                  >
                    Cargar Archivo JSON
                  </ButtonUi>
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
                        className="dark:text-white"
                        classNames={{ label: 'font-semibold' }}
                        errorMessage={formik.errors.declarationDate}
                        isInvalid={
                          !!formik.touched.declarationDate && !!formik.errors.declarationDate
                        }
                        label="Fecha de declaración"
                        labelPlacement="outside"
                        type="date"
                        variant="bordered"
                      />
                    </div>
                    <div>
                      <Select
                        classNames={{ label: 'font-semibold' }}
                        defaultSelectedKeys={[`${formik.values.typeSale}`]}
                        errorMessage={formik.errors.typeSale}
                        isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                        label="Tipo"
                        labelPlacement="outside"
                        placeholder="Selecciona el tipo"
                        variant="bordered"
                        onBlur={formik.handleBlur('typeSale')}
                        onSelectionChange={(key) => {
                          const value = new Set(key).values().next().value;

                          key
                            ? formik.setFieldValue('typeSale', value)
                            : formik.setFieldValue('typeSale', '');
                        }}
                      >
                        <SelectItem key={'interna'}>Interna</SelectItem>
                        <SelectItem key={'internacion'}>Internación</SelectItem>
                        <SelectItem key={'importacion'}>Importación</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <Select
                        classNames={{ label: 'font-semibold' }}
                        defaultSelectedKeys={
                          formik.values.branchId > 0 ? [`${formik.values.branchId}`] : undefined
                        }
                        errorMessage={formik.errors.branchId}
                        isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
                        label="Sucursal"
                        labelPlacement="outside"
                        placeholder="Selecciona la sucursal"
                        variant="bordered"
                        onBlur={formik.handleBlur('branchId')}
                        onSelectionChange={(key) => {
                          if (key) {
                            const branchId = Number(key.anchorKey);

                            const branch = branch_list.find((item) => item.id === branchId);

                            if (branch) {
                              setBranchSelected(branch.name);
                              formik.setFieldValue('branchId', branchId);
                              const itemss = [...items];

                              itemss[0].centroCosto = branch.id.toString();
                              itemss[1].centroCosto = branch.id.toString();
                              itemss[2].centroCosto = branch.id.toString();
                              setItems([...itemss]);
                            }
                          }
                        }}
                      >
                        {branch_list.map((item) => (
                          <SelectItem
                            key={item.id}
                            className="dark:text-white"
                            textValue={item.name}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <Select
                      className="w-full"
                      classNames={{ label: 'font-semibold' }}
                      errorMessage={formik.errors.classDocumentCode}
                      isInvalid={
                        !!formik.touched.classDocumentCode && !!formik.errors.classDocumentCode
                      }
                      label="Clase del documento"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      selectedKeys={formik.values.classDocumentCode}
                      variant="bordered"
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
                    >
                      {ClassDocuments.map((item) => (
                        <SelectItem key={item.code}>{item.value}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="w-full"
                      classNames={{ label: 'font-semibold' }}
                      errorMessage={formik.errors.operationTypeCode}
                      isInvalid={
                        !!formik.touched.operationTypeCode && !!formik.errors.operationTypeCode
                      }
                      label="Tipo de operación"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      selectedKeys={formik.values.operationTypeCode}
                      variant="bordered"
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
                    >
                      {OperationTypes.map((item) => (
                        <SelectItem key={item.code}>{item.value}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="w-full"
                      classNames={{ label: 'font-semibold' }}
                      errorMessage={formik.errors.classificationCode}
                      isInvalid={
                        !!formik.touched.classificationCode && !!formik.errors.classificationCode
                      }
                      label="Clasificación"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      selectedKeys={formik.values.classificationCode}
                      variant="bordered"
                      onBlur={formik.handleBlur('classificationCode')}
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
                    >
                      {Classifications.map((item) => (
                        <SelectItem key={item.code}>{item.value}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="w-full"
                      classNames={{ label: 'font-semibold' }}
                      errorMessage={formik.errors.sectorCode}
                      isInvalid={!!formik.touched.sectorCode && !!formik.errors.sectorCode}
                      label="Sector"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      selectedKeys={formik.values.sectorCode}
                      variant="bordered"
                      onBlur={formik.handleBlur('sectorCode')}
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
                    >
                      {Sectors.map((item) => (
                        <SelectItem key={item.code}>{item.value}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="w-full"
                      classNames={{ label: 'font-semibold' }}
                      errorMessage={formik.errors.typeCostSpentCode}
                      isInvalid={
                        !!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode
                      }
                      label="Tipo de costo/gasto"
                      labelPlacement="outside"
                      placeholder="Selecciona una opción"
                      selectedKeys={formik.values.typeCostSpentCode}
                      variant="bordered"
                      onBlur={formik.handleBlur('typeCostSpentCode')}
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
                    >
                      {TypeCostSpents.map((item) => (
                        <SelectItem key={item.code}>{item.value}</SelectItem>
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
                    <div className="border-t border-gray-400 my-4" />
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
                    <div className="border-t border-gray-400 my-4" />
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
                                <p key={key} className="">
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
                <AccountItem
                  editAccount
                  $debe={$debe}
                  $haber={$haber}
                  $total={$total}
                  addItems={addItem}
                  branchName={branchName}
                  canAddItem={false}
                  date={dateItem}
                  description={description}
                  errorP={errorP}
                  handleDeleteItem={() => { }}
                  index={0}
                  isReadOnly={false}
                  items={items}
                  ivaShoppingCod={fiscalDataAndParameter?.ivaLocalShopping || '110901'}
                  openCatalogModal={openCatalogModal}
                  selectedIndex={selectedIndex}
                  selectedType={selectedType}
                  setDate={setDateItem}
                  setDescription={setDescription}
                  setErrorP={setErrorP}
                  setItems={setItems}
                  setSelectedIndex={setSelectedIndex}
                  setSelectedType={setSelectedType}
                  onClose={catalogModal.onClose}
                />
                {jsonData && (
                  <div>
                    <p className="mt-4 font-semibold  dark:text-white  text-black justify-center text-lg">
                      DATOS DEL PRODUCTO
                    </p>
                    <div className="flex flex-col w-full">
                      <TableComponent headers={['Tipo de item', 'Un. de medida', 'Cantidad', 'Código', 'Descripción', 'Pre. unitario', 'Total Gravada']}>
                        {jsonData.cuerpoDocumento.map((item, index) => (
                          <tr key={index}>
                            <TdGlobal className="p-3">{item.tipoItem}</TdGlobal>
                            <TdGlobal className="p-3">{item.uniMedida}</TdGlobal>
                            <TdGlobal className="p-3">{item.cantidad}</TdGlobal>
                            <TdGlobal className="p-3 flex w-1/7">
                              <Input
                                className='flex w-1/7'
                                classNames={{ label: 'font-semibold' }}
                                isDisabled={lockedStates[index]}
                                name="codigo"
                                placeholder=""
                                value={item.codigo}
                                variant="bordered"
                                onChange={(e) => {
                                  if (!jsonData) return;

                                  const updatedItems = [...jsonData.cuerpoDocumento];

                                  updatedItems[index] = {
                                    ...updatedItems[index],
                                    codigo: e.target.value,
                                  };

                                  setJsonData({
                                    ...jsonData,
                                    cuerpoDocumento: updatedItems,
                                    apendice: jsonData.apendice ?? null,
                                    documentoRelacionado: jsonData.documentoRelacionado ?? null,
                                    extension: jsonData.extension ?? null,
                                    ventaTercero: jsonData.ventaTercero ?? null,
                                  });
                                }}
                              />
                              <Button
                                isIconOnly
                                className='bg-transparent'
                                size='sm'
                                type="button"
                                onPress={() => toggleLock(index)}
                              >
                                {lockedStates[index] ? <LockIcon size={20} /> : <UnlockIcon />}
                              </Button>
                            </TdGlobal>
                            <TdGlobal className="p-3 w-1/3">{item.descripcion}</TdGlobal>
                            <TdGlobal className="p-3">{item.precioUni}</TdGlobal>
                            <TdGlobal className="p-3">{item.ventaGravada}</TdGlobal>
                          </tr>
                        ))}
                      </TableComponent>

                    </div>
                  </div>
                )}
                {jsonData && (
                  <div className="flex justify-end">
                    <ButtonUi theme={Colors.Primary} type="submit">
                      Guardar
                    </ButtonUi>
                  </div>
                )}
              </form>
            </div>
          </div>
          <HeadlessModal
            isOpen={isOpen}
            size={
              window.innerWidth < 700
                ? 'w-full md:w-[600px] lg:w-[800px] xl:w-[7000px]'
                : 'w-full md:w-[500px] lg:w-[700px] xl:w-[500px]'
            }
            title=""
            onClose={() => setIsOpen(false)}
          >
            <label
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
              htmlFor="uploadFile1"
            >
              <svg
                className="w-11 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
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
                accept=".json"
                className="hidden"
                id="uploadFile1"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </HeadlessModal>
        </>
      ) : (
        <NoAuthorization />
      )}
      {editIndex !== null && (
        <Modal
          isOpen={catalogModal.isOpen}
          scrollBehavior="inside"
          size="2xl"
          onClose={catalogModal.onClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <CatalogItemsPaginated
                  index={editIndex}
                  items={items}
                  setItems={setItems}
                  onClose={onClose}
                />
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
