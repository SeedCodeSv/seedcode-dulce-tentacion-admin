import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { getElSalvadorDateTime } from "../../utils/dates"
import { formatCurrency } from "../../utils/dte";
interface Items {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface Props {
  dark: string;
  primary: string;
  items: Items[];
  supplier: string;
  total: number;
}
function PurchaseOrders({ dark, primary, items, supplier, total }: Props) {
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    th_content: {
      fontSize: 12,
      fontWeight: "semibold",
      justifyContent: "center",
      textAlign: "center",
      padding: 3,
      color: primary,
      height: 30,
    },
    td_content: {
      height: 30,
      fontSize: 12,
      padding: 3,
      textAlign: "center",
      justifyContent: "center",
    },
  });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>Orden de compra</Text>
        <View style={{ marginTop: "6px" }}>
          <Text style={{ fontSize: 14, fontWeight: "semibold" }}>
            Proveedor: {supplier}
          </Text>
        </View>
        <View style={{ marginTop: "6px" }}>
          <Text style={{ fontSize: 14, fontWeight: "semibold" }}>
            Fecha: {getElSalvadorDateTime().fecEmi}
          </Text>
        </View>
        <View style={{ marginTop: "6px" }}>
          <Text style={{ fontSize: 14, fontWeight: "semibold" }}>
            Hora: {getElSalvadorDateTime().horEmi}
          </Text>
        </View>
        <View style={{ marginTop: "6px" }}>
          <Table>
            <TH style={{ backgroundColor: dark }}>
              <TD weighting={0.1} style={styles.th_content}>
                No.
              </TD>
              <TD weighting={0.45} style={styles.th_content}>
                Producto
              </TD>
              <TD weighting={0.15} style={styles.th_content}>
                Cantidad
              </TD>
              <TD weighting={0.15} style={styles.th_content}>
                Precio unitario
              </TD>
              <TD weighting={0.15} style={styles.th_content}>
                Sub-total
              </TD>
            </TH>
            {items.map((item, index) => (
              <TR key={index}>
                <TD weighting={0.1} style={styles.td_content}>
                  {index + 1}
                </TD>
                <TD weighting={0.45} style={styles.td_content}>
                  {item.name}
                </TD>
                <TD weighting={0.15} style={styles.td_content}>
                  {item.qty}
                </TD>
                <TD weighting={0.15} style={styles.td_content}>
                  {formatCurrency(item.price)}
                </TD>
                <TD weighting={0.15} style={styles.td_content}>
                  {formatCurrency(item.total)}
                </TD>
              </TR>
            ))}
          </Table>
        </View>
        <View
          style={{
            marginTop: "6px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "semibold" }}>Total:</Text>
          <Text style={{ fontSize: 14, fontWeight: "semibold" }}>
            {formatCurrency(total)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default PurchaseOrders;
