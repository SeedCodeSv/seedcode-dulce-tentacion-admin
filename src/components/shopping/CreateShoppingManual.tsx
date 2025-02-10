import { get_correlative_shopping } from '@/services/shopping.service';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import { Button, Modal, ModalContent, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useGlobalStyles from '../global/global.styles';
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
import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { validateReceptor } from '@/utils/validation';
import { useBranchesStore } from '@/store/branches.store';
import GeneralInfo from './manual/general-info';
import { Items } from '@/pages/contablilidad/types/types';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import ResumeShopping from './manual/resume-shopping';
import CatalogItemsPaginated from './manual/catalog-items-paginated';
import AccountItem from './manual/account-item';

function CreateShoppingManual() {
  const { user } = useAuthStore();
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const { getFiscalDataAndParameter, fiscalDataAndParameter } = useFiscalDataAndParameterStore();
  const [nrc, setNrc] = useState('');
  const [supplierSelected, setSupplierSelected] = useState<Supplier>();
  const [searchNRC, setSearchNRC] = useState('');
  const styles = useGlobalStyles();
  const [correlative, setCorrelative] = useState(0);
  const [includePerception, setIncludePerception] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [description, setDescription] = useState('');
  const [dateItem, setDateItem] = useState(formatDate());
  const [selectedType, setSelectedType] = useState(0);

  const { getBranchesList } = useBranchesStore();
  const [tipoDte, setTipoDte] = useState('03');
  const { getAccountCatalogs, account_catalog_pagination } = useAccountCatalogsStore();

  useEffect(() => {
    const trandId =
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

    getBranchesList();
    getAccountCatalogs('', '');
    getFiscalDataAndParameter(trandId);
  }, []);

  useEffect(() => {
    if (fiscalDataAndParameter) {
      const itemss = [...items];
      if (fiscalDataAndParameter) {
        const findedI = account_catalog_pagination.accountCatalogs.find(
          (acc) => acc.code === (fiscalDataAndParameter.ivaLocalShopping || "110901")
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
  }, [fiscalDataAndParameter,account_catalog_pagination]);

  useEffect(() => {
    getSupplierPagination(1, 15, searchNRC, '', '', 1);
    get_correlative_shopping(Number(user?.correlative?.branchId ?? 0))
      .then(({ data }) => {
        setCorrelative(data.correlative + 1);
      })
      .catch(() => setCorrelative(0));
  }, [searchNRC]);

  useEffect(() => {
    if (nrc !== '') {
      const find = supplier_pagination.suppliers.find((supp) => supp.nrc === nrc);
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
    },
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
    },
    {
      no: 1,
      codCuenta: '',
      descCuenta: '',
      centroCosto: undefined,
      descTran: '',
      debe: '0',
      haber: '0',
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
    });
    setItems(itemss);
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

  const $exenta = useMemo(() => {
    return 0;
  }, []);

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

      try {
        const transId =
          user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

        await validateReceptor(supplierSelected);
        const payload = {
          supplierId: supplierSelected.id ?? 0,
          totalExenta: Number($exenta),
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
              conceptOfTheTransaction: item.descTran.length > 0 ? item.descTran : 'N/A',
            })),
          },
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

  return (
    <>
      <div className="w-full h-full">
        <FormikProvider value={formik}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.submitForm();
            }}
            className="w-full h-full overflow-y-auto p-5"
          >
            <GeneralInfo
              setSupplierSelected={setSupplierSelected}
              setNrc={setNrc}
              setSearchNRC={setSearchNRC}
              supplierSelected={supplierSelected}
              nrc={nrc}
              includePerception={includePerception}
              setIncludePerception={setIncludePerception}
              tipoDte={tipoDte}
              setTipoDte={setTipoDte}
              correlative={correlative}
              setBranchName={setBranchName}
            />
            <AccountItem
              items={items}
              ivaShoppingCod={fiscalDataAndParameter?.ivaLocalShopping ?? 'null'}
              addItems={addItem}
              setItems={setItems}
              handleDeleteItem={handleDeleteItem}
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
              canAddItem={true}
            />
            <ResumeShopping
              afecta={$afecta}
              exenta={$exenta.toFixed(2)}
              totalIva={$totalIva}
              $1perception={$1perception}
              total={$totalItems}
            />

            <div className="w-full flex justify-end mt-4">
              <Button type="submit" className="px-16" style={styles.thirdStyle}>
                Guardar
              </Button>
            </div>
          </form>
        </FormikProvider>
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
    </>
  );
}

export default CreateShoppingManual;
