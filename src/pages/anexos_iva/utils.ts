import { SaleAnnexe } from '@/store/types/iva-ccfe.types';
import { IvaSale } from '@/store/types/iva-fe.types';
import { ShoppingReport } from '@/types/shopping.types';
import { Supplier } from '@/types/supplier.types';
import ExcelJS from 'exceljs';

const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

export const annexes_iva_shopping = async (shoppingReport: ShoppingReport[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ANEXO DE COMPRAS');

    worksheet.columns = [
        { key: 'A', width: 23.57 },
        { key: 'B', width: 37.29 },
        { key: 'C', width: 22.57 },
        { key: 'D', width: 18.57 },
        { key: 'E', width: 28 },
        { key: 'F', width: 36.29 },
        { key: 'G', width: 20 },
        { key: 'H', width: 24.71 },
        { key: 'I', width: 24.71 },
        { key: 'J', width: 24.71 },
        { key: 'K', width: 24.71 },
        { key: 'L', width: 24.71 },
        { key: 'M', width: 24.71 },
        { key: 'N', width: 24.71 },
        { key: 'O', width: 24.71 },
        { key: 'P', width: 24.71 },
        { key: 'Q', width: 24.71 },
        { key: 'R', width: 24.71 },
        { key: 'S', width: 24.71 },
        { key: 'T', width: 24.71 },
        { key: 'U', width: 24.71 },
    ];

    const titles = [
        {
            title: 'FECHA DE EMISIÓN DEL DOCUMENTO',
            column: 'A',
        }, {
            title: 'CLASE DE DOCUMENTO',
            column: 'B',
        },
        {
            title: 'TIPO DE DOCUMENTO',
            column: 'C',
        },
        {
            title: 'NUMERO DE DOCUMENTO',
            column: 'D',
        },
        {
            title: 'NIT  O NRC DEL PROVEEDOR',
            column: 'E',
        },
        {
            title: 'NOMBRE DEL PROVEEDOR',
            column: 'F',
        },
        {
            title: 'COMPRAS INTERNAS EXENTAS',
            column: 'G',
        },
        {
            title: 'INTERNACIONES EXENTAS Y/O NO SUJETAS',
            column: 'H',
        },
        {
            title: 'IMPORTACIONES EXENTAS Y/O NO SUJETAS',
            column: 'I',
        },
        {
            title: 'COMPRAS INTERNAS GRAVADAS',
            column: 'J',
        },
        {
            title: 'INTERNACIONES GRAVADAS DE BIENES',
            column: 'K',
        },
        {
            title: 'IMPORTACIONES GRAVADAS DE BIENES',
            column: 'L',
        },
        {
            title: 'IMPORTACIONES GRAVADAS DE SERVICIOS',
            column: 'M',
        },
        {
            title: 'CRÉDITO FISCAL',
            column: 'N',
        },
        {
            title: 'TOTAL DE COMPRAS',
            column: 'O',
        },
        {
            title: 'DUI DEL PROVEEDOR ',
            column: 'P',
        },
        {
            title: 'TIPO DE OPERACIÓN (Renta)',
            column: 'Q',
        },
        {
            title: 'CLASIFICACIÓN (Renta)',
            column: 'R',
        },
        {
            title: 'SECTOR (Renta)',
            column: 'S',
        },
        {
            title: 'TIPO DE COSTO/GASTO (Renta)',
            column: 'T',
        },
        {
            title: 'NUMERO DEL ANEXO',
            column: 'U',
        }
    ];

    worksheet.getRow(1).height = 32.25;

    titles.forEach((title) => {
        worksheet.getCell(`${title.column}1`).style = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5b9bd5' } } }
        worksheet.getCell(`${title.column}1`).value = title.title;
        worksheet.getCell(`${title.column}1`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        worksheet.getCell(`${title.column}1`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    let nextLine = 2;
    for (const shopping of shoppingReport) {

        const totalIva = shopping.iva.map((i) => Number(i.monto)).reduce((a, b) => a + b, 0);

        worksheet.getCell(`A${nextLine}`).value = formatDate(shopping.fecEmi);
        worksheet.getCell(`B${nextLine}`).value = formatTypes(shopping).classDocument;
        worksheet.getCell(`C${nextLine}`).value = formatDteType(shopping.typeDte)
        worksheet.getCell(`D${nextLine}`).value = formatControlNumber(shopping.controlNumber);
        worksheet.getCell(`E${nextLine}`).value = formatNit(shopping.supplier)
        worksheet.getCell(`F${nextLine}`).value = shopping.supplier.nombre;
        worksheet.getCell(`G${nextLine}`).value = shopping.typeSale === "Interna" ? Number(shopping.totalExenta) : 0;
        worksheet.getCell(`H${nextLine}`).value = shopping.typeSale === "Externa" ? Number(shopping.totalExenta) : 0;
        worksheet.getCell(`I${nextLine}`).value = 0.00;
        worksheet.getCell(`J${nextLine}`).value = shopping.typeSale === "Interna" ? Number(shopping.totalGravada) : 0;
        worksheet.getCell(`K${nextLine}`).value = shopping.typeSale === "Externa" ? Number(shopping.totalGravada) : 0;
        worksheet.getCell(`L${nextLine}`).value = 0.00;
        worksheet.getCell(`M${nextLine}`).value = 0.00;
        worksheet.getCell(`N${nextLine}`).value = Number(totalIva);
        worksheet.getCell(`O${nextLine}`).value = {
            formula: `=SUM(G${nextLine}:N${nextLine})`,
            result: 0,
        }
        worksheet.getCell(`P${nextLine}`).value = formatNumDocument(shopping.supplier);
        worksheet.getCell(`Q${nextLine}`).value = formatTypes(shopping).typeOperation;
        worksheet.getCell(`R${nextLine}`).value = formatTypes(shopping).classification;
        worksheet.getCell(`S${nextLine}`).value = formatTypes(shopping).sector;
        worksheet.getCell(`T${nextLine}`).value = formatTypes(shopping).typeCostSpent;
        worksheet.getCell(`U${nextLine}`).value = 3;

        //formats
        worksheet.getCell(`G${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`H${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`I${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`J${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`K${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`L${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`M${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`N${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`O${nextLine}`).numFmt = '#,##0.00';

        nextLine += 1;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    return blob;
}

export const formatDteType = (typeDte: string) => {
    switch (typeDte) {
        case "03":
            return "03. COMPROBANTE DE CRÉDITO FISCAL";
        case "05":
            return "05. NOTA DE CRÉDITO";
        case "06":
            return "06. NOTA DE DÉBITO"
        default:
            return ""
    }
}

export const formatNit = (supplier: Supplier) => {
    if (supplier.nit && supplier.nit.length > 0 && supplier.nit !== "" && supplier.nit !== "0" && supplier.nit !== "N/A") {
        return supplier.nit;
    }

    if (supplier.nrc && supplier.nrc.length > 0 && supplier.nrc !== "" && supplier.nrc !== "0" && supplier.nrc !== "N/A") {
        return supplier.nrc;
    }

    return "";
}


const formatNumDocument = (supplier: Supplier) => {
    if (formatNit(supplier) === "") {
        return supplier.numDocumento && supplier.numDocumento.length > 0 && supplier.numDocumento !== "" && supplier.numDocumento !== "0" && supplier.numDocumento !== "N/A" ? supplier.numDocumento : "";
    }
    return ""
}

export const formatTypes = (shopping: ShoppingReport, onlyCodes: boolean = false) => {
    if (onlyCodes) {
        return {
            typeOperation: shopping.operationTypeCode,
            classification: shopping.classificationCode,
            sector: shopping.sectorCode,
            typeCostSpent: shopping.typeCostSpentCode,
            classDocument: shopping.classDocumentCode,
        }
    }
    return {
        typeOperation: `${shopping.operationTypeCode} ${shopping.operationTypeValue} `,
        classification: `${shopping.classificationCode} ${shopping.classificationValue} `,
        sector: `${shopping.sectorCode} ${shopping.sectorValue} `,
        typeCostSpent: `${shopping.typeCostSpentCode} ${shopping.typeCostSpentValue} `,
        classDocument: `${shopping.classDocumentCode} ${shopping.classDocumentValue} `,
    }
}

export const csvmaker = (shoppingReport: ShoppingReport[]) => {

    const payload = shoppingReport.map((item) => {
        return [
            formatDate(item.fecEmi),
            formatTypes(item, true).classDocument,
            (item.typeDte),
            formatControlNumber(item.controlNumber),
            formatNit(item.supplier),
            item.supplier.nombre,
            item.typeSale === "Interna" ? Number(item.totalExenta) : 0,
            item.typeSale === "Externa" ? Number(item.totalExenta) : 0,
            0.00,
            item.typeSale === "Interna" ? Number(item.totalGravada) : 0,
            item.typeSale === "Externa" ? Number(item.totalGravada) : 0,
            0.00,
            0.00,
            Number(item.totalIva),
            Number(item.totalIva),
            formatNumDocument(item.supplier),
            formatTypes(item, true).typeOperation,
            formatTypes(item, true).classification,
            formatTypes(item, true).sector,
            formatTypes(item, true).typeCostSpent,
            3,
        ]
    })
    return payload.map((row) => row.join(';')).join('\n');
}

export const formatControlNumber = (controlNumber: string) => {
    if (controlNumber !== "" && controlNumber !== "N/A" && controlNumber.length > 0) {
        return controlNumber.replace(/-/g, "")
    }
    return ""
}

export const annexes_iva_fe = async (annexe_fe: IvaSale[]) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Anexo FE');

    const titles = [
        {
            title: 'FECHA DE EMISIÓN',
            column: 'A',
            width: 23.57,
        }, {
            title: 'CLASE DE DOCUMENTO',
            column: 'B',
            width: 22.14,
        },
        {
            title: 'TIPO DE DOCUMENTO',
            column: 'C',
            width: 33.14,
        },
        {
            title: 'NÚMERO DE RESOLUCIÓN',
            column: 'D',
            width: 22.57
        },
        {
            title: 'SERIE DEL DOCUMENTO',
            column: 'E',
            width: 22.57
        },
        {
            title: 'NUMERO DE CONTROL INTERNO DEL',
            column: 'F',
            width: 22.57
        },
        {
            title: 'NUMERO DE CONTROL INTERNO AL ',
            column: 'G',
            width: 22.57
        },
        {
            title: 'NÚMERO DE DOCUMENTO (DEL)',
            column: 'H',
            width: 22.57
        },
        {
            title: 'NÚMERO DE DOCUMENTO (AL)',
            column: 'I',
            width: 18.57
        },
        {
            title: 'NÚMERO DE MAQUINA REGISTRADORA',
            column: 'J',
            width: 28
        },
        {
            title: 'VENTAS EXENTAS',
            column: 'K',
            width: 20
        },
        {
            title: 'VENTAS INTERNAS EXENTAS NO SUJETAS A PROPORCIONALIDAD',
            column: 'L',
            width: 29.29
        },
        {
            title: 'VENTAS NO SUJETAS',
            column: 'M',
            width: 21.57
        },
        {
            title: 'VENTAS GRAVADAS LOCALES',
            column: 'N',
            width: 28.71
        },
        {
            title: 'EXPORTACIONES DENTRO DEL ÁREA DE CENTROAMÉRICA',
            column: 'O',
            width: 28.71
        },
        {
            title: 'EXPORTACIONES FUERA DEL ÁREA DE CENTROAMÉRICA',
            column: 'P',
            width: 24.71
        },
        {
            title: 'EXPORTACIONES DE SERVICIO',
            column: 'Q',
            width: 22.14
        },
        {
            title: 'VENTAS A ZONAS FRANCAS  Y DPA (TASA CERO)',
            column: 'R',
            width: 24.71
        },
        {
            title: 'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS',
            column: 'S',
            width: 26.14
        },
        {
            title: 'TOTAL DE VENTAS',
            column: 'T',
            width: 18
        },
        {
            title: 'NUMERO DEL ANEXO',
            column: 'U',
            width: 24.71
        }
    ];

    worksheet.getRow(1).height = 32.25;

    titles.forEach((title) => {
        worksheet.getColumn(title.column).width = title.width + 0.71;
        worksheet.getCell(`${title.column}1`).style = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5b9bd5' } } }
        worksheet.getCell(`${title.column}1`).value = title.title;
        worksheet.getCell(`${title.column}1`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        worksheet.getCell(`${title.column}1`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    let nextLine = 2;

    for (const line of annexe_fe) {
        worksheet.getCell(`A${nextLine}`).value = line.currentDay
        worksheet.getCell(`B${nextLine}`).value = (line.type === 'FE') ? "1. IMPRESO POR IMPRENTA O TIQUETES" : "4. DOCUMENTO TRIBUTARIO ELECTRÓNICO (DTE)"
        worksheet.getCell(`C${nextLine}`).value = formatClassDte(line.typeVoucher)
        worksheet.getCell(`D${nextLine}`).value = formatResolution(line)
        worksheet.getCell(`E${nextLine}`).value = formatSeries(line)
        worksheet.getCell(`F${nextLine}`).value = formatInternalControl(line).del
        worksheet.getCell(`G${nextLine}`).value = formatInternalControl(line).al
        worksheet.getCell(`H${nextLine}`).value = formatNumberControlDelAl(line).del
        worksheet.getCell(`I${nextLine}`).value = formatNumberControlDelAl(line).al
        worksheet.getCell(`J${nextLine}`).value = formatPointOfSale(line)
        worksheet.getCell(`K${nextLine}`).value = 0.00
        worksheet.getCell(`L${nextLine}`).value = 0.00
        worksheet.getCell(`M${nextLine}`).value = 0.00
        worksheet.getCell(`N${nextLine}`).value = Number(line.totalSales)
        worksheet.getCell(`O${nextLine}`).value = 0.00
        worksheet.getCell(`P${nextLine}`).value = 0.00
        worksheet.getCell(`Q${nextLine}`).value = 0.00
        worksheet.getCell(`R${nextLine}`).value = 0.00
        worksheet.getCell(`S${nextLine}`).value = 0.00
        worksheet.getCell(`T${nextLine}`).value = {
            formula: `SUM(K${nextLine}:Q${nextLine})`
        }
        worksheet.getCell(`U${nextLine}`).value = 2

        if (line.type !== "DTE") {
            worksheet.getCell(`K${nextLine}`).numFmt = '0';
        }

        worksheet.getCell(`K${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`L${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`M${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`N${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`O${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`P${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`Q${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`R${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`S${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`T${nextLine}`).numFmt = '#,##0.00';
        nextLine += 1;
    }

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    return blob;
}

export const formatClassDte = (type: string) => {
    switch (type) {
        case "F":
            return "01. FACTURA"
        case "T":
            return "10. TIQUETES DE MAQUINA REGISTRADORA"
        case "FE":
            return "01. FACTURA";
        default:
            return ""
    }
}

export const formatClassCodeDte = (type: string) => {
    switch (type) {
        case "F":
            return "01"
        case "T":
            return "10"
        case "FE":
            return "01";
        default:
            return ""
    }
}
export const formatResolution = (iva: IvaSale) => {
    if (iva.type === "DTE") return "N/A"
    return iva.resolution
}

export const formatSeries = (iva: IvaSale) => {
    if (iva.type === "DTE") return "N/A"
    return iva.series
}

export const formatInternalControl = (iva: IvaSale) => {
    const del = iva.type === "DTE" ? "N/A" : iva.firstNumeroControl
    const al = iva.type === "DTE" ? "N/A" : iva.lastNumeroControl

    return { del, al }
}

export const formatNumberControlDelAl = (iva: IvaSale) => {
    const del = iva.type === "DTE" ? iva.firstNumeroControl.replace(/-/g, "") : iva.firstNumeroControl
    const al = iva.type === "DTE" ? iva.lastNumeroControl.replace(/-/g, "") : iva.lastNumeroControl

    return { del, al }
}

export const formatPointOfSale = (iva: IvaSale) => {
    if (iva.type === "DTE") return ""
    return iva.code
}

export const csvmaker_fe = (annexe_fe: IvaSale[]) => {

    const payload = annexe_fe.map((line) => {
        return [
            line.currentDay,
            (line.type === 'FE') ? "1" : "4",
            formatClassCodeDte(line.typeVoucher),
            formatResolution(line),
            formatSeries(line),
            formatInternalControl(line).del,
            formatInternalControl(line).al,
            formatNumberControlDelAl(line).del,
            formatNumberControlDelAl(line).al,
            formatPointOfSale(line),
            0.00,
            0.00,
            0.00,
            Number(line.totalSales),
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            Number(line.totalSales),
            2
        ]
    })
    return payload.map((row) => row.join(';')).join('\n');
}

export const export_annexes_iva_ccfe = async (annexe_ccfe: SaleAnnexe[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Anexo FE');

    const titles = [
        {
            title: 'FECHA DE EMISIÓN DEL DOCUMENTO',
            column: 'A',
            width: 23.57,
        }, {
            title: 'CLASE DE DOCUMENTO',
            column: 'B',
            width: 33,
        },
        {
            title: 'TIPO DE DOCUMENTO',
            column: 'C',
            width: 27.71,
        },
        {
            title: 'NÚMERO DE RESOLUCIÓN',
            column: 'D',
            width: 22.57
        },
        {
            title: 'SERIE DEL DOCUMENTO',
            column: 'E',
            width: 22.57
        },
        {
            title: 'NÚMERO DE DOCUMENTO',
            column: 'F',
            width: 22.57
        },
        {
            title: 'NUMERO DE CONTROL INTERNO',
            column: 'G',
            width: 22.57
        },
        {
            title: 'NIT O NRC DEL CLIENTE',
            column: 'H',
            width: 22.57
        },
        {
            title: 'NOMBRE RAZÓN SOCIAL O DENOMINACIÓN',
            column: 'I',
            width: 37.71
        },
        {
            title: 'VENTAS EXENTAS ',
            column: 'J',
            width: 20
        },
        {
            title: 'VENTAS NO SUJETAS ',
            column: 'K',
            width: 29.29
        },
        {
            title: 'VENTAS GRAVADAS LOCALES ',
            column: 'L',
            width: 21.57
        },
        {
            title: 'DÉBITO FISCAL',
            column: 'M',
            width: 24.71
        },
        {
            title: 'VENTAS A CUENTA DE TERCEROS NO DOMICILIADOS ',
            column: 'N',
            width: 28.71
        },
        {
            title: 'DEBITO FISCAL POR VENTAS A CUENTA DE TERCEROS',
            column: 'O',
            width: 24.71
        },
        {
            title: 'TOTAL DE VENTAS',
            column: 'P',
            width: 26.14
        },
        {
            title: 'NUMERO DE DUI DEL CLIENTE ',
            column: 'Q',
            width: 26.14
        },
        {
            title: 'NÚMERO DEL ANEXO',
            column: 'R',
            width: 18
        }
    ];

    titles.forEach((title) => {
        worksheet.getColumn(title.column).width = title.width + 0.71;
        worksheet.getCell(`${title.column}1`).style = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5b9bd5' } } }
        worksheet.getCell(`${title.column}1`).value = title.title;
        worksheet.getCell(`${title.column}1`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        worksheet.getCell(`${title.column}1`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell(`${title.column}1`).value = title.title
    })

    annexe_ccfe.forEach((line, index) => {
        const nextLine = index + 2;
        worksheet.getCell(`A${nextLine}`).value = line.fecEmi;
        worksheet.getCell(`B${nextLine}`).value = line.tipoDte === "03" ? "4. DOCUMENTO TRIBUTARIO ELECTRONICO (DTE)" : "1. IMPRESO POR IMPRENTA O TIQUETES"
        worksheet.getCell(`C${nextLine}`).value = "03. COMPROBANTE DE CRÉDITO FISCAL";
        worksheet.getCell(`D${nextLine}`).value = line.tipoDte === "03" ? line.numeroControl.replace(/-/g, "") : line.box.correlative.resolution
        worksheet.getCell(`E${nextLine}`).value = line.tipoDte === "03" ? line.selloRecibido.replace(/-/g, "") : line.box.correlative.serie
        worksheet.getCell(`F${nextLine}`).value = line.tipoDte === "03" ? line.codigoGeneracion.replace(/-/g, "") : line.numeroControl
        worksheet.getCell(`G${nextLine}`).value = line.tipoDte === "03" ? line.codigoGeneracion.replace(/-/g, "") : line.numeroControl
        worksheet.getCell(`H${nextLine}`).value = line.customer.nit.length === 14 ? line.customer.nit.replace(/-/g, "") : ""
        worksheet.getCell(`I${nextLine}`).value = line.customer.nombre
        worksheet.getCell(`J${nextLine}`).value = Number(line.totalExenta)
        worksheet.getCell(`K${nextLine}`).value = Number(line.totalNoSuj)
        worksheet.getCell(`L${nextLine}`).value = Number(line.totalGravada)
        worksheet.getCell(`M${nextLine}`).value = Number(line.totalIva)
        worksheet.getCell(`N${nextLine}`).value = 0.00
        worksheet.getCell(`O${nextLine}`).value = 0.00
        worksheet.getCell(`P${nextLine}`).value = Number(line.montoTotalOperacion)
        worksheet.getCell(`Q${nextLine}`).value = line.customer.nit.length >= 9 && line.customer.nit.length <= 10 ? line.customer.nit.replace(/-/g, "") : ""
        worksheet.getCell(`R${nextLine}`).value = 1

        worksheet.getCell(`J${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`K${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`L${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`M${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`N${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`O${nextLine}`).numFmt = '#,##0.00';
        worksheet.getCell(`P${nextLine}`).numFmt = '#,##0.00';

    })

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    return blob;
}

export const csvmaker_ccfe = (annexe_ccfe: SaleAnnexe[]) => {

    const payload = annexe_ccfe.map((line) => {
        return [
            line.fecEmi,
            line.tipoDte === "03" ? "4" : "1",
            "03",
            line.tipoDte === "03" ? line.numeroControl.replace(/-/g, "") : line.box.correlative.resolution,
            line.tipoDte === "03" ? line.selloRecibido.replace(/-/g, "") : line.box.correlative.serie,
            line.tipoDte === "03" ? line.codigoGeneracion.replace(/-/g, "") : line.numeroControl,
            line.tipoDte === "03" ? line.codigoGeneracion.replace(/-/g, "") : line.numeroControl,
            line.customer.nit.length === 14 ? line.customer.nit.replace(/-/g, "") : "",
            line.customer.nombre,
            Number(line.totalExenta),
            Number(line.totalNoSuj),
            Number(line.totalGravada),
            Number(line.totalIva),
            0.00,
            0.00,
            Number(line.montoTotalOperacion),
            line.customer.nit.length >= 9 && line.customer.nit.length <= 10 ? line.customer.nit.replace(/-/g, "") : "",
            1
        ]
    })
    return payload.map((row) => row.join(';')).join('\n');
}
