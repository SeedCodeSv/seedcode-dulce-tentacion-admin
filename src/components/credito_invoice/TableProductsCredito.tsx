import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import TableFooterCredito from './TableFooterCredito';
import { StyleSheet } from '@react-pdf/renderer';
import { DteJson } from '../../types/DTE/DTE.types';

interface Props {
  DTE: DteJson;
}

export default function TableProductsCredito({ DTE }: Props) {
  const styles = StyleSheet.create({
    th_content: {
      fontSize: 7,
      fontWeight: 'semibold',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 3,
    },
    td_content: {
      fontSize: 7,
      padding: 3,
      textAlign: 'center',
      justifyContent: 'center',
    },
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

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
      {DTE.dteJson.cuerpoDocumento.map((cuerpo, index) => (
        <TR>
          <TD weighting={0.1} style={styles.td_content}>
            {index + 1}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {cuerpo.cantidad}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {cuerpo.uniMedida}
          </TD>
          <TD weighting={0.3} style={{ ...styles.td_content }}>
            {cuerpo.descripcion}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(cuerpo.precioUni))}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(0))}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(cuerpo.montoDescu))}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(cuerpo.ventaNoSuj))}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(cuerpo.ventaExenta))}
          </TD>
          <TD weighting={0.1} style={styles.td_content}>
            {formatCurrency(Number(cuerpo.ventaGravada))}
          </TD>
        </TR>
      ))}
      <TableFooterCredito DTE={DTE} />
    </Table>
  );
}
