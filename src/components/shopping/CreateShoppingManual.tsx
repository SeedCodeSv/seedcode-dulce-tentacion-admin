import { get_correlative_shopping } from '@/services/shopping.service';
import { CreateShoppingDto } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import axios from 'axios';
import { MessageCircleQuestion } from 'lucide-react';
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
import { useBranchesStore } from '@/store/branches.store';

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

  const {getBranchesList, branch_list} = useBranchesStore()
  const [tipoDte, setTipoDte] = useState('03');

  useEffect(()=>{
    getBranchesList()
  },[])

  const handleChangeAfecta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, "")
    const totalAfecta = Number(sanitizedValue)

    setAfecta(sanitizedValue)
    setAfectaModified(true)
    setTotalModified(false)
    const ivaCalculado = totalAfecta * 0.13
    setTotalIva(ivaCalculado.toFixed(2))
    if (tipoDte !== "14" && includePerception) {
      const percepcion = totalAfecta * 0.01
      setTotal((totalAfecta + Number(exenta) + ivaCalculado + percepcion).toFixed(2))
      return
    }
    setTotal((totalAfecta + Number(exenta) + ivaCalculado).toFixed(2))
  }

  const handleChangeExenta = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, "")
    const totalExenta = Number(sanitizedValue)

    setExenta(sanitizedValue)
    if (includePerception) {
      const result = +afecta * 0.01
      setTotal(() =>
        (+afecta + totalExenta + result + (tipoDte === "03" ? Number(totalIva) : 0)).toFixed(2)
      )
    }
    setTotal(() => (+afecta + totalExenta + (tipoDte === "03" ? Number(totalIva) : 0)).toFixed(2))
  }

  const handleChangeTotal = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, "")
    const totalValue = Number(sanitizedValue)

    setTotalModified(true)
    setAfectaModified(false)

    if (tipoDte) {
      const ivaIncluido = totalValue - totalValue / 1.13
      const afectaSinIva = totalValue - ivaIncluido
      setAfecta(afectaSinIva.toFixed(2))
      setTotalIva(ivaIncluido.toFixed(2))
    } else {
      const ivaCalculado = totalValue * 0.13
      const afectaConIva = totalValue - ivaCalculado

      if (includePerception) {
        const percepcion = afectaConIva * 0.01
        setTotal((totalValue + percepcion).toFixed(2))
        return
      }

      setAfecta(afectaConIva.toFixed(2))
      setTotalIva(ivaCalculado.toFixed(2))
    }

    setTotal(sanitizedValue)
  }

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
    if (nrc !== "") {
      const find = supplier_pagination.suppliers.find((supp) => supp.nrc === nrc)
      if (find) setSupplierSelected(find)
      else {
        setSupplierSelected(undefined)
      }
    }
  }, [nrc])


  const services = new SeedcodeCatalogosMhService();
  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['03', '06', '05'].includes(item.codigo));
  }, []);

  const navigate = useNavigate();

  const $1perception = useMemo(() => {
    if (includePerception) {
      if (Number(afecta) > 0) {
        const result = Number(afecta) * 0.01
        return result
      }
      return 0
    }
    return 0
  }, [afecta, includePerception])




  const [exenta, setExenta] = useState("")
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
      tipoDte: "03",
      typeSale: "interna",
      declarationDate: formatDate(),
      fecEmi: formatDate(),
      branchId: 0,
      numeroControl: ""
    },
    validationSchema: yup.object().shape({
      operationTypeCode: yup.string().required("**El tipo de operación es requerido**"),
      operationTypeValue: yup.string().required("**El tipo de operación es requerido**"),
      classificationCode: yup.string().required("**La clasificación es requerida**"),
      classificationValue: yup.string().required("**La clasificación es requerida**"),
      sectorCode: yup.string().required("**El sector es requerido**"),
      sectorValue: yup.string().required("**El sector es requerido**"),
      typeCostSpentCode: yup.string().required("**El tipo de gasto es requerido**"),
      typeCostSpentValue: yup.string().required("**El tipo de gasto es requerido**"),
      classDocumentCode: yup.string().required("**La clasificación es requerida**"),
      classDocumentValue: yup.string().required("**La clasificación es requerida**"),
      tipoDte: yup.string().required("**El tipo de documento es requerido**"),
      typeSale: yup.string().required("**El tipo de venta es requerido**"),
      declarationDate: yup.string().required("**La fecha es requerida**"),
      fecEmi: yup.string().required("**La fecha es requerida**"),
      branchId: yup.number().required("**Selecciona la sucursal**").min(1, "**Selecciona la sucursal**"),
      numeroControl: yup.string().required("**Ingresa el numero de control**")
    }),
    async onSubmit(values, formikHelpers) {
      if (!supplierSelected) {
        toast.warning("Debes seleccionar el proveedor")
        return
      }

      try {
        await validateReceptor(supplierSelected)
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
          ...values
        }

        axios
          .post(API_URL + "/shoppings/create", payload)
          .then(() => {
            toast.success("Compra guardada con éxito")
            formikHelpers.setSubmitting(false)
            navigate("/shopping")
          })
          .catch(() => {
            toast.error("Error al guardar la compra")
            formikHelpers.setSubmitting(false)
          })
      } catch (error) {
        formikHelpers.setSubmitting(false)
        if (error instanceof Error) {
          toast.error("Proveedor no valido", { description: error.message })
        } else {
          toast.error("Error al guardar la compra")
        }
      }
    }
  })

  return (
    <>
      <div className="w-full h-full">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.submitForm()
          }}
          className="w-full h-full overflow-y-auto p-5"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <Input
                label="Registro"
                labelPlacement="outside"
                variant="bordered"
                placeholder="EJ:000"
                classNames={{ label: "font-semibold" }}
                className="w-full md:w-44"
                value={nrc}
                onChange={(e) => setNrc(e.currentTarget.value)}
              />
              <Autocomplete
                label="Nombre de proveedor"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona el proveedor"
                selectedKey={`${supplierSelected?.id}`}
                classNames={{ base: "font-semibold" }}
                onInputChange={(text) => setSearchNRC(text)}
                onSelectionChange={(key) => {
                  if (key) {
                    const id = Number(new Set([key]).values().next().value)
                    const fnd = supplier_pagination.suppliers.find((spp) => spp.id === id)
                    if (fnd) {
                      setSupplierSelected(fnd)
                      setNrc(fnd?.nrc)
                    } else setSupplierSelected(undefined)
                  } else setSupplierSelected(undefined)
                }}
              >
                {supplier_pagination.suppliers.map((supp) => (
                  <AutocompleteItem key={supp.id}>
                    {supp.nombre}
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
                classNames={{ label: "font-semibold" }}
                className="w-full md:w-44"
                value={tipoDte}
                onChange={(e) => {
                  formik.setFieldValue("tipoDte", e.currentTarget.value)
                  setTipoDte(e.currentTarget.value)
                }}
              />
              <Select
                label="Nombre comprobante"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Selecciona el tipo de documento"
                selectedKeys={[formik.values.tipoDte]}
                classNames={{ label: "font-semibold" }}
                onSelectionChange={(key) => {
                  const value = new Set(key).values().next().value as string
                  if (value) {
                    formik.setFieldValue("tipoDte", value)
                    setTipoDte(value)
                  } else {
                    formik.setFieldValue("tipoDte", "")
                    setTipoDte("")
                  }
                }}
              >
                {filteredTipoDoc.map((item) => (
                  <SelectItem value={item.codigo} key={item.codigo}>
                    {item.valores}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
          <div>
              <Select
                classNames={{ label: "font-semibold" }}
                variant="bordered"
                label="Sucursal"
                placeholder="Selecciona la sucursal"
                labelPlacement="outside"
                defaultSelectedKeys={[`${formik.values.branchId}`]}
                onSelectionChange={(key) => {
                  const value = new Set(key).values().next().value
                  key ? formik.setFieldValue("branchId", value) : formik.setFieldValue("branchId", "")
                }}
                onBlur={formik.handleBlur("branchId")}
                isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
                errorMessage={formik.errors.branchId}
              >
               {branch_list.map((item) => (
                 <SelectItem value={item.id} key={item.id}>
                   {item.name}
                 </SelectItem>
               ))}
              </Select>
            </div>
            <div>
              <Select
                classNames={{ label: "font-semibold" }}
                variant="bordered"
                label="Tipo"
                placeholder="Selecciona el tipo"
                labelPlacement="outside"
                defaultSelectedKeys={[`${formik.values.typeSale}`]}
                onSelectionChange={(key) => {
                  const value = new Set(key).values().next().value
                  key ? formik.setFieldValue("typeSale", value) : formik.setFieldValue("typeSale", "")
                }}
                onBlur={formik.handleBlur("typeSale")}
                isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
                errorMessage={formik.errors.typeSale}
              >
                <SelectItem key={"interna"} value="interna">
                  Interna
                </SelectItem>
                <SelectItem key={"internacion"} value="internacion">
                  Internación
                </SelectItem>
                <SelectItem key={"importacion"} value="importacion">
                  Importación
                </SelectItem>
              </Select>
            </div>
            <Input
              classNames={{ label: "font-semibold" }}
              placeholder="EJ: 101"
              variant="bordered"
              value={formik.values.numeroControl}
              onChange={formik.handleChange("numeroControl")}
              onBlur={formik.handleBlur("numeroControl")}
              label={
                <div className="flex gap-5">
                  <p>Numero de control</p>
                  <Tooltip
                    content={
                      <div className="w-44 ">
                        <span>
                          <span className="font-semibold">Consejo:</span> En caso de ser un DTE
                          ingrese el numero de control del documento con guiones
                        </span>
                      </div>
                    }
                  >
                    <MessageCircleQuestion size={20} />
                  </Tooltip>
                </div>
              }
              labelPlacement="outside"
              isInvalid={!!formik.touched.numeroControl && !!formik.errors.numeroControl}
              errorMessage={formik.errors.numeroControl}
            />
            <Select
              onBlur={formik.handleBlur("classDocumentCode")}
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value
                  const code = ClassDocuments.find((item) => item.code === value)
                  if (code) {
                    formik.setFieldValue("classDocumentCode", code.code)
                    formik.setFieldValue("classDocumentValue", code.value)
                  } else {
                    formik.setFieldValue("classDocumentCode", "")
                    formik.setFieldValue("classDocumentValue", "")
                  }
                } else {
                  formik.setFieldValue("classDocumentCode", "")
                  formik.setFieldValue("classDocumentValue", "")
                }
              }}
              selectedKeys={formik.values.classDocumentCode}
              classNames={{ label: "font-semibold" }}
              className="w-full"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Selecciona una opción"
              label={
                <div className="flex gap-5">
                  <p>clase del documento</p>
                  <Tooltip
                    content={
                      <div className="w-44 ">
                        <span>
                          <span className="font-semibold">Consejo:</span> En caso de ser un DTE
                          seleccione la opcion {ClassDocumentCode.DOCUMENTO_TRIBUTARIO_ELECTRONICO}.{" "}
                          {ClassDocumentValue.DOCUMENTO_TRIBUTARIO_ELECTRONICO}
                        </span>
                      </div>
                    }
                  >
                    <MessageCircleQuestion size={20} />
                  </Tooltip>
                </div>
              }
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
              onBlur={formik.handleBlur("operationTypeCode")}
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value
                  const code = OperationTypes.find((item) => item.code === value)
                  if (code) {
                    formik.setFieldValue("operationTypeCode", code.code)
                    formik.setFieldValue("operationTypeValue", code.value)
                  } else {
                    formik.setFieldValue("operationTypeCode", "")
                    formik.setFieldValue("operationTypeValue", "")
                  }
                } else {
                  formik.setFieldValue("operationTypeCode", "")
                }
              }}
              selectedKeys={formik.values.operationTypeCode}
              classNames={{ label: "font-semibold" }}
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
              classNames={{ label: "font-semibold" }}
              className="w-full"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Selecciona una opción"
              label="Clasificación"
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value
                  const code = Classifications.find((item) => item.code === value)
                  if (code) {
                    formik.setFieldValue("classificationCode", code.code)
                    formik.setFieldValue("classificationValue", code.value)
                  } else {
                    formik.setFieldValue("classificationCode", "")
                    formik.setFieldValue("classificationValue", "")
                  }
                } else {
                  formik.setFieldValue("classificationCode", "")
                }
              }}
              selectedKeys={formik.values.classificationCode}
              onBlur={formik.handleBlur("classificationCode")}
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
              classNames={{ label: "font-semibold" }}
              className="w-full"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Selecciona una opción"
              label="Sector"
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value
                  const code = Sectors.find((item) => item.code === value)
                  if (code) {
                    formik.setFieldValue("sectorCode", code.code)
                    formik.setFieldValue("sectorValue", code.value)
                  } else {
                    formik.setFieldValue("sectorCode", "")
                    formik.setFieldValue("sectorValue", "")
                  }
                } else {
                  formik.setFieldValue("sectorCode", "")
                }
              }}
              selectedKeys={formik.values.sectorCode}
              onBlur={formik.handleBlur("sectorCode")}
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
              classNames={{ label: "font-semibold" }}
              className="w-full"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Selecciona una opción"
              label="Tipo de costo/gasto"
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value
                  const code = TypeCostSpents.find((item) => item.code === value)
                  if (code) {
                    formik.setFieldValue("typeCostSpentCode", code.code)
                    formik.setFieldValue("typeCostSpentValue", code.value)
                  } else {
                    formik.setFieldValue("typeCostSpentCode", "")
                    formik.setFieldValue("typeCostSpentValue", "")
                  }
                } else {
                  formik.setFieldValue("typeCostSpentCode", "")
                }
              }}
              selectedKeys={formik.values.typeCostSpentCode}
              onBlur={formik.handleBlur("typeCostSpentCode")}
              isInvalid={!!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode}
              errorMessage={formik.errors.typeCostSpentCode}
            >
              {TypeCostSpents.map((item) => (
                <SelectItem value={item.code} key={item.code}>
                  {item.value}
                </SelectItem>
              ))}
            </Select>
            <div>
              <Input
                label="CORRELATIVO"
                labelPlacement="outside"
                readOnly
                value={correlative.toString()}
                placeholder="EJ: 001"
                variant="bordered"
                classNames={{ label: "font-semibold" }}
                type="number"
              />
            </div>
            <Input
              classNames={{ label: "font-semibold" }}
              variant="bordered"
              type="date"
              label="Fecha del documento"
              value={formik.values.fecEmi}
              onChange={formik.handleChange("fecEmi")}
              onBlur={formik.handleBlur("fecEmi")}
              labelPlacement="outside"
              isInvalid={!!formik.touched.fecEmi && !!formik.errors.fecEmi}
              errorMessage={formik.errors.fecEmi}
            />
            <Input
              classNames={{ label: "font-semibold" }}
              variant="bordered"
              type="date"
              label="Fecha de declaración"
              value={formik.values.declarationDate}
              onChange={formik.handleChange("declarationDate")}
              onBlur={formik.handleBlur("declarationDate")}
              labelPlacement="outside"
              isInvalid={!!formik.touched.declarationDate && !!formik.errors.declarationDate}
              errorMessage={formik.errors.declarationDate}
            />

            <div className="flex  items-end">
              <Checkbox
                checked={includePerception}
                onValueChange={(val) => setIncludePerception(val)}
                size="lg"
              >
                ¿Incluye percepción?
              </Checkbox>
            </div>
          </div>
          <p className="py-5 text-xl font-semibold">Resumen</p>
          <div className="rounded border shadow dark:border-gray-700 p-5 md:p-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Input
                  label="AFECTA"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  classNames={{ label: "font-semibold", input: "text-red-600 text-lg font-bold" }}
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
                  classNames={{ label: "font-semibold", input: "text-red-600 text-lg font-bold" }}
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
                  classNames={{ label: "font-semibold", input: "text-red-600 text-lg font-bold" }}
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
                  classNames={{ label: "font-semibold" }}
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
                  classNames={{ label: "font-semibold" }}
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
                  classNames={{ label: "font-semibold", input: "text-red-600 text-lg font-bold" }}
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
      </div>
    </>
  );
}

export default CreateShoppingManual;
