import Layout from "../layout/Layout";
// import { pdf } from "@react-pdf/renderer";
// import CreditoFiscalTMP from "./invoices/Template2/CFC";
import { Button } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import QR from "../assets/codigo-qr-1024x1024-1.jpg";
import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";
import JSON_DTE from "../assets/json/20F6B3E1-4AA4-4A93-A169-7F718E9987E9.json";
import { formatCurrency } from "../utils/dte";
import axios from "axios";
import { useConfigurationStore } from "../store/perzonalitation.store";

function Test() {
  const { theme } = useContext(ThemeContext);

  const { personalization } = useConfigurationStore();

  // const handleDownloadPDF = async () => {
  //   const blob = await pdf(<CreditoFiscalTMP />).toBlob();

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "invoice.pdf";
  //   link.click();

  //   URL.revokeObjectURL(url);
  // };

  const makePDF = async () => {
    const doc = new jsPDF();

    const data = await axios.get(personalization[0].logo, {
      responseType: "arraybuffer",
    });
    doc.addImage(new Uint8Array(data.data), "PNG", 10, 5, 15, 15);
    doc.addImage(QR, "PNG", 40, 5, 15, 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(
      "DOCUMENTO DE CONSULTA PORTAL OPERATIVO",
      doc.internal.pageSize.getWidth() - 10,
      10,
      { align: "right" }
    );
    doc.text(
      "DOCUMENTO TRIBUTARIO ELECTRÓNICO",
      doc.internal.pageSize.getWidth() - 10,
      13,
      { align: "right" }
    );
    doc.text(
      "COMPROBANTE DE NOTA DE DÉBITO",
      doc.internal.pageSize.getWidth() - 10,
      16,
      { align: "right" }
    );
    makeHeader(doc);
    doc.setDrawColor("#219ebc");
    returnBoldText(doc, "EMISOR", 50, 38, "center");
    doc.line(10, 40, 100, 40);
    returnBoldText(doc, "RECEPTOR", 150, 38, "center");
    doc.line(105, 40, 200, 40);

    const result = makeEmisor(doc);
    makeReceptor(doc);

    doc.setFont("helvetica", "bold");
    returnBoldText(
      doc,
      "OTROS DOCUMENTOS ASOCIADOS",
      100,
      45 + result.totalHeight + 5,
      "center"
    );

    autoTable(doc, {
      head: [["Identifcación del documento", "Descripción"]],
      startY: 45 + result.totalHeight + 8,
      headStyles: {
        fillColor: theme.colors.dark,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        fontStyle: "normal",
        fontSize: 7,
        textColor: theme.colors.primary,
        cellPadding: 1,
        halign: "center",
        cellWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: "auto" },
      },
      bodyStyles: {
        halign: "center",
        fontSize: 7,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        cellPadding: 1,
      },
      body: [["-", "-"]],
    });
    const finalY_Other = ((doc as unknown) as {
      lastAutoTable: { finalY: number };
    }).lastAutoTable.finalY;

    doc.setFont("helvetica", "bold");
    returnBoldText(
      doc,
      "VENTA A CUENTA DE TERCEROS",
      100,
      finalY_Other + 5,
      "center"
    );

    autoTable(doc, {
      head: [["NIT:", "Nombre, denominación o razón social:"]],
      startY: finalY_Other + 8,
      headStyles: {
        fillColor: theme.colors.dark,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        fontStyle: "normal",
        fontSize: 7,
        textColor: theme.colors.primary,
        cellPadding: 1,
        halign: "center",
        cellWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: "auto" },
      },
      bodyStyles: {
        halign: "center",
        fontSize: 7,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        cellPadding: 1,
      },
      body: [["-", "-"]],
    });

    const finalY_sale = ((doc as unknown) as {
      lastAutoTable: { finalY: number };
    }).lastAutoTable.finalY;

    doc.setFont("helvetica", "bold");
    returnBoldText(
      doc,
      "DOCUMENTOS RELACIONADOS",
      100,
      finalY_sale + 5,
      "center"
    );

    autoTable(doc, {
      head: [["Tipo de Documento", "N° de Documento", "Fecha de Documento"]],
      startY: finalY_sale + 8,
      headStyles: {
        fillColor: theme.colors.dark,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        fontStyle: "normal",
        fontSize: 7,
        textColor: theme.colors.primary,
        cellPadding: 1,
        halign: "center",
        cellWidth: "wrap",
      },
      bodyStyles: {
        halign: "center",
        fontSize: 7,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        cellPadding: 1,
      },
      body: [["-", "-", "-"]],
    });

    const finalY_rel = ((doc as unknown) as {
      lastAutoTable: { finalY: number };
    }).lastAutoTable.finalY;

    const headers = [
      "Cantidad",
      "Descripción",
      `Precio Unitario`,
      `Descuento por ítem`,
      `Otros montos no afectos`,
      `Ventas No Sujetas`,
      `Ventas Exentas`,
      `Ventas Gravadas`,
    ];

    const array_object: unknown[] = [];
    JSON_DTE.cuerpoDocumento.map((prd) => {
      array_object.push(
        Object.values({
          qty: prd.cantidad,
          desc: prd.descripcion,
          price: formatCurrency(prd.precioUni),
          descu: formatCurrency(prd.montoDescu),
          other: formatCurrency(0),
          vtSuj: formatCurrency(prd.ventaNoSuj),
          vtExe: formatCurrency(prd.ventaExenta),
          vtGrav: formatCurrency(prd.ventaGravada),
        })
      );
    });

    autoTable(doc, {
      margin: { top: 35 },
      head: [headers],
      startY: finalY_rel + 5,
      theme: "grid",
      headStyles: {
        fillColor: theme.colors.dark,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        fontStyle: "normal",
        fontSize: 6,
        textColor: theme.colors.primary,
        cellPadding: 1,
        halign: "center",
        cellWidth: "wrap",
      },
      bodyStyles: {
        halign: "center",
        fontSize: 6,
        lineWidth: 0.1,
        lineColor: theme.colors.third,
        cellPadding: 1,
        fillColor: "#fff",
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: "wrap" },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
      },
      body: array_object as unknown as RowInput[],
    });

    const createTable = (doc: jsPDF, finalY: number, bodyContent: string[]) => {
      autoTable(doc, {
        startY: finalY,
        theme: "grid",
        head: [["", "", "", ""]],
        showHead: "never",
        columnStyles: {
          0: { cellWidth: 15, fillColor: "#fff", lineWidth: 0 },
          1: { cellWidth: "wrap", fillColor: "#fff", lineWidth: 0 },
          2: { cellWidth: 80, lineWidth: 0.1, lineColor: theme.colors.third },
          3: { cellWidth: 15, lineWidth: 0.1, lineColor: theme.colors.third },
        },
        headStyles: {
          fillColor: "#ffff",
          textColor: "#000",
          lineWidth: 0.1,
        },
        bodyStyles: {
          fontSize: 6,
          halign: "right",
          cellPadding: 1,
          fillColor: "#fff",
        },
        body: [bodyContent],
      });
      return ((doc as unknown) as { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY;
    };

    let finalY = ((doc as unknown) as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY;

    finalY = createTable(doc, finalY, [
      "",
      "",
      "Sumatoria de Ventas",
      "1",
      "2",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Suma Total de Operaciones:",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas no sujetas:",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas Exentas:",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas gravadas:",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Impuesto al Valor Agregado 13%",
      "3",
    ]);
    finalY = createTable(doc, finalY, ["", "", "Sub-Total:", "3"]);
    finalY = createTable(doc, finalY, ["", "", "IVA Percibido:", "3"]);
    finalY = createTable(doc, finalY, ["", "", "IVA Retenido:", "3"]);
    finalY = createTable(doc, finalY, ["", "", "Retención Renta:", "3"]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Monto Total de la Operación:",
      "3",
    ]);
    finalY = createTable(doc, finalY, [
      "",
      "",
      "Total Otros montos no afectos:",
      "3",
    ]);
    createTable(doc, finalY, ["", "", "Total a Pagar:", "3"]);

    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (i !== 1) {
        returnBoldText(
          doc,
          "DOCUMENTO DE CONSULTA PORTAL OPERATIVO",
          100,
          10,
          "center"
        );
        returnBoldText(
          doc,
          "DOCUMENTO TRIBUTARIO ELECTRÓNICO",
          100,
          13,
          "center"
        );
        returnBoldText(doc, "COMPROBANTE DE NOTA DE DÉBITO", 100, 16, "center");
        makeHeader(doc);
      }
      doc.setFontSize(8);
      doc.text(
        "Powered by: www.seedcodesv.com",
        10,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        "Pagina " + i + " de " + pageCount,
        10,
        doc.internal.pageSize.height - 5
      );
    }
    // doc.autoPrint();
    doc.save("table.pdf");
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

export const makeEmisor = (doc: jsPDF) => {
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
  let totalHeight = 0;

  fields.forEach((field) => {
    returnBoldText(doc, field.label, 10, yPosition, "left");

    const splitText = doc.splitTextToSize(
      field.value,
      100 - getWidthText(doc, field.label)
    );

    doc.text(splitText, getWidthText(doc, field.label), yPosition);

    const height = getHeightText(doc, splitText);

    yPosition += height + 1;
    totalHeight += height + 1;
  });

  return { totalHeight };
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

export const makeHeader = (doc: jsPDF) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  returnBoldText(doc, "Código de Generación:", 10, 25);
  doc.text(
    "4DF77BC3-6AA7-483A-8B72-28D558D8880A",
    getWidthText(doc, "Código de Generación:"),
    25,
    {
      align: "left",
    }
  );
  returnBoldText(doc, "Número de Control:", 10, 28);
  doc.text(
    "DTE-03-M002P001-000000000002058",
    getWidthText(doc, "Número de Control:"),
    28,
    {
      align: "left",
    }
  );
  returnBoldText(doc, "Sello de Recepción:", 10, 31);
  doc.text(
    "20240772C711AFD44BA8AF3652B91539C584LEHJ",
    getWidthText(doc, "Sello de Recepción:"),
    31,
    {
      align: "left",
    }
  );
  returnBoldText(
    doc,
    "Modelo de Facturación:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "Previo"),
    25,
    "right"
  );
  doc.text("Previo", doc.internal.pageSize.getWidth() - 10, 25, {
    align: "right",
  });
  returnBoldText(
    doc,
    "Tipo de Transmisión:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "Normal"),
    28,
    "right"
  );
  doc.text("Normal", doc.internal.pageSize.getWidth() - 10, 28, {
    align: "right",
  });
  returnBoldText(
    doc,
    "Fecha y Hora de Generación:",
    doc.internal.pageSize.getWidth() - getWidthText(doc, "2024-06-08 09:15:09"),
    31,
    "right"
  );
  doc.text("2024-06-08 09:15:09", doc.internal.pageSize.getWidth() - 10, 31, {
    align: "right",
  });
};
