import { TD, TR } from "@ag-media/react-pdf-table";
import { StyleSheet } from "@react-pdf/renderer";
export default function TableFooter() {
  const styles = StyleSheet.create({
    td_without_border: {
      fontSize: 7,
      padding: 3,
      textAlign: "center",
      justifyContent: "center",
      border: "1px solid #fff",
    },
    td_with_border: {
      fontSize: 7,
      padding: 3,
      textAlign: "center",
      justifyContent: "center",
      border: "1px solid #000",
    },
  });
  return (
    <>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.334} style={styles.td_with_border}>
          $0.35
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.00
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Sumatoria de ventas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Monto global Desc., Rebajas y otros a ventas no sujetas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Monto global Desc., Rebajas y otros a ventas Exentas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Monto global Desc., Rebajas y otros a ventas gravadas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Sub-Total:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Impuesto al Valor Agregado 13%:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          IVA Retenido:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Retención Renta:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Monto Total de la Operación:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Total Otros Montos No Afectos:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD
          weighting={0.566}
          style={{ ...styles.td_with_border, justifyContent: "flex-end" }}
        >
          Total a Pagar:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.35
        </TD>
      </TR>
    </>
  );
}
