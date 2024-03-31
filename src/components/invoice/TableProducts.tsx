import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import TableFooter from "./TableFooter";
import { StyleSheet } from "@react-pdf/renderer";

export default function TableProducts() {
  const styles = StyleSheet.create({
    th_content: {
      fontSize: 7,
      fontWeight: "semibold",
      justifyContent: "center",
      textAlign: "center",
      padding: 3,
    },
    td_content: {
      fontSize: 7,
      padding: 3,
      textAlign: "center",
      justifyContent: "center",
    },
  });

  return (
    <Table>
      <TH>
        <TD weighting={0.1} style={styles.th_content}>
          No.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Cant.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Unidad M.
        </TD>
        <TD weighting={0.3} style={styles.th_content}>
          Descripción
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Precio un.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Otros montos.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Descu.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Ventas no suj.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Ventas Exen.
        </TD>
        <TD weighting={0.1} style={styles.th_content}>
          Ventas Grav.
        </TD>
      </TH>
      <TR>
        <TD weighting={0.1} style={styles.td_content}>
          1
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          10
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          26
        </TD>
        <TD weighting={0.3} style={styles.td_content}>
          CHOCOLATINA SALUD CARTÓN 236 ML
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.35
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_content}>
          $0.35
        </TD>
      </TR>
      <TableFooter />
    </Table>
  );
}
