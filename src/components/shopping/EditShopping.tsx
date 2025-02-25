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
import Layout from '@/layout/Layout';
import { useBranchesStore } from '@/store/branches.store';
import { useShoppingStore } from '@/store/shopping.store';
import { global_styles } from '@/styles/global.styles';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import { convertCurrencyFormat } from '@/utils/money';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import * as yup from 'yup';
import useGlobalStyles from '../global/global.styles';
import { useAuthStore } from '@/store/auth.store';
import AccountItem from './manual/account-item';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import CatalogItemsPaginated from './manual/catalog-items-paginated';
// import { cat_011_tipo_de_item } from '@/services/facturation/cat-011-tipo-de-item.service';

function EditShopping() {
  const { id, controlNumber } = useParams<{ id: string; controlNumber: string }>();
  const { shopping_details, getShoppingDetails } = useShoppingStore();
  // const [tipoDte, setTipoDte] = useState('');
  const styles = useGlobalStyles();
  const { branch_list, getBranchesList } = useBranchesStore();
  const [includePerception, setIncludePerception] = useState(false);
  const { getAccountCatalogs, account_catalog_pagination } = useAccountCatalogsStore();

  const isDisabled = controlNumber?.toUpperCase().startsWith('DTE');
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();

  useEffect(() => {
    getShoppingDetails(Number(id));
    getBranchesList();
    getAccountCatalogs('', '');
    const transmitterId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;
    getFiscalDataAndParameter(transmitterId);
  }, []);

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['03', '06', '05'].includes(item.codigo));
  }, []);

  const { user } = useAuthStore();

  const [hasDetails, setHasDetails] = useState(false);

  // item
  const [branchName, setBranchName] = useState('');
  const [description, setDescription] = useState('');
  const [dateItem, setDateItem] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);
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
      classDocumentCode: ClassDocumentCode.IMPRESO_POR_IMPRENTA_O_TIQUETES,
      classDocumentValue: ClassDocumentValue.IMPRESO_POR_IMPRENTA_O_TIQUETES,
      tipoDte: '',
      typeSale: 'interna',
      controlNumber: '',
      declarationDate: formatDate(),
      fecEmi: formatDate(),
      branchId: 0,
      totalExenta: 0,
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
      tipoDte: yup.string().required('**El tipo de documento es requerido**'),
      typeSale: yup.string().required('**El tipo de venta es requerido**'),
      controlNumber: yup.string().required('**El número de control es requerido**'),
      declarationDate: yup.string().required('**La fecha es requerida**'),
      fecEmi: yup.string().required('**La fecha es requerida**'),
      branchId: yup
        .number()
        .required('**Selecciona la sucursal**')
        .min(1, '**Selecciona la sucursal**'),
    }),

    onSubmit(values, formikHelpers) {
      if (items.some((item) => !item.codCuenta || item.codCuenta === '')) {
        toast.error('Revisa los datos de la partida hay lineas sin código de cuenta');
        formik.setSubmitting(false);
        return;
      }

      const transId =
        user?.correlative?.branch.transmitter.id ?? user?.pointOfSale?.branch.transmitter.id ?? 0;
      const payload = {
        supplierId: 0,
        branchId: values.branchId,
        numeroControl: values.controlNumber || '',
        tipoDte: values.tipoDte,
        totalExenta: values.totalExenta || 0,
        totalGravada: Number($afecta) || 0,
        porcentajeDescuento: 0,
        totalDescu: 0,
        totalIva: Number($totalIva) || 0,
        subTotal: Number($afecta) || 0,
        montoTotalOperacion: Number($totalItems) || 0,
        totalPagar: Number($totalItems) || 0,
        totalLetras: convertCurrencyFormat($totalItems),
        fecEmi: values.fecEmi,
        declarationDate: values.declarationDate,
        ivaPerci1: $1perception || 0,
        operationTypeCode: values.operationTypeCode,
        operationTypeValue: values.operationTypeValue,
        classificationCode: values.classificationCode,
        classificationValue: values.classificationValue,
        sectorCode: values.sectorCode,
        sectorValue: values.sectorValue,
        typeCostSpentCode: values.typeCostSpentCode,
        typeCostSpentValue: values.typeCostSpentValue,
        typeSale: values.typeSale,
        classDocumentCode: values.classDocumentCode,
        transmitterId: transId,
        classDocumentValue: values.classDocumentValue,
        itemCatalog: {
          transmitterId: transId,
          date: dateItem,
          typeOfAccountId: selectedType,
          concepOfTheItem: description,
          totalDebe: $debe,
          totalHaber: $haber,
          difference: $total,
          itemDetails: items.map((item) => ({
            numberItem: item.no,
            catalog: item.codCuenta,
            branchId: values.branchId ?? undefined,
            should: Number(item.debe),
            see: Number(item.haber),
            conceptOfTheTransaction: item.descTran.length > 0 ? item.descTran : 'N/A',
            itemId: item.itemId,
          })),
        },
      };

      axios
        .patch(API_URL + `/shoppings/${shopping_details?.id}`, payload)
        .then(() => {
          toast.success('Compra actualizada con éxito');
          formikHelpers.setSubmitting(false);
          navigate('/shopping');
        })
        .catch(() => {
          toast.error('Error al actualizada la compra');
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const handleDeleteItem = (index: number) => {
    const itemss = [...items];
    itemss.splice(index, 1);
    setItems([...itemss]);
    if (selectedIndex === index) {
      setSelectedIndex(null);
    }
  };

  const $afecta = useMemo(() => {
    const afecta = items
      .slice(0, items.length - 2)
      .reduce((acc, item) => acc + Number(item.debe) + Number(item.haber), 0)
      .toFixed(2);

    return afecta;
  }, [items]);

  const $totalIva = useMemo(() => {
    const iva = items[items.length - 2]?.debe
      ? Number(items[items.length - 2].debe) + Number(items[items.length - 2].haber)
      : 0;
    return iva.toFixed(2);
  }, [items]);


  const $totalItems = useMemo(() => {
    return (
      items
        .slice(0, items.length - 2)
        .reduce((acc, item) => acc + Number(item.debe) + Number(item.haber), 0) + +$totalIva
    ).toFixed(2);
  }, [items]);

  // TODO: Asignar valores a formik y a items
  useEffect(() => {
    if (shopping_details) {
      if (Number(shopping_details.ivaPerci1) > 0) {
        setIncludePerception(true);
      }

      formik.setValues({
        operationTypeCode: shopping_details.operationTypeCode,
        operationTypeValue: shopping_details.operationTypeValue,
        classificationCode: shopping_details.classificationCode,
        classificationValue: shopping_details.classificationValue,
        sectorCode: shopping_details.sectorCode,
        sectorValue: shopping_details.sectorValue,
        typeCostSpentCode: shopping_details.typeCostSpentCode,
        typeCostSpentValue: shopping_details.typeCostSpentValue,
        classDocumentCode: shopping_details.classDocumentCode,
        classDocumentValue: shopping_details.classDocumentValue,
        tipoDte: shopping_details.typeDte,
        typeSale: shopping_details.typeSale,
        controlNumber: shopping_details.controlNumber,
        declarationDate: shopping_details.declarationDate!,
        fecEmi: shopping_details.fecEmi,
        branchId: shopping_details.branchId ?? 0,
        totalExenta: Number(shopping_details.totalExenta),
      });

      const branch = branch_list.find((branch) => branch.id === shopping_details.branchId);

      setBranchName(branch?.name ?? '');

      // ?Si se incluyen
      if (shopping_details.item) {
        setHasDetails(true);
        setDescription(shopping_details.item.concepOfTheItem);
        setDateItem(shopping_details.item.date);
        setSelectedType(shopping_details.item.typeOfAccountId);

        const itemss = shopping_details.item.itemsDetails.map((item) => ({
          debe: (+item.should).toFixed(2),
          haber: (+item.see).toFixed(2),
          codCuenta: item.accountCatalog?.code ?? '',
          descCuenta: item.accountCatalog?.name ?? '',
          descTran: item.conceptOfTheTransaction,
          no: +item.numberItem,
          itemId: item.id,
        }));

        setItems(itemss);
      } else {
        // ?Si No existen
        setHasDetails(false);
        const handleSearchCuenta = (codCuenta: string) => {
          const fun = account_catalog_pagination.accountCatalogs.find(
            (item) => item.code === codCuenta
          );
          if (fun) {
            return fun;
          } else {
            return null;
          }
        };

        setItems([
          {
            debe: (
              +shopping_details.totalGravada +
              +shopping_details.totalExenta +
              +shopping_details.totalNoSuj
            ).toFixed(2),
            haber: '0',
            codCuenta: '',
            descCuenta: '',
            descTran: '',
            no: 1,
            itemId: 0,
          },
          {
            debe: shopping_details.totalIva,
            haber: '0',
            codCuenta:
              handleSearchCuenta(fiscalDataAndParameter?.ivaLocalShopping ?? '')?.code ?? '',
            descCuenta:
              handleSearchCuenta(fiscalDataAndParameter?.ivaLocalShopping ?? '')?.name ?? '',
            descTran: '',
            no: 2,
            itemId: 0,
          },
          {
            debe: '0',
            haber: shopping_details.montoTotalOperacion,
            codCuenta: handleSearchCuenta('21020101')?.code ?? '',
            descCuenta: handleSearchCuenta('21020101')?.name ?? '',
            descTran: '',
            no: 3,
            itemId: 0,
          },
        ]);
      }
    }
  }, [shopping_details]);

  const $1perception = useMemo(() => {
    if (includePerception) {
      if (Number($afecta) > 0) {
        const result = Number($afecta) * 0.01;
        return result;
      }
      return 0;
    }
    return 0;
  }, [includePerception]);

  return (
    <Layout title="Editar compra">
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800 dark:text-white">
        <div className="w-full h-full p-8 mt-2 custom-scrollbar overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          {shopping_details ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Select
                  label="Nombre comprobante"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Selecciona el tipo de documento"
                  selectedKeys={[formik.values.tipoDte]}
                  classNames={{ label: 'font-semibold' }}
                  isDisabled={isDisabled}
                  onSelectionChange={(key) => {
                    if (key) {
                      const fnd = filteredTipoDoc.find((doc) => doc.codigo === key.currentKey);
                      if (fnd) {
                        // setTipoDte(fnd.codigo);
                        formik.setFieldValue('tipoDte', fnd.codigo);
                      } else {
                        // setTipoDte('');
                        formik.setFieldValue('tipoDte', '');
                      }
                    } else {
                      // setTipoDte('');
                      formik.setFieldValue('tipoDte', '');
                    }
                  }}
                  isInvalid={!!formik.touched.tipoDte && !!formik.errors.tipoDte}
                  errorMessage={formik.errors.tipoDte}
                >
                  {filteredTipoDoc.map((item) => (
                    <SelectItem
                      value={item.codigo}
                      key={item.codigo}
                      isReadOnly={
                        ['03', '05', '06'].includes(item.codigo) &&
                        formik.values.typeSale === 'externa'
                      }
                    >
                      {item.valores}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  label="Sucursal"
                  placeholder="Selecciona la sucursal"
                  labelPlacement="outside"
                  selectedKeys={[`${formik.values.branchId.toString()}`]}
                  onSelectionChange={(key) => {
                    if (key) {
                      const fnd = branch_list.find(
                        (branch) => branch.id === Number(key.currentKey)
                      );
                      if (fnd) {
                        setBranchName(fnd.name);
                        formik.setFieldValue('branchId', fnd.id);
                      } else {
                        setBranchName('');
                        formik.setFieldValue('branchId', 0);
                      }
                    } else {
                      setBranchName('');
                      formik.setFieldValue('branchId', 0);
                    }
                  }}
                  onBlur={formik.handleBlur('branchId')}
                  isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
                  errorMessage={formik.errors.branchId}
                >
                  {branch_list.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  label="Tipo"
                  placeholder="Selecciona el tipo"
                  labelPlacement="outside"
                  selectedKeys={`${['Interna', 'Internacion', 'Importacion'].indexOf(formik.values.typeSale)}`}
                  onSelectionChange={(key) => {
                    const index = parseInt(key?.currentKey || '0', 10); // Default to '0' if key.currentKey is undefined
                    const typeSaleOptions = ['Interna', 'Internacion', 'Importacion'];
                    const selectedTypeSale = typeSaleOptions[index] || 'Interna'; // Default to 'interna' if index is invalid
                    formik.setFieldValue('typeSale', selectedTypeSale);
                  }}
                  onBlur={formik.handleBlur('typeSale')}
                  isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                  errorMessage={formik.errors.typeSale}
                  isDisabled={isDisabled}
                >
                  <SelectItem key={'0'} value="Interna">
                    Interna
                  </SelectItem>
                  <SelectItem key={'1'} value="Internacion">
                    Internación
                  </SelectItem>
                  <SelectItem key={'2'} value="Importacion">
                    Importación
                  </SelectItem>
                </Select>
                <Input
                  classNames={{ label: 'font-semibold' }}
                  placeholder="EJ: 101"
                  variant="bordered"
                  value={formik.values.controlNumber}
                  onChange={formik.handleChange('controlNumber')}
                  onBlur={formik.handleBlur('controlNumber')}
                  label="Numero de control"
                  labelPlacement="outside"
                  isInvalid={!!formik.touched.controlNumber && !!formik.errors.controlNumber}
                  errorMessage={formik.errors.controlNumber}
                  isDisabled={isDisabled}
                />
                <Select
                  onBlur={formik.handleBlur('classDocumentCode')}
                  onSelectionChange={(key) => {
                    if (key) {
                      const value = key.currentKey;
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
                  isDisabled={isDisabled}
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
                      const value = key.currentKey;
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
                  isDisabled={isDisabled}
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
                  isDisabled={isDisabled}
                  onSelectionChange={(key) => {
                    if (key) {
                      const value = key.currentKey;
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
                  isDisabled={isDisabled}
                  onSelectionChange={(key) => {
                    if (key) {
                      const value = key.currentKey;
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
                  isDisabled={isDisabled}
                  onSelectionChange={(key) => {
                    if (key) {
                      const value = key.currentKey;
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
                <Input
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  type="date"
                  label="Fecha del documento"
                  value={formik.values.fecEmi}
                  onChange={formik.handleChange('fecEmi')}
                  onBlur={formik.handleBlur('fecEmi')}
                  labelPlacement="outside"
                  isInvalid={!!formik.touched.fecEmi && !!formik.errors.fecEmi}
                  errorMessage={formik.errors.fecEmi}
                  isDisabled={isDisabled}
                />
                <Input
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  type="date"
                  label="Fecha de declaración"
                  value={formik.values.declarationDate}
                  onChange={formik.handleChange('declarationDate')}
                  onBlur={formik.handleBlur('declarationDate')}
                  labelPlacement="outside"
                  isInvalid={!!formik.touched.declarationDate && !!formik.errors.declarationDate}
                  errorMessage={formik.errors.declarationDate}
                />
                <div className="flex  items-end">
                  <Checkbox
                    defaultChecked={includePerception}
                    isSelected={includePerception}
                    checked={includePerception}
                    onValueChange={(val) => setIncludePerception(val)}
                    size="lg"
                    isDisabled={isDisabled}
                  >
                    ¿Incluye percepción?
                  </Checkbox>
                </div>
              </div>
              <AccountItem
                addItems={addItem}
                handleDeleteItem={(index) => {
                  handleDeleteItem(index);
                }}
                ivaShoppingCod={fiscalDataAndParameter?.ivaLocalShopping ?? ''}
                items={items}
                setItems={setItems}
                index={0}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                openCatalogModal={openCatalogModal}
                onClose={catalogModal.onClose}
                branchName={branchName}
                $debe={$debe}
                $haber={$haber}
                $total={$total}
                description={description}
                date={dateItem}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                setDate={setDateItem}
                setDescription={setDescription}
                isReadOnly={false}
                canAddItem={!isDisabled}
                editAccount={!hasDetails}
              />
              <div>
                <p className="py-4 text-xl font-semibold">Resumen: </p>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <Input
                      label="AFECTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={$afecta}
                      readOnly
                      disabled={isDisabled}
                    />
                  </div>
                  <div>
                    <Input
                      label="EXENTA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={String(formik.values.totalExenta) ?? 0}
                      readOnly
                      disabled={isDisabled}
                    />
                  </div>
                  <div>
                    <Input
                      label="IVA"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      readOnly
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={$totalIva}
                      disabled={isDisabled}
                    />
                  </div>
                  <div>
                    <Input
                      label="PERCEPCIÓN"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{ label: 'font-semibold' }}
                      startContent="$"
                      type="number"
                      readOnly
                      value={$1perception.toFixed(2)}
                      step={0.01}
                      disabled={isDisabled}
                    />
                  </div>
                  <div>
                    <Input
                      label="SUBTOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{ label: 'font-semibold' }}
                      startContent="$"
                      type="number"
                      value={$afecta}
                      step={0.01}
                      disabled={isDisabled}
                    />
                  </div>
                  <div>
                    <Input
                      label="TOTAL"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="bordered"
                      classNames={{
                        label: 'font-semibold',
                        input: 'text-red-600 text-lg font-bold',
                      }}
                      startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                      value={$totalItems}
                      readOnly
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-5 ">
                <div />
                <Button
                  onClick={() => navigate('/shopping')}
                  className="px-20"
                  style={styles.dangerStyles}
                  isLoading={formik.isSubmitting}
                >
                  Regresar
                </Button>
                <Button
                  isLoading={formik.isSubmitting}
                  type="submit"
                  className="px-20"
                  style={styles.thirdStyle}
                >
                  Guardar
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="w-full h-full flex flex-col justify-center items-center">
                <IoWarning size={50} className="text-orange-400" />
                <p className="mt-4 text-lg">No se encontró la venta solicitada</p>
                <div className="flex gap-5 mt-4">
                  <Button
                    onClick={() => navigate('/shopping')}
                    className="font-semibold px-10"
                    style={global_styles().dangerStyles}
                  >
                    Regresar
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="font-semibold px-10"
                    style={global_styles().secondaryStyle}
                  >
                    Recargar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        {editIndex !== null && (
          <Modal
            isOpen={catalogModal.isOpen}
            size="2xl"
            onClose={catalogModal.onClose}
            scrollBehavior="inside"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <CatalogItemsPaginated
                    onClose={onClose}
                    items={items}
                    setItems={setItems}
                    index={editIndex}
                  />
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

export default EditShopping;
