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
import { CreateShoppingDto } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import { convertCurrencyFormat } from '@/utils/money';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
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

function EditShopping() {
  const { id, controlNumber } = useParams<{ id: string; controlNumber: string }>();
  const { shopping_details, getShoppingDetails } = useShoppingStore();
  const [tipoDte, setTipoDte] = useState('');
  const styles = useGlobalStyles();
  const { branch_list, getBranchesList } = useBranchesStore();
  const [includePerception, setIncludePerception] = useState(false);

  const isDisabled = controlNumber?.toUpperCase().startsWith('DTE');

  useEffect(() => {
    getShoppingDetails(Number(id));
    getBranchesList();
  }, []);

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['03', '06', '05'].includes(item.codigo));
  }, []);

  const { user } = useAuthStore();

  const [total, setTotal] = useState('');
  const [afecta, setAfecta] = useState('');
  const [exenta, setExenta] = useState('');
  const [totalIva, setTotalIva] = useState('');
  const [afectaModified, setAfectaModified] = useState(false);
  const [totalModified, setTotalModified] = useState(false);
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
      branchId: yup.string().required('**Selecciona la sucursal**'),
    }),
    onSubmit(values, formikHelpers) {
      // const payload: CreateShoppingDto = {
      //   transmitterId: 0,
      //   supplierId: 0,
      //   totalExenta: Number(exenta),
      //   totalGravada: Number(afecta),
      //   porcentajeDescuento: 0,
      //   totalDescu: 0,
      //   totalIva: Number(totalIva),
      //   subTotal: Number(afecta),
      //   montoTotalOperacion: Number(total),
      //   totalPagar: Number(total),
      //   totalLetras: convertCurrencyFormat(total),
      //   correlative: 9,
      //   ivaPerci1: $1perception,
      //   ...values,
      // };
      const payload: CreateShoppingDto = {
        supplierId: 0,
        branchId: values.branchId,
        numeroControl: values.controlNumber || '', // Ensure it's a string
        tipoDte: values.tipoDte,
        totalExenta: Number(exenta) || 0,
        totalGravada: Number(afecta) || 0,
        porcentajeDescuento: 0,
        totalDescu: 0,
        totalIva: Number(totalIva) || 0,
        subTotal: Number(afecta) || 0,
        montoTotalOperacion: Number(total) || 0,
        totalPagar: Number(total) || 0,
        totalLetras: convertCurrencyFormat(total),
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
        transmitterId: user?.correlative?.branch.transmitter.id ?? user?.pointOfSale?.branch.transmitter.id ?? 0,
        classDocumentValue: values.classDocumentValue,
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
  }, [tipoDte]);

  useEffect(() => {
    handleChangeAfecta(afecta);
  }, [includePerception]);

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
      });

      setTotal(shopping_details.montoTotalOperacion);
      setAfecta(shopping_details.totalGravada);
      setExenta(shopping_details.totalExenta);
      setTotalIva(shopping_details.totalIva);
    }
  }, [shopping_details]);

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
                        setTipoDte(fnd.codigo);
                        formik.setFieldValue('tipoDte', fnd.codigo);
                      } else {
                        setTipoDte('');
                        formik.setFieldValue('tipoDte', '');
                      }
                    } else {
                      setTipoDte('');
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
                  onSelectionChange={(key) =>
                    key
                      ? formik.setFieldValue('branchId', key.currentKey)
                      : formik.setFieldValue('branchId', '')
                  }
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
                {/* <Select
                  classNames={{ label: 'font-semibold' }}
                  variant="bordered"
                  label="Tipo"
                  placeholder="Selecciona el tipo"
                  labelPlacement="outside"
                  selectedKeys={`${formik.values.typeSale === 'interna' ? '0' : '1'}`}
                  onSelectionChange={(key) =>
                    key
                      ? formik.setFieldValue(
                        'typeSale',
                        key.currentKey === '0' ? 'interna' : 'externa'
                      )
                      : formik.setFieldValue('typeSale', '')
                  }
                  onBlur={formik.handleBlur('typeSale')}
                  isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                  errorMessage={formik.errors.typeSale}
                >
                  <SelectItem key={'0'} value="interna">
                    Interna
                  </SelectItem>
                  <SelectItem key={'1'} value="externa">
                    Externa
                  </SelectItem>
                </Select> */}
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
                      value={afecta}
                      onChange={({ currentTarget }) => handleChangeAfecta(currentTarget.value)}
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
                      value={exenta}
                      onChange={({ currentTarget }) => handleChangeExenta(currentTarget.value)}
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
                      value={totalIva}
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
                      value={afecta}
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
                      value={total}
                      readOnly
                      onChange={({ currentTarget }) => handleChangeTotal(currentTarget.value)}
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
      </div>
    </Layout>
  );
}

export default EditShopping;
