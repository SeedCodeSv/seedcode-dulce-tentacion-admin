import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button } from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import { toast } from "sonner";
import { Sale } from "../../types/report_contigence";
import { useInvalidationStore } from "../../plugins/dexie/store/invalidation.store";
import { IInvalidationBody } from "../../types/DTE/invalidation.types";
import { getElSalvadorDateTime } from "../../utils/dates";
import { useTransmitterStore } from "../../store/transmitter.store";
import { useBillingStore } from "../../store/facturation/billing.store";
import { documentsTypeReceipt } from "../../utils/dte";
import { Select, SelectItem } from "@nextui-org/react";

interface Props {
  sale: Sale;
}
export const SaleInvalidation = (props: Props) => {
  useEffect(() => {
    gettransmitter();
  }, []);
  const { isLoading, isError, errorMessage, OnCreateInvalidation } =
    useInvalidationStore();
  const {} = useBillingStore();
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
      nombreResponsable: '',
      tipDocResponsable: '',
      numDocResponsable: '',
      nombreSolicita: '',
      tipDocSolicita: '',
      numDocSolicita: '',
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
    isLoading === true && toast.loading("Cargando...");

    OnCreateInvalidation({
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
    });
    console.log(values);
    console.log(data);
    isError === true && toast.error(errorMessage);
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
              <div className="flex flex-col justify-center items-center">
                <label
                  htmlFor="nameResponsible"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
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
                {errors.nameResponsible && touched.nameResponsible && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nameResponsible}
                  </span>
                )}
                <div className="flex flex-row justify-center gap-2 items-center p-2">
                  <Select
                    className="w-44"
                    variant="bordered"
                    size="lg"
                    label="Mostrar"
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
                  <div>
                    <input
                      placeholder="Numero de Documento"
                      className="border border-gray-300 rounded-md p-1 w-full"
                      type="text"
                      id="documentResponsible"
                      name="documentResponsible"
                      onChange={handleChange("docNumberResponsible")}
                      onBlur={handleBlur("docNumberResponsible")}
                    ></input>
                    {errors.docNumberResponsible &&
                      touched.docNumberResponsible && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.docNumberResponsible}
                        </span>
                      )}
                  </div>
                </div>

                <label
                  htmlFor="nameApplicant"
                  className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
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
                {errors.nameApplicant && touched.nameApplicant && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nameApplicant}
                  </span>
                )}
                <div className="flex flex-row justify-center gap-2 items-center p-2">
                  <Select
                    className="w-44"
                    variant="bordered"
                    size="lg"
                    label="Mostrar"
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
                  {errors.docNumberApplicant && touched.docNumberApplicant && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.docNumberApplicant}
                    </span>
                  )}
                </div>
              </div>
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
                  onClick={() => handleSubmit()}
                >
                  Invalidar
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};
