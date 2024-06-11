import jsPDF from "jspdf";

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

export const returnBoldText = (
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
