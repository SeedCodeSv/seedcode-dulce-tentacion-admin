import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { StyleSheet } from "@react-pdf/renderer";

export const TableOrder = () => {
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
        <TD weighting={0.1} style={styles.th_content}>1</TD>
      </TH>
      <TR>
        <TD weighting={0.1}>2</TD>
      </TR>
    </Table>
  );
};
