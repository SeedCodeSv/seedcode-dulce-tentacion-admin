import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import Emisor from '../components/credito_invoice/EmisorCredito';
import Receptor from '../components/credito_invoice/ReceptorCredito';
import TableProductsCredito from '../components/credito_invoice/TableProductsCredito';
import { DteJson } from '../types/DTE/DTE.types';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface Props {
  DTE: DteJson;
  sello: string;
  MHUrl: string;
}

// Create Document Component
export const CreditoInvoice = (props: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 10 }}>DOCUMENTO DE CONSULTA PORTAL OPERATIVO</Text>
          <Text style={{ fontSize: 10 }}>DOCUMENTO TRIBUTARIO ELECTRÓNICO</Text>
        </View>
        <View
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${props.MHUrl}`}
            style={{ width: 75, height: 75 }}
          />
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wwww.seedcodesv.com`}
            style={{ width: 75, height: 75 }}
          />
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <View style={{ width: '50%' }}>
          <Text style={{ fontSize: 8 }}>
            Código de Generación: {props.DTE.dteJson.identificacion.codigoGeneracion}
          </Text>
          <Text style={{ fontSize: 8 }}>
            Número de Control: {props.DTE.dteJson.identificacion.numeroControl}
          </Text>
          <Text style={{ fontSize: 8 }}>Sello de Recepción: {props.sello}</Text>
        </View>
        <View
          style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Text style={{ fontSize: 8, textAlign: 'right' }}>Modelo de Facturación: Previo</Text>
          <Text style={{ fontSize: 8, textAlign: 'right' }}>Tipo de Transmisión: Normal</Text>
          <Text style={{ fontSize: 8, textAlign: 'right' }}>
            Fecha y Hora de Generación: {props.DTE.dteJson.identificacion.fecEmi}{' '}
            {props.DTE.dteJson.identificacion.horEmi}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          marginTop: 15,
          gap: 10,
          height: 'auto',
        }}
      >
        <Emisor DTE={props.DTE} />
        <Receptor DTE={props.DTE} />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: 15,
          gap: 10,
          height: 'auto',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 8,
            fontWeight: 'semibold',
          }}
        >
          VENTA A CUENTA DE TERCEROS
        </Text>
        <View
          style={{
            width: '100%',
            border: '1px solid #000',
            borderRadius: 10,
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
          }}
        >
          <View style={{ width: '50%' }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 7,
                fontWeight: 'semibold',
              }}
            >
              NIT:
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 7,
                fontWeight: 'semibold',
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
          textAlign: 'center',
          fontSize: 8,
          fontWeight: 'semibold',
          marginTop: 5,
        }}
      >
        OTROS DOCUMENTOS ASOCIADOS
      </Text>

      <Table style={{ width: '100%', marginTop: 5 }}>
        <TH
          style={{
            backgroundColor: '#fff',
            color: '#000',
            textAlign: 'center',
          }}
        >
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            Tipo de Documento
          </TD>
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            N° de Documento
          </TD>
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            Fecha de Documento
          </TD>
        </TH>
        <TR>
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            -
          </TD>
          <TD
            style={{
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'semibold',
              justifyContent: 'center',
              paddingVertical: 3,
            }}
          >
            -
          </TD>
        </TR>
      </Table>
      <View style={{ width: '100%', marginTop: 5 }}>
        <TableProductsCredito DTE={props.DTE} />
      </View>
    </Page>
  </Document>
);
