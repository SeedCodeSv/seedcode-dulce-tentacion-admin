import { Button, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from 'react';
import { PiFileCsv, PiMicrosoftExcelLogoBold } from 'react-icons/pi';

import NO_DATA from "../../assets/no.png"

import { csvmaker } from './utils';

import Layout from '@/layout/Layout';
import { formatCurrency } from '@/utils/dte';
import { generate_anexe_shopping } from '@/utils/utils';
import { months } from '@/utils/constants';
import { useShoppingStore } from '@/store/shopping.store';
import { get_user } from '@/storage/localStorage';
import DivGlobal from "@/themes/ui/div-global";

function AnexosCompras() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1)
  const { shopping_by_months, onGetShoppingByMonth, loading_shopping } = useShoppingStore()

  const transmiter = get_user();

  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear, name: currentYear.toString() },
    { value: currentYear - 1, name: (currentYear - 1).toString() }
  ]; 
  const [yearSelected, setYearSelected] = useState(currentYear);

  useEffect(() => {
    onGetShoppingByMonth(
      Number(transmiter?.pointOfSale?.branch.transmitter.id),
      monthSelected <= 9 ? "0" + monthSelected : monthSelected.toString(), yearSelected
    )
  }, [monthSelected, yearSelected])

  const exportAnnexes = async () => {
    const month = months.find((month) => month.value === monthSelected)?.name || ""
    const blob = await generate_anexe_shopping(shopping_by_months)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `anexos-iva-compras_${month}_${yearSelected}.xlsx`
    link.click()
  }

  const exportAnnexesCSV = () => {
    const month = months.find((month) => month.value === monthSelected)?.name || ""
    const csv = csvmaker(shopping_by_months)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `iva-compras_${month}_${yearSelected}.csv`
    link.click()
  }


  return (
    <Layout title="Iva - Compras">
      <DivGlobal>
          <div className="w-full flex justify-between gap-5">
            <Select
              className="w-44"
              classNames={{ label: "font-semibold" }}
              label="Meses"
              labelPlacement="outside"
              selectedKeys={[`${monthSelected}`]}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  setMonthSelected(Number(new Set(key).values().next().value))
                }
              }}
            >
              {months.map((month) => (
                <SelectItem key={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </Select>
            <Select
                className="w-44"
                classNames={{ label: "font-semibold" }}
                label="Año"
                labelPlacement="outside"
                selectedKeys={[`${yearSelected}`]}
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setYearSelected(Number(new Set(key).values().next().value))
                  }
                }}
              >
                {years.map((years) => (
                  <SelectItem key={years.value}>
                    {years.name}
                  </SelectItem>
                ))}
              </Select>

            <div className="w-full flex justify-end gap-5 mt-4">
              <Button
                className="px-10 "
                color="secondary"
                endContent={<PiMicrosoftExcelLogoBold size={20} />}
                onClick={() => exportAnnexes()}
              >
                Exportar anexo
              </Button>
              {/* <Button style={global_styles().thirdStyle} onClick={exportAnnexes}>
              Exportar anexo
            </Button> */}
              <Button
                className="px-10"
                color="primary"
                endContent={<PiFileCsv size={20} />}
                onClick={() => exportAnnexesCSV()}
              >
                Exportar CSV
              </Button>
              {/* <Button style={global_styles().secondaryStyle} onClick={exportAnnexesCSV}>
              Exportar a CSV
            </Button> */}
            </div>
          </div>

          <div className="max-h-full w-full relative  overflow-x-auto overflow-y-auto custom-scrollbar mt-4">


            {loading_shopping ? (
              <>
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader" />
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              </>) : (
              <>
                {shopping_by_months.length > 0 ? (
                  <>
                    <table className=" w-full">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Fecha de emisión del documento
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Clase de documento
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Tipo de comprobante
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Número de documento
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            NIT o NRC del proveedor
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Nombre del proveedor
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Iva
                          </th>
                          <th
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            style={{ width: '200px' }}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopping_by_months.map((shopping, index) => (
                          <tr key={index} className="border-b border-slate-200">
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.fecEmi}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.classDocumentCode}. {shopping.classDocumentValue}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.typeDte === '03'
                                ? '03 - COMPROBANTE DE CREDITO FISCAL'
                                : '01 - FACTURA'}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.supplier.numDocumento}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.supplier.nrc}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {shopping.supplier.nombre}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {formatCurrency(Number(shopping.totalIva))}
                            </td>
                            <td className="p-3 text-xs text-slate-500 dark:text-slate-100">
                              {formatCurrency(Number(shopping.montoTotalOperacion))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full flex  p-10 flex-col justify-center items-center">
                      <img alt="" className="w-44 mt-10" src={NO_DATA} />
                      <p className="mt-5 dark:text-white text-gray-600 text-xl">
                        No se encontraron resultados
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
       </DivGlobal>
    </Layout>
  );
}

export default AnexosCompras;
