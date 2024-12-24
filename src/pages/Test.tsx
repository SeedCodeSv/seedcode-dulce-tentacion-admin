import Layout from "../layout/Layout";
import JSONDTE from "../assets/json/20F6B3E1-4AA4-4A93-A169-7F718E9987E9.json";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import autoTable, { RowInput } from "jspdf-autotable";
// import QR from "../assets/codigo-qr-1024x1024-1.jpg";
// import { formatCurrency } from "../utils/dte";
import { Button } from "@nextui-org/react";
import LOGO from "../assets/MADNESS.png";
import { jsPDF } from "jspdf";
import "svg2pdf.js";

const libroDiario = {
  partidas: [
    {
      numero: 1,
      fecha: "24-12-2024",
      cuenta: "1010",
      concepto: "Compra de mercancía",
      debe: 1000,
      haber: 0,
      conceptoPartida: "Compra"
    },
    {
      numero: 2,
      fecha: "24-12-2024",
      cuenta: "2010",
      concepto: "Pago a proveedores",
      debe: 0,
      haber: 1000,
      conceptoPartida: "Pago"
    },
    {
      numero: 3,
      fecha: "24-12-2024",
      cuenta: "1100",
      concepto: "Venta de producto",
      debe: 0,
      haber: 2000,
      conceptoPartida: "Venta"
    },
    {
      numero: 4,
      fecha: "24-12-2024",
      cuenta: "5000",
      concepto: "Gastos de oficina",
      debe: 500,
      haber: 0,
      conceptoPartida: "Gasto"
    },
    {
      numero: 5,
      fecha: "24-12-2024",
      cuenta: "1200",
      concepto: "Devolución de cliente",
      debe: 100,
      haber: 0,
      conceptoPartida: "Devolución"
    }
  ]
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

    const lastElementHeight = distTel + 15;

    const finalY = lastElementHeight + 1;

    const headers = [
      "#",
      "FECHA",
      "CUENTA",
      "CONCEPTO DE LA TRANSACCIÓN",
      "CONCEPTO",
      "DEBE",
      "HABER",
    ];

    const array_object: unknown[] = [];
    libroDiario.partidas.map((item) => {
      array_object.push(
        Object.values({
          qty: item.numero,
          desc: item.fecha,
          price: item.cuenta,
          concepto: item.concepto,
          descu: item.concepto,
          other: item.debe,
          vtSuj: item.haber,
        })
      );
    });

    autoTable(doc, {
      theme: "plain",
      startY: finalY,
      margin: {
        right: 5,
        left: 5,
        bottom: doc.internal.pages.length > 1 ? 10 : 55,
        top: 50,
      },
      head: [headers],
      body: (array_object as unknown) as RowInput[],
      columnStyles: {
        0: { cellWidth: 15, halign: "center", cellPadding: 2 },
        1: { cellWidth: 25, cellPadding: 2 },
        2: {
          cellWidth: 20,
          cellPadding: 2,
        },
        3: {
          cellWidth: 50,
          cellPadding: 2,
        },
        4: {
          cellWidth: 50,
          cellPadding: 2,
        },
        5: {
          cellWidth: 20,
          cellPadding: 2,
        },
        6: {
          cellWidth: 20,
          cellPadding: 2,
        }
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5,
      },
      bodyStyles: {
        fontSize: 7,
      },
    });

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
        (i > 1 ? 50 : finalYFirtsPage + 5) -
        margin +
        (i > 1 ? 0 : pageCount > 1 ? 50 : 0);

      const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor("#ced4da");

      doc.roundedRect(
        margin,
        i > 1 ? 50 : 45,
        15,
        rectHeight - 50,
        0,
        0,
        "S"
      );
      doc.roundedRect(
        40,
        i > 1 ? 50 : 45,
        25,
        rectHeight - 50,
        0,
        0,
        "S"
      );
      doc.roundedRect(
        65,
        i > 1 ? 50 : 45,
        45,
        rectHeight - 50,
        0,
        0,
        "S"
      );
      doc.roundedRect(
        160,
        i > 1 ? 50 : 45,
        20,
        rectHeight - 50,
        0,
        0,
        "S"
      );
      doc.roundedRect(
        200,
        i > 1 ? 50 : 45,
        20,
        rectHeight - 50,
        0,
        0,
        "S"
      );


      doc.setFillColor("#ced4da");

      //header
      doc.roundedRect(
        margin,
        i !== 1 ? 50 : 40,
        rectWidth,
        8,
        radius,
        radius,
        "FD"
      );
      autoTable(doc, {
        startY: i !== 1 ? 50 : 40,
        theme: "plain",
        head: [headers],
        columnStyles: {
          0: { cellWidth: 15, halign: "center", cellPadding: 2 },
          1: { cellWidth: 65, cellPadding: 2 },
          2: {
            cellWidth: 20,
            cellPadding: 2,
          },
          3: {
            cellWidth: 20,
            cellPadding: 2,
          },
          4: {
            cellWidth: 20,
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
        doc.line(
          125,
          doc.internal.pageSize.height - 48,
          125,
          doc.internal.pageSize.height - 5
        );
      }

      // }
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

export const makeEmisor = (doc: jsPDF, y = 45) => {
  const fields = [
    {
      label: "Nombre o razón social:",
      value: "HERNANDEZ MARQUEZ, JOSE MANUEL",
    },
    {
      label: "Actividad económica:",
      value:
        "Otras actividades de tegnologia de informacion y servicios de computadora",
    },
    { label: "NIT:", value: "03160902981010" },
    { label: "NRC:", value: "3165298" },
    {
      label: "Dirección:",
      value: "Avenida santa lucia Block K casa #5, SONZACATE, Sonsonate",
    },
    { label: "Número de teléfono:", value: "70245680" },
    { label: "Correo electrónico:", value: "seedcodesv@gmail.com" },
  ];

  let yPosition = y;
  let totalHeight = 0;

  fields.forEach((field) => {
    returnBoldText(doc, field.label, 10, yPosition, "left");

    const splitText = doc.splitTextToSize(
      field.value,
      75 - getWidthText(doc, field.label)
    );

    doc.text(splitText, getWidthText(doc, field.label), yPosition);

    const height = getHeightText(doc, splitText);

    yPosition += height + 1;
    totalHeight += height + 1;
  });

  return { totalHeight };
};

export const makeEmisorHeight = (doc: jsPDF, y = 45, x = 10) => {
  const fields = [
    {
      label: "Nombre o razón social:",
      value: "HERNANDEZ MARQUEZ, JOSE MANUEL",
    },
    {
      label: "Actividad económica:",
      value:
        "Otras actividades de tegnologia de informacion y servicios de computadora",
    },
    { label: "NIT:", value: "03160902981010" },
    { label: "NRC:", value: "3165298" },
    {
      label: "Dirección:",
      value: "Avenida santa lucia Block K casa #5, SONZACATE, Sonsonate",
    },
    { label: "Número de teléfono:", value: "70245680" },
    { label: "Correo electrónico:", value: "seedcodesv@gmail.com" },
  ];
  let totalHeight = 0;

  fields.forEach((field) => {
    const splitText = doc.splitTextToSize(
      field.value,
      100 - getWidthText(doc, field.label) + x
    );
    const height = getHeightText(doc, splitText);
    totalHeight += height + 1;
  });

  const showDoc = () => {
    let yP = y;

    fields.forEach((field) => {
      returnBoldText(doc, field.label, x, yP, "left");

      const splitText = doc.splitTextToSize(
        field.value,
        100 - getWidthText(doc, field.label) + x
      );

      doc.text(splitText, getWidthText(doc, field.label), yP);

      const height = getHeightText(doc, splitText);

      yP += height + 1;
    });
  };

  return { totalHeight, showDoc };
};

export const makeReceptor = (doc: jsPDF) => {
  const fields = [
    {
      label: "Nombre o razón social:",
      value: "HERNANDEZ MARQUEZ, JOSE MANUEL",
    },
    {
      label: "Actividad económica:",
      value:
        "Otras actividades de tegnologia de informacion y servicios de computadora",
    },
    { label: "NIT:", value: "03160902981010" },
    { label: "NRC:", value: "3165298" },
    {
      label: "Dirección:",
      value: "Avenida santa lucia Block K casa #5, SONZACATE, Sonsonate",
    },
    { label: "Número de teléfono:", value: "70245680" },
    { label: "Correo electrónico:", value: "seedcodesv@gmail.com" },
  ];

  let yPosition = 45;
  const xPosition = 105;
  let totalHeight = 0;

  fields.forEach((field) => {
    returnBoldText(doc, field.label, xPosition, yPosition, "left");

    const splitText = doc.splitTextToSize(
      field.value,
      100 - getWidthText(doc, field.label)
    );

    doc.text(
      splitText,
      xPosition + getWidthText(doc, field.label, 3),
      yPosition
    );

    const height = getHeightText(doc, splitText);

    yPosition += height + 1;
    totalHeight += height + 1;
  });

  return { totalHeight };
};

export const makeHeader = (doc: jsPDF, lastTop: number) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  returnBoldText(doc, "Código de Generación:", 10, lastTop + 5);
  doc.text(
    "4DF77BC3-6AA7-483A-8B72-28D558D8880A",
    getWidthText(doc, "Código de Generación:"),
    lastTop + 5,
    {
      align: "left",
    }
  );
  returnBoldText(doc, "Número de Control:", 10, lastTop + 8);
  doc.text(
    "DTE-03-M002P001-000000000002058",
    getWidthText(doc, "Número de Control:"),
    lastTop + 8,
    {
      align: "left",
    }
  );
  returnBoldText(doc, "Sello de Recepción:", 10, lastTop + 11);
  doc.text(
    "20240772C711AFD44BA8AF3652B91539C584LEHJ",
    getWidthText(doc, "Sello de Recepción:"),
    lastTop + 11,
    {
      align: "left",
    }
  );
  returnBoldText(
    doc,
    "Modelo de Facturación:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "Previo"),
    lastTop + 5,
    "right"
  );
  doc.text("Previo", doc.internal.pageSize.getWidth() - 10, lastTop + 5, {
    align: "right",
  });
  returnBoldText(
    doc,
    "Tipo de Transmisión:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "Normal"),
    lastTop + 8,
    "right"
  );
  doc.text("Normal", doc.internal.pageSize.getWidth() - 10, lastTop + 8, {
    align: "right",
  });
  returnBoldText(
    doc,
    "Fecha y Hora de Generación:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "2024-06-08 09:15:09"),
    lastTop + 11,
    "right"
  );
  doc.text(
    "2024-06-08 09:15:09",
    doc.internal.pageSize.getWidth() - 10,
    lastTop + 11,
    {
      align: "right",
    }
  );
};

// #region FooterTable
export const footerDocument = (doc: jsPDF, rectMargin: number) => {
  const { resumen } = JSONDTE;
  doc.text(`${resumen.totalLetras}`, 10, rectMargin + 4);
  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalNoSuj}`, 145, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalExenta}`, 165, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalGravada}`, 185, rectMargin + 4);
  doc.setFontSize(6);
  returnBoldText(doc, "Responsable por parte del emisor:", 10, rectMargin + 15);

  returnBoldText(doc, "N° de Documento:", 10, rectMargin + 25);
  returnBoldText(doc, "Observaciones:", 10, rectMargin + 35);
  returnBoldText(
    doc,
    "Responsable por parte del receptor:",
    65,
    rectMargin + 15
  );

  returnBoldText(doc, "N° de Documento:", 65, rectMargin + 25);

  doc.text("Suma Total de Operaciones:", 127, rectMargin + 10);
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas no sujetas: ",
    127,
    rectMargin + 13
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas exentas:",
    127,
    rectMargin + 16
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas gravadas:",
    127,
    rectMargin + 19
  );
  doc.text("IVA 13%: ", 127, rectMargin + 22);
  doc.text("Sub-Total: ", 127, rectMargin + 25);
  doc.text("Monto Total de la Operación: ", 127, rectMargin + 28);
  doc.text("Total Otros montos no afectos: ", 127, rectMargin + 31);
  doc.text("Total a Pagar: ", 127, rectMargin + 34);

  for (let i = 0; i < 9; i++) {
    doc.text("$", 185, rectMargin + i * 3 + 10);
  }

  const totals = [
    resumen.descuGravada.toFixed(2),
    resumen.descuNoSuj.toFixed(2),
    resumen.descuExenta.toFixed(2),
    resumen.descuGravada.toFixed(2),
    resumen.tributos
      .map((tr) => Number(tr.valor))
      .reduce((a, b) => a + b)
      .toFixed(2),
    resumen.subTotal.toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    "0.00",
    resumen.totalPagar.toFixed(2),
  ];

  totals.forEach((total, index) => {
    doc.text(total, 202.5, rectMargin + index * 3 + 10, {
      align: "right",
    });
  });
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

export const returnAddress = (depP: string, munP: string) => {
  const catalogos_service = new SeedcodeCatalogosMhService();
  const depF = catalogos_service
    .get012Departamento()
    .find((dep) => dep.codigo === depP);

  const munF = catalogos_service
    .get013Municipio(depP)
    ?.find((mun) => mun.codigo === munP);

  return `${munF?.valores ?? ""}, ${depF?.valores ?? ""}`;
};
