import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Input, Switch, useDisclosure } from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import { toast } from "sonner";
import { Sale } from "../../types/report_contigence";
import { useInvalidationStore } from "../../plugins/dexie/store/invalidation.store";
import {
  IInvalidationBody,
  IInvalidationToMH,
} from "../../types/DTE/invalidation.types";
import { getElSalvadorDateTime } from "../../utils/dates";
import { useTransmitterStore } from "../../store/transmitter.store";
import { documentsTypeReceipt } from "../../utils/dte";
import { Select, SelectItem } from "@nextui-org/react";
import ModalGlobal from "../global/ModalGlobal";
import { invalidationTypes } from "../../types/DTE/invalidation.types";
import {
  firmarDocumentoInvalidacion,
  send_to_mh_invalidation,
} from "../../services/DTE.service";
import { return_mh_token } from "../../storage/localStorage";
import { ambiente, version } from "../../utils/constants";
import axios from "axios";
import { invalidate_sale } from "../../services/sales.service";

interface Props {
  sale: Sale;
  closeModal: () => void;
}
export const SaleInvalidation = (props: Props) => {
  useEffect(() => {
    gettransmitter();
    OnGetRecentSales(props.sale.id);
  }, []);

  const [generationCodeR, setGenerationCodeR] = useState("");
  const [motivo, setMotivo] = useState(0);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [message, setMessage] = useState("");
  const {
    isLoading,
    isError,
    errorMessage,
    OnCreateInvalidation,
    sales,
    OnGetRecentSales,
  } = useInvalidationStore();

  const { transmitter, gettransmitter } = useTransmitterStore();

  const data: IInvalidationBody = {
    identificacion: {
      version: 2,
      ambiente: "00",
      codigoGeneracion: props.sale.codigoGeneracion,
      fecAnula: getElSalvadorDateTime().fecEmi,
      horAnula: getElSalvadorDateTime().horEmi,
    },
    emisor: {
      nit: transmitter.nit,
      nombre: transmitter.nombre,
      tipoEstablecimiento: transmitter.tipoEstablecimiento,
      telefono: transmitter.telefono,
      correo: transmitter.correo,
      codEstable: transmitter.codEstable,
      codPuntoVenta: transmitter.codPuntoVenta,
      nomEstablecimiento: transmitter.nombreComercial,
    },
    documento: {
      tipoDte: props.sale.tipoDte,
      codigoGeneracion: props.sale.codigoGeneracion,
      codigoGeneracionR: showMoreFields === true ? generationCodeR : null,
      selloRecibido: props.sale.selloRecibido,
      numeroControl: props.sale.numeroControl,
      fecEmi: props.sale.fecEmi,
      montoIva: Number(props.sale.totalIva),
      tipoDocumento: props.sale.customer.tipoDocumento,
      numDocumento: props.sale.customer.numDocumento,
      nombre: props.sale.customer.nombre,
    },
    motivo: {
      tipoAnulacion: 2,
      motivoAnulacion: "Rescindir de la operación realizada",
      nombreResponsable: "",
      tipDocResponsable: "",
      numDocResponsable: "",
      nombreSolicita: "",
      tipDocSolicita: "",
      numDocSolicita: "",
    },
  };

  const validationSchema = yup.object().shape({
    nameResponsible: yup.string().required("**El nombre es requerido**"),
    nameApplicant: yup.string().required("**El nombre es requerido**"),
    docNumberResponsible: yup
      .string()
      .required("**El documento es requerido**"),
    docNumberApplicant: yup.string().required("**El documento es requerido**"),
    typeDocResponsible: yup
      .string()
      .required("**El tipo de documento es requerido**"),
    typeDocApplicant: yup
      .string()
      .required("**El tipo de documento es requerido**"),
  });

  const onSubmit = async (values: any) => {
    toast.info("Estamos firmado tu documento");
    firmarDocumentoInvalidacion({
      nit: transmitter.nit,
      passwordPri: transmitter.clavePublica,
      dteJson: {
        identificacion: data.identificacion,
        emisor: data.emisor,
        documento: data.documento,
        motivo: {
          tipoAnulacion: 2,
          motivoAnulacion: "Rescindir de la operación realizada",
          nombreResponsable: values.nameResponsible,
          tipDocResponsable: values.typeDocResponsible,
          numDocResponsable: values.docNumberResponsible,
          nombreSolicita: values.nameApplicant,
          tipDocSolicita: values.typeDocApplicant,
          numDocSolicita: values.docNumberApplicant,
        },
      },
    })
      .then(async (firma) => {
        const token_mh = return_mh_token();
        if (firma.data.body) {
          const dataMH: IInvalidationToMH = {
            ambiente: ambiente,
            version: version,
            idEnvio: 1,
            documento: firma.data.body,
          };
          toast.success("Firmado correctamente");

          if (token_mh) {
            const source = axios.CancelToken.source();

            const timeout = setTimeout(() => {
              source.cancel("El tiempo de espera ha expirado");
            }, 25000);
            toast.info("Enviando a hacienda");
            send_to_mh_invalidation(dataMH)
              .then(async ({ data }) => {
                if (data.selloRecibido) {
                  clearTimeout(timeout);
                  toast.info("Estamos guardando tus datos");
                  invalidate_sale(props.sale.id, data.selloRecibido)
                    .then(() => {
                      toast.success("Guardado correctamente");
                      props.closeModal();
                    })
                    .catch((error) => {
                      toast.error(error.message);
                    });
                }
              })
              .catch((error) => {
                toast.error(error.message);
              });
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const changeToggle = () => {
    setShowMoreFields(!showMoreFields);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Formik
          initialValues={{
            nameResponsible: "",
            nameApplicant: "",
            docNumberResponsible: "",
            docNumberApplicant: "",
            typeDocResponsible: "",
            typeDocApplicant: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center items-center ">
                <label
                  htmlFor="nameResponsible"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                >
                  Nombre de Responsable
                </label>
                <Input
                  className="border border-gray-200 rounded-md w-full"
                  type="text"
                  id="nameResponsible"
                  name="nameResponsible"
                  value={values.nameResponsible}
                  onChange={handleChange("nameResponsible")}
                  onBlur={handleBlur("nameResponsible")}
                ></Input>
                {errors.nameResponsible && touched.nameResponsible && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nameResponsible}
                  </span>
                )}
                <div className="flex flex-row justify-center gap-2 items-center w-full">
                  <Select
                    className="w-44 mb-5"
                    variant="bordered"
                    size="md"
                    label="Seleccionar"
                    labelPlacement="outside"
                    classNames={{
                      label: "font-semibold",
                    }}
                    value={values.typeDocResponsible}
                    onChange={handleChange("typeDocResponsible")}
                  >
                    {documentsTypeReceipt.map((doc) => (
                      <SelectItem key={doc.codigo} value={doc.codigo}>
                        {doc.valores}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.typeDocResponsible && touched.typeDocResponsible && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.typeDocResponsible}
                    </span>
                  )}
                  <Input
                    className="border border-gray-200 rounded-md "
                    placeholder="Numero de Documento"
                    type="text"
                    id="docNumberResponsible"
                    name="docNumberResponsible"
                    value={values.docNumberResponsible}
                    onChange={handleChange("docNumberResponsible")}
                    onBlur={handleBlur("docNumberResponsible")}
                  ></Input>
                  {errors.docNumberResponsible &&
                    touched.docNumberResponsible && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.docNumberResponsible}
                      </span>
                    )}
                </div>

                <label
                  htmlFor="nameApplicant"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                >
                  Nombre de Solicitante
                </label>
                <Input
                  className="border border-gray-200 rounded-md w-full"
                  type="text"
                  id="nameApplicant"
                  name="nameApplicant"
                  value={values.nameApplicant}
                  onChange={handleChange("nameApplicant")}
                  onBlur={handleBlur("nameApplicant")}
                ></Input>
                {errors.nameApplicant && touched.nameApplicant && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nameApplicant}
                  </span>
                )}
                <div className="flex flex-row justify-center gap-2 items-center w-full">
                  <Select
                    className="w-44 mb-5"
                    variant="bordered"
                    size="md"
                    label="Seleccionar"
                    labelPlacement="outside"
                    classNames={{
                      label: "font-semibold",
                    }}
                    value={values.typeDocApplicant}
                    onChange={handleChange("typeDocApplicant")}
                  >
                    {documentsTypeReceipt.map((doc) => (
                      <SelectItem key={doc.codigo} value={doc.codigo}>
                        {doc.valores}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.typeDocApplicant && touched.typeDocApplicant && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.typeDocApplicant}
                    </span>
                  )}
                  <Input
                    className="border border-gray-200 rounded-md "
                    placeholder="Numero de Documento"
                    type="text"
                    id="documentApplicant"
                    name="documentApplicant"
                    value={values.docNumberApplicant}
                    onChange={handleChange("docNumberApplicant")}
                    onBlur={handleBlur("docNumberApplicant")}
                  ></Input>
                  {errors.docNumberApplicant && touched.docNumberApplicant && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.docNumberApplicant}
                    </span>
                  )}
                </div>
                {showMoreFields === true && (
                  <>
                    <Select
                      className="my-3"
                      size="lg"
                      variant="bordered"
                      placeholder="Selecciona el motivo"
                      value={motivo}
                      aria-label="Select a reason"
                      onChange={(e) => setMotivo(Number(e.target.value))}
                    >
                      {invalidationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.valores}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="my-3"
                      size="lg"
                      variant="bordered"
                      placeholder="Selecciona una venta"
                      value={generationCodeR}
                      aria-label="Select a sale"
                      onChange={(e) => setGenerationCodeR(e.target.value)}
                    >
                      {sales.map((sale) => (
                        <SelectItem
                          key={sale.codigoGeneracion}
                          value={sale.codigoGeneracion}
                        >
                          {sale.id +
                            " - " +
                            sale.fecEmi +
                            "-" +
                            sale.horEmi +
                            " - $" +
                            sale.montoTotalOperacion}
                        </SelectItem>
                      ))}
                    </Select>
                  </>
                )}

                <div className="flex flex-row justify-center gap-2 items-center p-2">
                  <p>Desea reemplazar la venta?</p>
                  <Switch
                    size="lg"
                    checked={showMoreFields}
                    onChange={() => changeToggle()}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-2 items-center mt-2 p-2">
                {showMoreFields === true ? (
                  <Button
                    className=" w-1/2"
                    style={global_styles().secondaryStyle}
                    size="md"
                    onClick={() => handleSubmit()}
                  >
                    Reemplazar
                  </Button>
                ) : (
                  <Button
                    className="flex w-1/2"
                    style={global_styles().warningStyles}
                    size="md"
                    onClick={() => handleSubmit()}
                  >
                    Invalidar
                  </Button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};
