import { useMemo } from "react";
import { formatCurrency } from "../../../utils/dte";
import { TableCellWithoutBorder, TableRow, TableWithoutBorder } from "../Table";
import { Text } from "@react-pdf/renderer";
import { SVFC_CF_Firmado } from "../../../types/svf_dte/cf.types";

interface ICCFProps {
  dte: SVFC_CF_Firmado;
}

function TableFooter({ dte }: ICCFProps) {
  const { resumen } = dte;

  const iva13 = useMemo(() => {
    if (resumen.tributos) {
      const tributes = resumen.tributos?.filter((tribute) => {
        return (tribute.codigo = "20");
      });

      const iva = tributes
        .map((tribute) => {
          return Number(tribute.valor);
        })
        .reduce((a, b) => {
          return a + b;
        }, 0);

      return formatCurrency(iva);
    }
    return "$0.00";
  }, [resumen]);

  return (
    <>
      {/* sizes={[7.5, 41, 8, 8, 11, 8.5, 8, 8]} */}
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={27} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Sumatoria de ventas:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.totalNoSuj))}
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.totalExenta))}
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.totalGravada))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        s
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Suma Total de Operaciones:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.subTotalVentas))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Monto global Desc., Rebajas y otros a ventas no sujetas:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(dte.resumen.descuNoSuj))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Monto global Desc., Rebajas y otros a ventas Exentas:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.descuExenta))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Monto global Desc., Rebajas y otros a ventas gravadas:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.descuGravada))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Impuesto al Valor Agregado 13%
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{iva13}</Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>Sub-Total:</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.subTotal))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              IVA Percibido:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.ivaPerci1))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              IVA Retenido:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.ivaRete1))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Retención Renta:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.reteRenta))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Monto Total de la Operación:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.montoTotalOperacion))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={43.5} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Total Otros montos no afectos:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={8} border={{ right: 1, top: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.totalNoGravado))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
      <TableWithoutBorder>
        <TableRow>
          <TableCellWithoutBorder size={7.5}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder size={41} border={{ right: 1 }}>
            <Text style={{ fontSize: 7, textAlign: "right" }}>{""}</Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder
            size={43.5}
            border={{ right: 1, top: 1, bottom: 1 }}
          >
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              Total a Pagar:
            </Text>
          </TableCellWithoutBorder>
          <TableCellWithoutBorder
            size={8}
            border={{ right: 1, top: 1, bottom: 1 }}
          >
            <Text style={{ fontSize: 7, textAlign: "right" }}>
              {formatCurrency(Number(resumen.totalPagar))}
            </Text>
          </TableCellWithoutBorder>
        </TableRow>
      </TableWithoutBorder>
    </>
  );
}

export default TableFooter;
