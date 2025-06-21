import {
  Checkbox,
  Input,
  Modal,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import * as yup from 'yup';

import CatalogItemsPaginated from './manual/catalog-items-paginated';
import EditResumeShopping from './edit-resumen-shopping';
import AccountItemEdit from './account-item-edit';

import { useAuthStore } from '@/store/auth.store';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import { convertCurrencyFormat } from '@/utils/money';
import { formatDate } from '@/utils/dates';
import { API_URL } from '@/utils/constants';
import { useShoppingStore } from '@/store/shopping.store';
import { useBranchesStore } from '@/store/branches.store';
import Layout from '@/layout/Layout';
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
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function EditShopping() {
  const { id, controlNumber } = useParams<{ id: string; controlNumber: string }>();
  const { shopping_details, getShoppingDetails, loading_shopping } = useShoppingStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const [includePerception, setIncludePerception] = useState(false);
  const { getAccountCatalogs, account_catalog_pagination } = useAccountCatalogsStore();

  const isDisabled = controlNumber?.toUpperCase().startsWith('DTE');
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();

  const { user } = useAuthStore();

  useEffect(() => {
    getShoppingDetails(Number(id));
    getBranchesList();
    const transmitterId =
      user?.pointOfSale?.branch.transmitterId ?? 0;

    getAccountCatalogs(transmitterId, '', '');

    getFiscalDataAndParameter(transmitterId);
  }, []);

  const [$exenta, setExenta] = useState(shopping_details?.totalExenta || '0');

  useEffect(() => {
    setExenta(shopping_details?.totalExenta || '0');
  }, [shopping_details?.totalExenta]);

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['03', '06', '05'].includes(item.codigo));
  }, []);

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
      isExenta: false,
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
      isExenta: false,
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
      isExenta: false,
    },
  ]);

  const addItem = (newItem?: Items, index?: number) => {
    const itemss = [...items];

    if (newItem) {
      if (index !== undefined) {
        // Actualizar la fila en su posición original
        itemss[index] = newItem;
      } else {
        if (newItem.isExenta) {
          // Verificar si ya existe una fila EXENTA
          const existingExentaIndex = itemss.findIndex((item) => item.isExenta);

          if (existingExentaIndex !== -1) {
            // Si ya existe una fila EXENTA, actualizarla
            itemss[existingExentaIndex] = newItem;
          } else {
            // Si no existe una fila EXENTA, agregarla como el primer ítem
            newItem.no = 1;
            itemss.unshift(newItem);

            // Reordenar los números de los demás ítems
            itemss.forEach((item, idx) => {
              if (idx > 0) {
                item.no = idx + 1;
              }
            });
          }
          setExenta(newItem.debe);
        } else {
          // Agregar el ítem no exento al inicio
          newItem.no = 1;
          newItem.debe = '0';
          newItem.haber = '0';
          itemss.unshift(newItem);
          newItem.codCuenta = '';
          newItem.descCuenta = '';
          newItem.centroCosto = undefined;
          newItem.descTran = '';

          // Reordenar los números de los demás ítems
          itemss.forEach((item, idx) => {
            if (idx > 0) {
              item.no = idx + 1;
            }
          });
        }
      }
    } else {
      itemss.unshift({
        no: 1,
        codCuenta: '',
        descCuenta: '',
        centroCosto: undefined,
        descTran: '',
        debe: '0',
        haber: '0',
        itemId: 0,
        isExenta: false,
      });

      // Reordenar los números de los demás ítems
      itemss.forEach((item, idx) => {
        if (idx > 0) {
          item.no = idx + 1;
        }
      });
    }

    setItems([...itemss]);
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const catalogModal = useDisclosure();

  const $debe = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.debe), 0);
  }, [items]);

  const $haber = useMemo(() => {
    return items.reduce((acc, item) => acc + Number(item.haber), 0 + Number($exenta || 0));
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
      totalExenta: $exenta,
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
      user?.pointOfSale?.branch.transmitter.id ?? 0;
      const payload = {
        supplierId: 0,
        branchId: values.branchId,
        numeroControl: values.controlNumber || '',
        tipoDte: values.tipoDte,
        totalExenta: $exenta,
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

  const sortedItems = items.sort((a, b) => a.no - b.no);
  const $afecta = useMemo(() => {
    const afecta = sortedItems
      .slice(0, items.length - 2)
      .reduce((acc, item) => {
        // Verificar si item.isExenta está en false
        if (item.debe !== $exenta || !item.isExenta) {
          return acc + Number(item.debe) + Number(item.haber);
        }

        return acc;
      }, 0)
      .toFixed(2);

    return afecta;
  }, [items]);

  const $totalIva = useMemo(() => {
    const iva =
      items.slice(0, items.length - 2).reduce((acc, item) => {
        // No aplicar IVA si el ítem es EXENTO o si su valor de "debe" es igual a $exenta
        if (item?.isExenta || item.debe === $exenta) {
          return acc;
        }

        return acc + Number(item.debe) + Number(item.haber);
      }, 0) * 0.13;

    return iva.toFixed(2);
  }, [items, $exenta]);

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
        totalExenta: String($exenta),
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
          <>
            {loading_shopping ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="loader" />
                <p className="mt-3 text-xl font-semibold">Cargando...</p>
              </div>
            ) : shopping_details ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Select
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.tipoDte}
                    isDisabled={isDisabled}
                    isInvalid={!!formik.touched.tipoDte && !!formik.errors.tipoDte}
                    label="Nombre comprobante"
                    labelPlacement="outside"
                    placeholder="Selecciona el tipo de documento"
                    selectedKeys={[formik.values.tipoDte]}
                    variant="bordered"
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
                  >
                    {filteredTipoDoc.map((item) => (
                      <SelectItem
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
                    errorMessage={formik.errors.branchId}
                    isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
                    label="Sucursal"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal"
                    selectedKeys={[`${formik.values.branchId.toString()}`]}
                    variant="bordered"
                    onBlur={formik.handleBlur('branchId')}
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
                  >
                    {branch_list.map((branch) => (
                      <SelectItem key={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.typeSale}
                    isDisabled={isDisabled}
                    isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                    label="Tipo"
                    labelPlacement="outside"
                    placeholder="Selecciona el tipo"
                    selectedKeys={`${['Interna', 'Internacion', 'Importacion'].indexOf(formik.values.typeSale)}`}
                    variant="bordered"
                    onBlur={formik.handleBlur('typeSale')}
                    onSelectionChange={(key) => {
                      const index = parseInt(key?.currentKey || '0', 10); // Default to '0' if key.currentKey is undefined
                      const typeSaleOptions = ['Interna', 'Internacion', 'Importacion'];
                      const selectedTypeSale = typeSaleOptions[index] || 'Interna'; // Default to 'interna' if index is invalid

                      formik.setFieldValue('typeSale', selectedTypeSale);
                    }}
                  >
                    <SelectItem key={'0'}>Interna</SelectItem>
                    <SelectItem key={'1'}>Internación</SelectItem>
                    <SelectItem key={'2'}>Importación</SelectItem>
                  </Select>
                  <Input
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.controlNumber}
                    isDisabled={isDisabled}
                    isInvalid={!!formik.touched.controlNumber && !!formik.errors.controlNumber}
                    label="Numero de control"
                    labelPlacement="outside"
                    placeholder="EJ: 101"
                    value={formik.values.controlNumber}
                    variant="bordered"
                    onBlur={formik.handleBlur('controlNumber')}
                    onChange={formik.handleChange('controlNumber')}
                  />
                  <Select
                    className="w-full"
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.classDocumentCode}
                    isDisabled={isDisabled}
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
                  >
                    {ClassDocuments.map((item) => (
                      <SelectItem key={item.code}>{item.value}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.operationTypeCode}
                    isDisabled={isDisabled}
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
                  >
                    {OperationTypes.map((item) => (
                      <SelectItem key={item.code}>{item.value}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.classificationCode}
                    isDisabled={isDisabled}
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
                  >
                    {Classifications.map((item) => (
                      <SelectItem key={item.code}>{item.value}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.sectorCode}
                    isDisabled={isDisabled}
                    isInvalid={!!formik.touched.sectorCode && !!formik.errors.sectorCode}
                    label="Sector"
                    labelPlacement="outside"
                    placeholder="Selecciona una opción"
                    selectedKeys={formik.values.sectorCode}
                    variant="bordered"
                    onBlur={formik.handleBlur('sectorCode')}
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
                  >
                    {Sectors.map((item) => (
                      <SelectItem key={item.code}>{item.value}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.typeCostSpentCode}
                    isDisabled={isDisabled}
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
                  >
                    {TypeCostSpents.map((item) => (
                      <SelectItem key={item.code}>{item.value}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.fecEmi}
                    isDisabled={isDisabled}
                    isInvalid={!!formik.touched.fecEmi && !!formik.errors.fecEmi}
                    label="Fecha del documento"
                    labelPlacement="outside"
                    type="date"
                    value={formik.values.fecEmi}
                    variant="bordered"
                    onBlur={formik.handleBlur('fecEmi')}
                    onChange={formik.handleChange('fecEmi')}
                  />
                  <Input
                    classNames={{ label: 'font-semibold' }}
                    errorMessage={formik.errors.declarationDate}
                    isInvalid={!!formik.touched.declarationDate && !!formik.errors.declarationDate}
                    label="Fecha de declaración"
                    labelPlacement="outside"
                    type="date"
                    value={formik.values.declarationDate}
                    variant="bordered"
                    onBlur={formik.handleBlur('declarationDate')}
                    onChange={formik.handleChange('declarationDate')}
                  />
                  <div className="flex  items-end">
                    <Checkbox
                      checked={includePerception}
                      defaultChecked={includePerception}
                      isDisabled={isDisabled}
                      isSelected={includePerception}
                      size="lg"
                      onValueChange={(val) => setIncludePerception(val)}
                    >
                      ¿Incluye percepción?
                    </Checkbox>
                  </div>
                </div>
                <AccountItemEdit
                  $debe={$debe}
                  $haber={$haber}
                  $total={$total}
                  addItems={addItem}
                  branchName={branchName}
                  canAddItem={!isDisabled}
                  date={dateItem}
                  description={description}
                  editAccount={!hasDetails}
                  exenta={$exenta}
                  handleDeleteItem={handleDeleteItem}
                  index={0}
                  isReadOnly={false}
                  items={items}
                  ivaShoppingCod={fiscalDataAndParameter?.ivaLocalShopping ?? ''}
                  openCatalogModal={openCatalogModal}
                  selectedIndex={selectedIndex}
                  selectedType={selectedType}
                  setDate={setDateItem}
                  setDescription={setDescription}
                  setExenta={setExenta}
                  setItems={setItems}
                  setSelectedIndex={setSelectedIndex}
                  setSelectedType={setSelectedType}
                  onClose={catalogModal.onClose}
                />
                <div>
                  <EditResumeShopping
                    $1perception={$1perception}
                    addItems={addItem}
                    afecta={$afecta}
                    exenta={$exenta}
                    items={items}
                    setExenta={setExenta}
                    total={$totalItems}
                    totalIva={$totalIva}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-5 ">
                  <div />
                  <ButtonUi
                    className="px-20"
                    isLoading={formik.isSubmitting}
                    theme={Colors.Default}
                    onPress={() => navigate('/shopping')}
                  >
                    Regresar
                  </ButtonUi>
                  <ButtonUi
                    className="px-20"
                    isLoading={formik.isSubmitting}
                    theme={Colors.Primary}
                    type="submit"
                  >
                    Guardar
                  </ButtonUi>
                </div>
              </form>
            ) : (
              <>
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <IoWarning className="text-orange-400" size={50} />
                  <p className="mt-4 text-lg">No se encontró la venta solicitada</p>
                  <div className="flex gap-5 mt-4">
                    <ButtonUi
                      className="font-semibold px-10"
                      theme={Colors.Default}
                      onPress={() => navigate('/shopping')}
                    >
                      Regresar
                    </ButtonUi>
                    <ButtonUi
                      className="font-semibold px-10"
                      theme={Colors.Primary}
                      onPress={() => window.location.reload()}
                    >
                      Recargar
                    </ButtonUi>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
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
      </div>
    </Layout>
  );
}

export default EditShopping;
