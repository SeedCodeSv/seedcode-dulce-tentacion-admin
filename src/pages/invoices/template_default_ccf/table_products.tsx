import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { styles } from "./style";

function table_products({ items }: { items: number }) {
  const formatName = (text: string) => {
    const text_length = text.length;
    if (text_length > 30) {
      return text.substring(0, 100) + "...";
    } else {
      return text;
    }
  };
  return (
    <Table
      tdStyle={{
        padding: "2px",
        paddingVertical: 4,
        display: "flex",
        flexDirection: "column",
      }}
      style={{ paddingBottom: 10, marginTop: 10 }}
    >
      <TH
        fixed
        style={{
          fontSize: 10,
        }}
      >
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: 40
          }}
        >
          No.
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: 40
          }}
        >
          Cantidad
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: 40
          }}
        >
          Unidad
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: 200
          }}
        >
          Descripción
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Precio Unitario
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Descuento por ítem
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Otros montos no afectos
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Ventas No Sujetas
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Ventas Exentas
        </TD>
        <TD
          style={{
            fontSize: 7,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Ventas Gravadas
        </TD>
      </TH>
      {Array.from({ length: items }).map((_, i) => (
        <TR key={i} style={{ fontSize: 10, height: 40 }}>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            Juan
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human.lastNam
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human
          </TD>
          <TD
            weighting={0.3}
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            {formatName(
              `Productos y Servicios muy largos de nombre y descripción con mas de dos lineas de descripción y dos lineas de descripción`
            )}
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human.phoneNumber
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            Juan
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human.lastNam
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human.countr
          </TD>
          <TD
            style={{
              fontSize: 7,
              textAlign: "left",
            }}
          >
            human.phoneNumber
          </TD>
        </TR>
      ))}
      <TR>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.1} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_without_border}></TD>
        <TD weighting={0.3} style={styles.td_with_border}>
          Suma de ventas:
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $100
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $100
        </TD>
        <TD weighting={0.1} style={styles.td_with_border}>
          $100
        </TD>
      </TR>
    </Table>
  );
}

export default table_products;
