
import ExcelJS from "exceljs"

import { ITransmitter } from "@/types/transmitter.types";

export const generate_shopping_excel = async (
  shopping_data: Array<Array<string | number>>,
  month: string,
  transmitter: ITransmitter,
  year: number
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Compras")

  worksheet.views = [{ state: "frozen", xSplit: 5, ySplit: 7 }]

  const merges = [
    "A6:A7",
    "B6:B7",
    "C6:C7",
    "D6:D7",
    "E6:E7",
    "F6:F7",
    "G6:J6",
    "K6:M6",
    "N6:N7",
    "O6:O7",
    "P6:P7",
    "D3:N3",
    "A3:C3",
    "D4:N4",
    "D5:F5"
  ]

  merges.forEach((range) => worksheet.mergeCells(range))

  worksheet.getCell("A6").value = "No. Corr."
  worksheet.getCell("B6").value = "Fecha"
  worksheet.getCell("C6").value = "No. Doc."
  worksheet.getCell("D6").value = "No. Reg."
  worksheet.getCell("E6").value = "NIT U DUI"
  worksheet.getCell("F6").value = "Nombre del proveedor"
  worksheet.getCell("G6").value = "Compras Gravadas"
  worksheet.getCell("K6").value = "Compras Exentas"
  

  worksheet.getCell("G7").value = "Internas"
  worksheet.getCell("H7").value = "Internaciones"
  worksheet.getCell("I7").value = "Importaciones"
  worksheet.getCell("J7").value = "IVA"

  worksheet.getCell("K7").value = "Internas"
  worksheet.getCell("L7").value = "Internaciones"
  worksheet.getCell("M7").value = "Importaciones"
  worksheet.getCell("N6").value = "Total compras"
  worksheet.getCell("O6").value = "Anticipo a cuenta IVA percibido"
  worksheet.getCell("P6").value = "Compras a Suj. Excluidos"

  const titles = [
    { cell: "A3", text: "REGISTRO No. " + `${transmitter?.nrc}` },
    { cell: "D3", text: "ESTABLECIMIENTO:  " + `${transmitter?.nombreComercial}` },
    { cell: "D4", text: "LIBRO DE COMPRAS" },
    { cell: "A5", text: "MES" },
    { cell: "B5", text: `${month}` },
    { cell: "D5", text: `AÑO: ${year}` }
  ]

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text
    worksheet.getCell(cell).alignment = { horizontal: "center" }

    if (["A5", "B5", "D5"].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true
      }
    }
  })

  worksheet.columns = [
    { key: "A", width: 5 },
    { key: "B", width: 10 },
    { key: "C", width: 25 },
    { key: "D", width: 10 },
    { key: "E", width: 15 },
    { key: "F", width: 45 },
    { key: "G", width: 13},
    { key: "H", width: 13 },
    { key: "I", width: 13 },
    { key: "J", width: 13 },
    { key: "K", width: 13 },
    { key: "L", width: 13 },
    { key: "M", width: 13 },
    { key: "N", width: 13 },
    { key: "O", width: 13 },
    { key: "P", width: 13 }
  ]

  const applyAlignmentAndFont = (cell: string, alignment: ExcelJS.Alignment, font: ExcelJS.Font) => {
    worksheet.getCell(cell).alignment = alignment
    worksheet.getCell(cell).font = font
  }

  const alignmentCenter = { horizontal: "center", wrapText: true }
  const fontSize8 = { size: 8, name: "Calibri" }
  const headersCells = [
    "A6",
    "B6",
    "C6",
    "D6",
    "E6",
    "F6",
    "G6",
    "H6",
    "I6",
    "J6",
    "K6",
    "L6",
    "M6",
    "N6",
    "G7",
    "H7",
    "I7",
    "J7",
    "K7",
    "L7",
    "M7",
    "N6",
    "O6",
    "P6"
  ]

  headersCells.forEach((cell) => applyAlignmentAndFont(cell, alignmentCenter as ExcelJS.Alignment, fontSize8 as ExcelJS.Font))

  worksheet.getRow(6).height = 20

  const borders = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  } as ExcelJS.Borders

  for (let row = 6; row <= 6 + shopping_data.length + 1; row++) {
    for (let col = 0; col < 16; col++) {
      worksheet.getCell(String.fromCharCode(65 + col) + row).border = borders
    }
  }

  shopping_data.forEach((item, rowIndex) => {
    const row = rowIndex + 8

    item.forEach((value, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + row

      worksheet.getCell(cell).value = value
      worksheet.getCell(cell).alignment = { horizontal: "left", wrapText: true }
      worksheet.getCell(cell).font = { name: "Calibri", size: 8 }
      if (colIndex === 1) worksheet.getCell(cell).numFmt = "mm/dd/yyyy"
      if ([6, 7, 8, 9, 10, 11, 12, 13,14,15].includes(colIndex))
        worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
    })
  })

  const nextLine = shopping_data.length + 8

  worksheet.getCell(`F${nextLine}`).value = "Total"
    ;["G", "H", "I", "J", "K", "L", "M", "N","O","P"].forEach((col) => {
      worksheet.getCell(`${col}${nextLine}`).value = {
        formula: `SUM(${col}8:${col}${nextLine - 1})`,
        result: 0
      }
      worksheet.getCell(`${col}${nextLine}`).font = { name: "Calibri", bold: true, size: 8 }
      worksheet.getCell(`${col}${nextLine}`).numFmt =
        '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
    })

  const borders_cells = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O","P"]

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders
  })

  worksheet.mergeCells(`E${nextLine + 5}:F${nextLine + 5}`)
  worksheet.getCell(`E${nextLine + 5}`).value = "__________________________"
  worksheet.mergeCells(`G${nextLine + 5}:I${nextLine + 5}`)
  worksheet.getCell(`G${nextLine + 5}`).value = "__________________________"

  worksheet.mergeCells(`E${nextLine + 6}:F${nextLine + 6}`)
  worksheet.getCell(`E${nextLine + 6}`).value = "Nombre contador o contribuyente"
  worksheet.getCell(`E${nextLine + 6}`).font = { bold: true, name: "Calibri" }

  worksheet.mergeCells(`G${nextLine + 6}:I${nextLine + 6}`)
  worksheet.getCell(`G${nextLine + 6}`).value = "Firma contador o contribuyente"
  worksheet.getCell(`G${nextLine + 6}`).font = { bold: true, name: "Calibri" }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/octet-stream" })

  return blob
}

interface FCF {
  exenta: number
  gravada: number
  iva: number
  retencion: number
  total: number
}

export const export_excel_factura = async (
  factura_data: Array<Array<number | string>>,
  month: string,
  transmitter: ITransmitter
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Ventas FACT.")

  worksheet.columns = [
    { key: "A", width: 15 },
    { key: "B", width: 30 },
    { key: "C", width: 30 },
    { key: "D", width: 30 },
    { key: "E", width: 30 },
    { key: "F", width: 30 },
    { key: "G", width: 30 },
    { key: "H", width: 15 },
    { key: "I", width: 15 },
    { key: "J", width: 15 },
    { key: "K", width: 15 },
    { key: "L", width: 15 }
  ]

  const merges = [
    "A6:A8",
    "A3:B3",
    "B6:C6",
    "B7:B8",
    "C7:C8",
    "C3:J3",
    "C4:J4",
    "B5:C5",
    "D6:E6",
    "D7:D8",
    "E7:E8",
    "F6:G6",
    "F7:F8",
    "G7:G8",
    "H6:J6",
    "H7:H8",
    "I7:J7",
    "K6:K8",
    "L6:L8"
  ]

  merges.forEach((range) => worksheet.mergeCells(range))

  const borders = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  } as ExcelJS.Borders

  const boldText = `${transmitter.nombreComercial}`
  const normalText = "ESTABLECIMIENTO: "

  worksheet.getCell("D3").value = {
    richText: [{ text: normalText }, { text: boldText, font: { bold: true } }]
  }

  worksheet.getCell("D3").alignment = { horizontal: "center" }
  const normalTextReg = "REGISTRO No."
  const boldReg = "269660-0"

  worksheet.getCell("A3").value = {
    richText: [{ text: normalTextReg }, { text: boldReg, font: { bold: true } }]
  }

  const titles = [
    { cell: "D4", text: "LIBRO DE VENTAS CONSUMIDOR FINAL" },
    { cell: "A5", text: `MES:${month.toUpperCase()}` },
    { cell: "B5", text: `AÑO: ${new Date().getFullYear()}` }
  ]

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text
    worksheet.getCell(cell).alignment = { horizontal: "center" }

    if (["A5", "B5", "B4", "D4"].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true
      }
    }
  })

  worksheet.getCell("B5").alignment = { horizontal: "center" }

  const headers_cell = [
    { cell: "A8", text: "FECHA EMISION" },
    { cell: "B8", text: "CÓDIGO DE GENERACIÓN INICIAL" },
    { cell: "C8", text: "CÓDIGO DE GENERACIÓN FINAL" },
    { cell: "B6", text: "FACTURAS" },
    { cell: "D7", text: "NUMERO DE CONTROL DEL" },
    { cell: "E7", text: "NUMERO DE CONTROL AL" },
    { cell: "E6", text: "" },
    { cell: "F6", text: "" },
    { cell: "F7", text: "SELLO RECIBIDO INICIAL" },
    { cell: "G7", text: "SELLO RECIBIDO FINAL" },
    { cell: "H6", text: "VENTAS" },
    { cell: "H8", text: "EXENTAS" },
    { cell: "I7", text: "GRAVADAS" },
    { cell: "I8", text: "LOCALES" },
    { cell: "J8", text: "EXPORTACIONES" },
    { cell: "K8", text: "VENTAS TOTALES" },
    { cell: "L8", text: "VENTAS POR CUENTAS DE TERCEROS" }
  ]

  headers_cell.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text
    worksheet.getCell(cell).font = { name: "Calibri", size: 9, bold: true }
    worksheet.getCell(cell).alignment = { horizontal: "center", wrapText: true }
    worksheet.getCell(cell).border = borders
  })

  factura_data.forEach((item, rowIndex) => {
    const row = rowIndex + 9

    item.forEach((value, colIndex) => {
      const cell = String.fromCharCode(65 + colIndex) + row

      worksheet.getCell(cell).value = value
      worksheet.getCell(cell).border = borders
      worksheet.getCell(cell).alignment = { horizontal: "left", wrapText: true }
      worksheet.getCell(cell).font = { name: "Calibri", size: 9 }
      if (colIndex === 1) worksheet.getCell(cell).numFmt = "mm/dd/yyyy"
      if ([6, 7, 8, 9, 10].includes(colIndex))
        worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
    })
  })

  const nextLine = factura_data.length + 9

  worksheet.getCell(`C${nextLine}`).value = "TOTAL"
  worksheet.getCell(`C${nextLine}`).font = {
    name: "Calibri",
    size: 8,
    bold: true
  }
    ;["H", "I", "J", "K", "L"].forEach((col) => {
      worksheet.getCell(`${col}${nextLine}`).value = {
        formula: `SUM(${col}8:${col}${nextLine - 1})`,
        result: 0
      }
      worksheet.getCell(`${col}${nextLine}`).font = { name: "Calibri", bold: true, size: 8 }
      worksheet.getCell(`${col}${nextLine}`).numFmt =
        '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
    })

  const borders_cells = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders
  })

  worksheet.getCell(`E${nextLine + 3}`).value = "VENTAS LOCALES GRAVADAS"
  worksheet.getCell(`F${nextLine + 3}`).value = {
    formula: `+I${nextLine}`
  }

  //
  worksheet.getCell(`B${nextLine + 3}`).font = { size: 9 }
  worksheet.getCell(`E${nextLine + 3}`).font = { size: 9 }
  //
  worksheet.getCell(`I${nextLine + 3}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

  worksheet.getCell(`I${nextLine + 4}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

  worksheet.getCell(`I${nextLine + 5}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
  worksheet.getCell(`F${nextLine + 3}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
  worksheet.getCell(`I${nextLine + 5}`).numFmt =
    '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

  //
  worksheet.getCell(`I${nextLine + 3}`).value = {
    formula: `+I${nextLine}/1.13`
  }
  worksheet.getCell(`I${nextLine + 4}`).value = {
    formula: `+I${nextLine + 3}*13%`
  }

  worksheet.getCell(`I${nextLine + 4}`).border = {
    bottom: {
      style: "thin"
    }
  }

  worksheet.getCell(`I${nextLine + 5}`).value = {
    formula: `SUM(I${nextLine + 3}+I${nextLine + 4})`
  }
  worksheet.getCell(`G${nextLine + 3}`).value = "/1.13 = VENTAS NETAS GRAVADAS"
  worksheet.getCell(`G${nextLine + 4}`).value = "POR 13% IMPUESTO (DEBITO FISCAL)"
  worksheet.getCell(`G${nextLine + 5}`).value = "TOTAL VENTAS GRAVADAS"

  //font
  worksheet.getCell(`G${nextLine + 3}`).font = { size: 9 }
  worksheet.getCell(`G${nextLine + 4}`).font = { size: 9 }
  worksheet.getCell(`G${nextLine + 5}`).font = { size: 9 }
  worksheet.getCell(`I${nextLine + 3}`).font = { size: 10 }
  worksheet.getCell(`I${nextLine + 4}`).font = { size: 10 }
  worksheet.getCell(`I${nextLine + 5}`).font = { size: 10 }

  const merges_final = [
    `B${nextLine + 3}:C${nextLine + 3}`,
    `G${nextLine + 3}:H${nextLine + 3}`,
    `G${nextLine + 4}:H${nextLine + 4}`,
    `G${nextLine + 5}:H${nextLine + 5}`,
    `B${nextLine + 11}:C${nextLine + 11}`,
    `B${nextLine + 12}:C${nextLine + 12}`,
    `G${nextLine + 11}:I${nextLine + 11}`,
    `G${nextLine + 12}:I${nextLine + 12}`
  ]

  worksheet.getCell(`B${nextLine + 11}`).value = "Oscar Leopoldo Ramírez García"
  worksheet.getCell(`B${nextLine + 12}`).value = "Nombre contador o Contribuyente"
  worksheet.getCell(`B${nextLine + 11}`).font = { size: 11, name: "Calibri" }
  worksheet.getCell(`B${nextLine + 12}`).font = { size: 11, bold: true, name: "Calibri" }

  worksheet.getCell(`G${nextLine + 11}`).value = "______________________________________________"
  worksheet.getCell(`G${nextLine + 12}`).value = "Firma contador o Contribuyente"
  worksheet.getCell(`G${nextLine + 11}`).font = { size: 11, name: "Calibri" }
  worksheet.getCell(`G${nextLine + 12}`).font = { size: 11, bold: true, name: "Calibri" }

  merges_final.forEach((range) => worksheet.mergeCells(range))

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], { type: "application/octet-stream" })

  return blob
}

export const export_excel_credito = async (
  month: string,
  data: Array<Array<string | number>>,
  facturas: FCF,
  transmitter: ITransmitter
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Ventas CCF")

  const borders = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  } as ExcelJS.Borders

  worksheet.columns = [
    { key: "A", width: 5 },
    { key: "B", width: 11.8 },
    { key: "C", width: 30 },
    { key: "D", width: 25 },
    { key: "E", width: 25 },
    { key: "F", width: 11.8 },
    { key: "G", width: 11.8 },
    { key: "H", width: 11.8 },
    { key: "I", width: 11.8 },
    { key: "J", width: 13 },
    { key: "K", width: 13 },
    { key: "L", width: 13 },
    { key: "M", width: 13 },
    { key: "N", width: 13 },
    { key: "O", width: 13 },
    { key: "P", width: 13 }
  ]

  const merges = [
    "A3:C3",
    "D3:L3",
    "D4:L4",
    "D5:E5",
    "A6:A7",
    "B6:B7",
    "C6:C7",
    "D6:D7",
    "E6:E7",
    "F6:F7",
    "G6:I7",
    "J6:K6",
    "L6:L7",
    "M6:M7",
    "N6:N7",
    "O6:O7",
    "P6:P7"
  ]

  merges.forEach((range) => worksheet.mergeCells(range))
  const titles = [
    { cell: "D4", text: "LIBRO DE VENTAS DE CRÉDITO FISCAL" },
    { cell: "A5", text: "MES" },
    { cell: "B5", text: `${month}` },
    { cell: "D5", text: `AÑO: ${new Date().getFullYear()}` }
  ]

  titles.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text
    worksheet.getCell(cell).alignment = { horizontal: "center", wrapText: true }

    if (["A5", "B5", "D5"].includes(cell)) {
      worksheet.getCell(cell).font = {
        bold: true
      }
    }
  })

  worksheet.getCell("B5").font = { bold: true }
  worksheet.getCell("D5").font = { bold: true }
  worksheet.getCell("D4").font = { bold: true }
  worksheet.getCell("A3").value = {
    richText: [
      {
        text: "REGISTRO No.:",
        font: {
          bold: false
        }
      },
      {
        text: "269660-0",
        font: {
          bold: true
        }
      }
    ]
  }
  worksheet.getCell("D3").value = {
    richText: [
      {
        text: "ESTABLECIMIENTO:",
        font: {
          bold: false
        }
      },
      {
        text: `${transmitter?.nombreComercial}`,
        font: {
          bold: true
        }
      }
    ]
  }

  const headers_cell = [
    { cell: "A7", text: "No. Corr." },
    { cell: "B7", text: "Fecha Emisión" },
    { cell: "C7", text: "Código de generación" },
    { cell: "D7", text: "No. de control" },
    { cell: "E7", text: "Sello recibido" },
    { cell: "F7", text: "No. Reg." },
    { cell: "G7", text: "Nombre del Cliente" },
    { cell: "J6", text: "Ventas Internas" },
    { cell: "J7", text: "Exentas" },
    { cell: "K7", text: "Gravadas" },
    { cell: "L7", text: "IVA Débito Fiscal" },
    { cell: "M7", text: "Ventas a cuenta de terceros" },
    { cell: "N7", text: "IVA Débito Fiscal a cuenta de terceros" },
    { cell: "O7", text: "IVA Percibido" },
    { cell: "P7", text: "Total" }
  ]

  worksheet.getRow(6).height = 25

  headers_cell.forEach(({ cell, text }) => {
    worksheet.getCell(cell).value = text
    worksheet.getCell(cell).font = { name: "Calibri", size: 9, bold: true }
    worksheet.getCell(cell).alignment = { horizontal: "center", wrapText: true }
    worksheet.getCell(cell).border = borders
  })

  data.forEach((item, rowIndex) => {
    const row = rowIndex + 8

    item.forEach((value, colIndex) => {
      let actualColIndex = colIndex

      if (colIndex === 6) {
        worksheet.mergeCells(`${String.fromCharCode(71)}${row}:${String.fromCharCode(73)}${row}`)
        const cell = `${String.fromCharCode(71)}${row}`

        worksheet.getCell(cell).value = value
        worksheet.getCell(cell).border = borders
        worksheet.getCell(cell).alignment = { horizontal: "left", wrapText: true }
        worksheet.getCell(cell).font = { name: "Calibri", size: 9 }
      } else if (colIndex > 6) {
        actualColIndex = colIndex + 2
        const cell = String.fromCharCode(65 + actualColIndex) + row

        worksheet.getCell(cell).value = value
        worksheet.getCell(cell).border = borders
        worksheet.getCell(cell).alignment = { horizontal: "left", wrapText: true }
        worksheet.getCell(cell).font = { name: "Calibri", size: 9 }

        if ([7, 8, 9, 10, 11, 12, 13, 14].includes(colIndex))
          worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
      } else {
        const cell = String.fromCharCode(65 + colIndex) + row

        if (colIndex === 1) worksheet.getCell(cell).numFmt = "mm/dd/yyyy"
        worksheet.getCell(cell).value = value
        worksheet.getCell(cell).border = borders
        worksheet.getCell(cell).alignment = { horizontal: "left", wrapText: true }
        worksheet.getCell(cell).font = { name: "Calibri", size: 9 }

        if ([7, 8, 9, 10, 11, 12, 13, 14].includes(colIndex))
          worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
      }
    })
  })

  const nextLine = data.length + 8

  worksheet.getCell(`E${nextLine}`).value = "TOTAL"
  worksheet.getCell(`E${nextLine}`).font = {
    name: "Calibri",
    size: 8,
    bold: true
  }
    ;["J", "K", "L", "M", "N", "O", "P"].forEach((col) => {
      worksheet.getCell(`${col}${nextLine}`).value = {
        formula: `SUM(${col}8:${col}${nextLine - 1})`,
        result: 0
      }
      worksheet.getCell(`${col}${nextLine}`).font = { name: "Calibri", bold: true, size: 8 }
      worksheet.getCell(`${col}${nextLine}`).numFmt =
        '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
    })

  const borders_cells = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P"
  ]

  borders_cells.forEach((cell) => {
    worksheet.getCell(`${cell}${nextLine}`).border = borders
  })

  const colums_final = [
    `D${nextLine + 5}`,
    `F${nextLine + 5}`,
    `G${nextLine + 5}`,
    `H${nextLine + 5}`,
    `I${nextLine + 5}`,
    `J${nextLine + 5}`
  ]

  // merges_cells.forEach((merge) => worksheet.mergeCells(merge))

  worksheet.getCell(`D${nextLine + 5}`).value = "Ventas Exentas"
  worksheet.getCell(`F${nextLine + 5}`).value = "Ventas Gravadas"
  worksheet.getCell(`G${nextLine + 5}`).value = "Exportaciones"
  worksheet.getCell(`H${nextLine + 5}`).value = "IVA"
  worksheet.getCell(`I${nextLine + 5}`).value = "Percibido"
  worksheet.getCell(`J${nextLine + 5}`).value = "Total"

  colums_final.forEach((col, index) => {
    worksheet.getCell(col).alignment = { horizontal: "center", wrapText: true }
    worksheet.getCell(col).font = { size: index === 2 ? 10 : 11, name: "Calibri" }
  })

  worksheet.getRow(nextLine + 6).height = 6
  worksheet.getCell(`B${nextLine + 7}`).value = "Consumidores Finales"
  worksheet.getCell(`B${nextLine + 8}`).value = "Contribuyentes"
  worksheet.getCell(`B${nextLine + 9}`).value = "Totales"
  worksheet.getCell(`B${nextLine + 9}`).font = { bold: true, name: "Calibri" }

  //FCF
  worksheet.getCell(`D${nextLine + 7}`).value = facturas.exenta
  worksheet.getCell(`F${nextLine + 7}`).value = facturas.gravada
  worksheet.getCell(`G${nextLine + 7}`).value = 0
  worksheet.getCell(`H${nextLine + 7}`).value = facturas.iva
  worksheet.getCell(`I${nextLine + 7}`).value = facturas.retencion
  worksheet.getCell(`J${nextLine + 7}`).value = facturas.total

  worksheet.getCell(`D${nextLine + 8}`).value = { formula: `+J${nextLine}` }
  worksheet.getCell(`F${nextLine + 8}`).value = { formula: `+K${nextLine}` }
  worksheet.getCell(`G${nextLine + 8}`).value = 0
  worksheet.getCell(`H${nextLine + 8}`).value = { formula: `+L${nextLine}` }
  worksheet.getCell(`I${nextLine + 8}`).value = { formula: `+O${nextLine}` }
  worksheet.getCell(`J${nextLine + 8}`).value = {
    formula: `SUM(D${nextLine + 8}+F${nextLine + 8}+G${nextLine + 8}+H${nextLine + 8})`
  }

  worksheet.getCell(`D${nextLine + 9}`).value = {
    formula: `SUM(D${nextLine + 7}+D${nextLine + 8})`
  }
  worksheet.getCell(`F${nextLine + 9}`).value = {
    formula: `SUM(F${nextLine + 7}+F${nextLine + 8})`
  }
  worksheet.getCell(`G${nextLine + 9}`).value = {
    formula: `SUM(G${nextLine + 7}+G${nextLine + 8})`
  }
  worksheet.getCell(`H${nextLine + 9}`).value = {
    formula: `SUM(H${nextLine + 7}+H${nextLine + 8})`
  }
  worksheet.getCell(`I${nextLine + 9}`).value = {
    formula: `SUM(I${nextLine + 7}+I${nextLine + 8})`
  }
  worksheet.getCell(`J${nextLine + 9}`).value = {
    formula: `SUM(D${nextLine + 9}+F${nextLine + 9}+G${nextLine + 9}+H${nextLine + 9})`
  }

  const totals = [
    `D${nextLine + 9}`,
    `E${nextLine + 9}`,
    `F${nextLine + 9}`,
    `G${nextLine + 9}`,
    `H${nextLine + 9}`,
    `I${nextLine + 9}`,
    `J${nextLine + 9}`
  ]

  const cell_to_format = [
    `D${nextLine + 7}`,
    `F${nextLine + 7}`,
    `G${nextLine + 7}`,
    `H${nextLine + 7}`,
    `I${nextLine + 7}`,
    `J${nextLine + 7}`,
    `D${nextLine + 8}`,
    `F${nextLine + 8}`,
    `G${nextLine + 8}`,
    `H${nextLine + 8}`,
    `I${nextLine + 8}`,
    `J${nextLine + 8}`,
    ...totals
  ]

  totals.forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true }
    worksheet.getCell(cell).border = {
      bottom: {
        style: "double"
      },
      top: {
        style: "thin"
      }
    }
  })

  cell_to_format.forEach((cell) => {
    worksheet.getCell(cell).numFmt = '_-"$"* #,##0.00_-;-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'
  })

  worksheet.getCell(`D${nextLine + 14}`).value = "Oscar Leopoldo Ramírez García"
  worksheet.getCell(`D${nextLine + 15}`).value = "Nombre contador o Contribuyente"
  worksheet.getCell(`D${nextLine + 14}`).font = { size: 9, name: "Calibri" }
  worksheet.getCell(`D${nextLine + 15}`).font = { size: 9, bold: true, name: "Calibri" }

  worksheet.getCell(`H${nextLine + 14}`).value = "______________________________"
  worksheet.getCell(`H${nextLine + 15}`).value = "Firma contador o Contribuyente"
  worksheet.getCell(`H${nextLine + 14}`).font = { size: 9, name: "Calibri" }
  worksheet.getCell(`H${nextLine + 15}`).font = { size: 9, bold: true, name: "Calibri" }

  worksheet.mergeCells(`D${nextLine + 14}:F${nextLine + 14}`)
  worksheet.mergeCells(`D${nextLine + 15}:F${nextLine + 15}`)

  worksheet.mergeCells(`H${nextLine + 14}:I${nextLine + 14}`)
  worksheet.mergeCells(`H${nextLine + 15}:I${nextLine + 15}`)

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/octet-stream" })

  return blob
}
