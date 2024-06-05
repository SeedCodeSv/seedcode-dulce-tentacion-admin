import { View, Text } from "@react-pdf/renderer";
import { styles } from "./style";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";

function other_documents() {
  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <Text style={[styles.subtitle, { marginTop: 5, fontSize: 6.5 }]}>
        OTROS DOCUMENTOS ASOCIADOS
      </Text>
      <Table
        style={{ marginTop: 10 }}
        tdStyle={{
          padding: "2px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TH>
          <TD
            style={[
              styles.subtitleNormal,
              {
                textAlign: "center",
                fontSize: 6.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            Identificación del documento
          </TD>
          <TD
            style={[
              styles.subtitleNormal,
              {
                textAlign: "center",
                fontSize: 6.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            Descripción
          </TD>
        </TH>
        <TR>
          <TD
            style={{
              textAlign: "center",
              fontSize: 8,
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
              fontSize: 8,
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

export default other_documents;
