import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import QR from "../assets/codigo-qr-1024x1024-1.jpg";
import Emisor from "../components/invoice/Emisor";
import Receptor from "../components/invoice/Receptor";
import TableProducts from "../components/invoice/TableProducts";
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={{ fontSize: 10 }}>
            DOCUMENTO DE CONSULTA PORTAL OPERATIVO
          </Text>
          <Text style={{ fontSize: 10 }}>DOCUMENTO TRIBUTARIO ELECTRÓNICO</Text>
        </View>
        <View
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <Image src={QR} style={{ width: 75, height: 75 }} />
          <Image src={QR} style={{ width: 75, height: 75 }} />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={{ fontSize: 8 }}>
            Código de Generación: 417D5232-92E2-41FE-8F36-96BAB25BBAFA
          </Text>
          <Text style={{ fontSize: 8 }}>
            Número de Control: DTE-01-M001P001-000000000000973
          </Text>
          <Text style={{ fontSize: 8 }}>
            Sello de Recepción: 202401297779B58149D5883E13D8D9CDFAEDCGAS
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Text style={{ fontSize: 8, textAlign: "right" }}>
            Modelo de Facturación: Previo
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>
            Tipo de Transmisión: Normal
          </Text>
          <Text style={{ fontSize: 8, textAlign: "right" }}>
            Fecha y Hora de Generación: 19/03/2024 15:39:07
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: 15,
          gap: 10,
          height: "auto",
        }}
      >
        <Emisor />
        <Receptor />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginTop: 15,
          gap: 10,
          height: "auto",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 8,
            fontWeight: "semibold",
          }}
        >
          VENTA A CUENTA DE TERCEROS
        </Text>
        <View
          style={{
            width: "100%",
            border: "1px solid #000",
            borderRadius: 10,
            padding: 10,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <View style={{ width: "50%" }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 7,
                fontWeight: "semibold",
              }}
            >
              NIT:
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                textAlign: "left",
                fontSize: 7,
                fontWeight: "semibold",
                width: 100,
              }}
            >
              Nombre, denominación o razón social:
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 8,
          fontWeight: "semibold",
          marginTop: 5,
        }}
      >
        OTROS DOCUMENTOS ASOCIADOS
      </Text>

      <Table style={{ width: "100%", marginTop: 5 }}>
        <TH
          style={{
            backgroundColor: "#fff",
            color: "#000",
            textAlign: "center",
          }}
        >
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            Tipo de Documento
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            N° de Documento
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            Fecha de Documento
          </TD>
        </TH>
        <TR>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: "semibold",
              justifyContent: "center",
              paddingVertical: 3,
            }}
          >
            -
          </TD>
        </TR>
      </Table>
      <View style={{ width: "100%", marginTop: 5 }}>
        <TableProducts />
      </View>
    </Page>
  </Document>
);
