import { create } from "zustand";
import { IGlobalBillingStore } from "./types/global.types";
import { cat_012_departamento } from "../../services/facturation/cat-012-departamento.service";
import { cat_013_municipio } from "../../services/facturation/cat-013-municipio.service";
import { cat_019_codigo_de_actividad_economica } from "../../services/facturation/cat-019-codigo-de-actividad-economica.service";
import {
  firmarDocumentoFactura,
  firmarDocumentoFiscal,
  get_ambiente_destino,
  get_metodos_de_pago,
  get_tipos_de_documento,
  get_tipos_de_tributo,
  send_to_mh,
} from "../../services/DTE.service";
import {
  PayloadMH,
  DTEToPDFFiscal,
} from "../../types/DTE/credito_fiscal.types";
import {DTEToPDF} from "../../types/DTE/factura.types"
import { toast } from "sonner";
import { return_mh_token } from "../../storage/localStorage";
import { make_to_pdf } from "../../utils/make-dte";
import { SendMHFailed } from "../../types/transmitter.types";
import { AxiosError } from "axios";
import { make_to_pdf_fiscal } from "../../utils/DTE/credito_fiscal";
export const useBillingStore = create<IGlobalBillingStore>((set, get) => ({
  cat_012_departamento: [],
  cat_013_municipios: [],
  cat_019_codigo_de_actividad_economica: [],
  ambiente_destino: [],
  metodos_de_pago: [],
  tipos_de_documento: [],
  tipos_tributo: [],
  getCat012Departamento: () => {
    cat_012_departamento()
      .then(({ data }) => {
        set((state) => ({ ...state, cat_012_departamento: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, cat_012_departamento: [] }));
      });
  },
  getCat013Municipios() {
    cat_013_municipio()
      .then(({ data }) => {
        set((state) => ({ ...state, cat_013_municipios: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, cat_013_municipios: [] }));
      });
  },
  getCat019CodigoActividadEconomica() {
    cat_019_codigo_de_actividad_economica()
      .then(({ data }) => {
        set((state) => ({
          ...state,
          cat_019_codigo_de_actividad_economica: data.object,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          cat_019_codigo_de_actividad_economica: [],
        }));
      });
  },
  OnGetTiposTributos() {
    get_tipos_de_tributo()
      .then(({ data }) => {
        set((state) => ({ ...state, tipos_tributo: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, tipos_tributo: [] }));
      });
  },
  OnGetAmbienteDestino() {
    get_ambiente_destino()
      .then(({ data }) => {
        set((state) => ({ ...state, ambiente_destino: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, ambiente_destino: [] }));
      });
  },
  OnGetFormasDePago() {
    get_metodos_de_pago()
      .then(({ data }) => {
        set((state) => ({ ...state, metodos_de_pago: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, metodos_de_pago: [] }));
      });
  },
  OnGetTipoDeDocumento() {
    get_tipos_de_documento()
      .then(({ data }) => {
        set((state) => ({ ...state, tipos_de_documento: data.objects }));
      })
      .catch(() => {
        set((state) => ({ ...state, tipos_de_standard: [] }));
      });
  },
  OnSignInvoiceDocument(DTE, total) {
    firmarDocumentoFactura(DTE).then(async (firmador) => {
      const token_mh = await return_mh_token();

      if (firmador.data.body) {
        const data_send: PayloadMH = {
          ambiente: "00",
          idEnvio: 1,
          version: 1,
          tipoDte: "01",
          documento: firmador.data.body,
        };

        toast.info("Se ah enviado a hacienda, esperando respuesta");
        send_to_mh(data_send, token_mh!)
          .then(async ({ data }) => {
            const data_pdf: DTEToPDF = make_to_pdf(DTE, total, data);
            toast.info("El DTE ah sido validado por hacienda");
            // await saveFactura(data_pdf, DTE, data, firmador.data.body);
          })
          .catch((error: AxiosError<SendMHFailed>) => {
            if (error.response?.status === 401) {
              toast.error("No tienes los accesos necesarios");
              // setLoadingSave(false);
              return;
            } else {
              //////-----------------------
              if (error.response?.data) {
                // Alert.alert(
                //   error.response?.data.descripcionMsg,
                //   error.response.data.observaciones &&
                //     error.response.data.observaciones.length > 0
                //     ? error.response?.data.observaciones.join("\n\n")
                //     : ""
                // );
                // toast.error(error.response?.data.descripcionMsg,
                //   error.response.data.observaciones &&
                //     error.response.data.observaciones.length > 0
                //     ? error.response?.data.observaciones.join("\n\n")
                //     : "")
                // Dte_Error(
                //   DTE,
                //   error,
                //   data_send,
                //   error.response?.data,
                //   error.response.data.observaciones.join("\n\n")
                // );
                return;
              } else {
                return;
              }
            }
          });
      } else {
      }
    });
  },
  OnSignInvoiceDocumentFiscal(PayloadMH, total) {
    firmarDocumentoFiscal(PayloadMH)
      .then(async (firmador) => {
        const token_mh = await return_mh_token();
        if (firmador.data.body) {
          const data_send: PayloadMH = {
            ambiente: "00",
            idEnvio: 1,
            version: 3,
            tipoDte: "03",
            documento: firmador.data.body,
          };

          toast.info("Se ah enviado a hacienda, esperando respuesta");
          send_to_mh(data_send, token_mh!)
            .then(async ({ data }) => {
              const data_pdf: DTEToPDFFiscal = make_to_pdf_fiscal(
                PayloadMH,
                total,
                data
              );
              toast.info("El DTE ah sido validado por hacienda");
              //guardar factura
              // await generate_fiscal(
              //   data_pdf,
              //   generation,
              //   data,
              //   firmador.data.body
              // );
            })
            .catch((error: AxiosError<SendMHFailed>) => {
              if (error.response?.status === 401) {
                // ToastAndroid.show(
                //   "No tienes los accesos necesarios",
                //   ToastAndroid.SHORT
                // );
                toast.error("No tienes los accesos necesarios");
                // setLoadingSave(false);
              } else {
                if (error.response?.data) {
                  // Alert.alert(
                  //   error.response?.data.descripcionMsg,
                  //   error.response.data.observaciones &&
                  //     error.response.data.observaciones.length > 0
                  //     ? error.response?.data.observaciones.join("\n\n")
                  //     : ""
                  // );
                  // setLoadingSave(false);
                } else {
                  // ToastAndroid.show(
                  //   "No tienes los accesos necesarios",
                  //   ToastAndroid.SHORT
                  // );
                  // setLoadingSave(false);
                }
              }
            });
        } else {
          // ToastAndroid.show(
          //   "No se encontró la firma necesaria",
          //   ToastAndroid.SHORT
          // );
          // setLoadingSave(false);
        }
      })
      .catch(() => {
        // Alert.alert(
        //   "Error al firmar el documento",
        //   "Intenta firmar el documento mas tarde o contacta al equipo de soporte"
        // );
        // setLoadingSave(false);
      });
  },
}));
