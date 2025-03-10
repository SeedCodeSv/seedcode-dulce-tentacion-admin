import { AccountCatalog } from "@/types/accountCatalogs.types"
import ExcelJS from "exceljs"
export const generate_catalog_de_cuentas = async (accountCatalogs: AccountCatalog[]) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("CATALOGO DE CUENTAS")

    worksheet.columns = [
        { key: "A", width: 23.57 },
        { key: "B", width: 37.29 },
        { key: "C", width: 22.57 },
        { key: "D", width: 18.57 },
        { key: "E", width: 28 },
        { key: "F", width: 36.29 },
        { key: "G", width: 20 },
        { key: "H", width: 24.71 },
        { key: "I", width: 24.71 },
        { key: "J", width: 24.71 },
    ]

    const titles = [
        {
            title: "ID DE CUENTA",
            column: "A"
        },
        {
            title: "NOMBRE DE CUENTA",
            column: "B"
        },
        {
            title: "ID CUENTAMAY",
            column: "C"
        },
        {
            title: "NIVEL DE CUENTA",
            column: "D"
        },
        {
            title: "TIPO DE CUENTA",
            column: "E"
        },
        {
            title: "CARGAR COMO",
            column: "F"
        },
        {
            title: "SALDO INICIAL",
            column: "G"
        },
        {
            title: "CARGOS MES 01",
            column: "H"
        },
        {
            title: "ABONO MES 01",
            column: "I"
        },
        {
            title: "SALDO MES 01",
            column: "J"
        },

    ]

    worksheet.getRow(1).height = 32.25

    titles.forEach((title) => {
        worksheet.getCell(`${title.column}1`).style = {
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF5b9bd5" } }
        }
        worksheet.getCell(`${title.column}1`).value = title.title
        worksheet.getCell(`${title.column}1`).font = {
            bold: true,
            size: 11,
            color: { argb: "FFFFFFFF" }
        }
        worksheet.getCell(`${title.column}1`).alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true
        }
    })

    let nextLine = 2

    for (const shopping of accountCatalogs) {

        worksheet.getCell(`A${nextLine}`).value = (shopping.id)
        worksheet.getCell(`B${nextLine}`).value = (shopping.name)
        worksheet.getCell(`C${nextLine}`).value = (shopping.majorAccount.toString())
        worksheet.getCell(`D${nextLine}`).value = (shopping.accountLevel)
        worksheet.getCell(`E${nextLine}`).value = shopping.accountType
        worksheet.getCell(`F${nextLine}`).value = (shopping.uploadAs)
        worksheet.getCell(`G${nextLine}`).value = ('0.00')
        worksheet.getCell(`H${nextLine}`).value = ('0.00')
        worksheet.getCell(`I${nextLine}`).value = ('0.00')
        worksheet.getCell(`J${nextLine}`).value = ('0.00')

        //formats
        worksheet.getCell(`G${nextLine}`).numFmt = "#,##0.00"
        worksheet.getCell(`H${nextLine}`).numFmt = "#,##0.00"
        worksheet.getCell(`I${nextLine}`).numFmt = "#,##0.00"
        worksheet.getCell(`J${nextLine}`).numFmt = "#,##0.00"

        nextLine += 1
    }

    const buffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([buffer], { type: "application/octet-stream" })

    return blob
}

