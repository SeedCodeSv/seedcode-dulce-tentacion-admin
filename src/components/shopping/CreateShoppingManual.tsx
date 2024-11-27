import { get_correlative_shopping } from '@/services/shopping.service';
import { CreateShoppingDto } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import useGlobalStyles from '../global/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { Supplier } from '@/types/supplier.types';
import { useSupplierStore } from '@/store/supplier.store';
import { convertCurrencyFormat } from '@/utils/money';
import {
  ClassificationCode,
  Classifications,
  ClassificationValue,
  SectorCode,
  SectorValue,
  OperationTypeCode,
  OperationTypes,
  OperationTypeValue,
  Sectors,
  TypeCostSpentCode,
  TypeCostSpents,
  TypeCostSpentValue,
  ClassDocumentCode,
  ClassDocumentValue,
  ClassDocuments,
} from '@/enums/shopping.enum';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { validateReceptor } from '@/utils/validation';

function CreateShoppingManual() {
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const [nrc, setNrc] = useState('');
  const [supplierSelected, setSupplierSelected] = useState<Supplier>();
  const [searchNRC, setSearchNRC] = useState('');
  const [currentDate, setCurrentDate] = useState(formatDate());
  const { user } = useAuthStore();
  const styles = useGlobalStyles();
  const [total, setTotal] = useState('');
  const [afecta, setAfecta] = useState('');
  const [exenta, setExenta] = useState('');
  const [totalIva, setTotalIva] = useState('');
  const [correlative, setCorrelative] = useState(0);
  const [numeroControl, setNumeroControl] = useState('');

  const [afectaModified, setAfectaModified] = useState(false);
  const [totalModified, setTotalModified] = useState(false);

  useEffect(() => {
    getSupplierPagination(1, 15, searchNRC, '', '', 1);
    get_correlative_shopping(
      Number(user?.correlative?.branch.id ?? user?.pointOfSale?.branch.id ?? 0)
    )
      .then(({ data }) => {
        setCorrelative(data.correlative + 1);
      })
      .catch(() => setCorrelative(0));
  }, []);

  useEffect(() => {
    if (nrc !== '') {
      const find = supplier_pagination.suppliers.find((supp) => supp.nrc === nrc);
      if (find) setSupplierSelected(find);
      else {
        setSupplierSelected(undefined);
      }
    }
  }, [nrc]);

  const services = new SeedcodeCatalogosMhService();
  const [tipoDte, setTipoDte] = useState('');
  const [tipoDocSelected, setTipoDocSelected] = useState<{ codigo: string; valores: string }>();

  const tiposDoc = services.get002TipoDeDocumento();

  const handleChangeAfecta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalAfecta = Number(sanitizedValue);

    setAfecta(sanitizedValue);
    setAfectaModified(true);
    setTotalModified(false);

    if (tipoDte === '01') {
      const ivaIncluido = totalAfecta - totalAfecta / 1.13;
      setTotalIva(ivaIncluido.toFixed(2));
      setTotal((totalAfecta + Number(exenta)).toFixed(2));
    } else {
      const ivaCalculado = totalAfecta * 0.13;
      setTotalIva(ivaCalculado.toFixed(2));
      setTotal((totalAfecta + Number(exenta) + ivaCalculado).toFixed(2));
    }
  };

  const handleChangeExenta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalExenta = Number(sanitizedValue);

    setExenta(sanitizedValue);
    setTotal(() => (+afecta + totalExenta + (tipoDte === '03' ? Number(totalIva) : 0)).toFixed(2));
  };

  const handleChangeTotal = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const totalValue = Number(sanitizedValue);

    setTotal(sanitizedValue);
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
      setAfecta(afectaConIva.toFixed(2));
      setTotalIva(ivaCalculado.toFixed(2));
    }
  };

  useEffect(() => {
    if (afectaModified && total !== '') {
      handleChangeAfecta(afecta);
    } else if (totalModified && afecta !== '') {
      handleChangeTotal(total);
    }
  }, [tipoDte]);

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['01', '03', '06', '05'].includes(item.codigo));
  }, []);

  useEffect(() => {
    if (tipoDte !== '') {
      const fnd = filteredTipoDoc.find((doc) => doc.codigo === tipoDte);
      if (fnd) {
        setTipoDocSelected({ codigo: fnd.codigo, valores: fnd.valores });
      } else setTipoDocSelected(undefined);
    }
  }, [tipoDte]);

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
    }),
    async onSubmit(values, formikHelpers) {
      if (!supplierSelected) {
        toast.warning('Debes seleccionar el proveedor');
        return;
      }

      console.log(supplierSelected);

      try {
        await validateReceptor(supplierSelected);
        const payload: CreateShoppingDto = {
          branchId: user?.correlative?.branch.id ?? user?.pointOfSale?.branch.id ?? 0,
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
          fecEmi: currentDate,
          correlative: correlative,
          ...values,
        };

        axios
          .post(API_URL + '/shoppings/create', payload)
          .then(() => {
            toast.success('Compra guardada con éxito');
            navigate('/shopping');
          })
          .catch(() => {
            toast.error('Error al guardar la compra');
          });
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Proveedor no valido', { description: error.message });
        } else {
          toast.error('Error al guardar la compra');
        }
      }
    },
  });

  const clearAllDataManual = () => {
    setNrc(''); // Limpiar los datos manuales
    setSupplierSelected(undefined); // Limpiar proveedor seleccionado
    setNumeroControl(''); // Limpiar número de control
    setAfecta('');
    setTotal('');
    setTotalIva('');
    setTipoDte(''); // Limpiar el campo de "Tipo"
    setTipoDocSelected(undefined); // Limpiar el campo de "Nombre comprobante"
  };

  useEffect(() => {
    if (formik.values.typeSale) {
      formik.setFieldValue('tipoDte', '01');
      setTipoDocSelected(filteredTipoDoc[0]);
      setTipoDte('01');
    }
  }, [formik.values.typeSale]);

  return (
    <>
      <div className="w-full relative  top-5 flex justify-end right-5">
        <X className="cursor-pointer" onClick={clearAllDataManual} />
      </div>
      <div className="w-full h-full overflow-y-auto p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <Input
                label="Registro"
                labelPlacement="outside"
                variant="bordered"
                placeholder="EJ:000"
                classNames={{ label: 'font-semibold' }}
                className="w-full md:w-44"
                value={nrc}
                onChange={(e) => {
                  setNrc(e.currentTarget.value);
                  const foundSupplier = supplier_pagination.suppliers.find(
                    (supp) => supp.nrc === e.currentTarget.value
                  );
                  if (foundSupplier) {
                    setSupplierSelected(foundSupplier);
                  } else {
                    setSupplierSelected(undefined);
                  }
                }}
              />

              <Autocomplete
                label="Nombre de proveedor"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona el proveedor"
                selectedKey={`${supplierSelected?.id ?? ''}`}
                classNames={{ base: 'font-semibold' }}
                onInputChange={(text) => {
                  setSearchNRC(text);
                }}
                onSelectionChange={(key) => {
                  if (key) {
                    const id = Number(new Set([key]).values().next().value);
                    const foundSupplier = supplier_pagination.suppliers.find(
                      (supp) => supp.id === id
                    );
                    if (foundSupplier) {
                      setSupplierSelected(foundSupplier);
                      setNrc(foundSupplier.nrc); // Actualiza el NRC cuando se selecciona el proveedor
                    } else {
                      setSupplierSelected(undefined);
                      setNrc(''); // Limpia NRC si no se encuentra el proveedor
                    }
                  } else {
                    setSupplierSelected(undefined);
                    setNrc(''); // Limpia NRC si no se selecciona ningún proveedor
                  }
                }}
              >
                {supplier_pagination.suppliers.map((supp) => (
                  <AutocompleteItem key={supp.id ?? 0}>
                    {supp.nombre + ' - ' + supp.nombreComercial}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5">
              <Input
                label="Tipo"
                labelPlacement="outside"
                variant="bordered"
                placeholder="EJ:01"
                classNames={{ label: 'font-semibold' }}
                className="w-full md:w-44"
                value={tipoDte}
                onChange={(e) => setTipoDte(e.currentTarget.value)}
              />
              <Select
                label="Nombre comprobante"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona el tipo de documento"
                selectedKeys={tipoDocSelected ? [`${tipoDocSelected?.codigo}`] : []}
                classNames={{ label: 'font-semibold' }}
                onSelectionChange={(key) => {
                  if (key) {
                    const fnd = filteredTipoDoc.find((doc) => doc.codigo === key.currentKey);
                    if (fnd) {
                      setTipoDocSelected({ codigo: fnd.codigo, valores: fnd.valores });
                      setTipoDte(fnd.codigo);
                      formik.setFieldValue('tipoDte', fnd.codigo);
                    } else {
                      setTipoDte('');
                      setTipoDocSelected(undefined);
                      formik.setFieldValue('tipoDte', '');
                    }
                  } else {
                    setTipoDte('');
                    setTipoDocSelected(undefined);
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
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-3">
            <div>
              <Input
                classNames={{ label: 'font-semibold' }}
                variant="bordered"
                type="date"
                label="Fecha recibido"
                value={currentDate}
                onChange={({ currentTarget }) => setCurrentDate(currentTarget.value)}
                labelPlacement="outside"
              />
            </div>
            <div>
              <Select
                classNames={{ label: 'font-semibold' }}
                variant="bordered"
                label="Tipo"
                placeholder="Selecciona el tipo"
                labelPlacement="outside"
                defaultSelectedKeys={`${formik.values.typeSale}`}
                onSelectionChange={(key) =>
                  key
                    ? formik.setFieldValue('typeSale', key.currentKey)
                    : formik.setFieldValue('typeSale', '')
                }
                onBlur={formik.handleBlur('typeSale')}
                isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                errorMessage={formik.errors.typeSale}
              >
                <SelectItem key={'interna'} value="interna">
                  Interna
                </SelectItem>
                <SelectItem key={'externa'} value="externa">
                  Externa
                </SelectItem>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-3">
            <Input
              classNames={{ label: 'font-semibold' }}
              placeholder="EJ: 101"
              variant="bordered"
              value={numeroControl}
              onChange={({ currentTarget }) => setNumeroControl(currentTarget.value)}
              label="Numero de control"
              labelPlacement="outside"
            />
            <Select
              onBlur={formik.handleBlur('classDocumentCode')}
              onSelectionChange={(key) => {
                if (key) {
                  const value = key.currentKey;
                  const code = OperationTypes.find((item) => item.code === value);
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
              isInvalid={!!formik.touched.classDocumentCode && !!formik.errors.classDocumentCode}
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
              isInvalid={!!formik.touched.operationTypeCode && !!formik.errors.operationTypeCode}
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
              isInvalid={!!formik.touched.classificationCode && !!formik.errors.classificationCode}
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
              isInvalid={!!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode}
              errorMessage={formik.errors.typeCostSpentCode}
            >
              {TypeCostSpents.map((item) => (
                <SelectItem value={item.code} key={item.code}>
                  {item.value}
                </SelectItem>
              ))}
            </Select>
          </div>
          <p className="py-5 text-xl font-semibold">Resumen</p>
          <div className="rounded border shadow dark:border-gray-700 p-5 md:p-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  onChange={({ currentTarget }) => handleChangeTotal(currentTarget.value)}
                />
              </div>
              <div>
                <Input
                  label="CORRELATIVO"
                  labelPlacement="outside"
                  readOnly
                  value={correlative.toString()}
                  placeholder="EJ: 001"
                  variant="bordered"
                  classNames={{ label: 'font-semibold' }}
                  type="number"
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
      </div>
    </>
  );
}

export default CreateShoppingManual;
