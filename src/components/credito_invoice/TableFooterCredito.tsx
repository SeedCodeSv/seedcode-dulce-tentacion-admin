import { TD, TR } from '@ag-media/react-pdf-table';
import { StyleSheet } from '@react-pdf/renderer';
import { DteJson } from '../../types/DTE/DTE.types';
import { formatCurrency } from '../../utils/dte';

interface Props {
  DTE: DteJson;
}
export default function TableFooterCredito({ DTE }: Props) {
  const styles = StyleSheet.create({
    td_without_border: {
      fontSize: 7,
      padding: 3,
      textAlign: 'center',
      justifyContent: 'center',
      border: '1px solid #fff',
    },
    td_with_border: {
      fontSize: 7,
      padding: 3,
      textAlign: 'center',
      justifyContent: 'center',
      border: '1px solid #000',
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
          Suma de ventas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.totalNoSuj))}
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.totalExenta))}
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.totalGravada))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Sumatoria de ventas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.subTotalVentas))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Monto global Desc., Rebajas y otros a ventas no sujetas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.descuNoSuj))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Monto global Desc., Rebajas y otros a ventas Exentas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.descuExenta))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Monto global Desc., Rebajas y otros a ventas gravadas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.descuGravada))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Sub-Total:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.subTotal))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Impuesto al Valor Agregado 13%:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $0.13
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          IVA Retenido:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.ivaRete1))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Retención Renta:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.reteRenta))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Monto Total de la Operación:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.montoTotalOperacion))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Total Otros Montos No Afectos:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.totalNoGravado))}
        </TD>
      </TR>
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.566} style={{ ...styles.td_with_border, justifyContent: 'flex-end' }}>
          Total a Pagar:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          {formatCurrency(Number(DTE.dteJson.resumen.totalPagar))}
        </TD>
      </TR>
    </>
  );
}
