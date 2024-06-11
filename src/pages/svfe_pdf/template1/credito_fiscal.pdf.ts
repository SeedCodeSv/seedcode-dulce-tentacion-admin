import jsPDF from "jspdf";
import { getHeightText, getWidthText, returnBoldText } from "../global/global.pdf";
import { SVFC_CF_Firmado } from "../../../types/svf_dte/cf.types"
// import LOGOMIN from "../../../assets/logoMIN.png"

// export const makePDFCreditoFiscal = (doc: jsPDF, dte: SVFC_CF_Firmado, LOGO: string | Uint8Array, QR: string | Uint8Array) => {
//     doc.addImage(typeof LOGO === "string" ? LOGOMIN : LOGO, "PNG", 10, 5, 15, 15);
//     doc.addImage(QR, "PNG", 40, 5, 15, 15);
//     doc.setFontSize(8);
//     doc.setFont("helvetica", "bold");
// }

export const makeEmisor = (doc: jsPDF, dte: SVFC_CF_Firmado) => {
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

export const makeReceptor = (doc: jsPDF, dte: SVFC_CF_Firmado) => {
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
        { label: "Número de teléfono:", value: dte.emisor.telefono ?? "no-registrado" },
        { label: "Correo electrónico:", value: dte.emisor.correo ?? "no-registrado" },
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