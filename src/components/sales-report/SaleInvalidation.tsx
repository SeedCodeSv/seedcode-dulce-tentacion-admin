import { useContext } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import ModalGlobal from "../global/ModalGlobal";
import { Button, useDisclosure } from "@nextui-org/react";
import { ThemeContext } from "../../hooks/useTheme";
import { global_styles } from "../../styles/global.styles";
import { toast } from "sonner";
import { Sale } from "../../types/report_contigence";
import { useInvalidationStore } from "../../plugins/dexie/store/invalidation.store";
import { IInvalidationBody } from "../../types/DTE/invalidation.types";
import { formatDate, getElSalvadorDateTime } from "../../utils/dates";
import { useTransmitterStore } from "../../store/transmitter.store";

interface Props {
  sale: Sale;
}
export const SaleInvalidation = (props: Props) => {
  const { isLoading, isError, errorMessage, OnCreateInvalidation } =
    useInvalidationStore();
  const { transmitter, gettransmitter } = useTransmitterStore();

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

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
      codigoGeneracionR: null,
      selloRecibido: props.sale.selloRecibido,
      numeroControl: props.sale.numeroControl,
      fecEmi: props.sale.fecEmi,
      montoIva: Number(props.sale.totalIva),
      tipoDocumento: "13",
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

  const modalForm = useDisclosure();

  const validationSchema = yup.object().shape({
    nameResponsible: yup.string().required("**El nombre es requerido**"),
    nameApplicant: yup.string().required("**El nombre es requerido**"),
    docNumberResponsible: yup
      .string()
      .required("**El documento es requerido**"),
    docNumberApplicant: yup.string().required("**El documento es requerido**"),
    typeDocResponsible: yup
      .number()
      .required("**El tipo de documento es requerido**"),
    typeDocApplicant: yup
      .number()
      .required("**El tipo de documento es requerido**"),
  });

  const initialValues = {
    nameResponsible: "",
    nameApplicant: "",
    docNumberResponsible: "",
    docNumberApplicant: "",
    typeDocResponsible: 0,
    typeDocApplicant: 0,
    
  };

  const handleSubmit = () => {};
  const handleInvalidate = () => {
    OnCreateInvalidation({ nit: "", passwordPri: "", dteJson: data });
  };

  const handleReplace = () => {
    toast(`Reemplazando venta ${props.sale.id}`);
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
            typeDocResponsible: 0,
            typeDocApplicant: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
              <div className="flex flex-col justify-center items-center">
                <label
                  htmlFor="nameResponsible"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre de Responsable
                </label>
                <input
                  className="border border-gray-300 rounded-md p-1 w-full"
                  type="text"
                  id="nameResponsible"
                  name="nameResponsible"
                  value={values.nameResponsible}
                  onChange={handleChange("nameResponsible")}
                  onBlur={handleBlur("nameResponsible")}
                ></input>
                <div className="flex flex-row justify-center gap-2 items-center p-2">
                  <select
                    className="border border-gray-300 rounded-md p-1"
                    id="typeDocResponsible"
                    name="typeDocResponsible"
                    value={values.typeDocResponsible}
                    onChange={handleChange("typeDocResponsible")}
                    onBlur={handleBlur("typeDocResponsible")}
                  >
                    <option value="DUi">DUI</option>
                  </select>
                  <div>
                    <input
                      placeholder="Numero de Documento"
                      className="border border-gray-300 rounded-md p-1 w-full"
                      type="text"
                      id="documentResponsible"
                      name="documentResponsible"
                      value={values.docNumberResponsible}
                      onChange={handleChange("docNumberResponsible")}
                      onBlur={handleBlur("docNumberResponsible")}
                    ></input>
                  </div>
                </div>

                <label
                  htmlFor="nameApplicant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre de Solicitante
                </label>
                <input
                  className="border border-gray-300 rounded-md p-1 w-full"
                  type="text"
                  id="nameApplicant"
                  name="nameApplicant"
                  value={values.nameApplicant}
                  onChange={handleChange("nameApplicant")}
                  onBlur={handleBlur("nameApplicant")}
                ></input>
                <div className="flex flex-row justify-center gap-2 items-center p-2">
                  <select
                    className="border border-gray-300 rounded-md p-1"
                    id="typeDocApplicant"
                    name="typeDocApplicant"
                    value={values.typeDocApplicant}
                    onChange={handleChange("typeDocApplicant")}
                    onBlur={handleBlur("typeDocApplicant")}
                  >
                    <option value="DUi">DUI</option>
                  </select>
                  <input
                    className="border border-gray-300 rounded-md p-1"
                    placeholder="Numero de Documento"
                    type="text"
                    id="documentApplicant"
                    name="documentApplicant"
                    value={values.docNumberApplicant}
                    onChange={handleChange("docNumberApplicant")}
                    onBlur={handleBlur("docNumberApplicant")}
                  ></input>
                </div>
              </div>
            </form>
          )}
        </Formik>
        <div className="flex justify-between gap-2 items-center mt-2 p-2">
          <Button
            style={global_styles().secondaryStyle}
            size="md"
            onClick={handleReplace}
          >
            Reemplazar
          </Button>
          <Button
            style={global_styles().warningStyles}
            size="md"
            onClick={handleInvalidate}
          >
            Invalidar
          </Button>
        </div>
      </div>
    </>
  );
};
