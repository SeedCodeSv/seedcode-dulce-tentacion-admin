import Layout from "../layout/Layout";
import JSONDTE from "../assets/json/20F6B3E1-4AA4-4A93-A169-7F718E9987E9.json";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import autoTable from "jspdf-autotable";
// import QR from "../assets/codigo-qr-1024x1024-1.jpg";
// import { formatCurrency } from "../utils/dte";
import { Button } from "@heroui/react";
import LOGO from "../assets/MADNESS.png";
import { jsPDF } from "jspdf";
import "svg2pdf.js";

const libroDiario = {
  partidas: [
    {
      numero: 1,
      fecha: '24-12-2024',
      conceptoPartida: 'Compra',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 2,
      fecha: '24-12-2024',
      conceptoPartida: 'Pago a proveedores',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 3,
      fecha: '24-12-2024',
      conceptoPartida: 'Venta de producto',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 4,
      fecha: '24-12-2024',
      conceptoPartida: 'Gastos de oficina',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 5,
      fecha: '24-12-2024',
      conceptoPartida: 'Devolución de cliente',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 6,
      fecha: '24-12-2024',
      conceptoPartida: 'Devolución de cliente',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 7,
      fecha: '24-12-2024',
      conceptoPartida: 'Devolución de cliente',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 8,
      fecha: '24-12-2024',
      conceptoPartida: 'Devolución de cliente',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
    {
      numero: 9,
      fecha: '24-12-2024',
      conceptoPartida: 'Devolución de cliente',
      movimientos: [
        {
          cuenta: '1010',
          concepto: 'Compra de mercancía',
          debe: 1000,
          haber: 0,
        },
        {
          cuenta: '1010',
          concepto: 'Compra',
          debe: 0,
          haber: 1000,
        },
      ],
    },
  ],
};



// interface ILibroDiario {
//   numero: number;
//   fecha: string;
//   cuenta: string;
//   concepto: string;
//   debe: number;
//   haber: number;
//   conceptoPartida: string;
// }

function Test() {
  const makePDF = () => {
    const doc = new jsPDF();

    const finalYFirtsPage = 0;

    doc.addImage(LOGO, "PNG", 5, 20, 40, 10, "FAST", "FAST");
    doc.setFontSize(7);
    const name = doc.splitTextToSize(`${JSONDTE.emisor.nombre}`, 90);
    const nameH = getHeightText(doc, name);
    returnBoldText(doc, name, 90, 20, "center");
    doc.setFontSize(6);
    const actEco = doc.splitTextToSize(
      `Actividad económica: ${JSONDTE.emisor.descActividad}`,
      75
    );

    const distActEco = nameH + 20.5;

    returnBoldText(doc, actEco, 90, distActEco, "center");
    const address = doc.splitTextToSize(
      `DIRECCION : ${JSONDTE.emisor.direccion.complemento} ${returnAddress(
        JSONDTE.emisor.direccion.departamento,
        JSONDTE.emisor.direccion.municipio
      )}, El Salvador`,
      70
    );

    const act = getHeightText(doc, actEco);

    const distAddress = distActEco + act + 0.5;

    returnBoldText(doc, address, 90, distAddress, "center");

    const tel = getHeightText(doc, address);

    const distTel = distAddress + tel + 0.5;

    returnBoldText(
      doc,
      `TEL: ${JSONDTE.emisor.telefono}`,
      90,
      distTel,
      "center"
    );

    const headers = [
      "#",
      "FECHA",
      "CUENTA",
      "CONCEPTO DE LA TRANSACCIÓN",
      "DEBE",
      "HABER",
    ];

    const drawPartidas = () => {
      let startY = 50;
      const isFirstPage = true;

      libroDiario.partidas.forEach((partida) => {
        let totalDebe = 0;
        let totalHaber = 0;

        partida.movimientos.forEach((movimiento) => {

          totalDebe += movimiento.debe || 0;
          totalHaber += movimiento.haber || 0;

          autoTable(doc, {
            startY,
            body: [
              [
                partida.numero,
                partida.fecha,
                movimiento.cuenta,
                movimiento.concepto || "",
                movimiento.debe || "0.00",
                movimiento.haber || "0.00",
              ],
            ],
            theme: "plain",
            styles: {
              fontSize: 8,
            },
            columnStyles: {
              0: { cellWidth: 20, halign: "left" }, // Número de partida centrado
              1: { cellWidth: 25, halign: "left" }, // Fecha centrada
              2: { cellWidth: 25, halign: "left" },   // Cuenta alineada a la izquierda
              3: { cellWidth: 75, halign: "left" },  // Concepto alineado a la izquierda
              4: { cellWidth: 20, halign: "center" }, // Debe alineado a la derecha
              5: { cellWidth: 20, halign: "center" }, // Haber alineado a la derecha
            },
            didDrawPage: (data) => {
              // Agregar numeración de páginas
              const pageCount = doc.internal.pages.length - 1;
              doc.setFontSize(10);
              doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            },
            didDrawCell: (data) => {
              if (data.row.index === 0 && !isFirstPage) {
                doc.setDrawColor(0, 0, 0);
                doc.setLineDashPattern([], 0);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
              }
            },
          });
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          startY = (doc as any).lastAutoTable.finalY + 1;

        });

        autoTable(doc, {
          startY,
          body: [
            [
              "CONCEPTO:",
              partida.conceptoPartida,
              totalDebe.toFixed(2),
              totalHaber.toFixed(2),
            ],
          ],
          theme: "plain",
          styles: {
            fontSize: 8,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 25, halign: "left" },
            1: { cellWidth: 120, halign: "left" },
            2: { cellWidth: 20, halign: "center" },
            3: { cellWidth: 20, halign: "center" },
          },
        });
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        startY = (doc as any).lastAutoTable.finalY + 3;

        const lineStartX = 10;
        const lineEndX = doc.internal.pageSize.getWidth() - 10;
        const lineY = startY - 2;

        doc.setDrawColor(0, 0, 0);
        doc.setLineDashPattern([3, 3], 0);
        doc.line(lineStartX, lineY, lineEndX, lineY);

        startY += 5; // Espacio después de la línea
      });
    };

    drawPartidas();

    const pageCount = doc.internal.pages.length - 1;

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (i !== 1) {
        headerDoc(doc);
      }
      const margin = 5;
      const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
      const radius = 2;
      const rectHeight =
        doc.internal.pageSize.getHeight() -
        (i > 1 ? 50 : finalYFirtsPage + 5) - margin +
        (i > 1 ? 0 : pageCount > 1 ? 50 : 0);

      const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;

      doc.setDrawColor("#ced4da");
      doc.setFillColor("#ced4da");

      //header
      doc.roundedRect(
        margin,
        i !== 1 ? 50 : 40,
        rectWidth,
        8,
        radius,
        radius,
        "F"
      );
      autoTable(doc, {
        startY: i !== 1 ? 50 : 40,
        theme: "plain",
        head: [headers],
        columnStyles: {
          0: { cellWidth: 20, halign: "center", cellPadding: 2 },
          1: { cellWidth: 25, cellPadding: 2 },
          2: {
            cellWidth: 25,
            cellPadding: 2,
          },
          3: {
            cellWidth: 80,
            cellPadding: 2,
          },
          4: {
            cellWidth: 25,
            cellPadding: 2,
          },
          5: {
            cellWidth: 20,
            cellPadding: 2,
          },
        },
        headStyles: {
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
          fontSize: 5,
          lineWidth: 0,
          lineColor: [255, 255, 255], // Color del borde (blanco, opcional)
        },
        body: [["", "", "", "", "", ""]],
        margin: {
          right: 5,
          left: 5,
        },
      });

      if (pageCount > 1 && i > 1) {
        doc.line(
          5,
          rectMargin,
          doc.internal.pageSize.getWidth() - 5,
          rectMargin
        );
        doc.line(
          5,
          rectMargin + 7,
          doc.internal.pageSize.getWidth() - 5,
          rectMargin + 7
        );
        footerDocument(doc, rectMargin);
        doc.line(125, rectHeight + 50, 125, rectMargin + 7);
      }

      if (pageCount === 1 && 1 === 1) {
        doc.line(
          5,
          rectMargin + 7,
          doc.internal.pageSize.getWidth() - 5,
          rectMargin + 7
        );
        footerDocument(doc, rectMargin);

      }
    }

    doc.save("test.pdf");
  };

  return (
    <Layout title="Test">
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <Button onClick={makePDF}>Limpiar</Button>
        </div>
      </div>
    </Layout>
  );
}

export default Test;

const returnBoldText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  alignContent: "left" | "center" | "right" = "left"
) => {
  doc.setFont("helvetica", "bold");
  doc.text(text, x, y, { align: alignContent });
  doc.setFont("helvetica", "normal");
};

export const getWidthText = (doc: jsPDF, text: string, plus: number = 13) => {
  const dimensions = doc.getTextDimensions(text);
  return dimensions.w + plus;
};

export const getHeightText = (doc: jsPDF, text: string) => {
  const dimensions = doc.getTextDimensions(text);
  return dimensions.h;
};

export const footerDocument = (doc: jsPDF, rectMargin: number) => {
  // Título principal en negrita y tamaño de fuente adecuado
  doc.setFontSize(10);
  doc.setFont('bold');
  doc.text(`TOTAL CARGOS Y ABONOS`, 100, rectMargin + 4);

  // Valores de cargos y abonos
  doc.setFontSize(10);
  doc.text(`$${" "} ${" "} ${5000}`, 165, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${5000}`, 185, rectMargin + 4);

  // Espacio adicional
  rectMargin += 8;

  // Líneas para firmas
  const startY = rectMargin + 10;

  doc.setLineDashPattern([], 0); // Restablecer el estilo de línea a sólido
  doc.setDrawColor(0, 0, 0); // Establecer el color de la línea a negro

  // Primera línea para "Hecho por"
  doc.line(30, startY + 10, 65, startY + 10);
  doc.text('Hecho por', 40, startY + 15);

  // Segunda línea para "Revisado"
  doc.line(90, startY + 10, 125, startY + 10);
  doc.text('Revisado', 100, startY + 15);

  // Tercera línea para "Autorizado"
  doc.line(140, startY + 10, 175, startY + 10);
  doc.text('Autorizado', 150, startY + 15);

  doc.setFontSize(10);
};


// #region Header Table
export const headerDoc = (doc: jsPDF) => {
  doc.addImage(LOGO, "PNG", 5, 20, 40, 10, "FAST", "FAST");
  doc.setFontSize(7);
  const name = doc.splitTextToSize(`${JSONDTE.emisor.nombre}`, 90);
  const nameH = getHeightText(doc, name);
  returnBoldText(doc, name, 90, 20, "center");
  doc.setFontSize(6);
  const actEco = doc.splitTextToSize(
    `Actividad económica: ${JSONDTE.emisor.descActividad}`,
    75
  );

  const distActEco = nameH + 20.5;

  returnBoldText(doc, actEco, 90, distActEco, "center");
  const address = doc.splitTextToSize(
    `DIRECCION : ${JSONDTE.emisor.direccion.complemento} ${returnAddress(
      JSONDTE.emisor.direccion.departamento,
      JSONDTE.emisor.direccion.municipio
    )}, El Salvador`,
    70
  );

  const act = getHeightText(doc, actEco);

  const distAddress = distActEco + act + 0.5;

  returnBoldText(doc, address, 90, distAddress, "center");

  const tel = getHeightText(doc, address);

  const distTel = distAddress + tel + 0.5;

  returnBoldText(doc, `TEL: ${JSONDTE.emisor.telefono}`, 90, distTel, "center");
};

// #region Return Address
const returnAddress = (depP: string, munP: string) => {
  const catalogos_service = new SeedcodeCatalogosMhService();
  const depF = catalogos_service
    .get012Departamento()
    .find((dep) => dep.codigo === depP);

  const munF = catalogos_service
    .get013Municipio(depP)
    ?.find((mun) => mun.codigo === munP);

  return `${munF?.valores ?? ""}, ${depF?.valores ?? ""}`;
};
