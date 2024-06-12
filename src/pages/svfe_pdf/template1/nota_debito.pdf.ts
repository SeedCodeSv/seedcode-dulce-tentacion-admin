import jsPDF from "jspdf";
import {
  createTableResumen,
  getHeightText,
  getWidthText,
  makeHeader,
  returnBoldText,
} from "../global/global.pdf";
import LOGOMIN from "../../../assets/logoMIN.png";
import autoTable, { RowInput } from "jspdf-autotable";
import { Theme } from "../../../hooks/useTheme";
import { formatCurrency } from "../../../utils/dte";
import { SVFE_ND_Firmado } from "../../../types/svf_dte/nd.types";

export const makePDFNotaDebito = (
  doc: jsPDF,
  dte: SVFE_ND_Firmado,
  LOGO: string | Uint8Array,
  QR: string | Uint8Array,
  theme: Theme
) => {
  doc.addImage(typeof LOGO === "string" ? LOGOMIN : LOGO, "PNG", 10, 5, 15, 15);
  doc.addImage(QR, "PNG", 40, 5, 15, 15);
  doc.setFontSize(8);
  doc.setTextColor(theme.colors.dark);
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
  makeHeader(
    doc,
    dte.identificacion.codigoGeneracion,
    dte.respuestaMH.selloRecibido,
    dte.identificacion.numeroControl,
    dte.identificacion.fecEmi + " " + dte.identificacion.horEmi
  );
  doc.setDrawColor(theme.colors.third);
  doc.setTextColor(theme.colors.third);
  returnBoldText(doc, "EMISOR", 50, 38, "center");
  doc.line(10, 40, 100, 40);
  returnBoldText(doc, "RECEPTOR", 150, 38, "center");
  doc.line(105, 40, 200, 40);
  doc.setTextColor(theme.colors.dark);
  const result = makeEmisor(doc, dte);
  makeReceptor(doc, dte);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(theme.colors.third);
  returnBoldText(
    doc,
    "OTROS DOCUMENTOS ASOCIADOS",
    100,
    45 + result.totalHeight + 5,
    "center"
  );
  doc.setTextColor(theme.colors.dark);
  autoTable(doc, {
    head: [["Identifcación del documento", "Descripción"]],
    startY: 45 + result.totalHeight + 8,
    headStyles: {
      fillColor: theme.colors.third,
      lineWidth: 0.1,
      lineColor: theme.colors.third,
      fontStyle: "normal",
      fontSize: 6,
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
      fontSize: 6,
      lineWidth: 0.1,
      lineColor: theme.colors.third,
      cellPadding: 1,
      textColor: theme.colors.dark,
    },
    body: [["-", "-"]],
  });
  const finalY_Other = ((doc as unknown) as {
    lastAutoTable: { finalY: number };
  }).lastAutoTable.finalY;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(theme.colors.third);
  returnBoldText(
    doc,
    "VENTA A CUENTA DE TERCEROS",
    100,
    finalY_Other + 5,
    "center"
  );
  doc.setTextColor(theme.colors.dark);

  autoTable(doc, {
    head: [["NIT:", "Nombre, denominación o razón social:"]],
    startY: finalY_Other + 8,
    headStyles: {
      fillColor: theme.colors.third,
      lineWidth: 0.1,
      lineColor: theme.colors.third,
      fontStyle: "normal",
      fontSize: 6,
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
      fontSize: 6,
      lineWidth: 0.1,
      lineColor: theme.colors.third,
      cellPadding: 1,
      textColor: theme.colors.dark,
    },
    body: [["-", "-"]],
  });

  const finalY_sale = ((doc as unknown) as {
    lastAutoTable: { finalY: number };
  }).lastAutoTable.finalY;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(theme.colors.third);
  returnBoldText(
    doc,
    "DOCUMENTOS RELACIONADOS",
    100,
    finalY_sale + 5,
    "center"
  );
  doc.setTextColor(theme.colors.dark);

  const array_object_doc: unknown[] = [];
  dte.documentoRelacionado?.map((doc) => {
    array_object_doc.push([
      "Comprobante de crédito fiscal",
      doc.numeroDocumento,
      doc.fechaEmision,
    ]);
  });

  autoTable(doc, {
    head: [["Tipo de Documento", "N° de Documento", "Fecha de Documento"]],
    startY: finalY_sale + 8,
    headStyles: {
      fillColor: theme.colors.third,
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
      textColor: theme.colors.dark,
      cellPadding: 1,
    },
    body: (array_object_doc as unknown) as RowInput[],
  });
  const finalY_rel = ((doc as unknown) as {
    lastAutoTable: { finalY: number };
  }).lastAutoTable.finalY;

  const headers = [
    "Cantidad",
    "Descripción",
    `Precio Unitario`,
    `Descuento por ítem`,
    `Ventas No Sujetas`,
    `Ventas Exentas`,
    `Ventas Gravadas`,
  ];

  const array_object: unknown[] = [];
  dte.cuerpoDocumento.map((prd) => {
    array_object.push(
      Object.values({
        qty: prd.cantidad,
        desc: prd.descripcion,
        price: formatCurrency(prd.precioUni),
        descu: formatCurrency(prd.montoDescu),
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
      fillColor: theme.colors.third,
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
      2: { cellWidth: 19 },
      3: { cellWidth: 19 },
      4: { cellWidth: 19 },
      5: { cellWidth: 19 },
      6: { cellWidth: 19 },
    },
    body: (array_object as unknown) as RowInput[],
  });

  const finalYTable = ((doc as unknown) as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  autoTable(doc, {
    theme: "grid",
    startY: finalYTable + 1,
    head: [["", "", "", "", "", ""]],
    showHead: "never",
    columnStyles: {
      0: { cellWidth: 15, fillColor: "#fff", lineWidth: 0 },
      1: { cellWidth: "wrap", fillColor: "#fff", lineWidth: 0 },
      2: { cellWidth: 50, lineWidth: 0.1, lineColor: theme.colors.third },
      3: { cellWidth: 15, lineWidth: 0.1, lineColor: theme.colors.third },
      4: { cellWidth: 15, lineWidth: 0.1, lineColor: theme.colors.third },
      5: { cellWidth: 15, lineWidth: 0.1, lineColor: theme.colors.third },
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
    },
    body: [
      [
        "",
        "",
        "Sumatoria de Ventas",
        formatCurrency(Number(dte.resumen.totalNoSuj)),
        formatCurrency(Number(dte.resumen.totalExenta)),
        formatCurrency(Number(dte.resumen.totalGravada)),
      ],
    ],
  });

  let finalY = ((doc as unknown) as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;
  finalY = createTableResumen(
    doc,
    finalY,
    [
      "",
      "",
      "Suma Total de Operaciones:",
      formatCurrency(Number(dte.resumen.subTotalVentas)),
    ],
    theme
  );
  finalY = createTableResumen(
    doc,
    finalY,
    [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas no sujetas:",
      formatCurrency(Number(dte.resumen.descuNoSuj)),
    ],
    theme
  );
  finalY = createTableResumen(
    doc,
    finalY,
    [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas Exentas:",
      formatCurrency(Number(dte.resumen.descuExenta)),
    ],
    theme
  );
  finalY = createTableResumen(
    doc,
    finalY,
    [
      "",
      "",
      "Monto global Desc., Rebajas y otros a ventas gravadas:",
      formatCurrency(Number(dte.resumen.descuGravada)),
    ],
    theme
  );

  const iva13 = Number(dte.resumen.subTotal) * 0.13;

  finalY = createTableResumen(
    doc,
    finalY,
    ["", "", "Impuesto al Valor Agregado 13%", formatCurrency(Number(iva13))],
    theme
  );
  finalY = createTableResumen(
    doc,
    finalY,
    ["", "", "Sub-Total:", formatCurrency(Number(dte.resumen.subTotal))],
    theme
  );
  createTableResumen(
    doc,
    finalY,
    [
      "",
      "",
      "Monto Total de la Operación:",
      formatCurrency(Number(dte.resumen.montoTotalOperacion)),
    ],
    theme
  );

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
      makeHeader(
        doc,
        dte.identificacion.codigoGeneracion,
        dte.respuestaMH.selloRecibido,
        dte.identificacion.numeroControl,
        dte.identificacion.fecEmi + " " + dte.identificacion.horEmi
      );
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

  return doc.output("blob");
};

export const makeEmisor = (doc: jsPDF, dte: SVFE_ND_Firmado) => {
  const fields = [
    {
      label: "Nombre o razón social:",
      value: dte.emisor.nombre,
    },
    {
      label: "Actividad económica:",
      value: dte.emisor.descActividad,
    },
    { label: "NIT:", value: dte.emisor.nit },
    { label: "NRC:", value: dte.emisor.nrc },
    {
      label: "Dirección:",
      value: `${dte.emisor.direccion.departamento}, ${dte.emisor.direccion.municipio}, ${dte.emisor.direccion.complemento}`,
    },
    { label: "Número de teléfono:", value: dte.emisor.telefono },
    { label: "Correo electrónico:", value: dte.emisor.correo },
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

export const makeReceptor = (doc: jsPDF, dte: SVFE_ND_Firmado) => {
  const fields = [
    {
      label: "Nombre o razón social:",
      value: dte.receptor.nombre,
    },
    {
      label: "Actividad económica:",
      value: dte.receptor.descActividad,
    },
    { label: "NIT:", value: dte.receptor.nit },
    { label: "NRC:", value: dte.receptor.nrc },
    {
      label: "Dirección:",
      value: `${dte.receptor.direccion.departamento}, ${dte.receptor.direccion.municipio}, ${dte.receptor.direccion.complemento}`,
    },
    {
      label: "Número de teléfono:",
      value: dte.receptor.telefono ?? "no-registrado",
    },
    {
      label: "Correo electrónico:",
      value: dte.receptor.correo ?? "no-registrado",
    },
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
