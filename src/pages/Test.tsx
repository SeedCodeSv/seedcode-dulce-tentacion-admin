import Layout from "../layout/Layout";
// import { pdf } from "@react-pdf/renderer";
// import CreditoFiscalTMP from "./invoices/Template2/CFC";
import { Button } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QR from "../assets/codigo-qr-1024x1024-1.jpg";
import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";
import LOGO from "../assets/logoMIN.png";
import { createSVG, createSVGCircle } from "./svfe_pdf/template2/creations";
import "svg2pdf.js";

function Test() {
  const { theme } = useContext(ThemeContext);

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
    doc.addImage(LOGO, "PNG", 180, 5, 20, 20);
    doc.setFontSize(8);
    doc.setTextColor(theme.colors.dark);
    doc.text("DOCUMENTO DE CONSULTA PORTAL OPERATIVO", 110, 10, {
      align: "center",
    });
    doc.text("DOCUMENTO TRIBUTARIO ELECTRÓNICO", 110, 14, { align: "center" });
    doc.text("COMPROBANTE DE CREDITO FISCAL", 110, 18, { align: "center" });

    doc.addImage(QR, "PNG", 100, 22, 20, 20);
    makeHeader(doc, 30);

    const emisor = makeEmisorHeight(doc, 55);

    const margin = 5;
    const rectWidth = (doc.internal.pageSize.getWidth() - 3 * margin) / 2;
    const rectHeight = emisor.totalHeight + 5;
    const radius = 2;

    returnBoldText(doc, "EMISOR", 50, 48, "center");
    // Dibujar el primer cuadrado con borde redondeado y agregar texto
    doc.setDrawColor(theme.colors.third);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 50, rectWidth, rectHeight, radius, radius, "FD");
    doc.setFontSize(6);
    emisor.showDoc();
    doc.setDrawColor(theme.colors.third);
    doc.setFillColor(255, 255, 255);
    // Dibujar el segundo cuadrado con borde redondeado y agregar texto
    doc.roundedRect(
      2 * margin + rectWidth,
      45,
      rectWidth,
      rectHeight,
      radius,
      radius,
      "FD"
    );
    autoTable(doc, {
      startY: emisor.totalHeight + 50 + 10,
      margin: {
        top: 40,
      },
      bodyStyles: {
        lineWidth: 0.1,
        lineColor: theme.colors.third,
      },
      theme: "plain",
      head: [["Name", "Email", "Age"]],
      body: [
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
        ["John Doe", "hDh9I@example.com", 30],
        ["Jane Doe", "DjvJj@example.com", 25],
        ["Bob Smith", "KlT5n@example.com", 40],
        ["Alice Johnson", "KlT5n@example.com", 35],
      ],
    });
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (i !== 1) {
        doc.setFontSize(8);
        doc.setTextColor(theme.colors.dark);
        doc.text("DOCUMENTO DE CONSULTA PORTAL OPERATIVO", 110, 10, {
          align: "center",
        });
        doc.text("DOCUMENTO TRIBUTARIO ELECTRÓNICO", 110, 14, {
          align: "center",
        });
        doc.text("COMPROBANTE DE CREDITO FISCAL", 110, 18, { align: "center" });

        makeHeader(doc, 25);
      }
      const svgElement = createSVG(
        theme.colors.third,
        theme.colors.secondary,
        theme.colors.secondary
      );

      const svgElementCircles = createSVGCircle(
        theme.colors.third,
        theme.colors.secondary,
        theme.colors.secondary
      );

      await doc.svg(svgElement, {
        x: 0,
        y: -218.5,
        width: 50,
      });
      await doc.svg(svgElementCircles, {
        x: 170,
        y: 125,
        width: 30,
      });
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.2 }));
      doc.addImage(
        LOGO,
        "JPEG",
        doc.internal.pageSize.width / 2 - 35,
        i !== 1 ? 100 : 150,
        70,
        70
      );
      doc.restoreGraphicsState();
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
    doc.text("Texto en el segundo cuadrado", 2 * margin + rectWidth + 5, 60);
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
      100 - getWidthText(doc, field.label)
    );

    doc.text(splitText, getWidthText(doc, field.label), yPosition);

    const height = getHeightText(doc, splitText);

    yPosition += height + 1;
    totalHeight += height + 1;
  });

  return { totalHeight };
};

export const makeEmisorHeight = (doc: jsPDF, y = 45) => {
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
      100 - getWidthText(doc, field.label)
    );
    const height = getHeightText(doc, splitText);
    totalHeight += height + 1;
  });

  const showDoc = () => {
    let yP = y;

    fields.forEach((field) => {
      returnBoldText(doc, field.label, 10, yP, "left");

      const splitText = doc.splitTextToSize(
        field.value,
        100 - getWidthText(doc, field.label)
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
