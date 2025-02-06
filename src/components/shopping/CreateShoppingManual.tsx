import { get_correlative_shopping } from '@/services/shopping.service';
import { CreateShoppingDto } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import { Button, Input } from '@nextui-org/react';
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

function CreateShoppingManual() {
  const { user } = useAuthStore();
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const [nrc, setNrc] = useState('');
  const [supplierSelected, setSupplierSelected] = useState<Supplier>();
  const [searchNRC, setSearchNRC] = useState('');
  const styles = useGlobalStyles();
  const [total, setTotal] = useState('');
  const [afecta, setAfecta] = useState('');
  const [totalIva, setTotalIva] = useState('');
  const [correlative, setCorrelative] = useState(0);
  const [afectaModified, setAfectaModified] = useState(false);
  const [totalModified, setTotalModified] = useState(false);
  const [includePerception, setIncludePerception] = useState(false);

  const { getBranchesList } = useBranchesStore();
  const [tipoDte, setTipoDte] = useState('03');

  useEffect(() => {
    getBranchesList();
  }, []);

  const handleChangeAfecta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalAfecta = Number(sanitizedValue);

    setAfecta(sanitizedValue);
    setAfectaModified(true);
    setTotalModified(false);
    const ivaCalculado = totalAfecta * 0.13;
    setTotalIva(ivaCalculado.toFixed(2));
    if (tipoDte !== '14' && includePerception) {
      const percepcion = totalAfecta * 0.01;
      setTotal((totalAfecta + Number(exenta) + ivaCalculado + percepcion).toFixed(2));
      return;
    }
    setTotal((totalAfecta + Number(exenta) + ivaCalculado).toFixed(2));
  };

  const handleChangeExenta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalExenta = Number(sanitizedValue);

    setExenta(sanitizedValue);
    if (includePerception) {
      const result = +afecta * 0.01;
      setTotal(() =>
        (+afecta + totalExenta + result + (tipoDte === '03' ? Number(totalIva) : 0)).toFixed(2)
      );
    }
    setTotal(() => (+afecta + totalExenta + (tipoDte === '03' ? Number(totalIva) : 0)).toFixed(2));
  };

  const handleChangeTotal = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalValue = Number(sanitizedValue);

    setTotalModified(true);
    setAfectaModified(false);

    if (tipoDte) {
      const ivaIncluido = totalValue - totalValue / 1.13;
      const afectaSinIva = totalValue - ivaIncluido;
      setAfecta(afectaSinIva.toFixed(2));
      setTotalIva(ivaIncluido.toFixed(2));
    } else {
      const ivaCalculado = totalValue * 0.13;
      const afectaConIva = totalValue - ivaCalculado;

      if (includePerception) {
        const percepcion = afectaConIva * 0.01;
        setTotal((totalValue + percepcion).toFixed(2));
        return;
      }

      setAfecta(afectaConIva.toFixed(2));
      setTotalIva(ivaCalculado.toFixed(2));
    }

    setTotal(sanitizedValue);
  };

  useEffect(() => {
    if (afectaModified && total !== '') {
      handleChangeAfecta(afecta);
    } else if (totalModified && afecta !== '') {
      handleChangeTotal(total);
    }
  }, [tipoDte, includePerception]);

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
    if (includePerception) {
      if (Number(afecta) > 0) {
        const result = Number(afecta) * 0.01;
        return result;
      }
      return 0;
    }
    return 0;
  }, [afecta, includePerception]);

  const [exenta, setExenta] = useState('');
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
        await validateReceptor(supplierSelected);
        const payload: CreateShoppingDto = {
          supplierId: supplierSelected.id ?? 0,
          totalExenta: Number(exenta),
          totalGravada: Number(afecta),
          porcentajeDescuento: 0,
          totalDescu: 0,
          totalIva: Number(totalIva),
          subTotal: Number(afecta),
          montoTotalOperacion: Number(total),
          totalPagar: Number(total),
          totalLetras: convertCurrencyFormat(total),
          ivaPerci1: $1perception,
          transmitterId:
            user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0,
          ...values,
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
          />
          <p className="py-5 text-xl font-semibold">Resumen</p>
          <div className="rounded border shadow dark:border-gray-700 p-5 md:p-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Input
                  label="AFECTA"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                  startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                  value={afecta}
                  onChange={({ currentTarget }) => handleChangeAfecta(currentTarget.value)}
                />
              </div>
              <div>
                <Input
                  label="EXENTA"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                  startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                  value={exenta}
                  onChange={({ currentTarget }) => handleChangeExenta(currentTarget.value)}
                />
              </div>
              <div>
                <Input
                  label="IVA"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  readOnly
                  classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                  startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                  value={totalIva}
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
                  value={afecta}
                  step={0.01}
                />
              </div>
              <div>
                <Input
                  label="TOTAL"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                  startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                  value={total}
                  readOnly
                  onChange={({ currentTarget }) => handleChangeTotal(currentTarget.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-4">
            <Button type="submit" className="px-16" style={styles.thirdStyle}>
              Guardar
            </Button>
          </div>
        </form>
        </FormikProvider>
      </div>
    </>
  );
}

export default CreateShoppingManual;
