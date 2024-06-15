import Layout from "../layout/Layout";
// import { pdf } from "@react-pdf/renderer";
// import CreditoFiscalTMP from "./invoices/Template2/CFC";
import { Button } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
// import QR from "../assets/codigo-qr-1024x1024-1.jpg";
// import { useContext } from "react";
// import { ThemeContext } from "../hooks/useTheme";
import LOGO from "../assets/CSLOGO.png";
// import { createSVG, createSVGCircle } from "./svfe_pdf/template2/creations";
import "svg2pdf.js";
// import BG from "../assets/template2.png";
import JSONDTE from "../assets/json/20F6B3E1-4AA4-4A93-A169-7F718E9987E9.json";
import { formatCurrency } from "../utils/dte";

function Test() {
  // const { theme } = useContext(ThemeContext);

  // const handleDownloadPDF = async () => {
  //   const blob = await pdf(<CreditoFiscalTMP />).toBlob();

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "invoice.pdf";
  //   link.click();

  //   URL.revokeObjectURL(url);
  // };

  const makePDF = () => {
    const doc = new jsPDF();

    doc.addImage(LOGO, "PNG", 0, 0, 40, 10, "FAST", "FAST");
    doc.setFontSize(8);
    const name = doc.splitTextToSize(
      "CS EQUIPOS Y SERVICIOS, SOCIEDAD ANONIMA DE CAPITAL VARIABLE",
      90
    );
    const nameH  = getHeightText(doc, name)
    returnBoldText(doc, name + 11, 100, 10, "center");
    doc.setFontSize(7);
    const actEco = doc.splitTextToSize("Actividad económica: Alquiler de maquinaria y equipo",75)
    returnBoldText(
      doc,
      actEco,
      100,
     nameH,
      "center"
    );
    const address = doc.splitTextToSize(
      "CENTRO FINANCIERO DAVIVIENDA, AVENIDA OLÍMPICA No. 3550 SAN SALVADOR, EL SALVADOR, C.A.",
      70
    );

    const act = getHeightText(doc, actEco) + nameH + 1;

    returnBoldText(doc, address, 100, act, "center");

    const tel = getHeightText(doc, address) + act + nameH - 11;

    returnBoldText(
      doc,
      "TEL: 2556-0000",
      100,
      tel,
      "center"
    );

    const margin = 5;
    const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const radius = 2;
    const rectHeight = doc.internal.pageSize.getHeight() - 50 - margin;
    const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;

    const marginTop =
      doc.internal.pages.length === 1 ? rectHeight - 50 : rectHeight;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    // doc.roundedRect(20, 50, 80, rectHeight, 0, 0, "S");
    doc.roundedRect(85, 50, 20, marginTop, 0, 0, "S");
    // doc.roundedRect(105, 50, 20, rectHeight, 0, 0, "S");
    doc.roundedRect(125, 50, 20, marginTop, 0, 0, "S");
    // doc.roundedRect(145, 50, 20, rectHeight, 0, 0, "S");
    doc.roundedRect(165, 50, 20, marginTop, 0, 0, "S");
    doc.roundedRect(margin, 50, rectWidth, rectHeight, radius, radius, "S");
    doc.roundedRect(margin, 50, rectWidth, 8, radius, radius, "S");
    if (doc.internal.pages.length === 1) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7
      );
      doc.line(125, rectHeight + 50, 125, rectMargin + 7);
    }
    const headers = [
      "CANTIDAD",
      "DESCRIPCION",
      "PRECIO UNITARIO",
      "DESCUENTO POR ITEM",
      "OTROS MONTOS NO AFECTOS",
      "VENTAS NO SUJETAS",
      "VENTAS EXENTAS",
      "VENTAS GRAVADAS",
    ];

    const array_object: unknown[] = [];
    JSONDTE.cuerpoDocumento.map((prd) => {
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
      theme: "plain",
      startY: 50,
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
        6: { cellWidth: 20, cellPadding: 2 },
        7: { cellPadding: 2 },
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
        const margin = 5;
        const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const radius = 2;
        const rectHeight = doc.internal.pageSize.getHeight() - 50 - margin;
        const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 0, 0);
        // doc.roundedRect(20, 50, 80, rectHeight, 0, 0, "S");
        doc.roundedRect(85, 50, 20, rectHeight - 50, 0, 0, "S");
        // doc.roundedRect(105, 50, 20, rectHeight, 0, 0, "S");
        doc.roundedRect(125, 50, 20, rectHeight - 50, 0, 0, "S");
        // doc.roundedRect(145, 50, 20, rectHeight, 0, 0, "S");
        doc.roundedRect(165, 50, 20, rectHeight - 50, 0, 0, "S");
        doc.roundedRect(margin, 50, rectWidth, rectHeight, radius, radius, "S");
        doc.roundedRect(margin, 50, rectWidth, 8, radius, radius, "S");
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
        doc.line(125, rectHeight + 50, 125, rectMargin + 7);
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
