import { View, Text, Image } from "@react-pdf/renderer";
import { styles } from "./style";
import { CreditoFiscalJSON } from "../../../types/DTE/credito_fiscal.types";
import { MH_QUERY } from "../../../utils/constants";

interface ICCFProps {
  dte: CreditoFiscalJSON;
}

function header({ dte }: ICCFProps) {
  const generateURLMH = (
    ambiente: string,
    codegen: string,
    fechaEmi: string
  ) => {
    return `${MH_QUERY}?ambiente=${ambiente}&codGen=${codegen}&fechaEmi=${fechaEmi}`;
  };

  return (
    <View
      fixed
      render={({ pageNumber }) => (
        <>
          <View
            style={{
              textAlign: "center",
              paddingTop: pageNumber === 1 ? 0 : 30,
            }}
          >
            <Text
              style={{
                fontSize: 7,
                fontWeight: "semibold",
                marginTop: 2,
              }}
            >
              DOCUMENTO DE CONSULTA PORTAL OPERATIVO
            </Text>
            <Text
              style={{
                fontSize: 7,
                fontWeight: "semibold",
                marginTop: 2,
              }}
            >
              DOCUMENTO TRIBUTARIO ELECTRÓNICO
            </Text>
            <Text
              style={{
                fontSize: 7,
                fontWeight: "semibold",
                marginTop: 2,
              }}
            >
              COMPROBANTE DE CRÉDITO FISCAL
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              marginTop: 10,
              // paddingVertical: pageNumber === 1 ? 0 : 30,
              paddingBottom: pageNumber === 1 ? 10 : 20,
            }}
          >
            <View style={{ width: "50%" }}>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Código de Generación:
                </Text>
                <Text style={{ fontSize: 6 }}>
                  {dte.identificacion.codigoGeneracion}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Número de Control:
                </Text>
                <Text style={{ fontSize: 6 }}>
                  {dte.identificacion.numeroControl}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Sello de Recepción:
                </Text>
                <Text style={{ fontSize: 6 }}>
                  {dte.respuestaMH.selloRecibido}
                </Text>
              </View>
            </View>
            {pageNumber === 1 && (
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  generateURLMH(
                    dte.identificacion.ambiente,
                    dte.identificacion.codigoGeneracion,
                    dte.identificacion.fecEmi
                  )
                )}`}
                style={{ height: 50, width: 55 }}
              ></Image>
            )}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "50%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Modelo de Facturación:
                </Text>
                <Text style={{ fontSize: 6 }}>Previo</Text>
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Tipo de Transmisión:
                </Text>
                <Text style={{ fontSize: 6 }}>Normal</Text>
              </View>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={[styles.textBold, { fontSize: 6 }]}>
                  Fecha y Hora de Generación:
                </Text>
                <Text style={{ fontSize: 6, fontWeight: 500 }}>
                  {dte.identificacion.fecEmi} {dte.identificacion.horEmi}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    />
  );
}

export default header;
