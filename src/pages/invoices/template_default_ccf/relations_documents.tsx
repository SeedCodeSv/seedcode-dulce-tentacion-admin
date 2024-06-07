import { View, Text } from "@react-pdf/renderer";
import { styles } from "./style";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";

function relations_documents() {
  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <Text style={[styles.subtitle, { marginTop: 5, fontSize: 6.5 }]}>
      DOCUMENTOS RELACIONADOS
      </Text>
      <Table
      style={{marginTop: 5}}
        tdStyle={{
          padding: "2px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TH>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Tipo de Documento
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            N° de Documento
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Fecha de Documento

          </TD>
        </TH>
        <TR>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: "center",
              fontSize: 6.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </TD>
        </TR>
      </Table>
    </View>
  );
}

export default relations_documents;
