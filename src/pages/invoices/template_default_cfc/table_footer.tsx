import { formatCurrency } from "../../../utils/dte";
import { TableCellWithoutBorder, TableRow, TableWithoutBorder } from "../Table";
import { Text } from "@react-pdf/renderer";
import { SVFC_FC_Firmado } from "../../../types/svf_dte/fc.types";

interface ICFCProps {
  dte: SVFC_FC_Firmado;
}

function TableFooter({ dte }: ICFCProps) {
  const { resumen } = dte;

  return (
    <>
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
