import { Modal, ModalContent, useDisclosure } from '@heroui/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';

import GeneralInfo from './manual/general-info';
import ResumeShopping from './manual/resume-shopping';
import CatalogItemsPaginated from './manual/catalog-items-paginated';
import AccountItem from './manual/account-item';
import AddProductsShopping from './manual/AddProductsShopping';

import { get_correlative_shopping } from '@/services/shopping.service';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import { useAuthStore } from '@/store/auth.store';
import { Supplier } from '@/types/supplier.types';
import { useSupplierStore } from '@/store/supplier.store';
import { convertCurrencyFormat } from '@/utils/money';
import {
  ClassificationCode,
  ClassificationValue,
  SectorCode,
  SectorValue,
  OperationTypeCode,
  OperationTypeValue,
  TypeCostSpentCode,
  TypeCostSpentValue,
  ClassDocumentCode,
  ClassDocumentValue,
} from '@/enums/shopping.enum';
import { validateReceptor } from '@/utils/validation';
import { useBranchesStore } from '@/store/branches.store';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { CuerpoDocumento } from '@/shopping-branch-product/types/notes_of_remision.types';

function CreateShoppingManual() {
  const { user } = useAuthStore();
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();
  const [nrc, setNrc] = useState('');
  const [supplierSelected, setSupplierSelected] = useState<Supplier>();
  const [searchNRC, setSearchNRC] = useState('');
  const [correlative, setCorrelative] = useState(0);
  const [includePerception, setIncludePerception] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [description, setDescription] = useState('');
  const [dateItem, setDateItem] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);
  const [productsDetails, setProductsDetails] = useState<CuerpoDocumento[]>([])
  const [errorP, setErrorP] = useState(false)

  const { getBranchesList } = useBranchesStore();
  const [tipoDte, setTipoDte] = useState('03');
  const { getAccountCatalogs, account_catalog_pagination } = useAccountCatalogsStore();

  useEffect(() => {
    const trandId = user?.pointOfSale?.branch.transmitterId ?? 0;

    getBranchesList();
    getAccountCatalogs(trandId ?? 0, '', '');
    getFiscalDataAndParameter(trandId);
  }, []);

  useEffect(() => {
    if (fiscalDataAndParameter) {
      const itemss = [...items];

      if (fiscalDataAndParameter) {
        const findedI = account_catalog_pagination.accountCatalogs.find(
          (acc) => acc.code === (fiscalDataAndParameter.ivaLocalShopping || '110901')
        );
        const findedII = account_catalog_pagination.accountCatalogs.find(
          (acc) => acc.code === '21020101'
        );

        if (findedI) {
          itemss[1].codCuenta = findedI.code;
          itemss[1].descCuenta = findedI.name;
        }
        if (findedII) {
          itemss[2].codCuenta = findedII.code;
          itemss[2].descCuenta = findedII.name;
        }
      }
      setItems([...itemss]);
    }
  }, [fiscalDataAndParameter, account_catalog_pagination]);

  useEffect(() => {
    getSupplierPagination(1, 15, searchNRC, '', '', '', 1);
  }, [searchNRC]);


  useEffect(() => {
    if (nrc !== '') {
      const find = supplier_pagination?.suppliers.find((supp) => supp.nrc === nrc);

      if (find) setSupplierSelected(find);
      else {
        setSupplierSelected(undefined);
      }
    }
  }, [nrc]);

  const navigate = useNavigate();

  const $1perception = useMemo(() => {
    return 0;
  }, [includePerception]);

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

  const [$exenta, setExenta] = useState('0');
  const addItem = (newItem?: Items, index?: number) => {
    const itemss = [...items];

    if (newItem) {
      if (index !== undefined) {
        itemss[index] = newItem;
      } else {
        newItem.no = items.length + 1;
        if (newItem.isExenta) {
          setExenta(newItem.debe);
        } else {
          newItem.codCuenta = '';
          newItem.descCuenta = '';
          newItem.centroCosto = undefined;
          newItem.debe = '0';
          newItem.haber = '0';
          newItem.descTran = '';
          newItem.itemId = 0;
          newItem.isExenta = false;
        }
        itemss.unshift(newItem);
      }
      setItems([...itemss]);
    } else {
      itemss.unshift({
        no: items.length + 1,
        codCuenta: '',
        descCuenta: '',
        centroCosto: undefined,
        descTran: '',
        debe: '0',
        haber: '0',
        itemId: 0,
        isExenta: false,
      });
      setItems([...itemss]);
    }
  };

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
      .reduce((acc, item) => {
        // Verificar si item.isExenta está en false
        if (!item.isExenta) {
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
        // Verificar si item.isExenta está en false
        if (!item.isExenta) {
          return acc + Number(item.debe) + Number(item.haber);
        }

        return acc;
      }, 0) * 0.13;

    return iva.toFixed(2);
  }, [items]);

  const $totalItems = useMemo(() => {
    return (
      items
        .slice(0, items.length - 2)
        .reduce((acc, item) => acc + Number(item.debe) + Number(item.haber), 0) + +$totalIva
    ).toFixed(2);
  }, [items]);

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
      tipoDte: '03',
      typeSale: 'interna',
      declarationDate: formatDate(),
      fecEmi: formatDate(),
      branchId: 0,
      numeroControl: '',
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
      declarationDate: yup.string().required('**La fecha es requerida**'),
      fecEmi: yup.string().required('**La fecha es requerida**'),
      branchId: yup
        .number()
        .required('**Selecciona la sucursal**')
        .min(1, '**Selecciona la sucursal**'),
      numeroControl: yup.string().required('**Ingresa el numero de control**'),
    }),
    async onSubmit(values, formikHelpers) {
      if (!supplierSelected) {
        toast.warning('Debes seleccionar el proveedor');

        return;
      }

      if (items.some((item) => !item.codCuenta || item.codCuenta === '')) {
        toast.error('Revisa los datos de la partida hay lineas sin código de cuenta');
        formikHelpers.setSubmitting(false);
        setErrorP(true)

        return;
      }


      if (!selectedType) {
        toast.warning('Debes seeccionar el tipo de partida');
        setErrorP(true)

        return;
      }

      if (
        productsDetails.length > 0 &&
        productsDetails.some(
          (item) =>
            !item.codigo || !item.uniMedida || item.cantidad === 0 || item.precioUni === 0
        )
      ) {
        toast.warning('Completa todos los campos de los productos o desactiva la opción de ingresar productos.');

        return;
      }

      try {
        const transId = user?.pointOfSale?.branch.transmitterId ?? 0;

        await validateReceptor(supplierSelected);
        const payload = {
          supplierId: supplierSelected.id ?? 0,
          totalExenta: Number($exenta ?? 0),
          totalGravada: Number($afecta),
          porcentajeDescuento: 0,
          totalDescu: 0,
          totalIva: Number($totalIva),
          subTotal: Number($afecta),
          montoTotalOperacion: Number($total),
          totalPagar: Number($total),
          totalLetras: convertCurrencyFormat($total.toFixed(2)),
          ivaPerci1: $1perception,
          transmitterId: transId,
          ...values,
          itemCatalog: {
            transmitterId: transId,
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
          },
          ...(productsDetails.length > 0 && { productsDetails })
        };

        axios
          .post(API_URL + '/shoppings/create', payload)
          .then(() => {
            toast.success('Compra guardada con éxito');
            formikHelpers.setSubmitting(false);
            navigate('/shopping');
          })
          .catch(() => {
            toast.error('Error al guardar la compra');
            formikHelpers.setSubmitting(false);
          });
      } catch (error) {
        formikHelpers.setSubmitting(false);
        if (error instanceof Error) {
          toast.error('Proveedor no valido', { description: error.message });
        } else {
          toast.error('Error al guardar la compra');
        }
      }
    },
  });

  useEffect(() => {
    get_correlative_shopping(Number(formik.values.branchId ?? 0))
      .then(({ data }) => {
        setCorrelative(data.correlative + 1);
      })
      .catch(() => setCorrelative(0));
  }, [formik.values.branchId]);

  return (
    <>
      <div className="w-full h-full">
        <FormikProvider value={formik}>
          <form
            className="w-full h-full overflow-y-auto p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!formik.isSubmitting) {
                formik.submitForm();
              }
            }}
          >
            <GeneralInfo
              correlative={correlative}
              includePerception={includePerception}
              nrc={nrc}
              setBranchName={setBranchName}
              setIncludePerception={setIncludePerception}
              setNrc={setNrc}
              setSearchNRC={setSearchNRC}
              setSupplierSelected={setSupplierSelected}
              setTipoDte={setTipoDte}
              supplierSelected={supplierSelected}
              tipoDte={tipoDte}
            />
            <AccountItem
              editAccount
              $debe={$debe}
              $haber={$haber}
              $total={$total}
              addItems={addItem}
              branchName={branchName}
              canAddItem={true}
              date={dateItem}
              description={description}
              errorP={errorP}
              handleDeleteItem={handleDeleteItem}
              index={0}
              isReadOnly={false}
              items={items}
              ivaShoppingCod={fiscalDataAndParameter?.ivaLocalShopping ?? 'null'}
              openCatalogModal={openCatalogModal}
              selectedIndex={selectedIndex}
              selectedType={selectedType}
              setDate={setDateItem}
              setDescription={setDescription}
              setErrorP={setErrorP}
              setExenta={setExenta}
              setItems={setItems}
              setSelectedIndex={setSelectedIndex}
              setSelectedType={setSelectedType}
              onClose={catalogModal.onClose}
            />
            <ResumeShopping
              $1perception={$1perception}
              addItems={addItem}
              afecta={$afecta}
              exenta={$exenta}
              items={items}
              setExenta={setExenta}
              total={$totalItems}
              totalIva={$totalIva}
            />
            <AddProductsShopping setDetails={(products) => setProductsDetails(products)} />
            <div className="w-full flex justify-end mt-4">
              <ButtonUi
                className="px-16"
                isDisabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
                theme={Colors.Primary}
                type="submit"
              >
                {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
              </ButtonUi>
            </div>
          </form>
        </FormikProvider>
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
    </>
  );
}

export default CreateShoppingManual;
