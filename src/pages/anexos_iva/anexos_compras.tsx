import Layout from '@/layout/Layout';
// import { useShoppingReportsStore } from '@/store/reports/shopping_reports.store';
// import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/dte';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { csvmaker } from './utils';
import { useAuthStore } from '@/store/auth.store';
import { PiFileCsv, PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { generate_anexe_shopping } from '@/utils/utils';
import { months } from '@/utils/constants';
import { useShoppingStore } from '@/store/shopping.store';
import NO_DATA from "../../assets/no.png"

function AnexosCompras() {
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1)
  const { shopping_by_months, onGetShoppingByMonth, loading_shopping } = useShoppingStore()
  // const [startDate, setStartDate] = useState(formatDate());
  // const [endDate, setEndDate] = useState(formatDate());
  const { user } = useAuthStore()
  // const { annexes_list, onGetAnnexes } = useShoppingReportsStore();
  useEffect(() => {
    onGetShoppingByMonth(
      Number(user?.correlative?.branchId),
      monthSelected <= 9 ? "0" + monthSelected : monthSelected.toString()
    )
    // getExcludedSubjectByMonth(Number(user?.employee.branch.id), monthSelected)
  }, [monthSelected])
  // const { transmitter } = useAuthStore();
  // useEffect(() => {
  //   onGetAnnexes(transmitter?.id ?? 0, startDate, endDate);
  // }, [transmitter, startDate, endDate]);

  // const month = months.find((month) => month.value === monthSelected)?.name || ""

  // const exportAnnexes = async () => {
  //   const blob = await annexes_iva_shopping(annexes_list);
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'anexos-iva-compras.xlsx';
  //   link.click();
  // };
  const exportAnnexes = async () => {
    const month = months.find((month) => month.value === monthSelected)?.name || ""
    const blob = await generate_anexe_shopping(shopping_by_months)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `anexos-iva-compras_${month}_${new Date().getFullYear()}.xlsx`
    link.click()
  }
  // const exportAnnexesCSV = () => {
  //   const csv = csvmaker(annexes_list);
  //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'iva-compras.csv';
  //   link.click();
  // };
  const exportAnnexesCSV = () => {
    const month = months.find((month) => month.value === monthSelected)?.name || ""
    const csv = csvmaker(shopping_by_months)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `iva-compras_${month}_${new Date().getFullYear()}.csv`
    link.click()
  }


  return (
    <Layout title="Iva - Compras">
      <div className=" w-full h-full p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full flex flex-col h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full flex justify-between gap-5">
            <Select
              selectedKeys={[`${monthSelected}`]}
              onSelectionChange={(key) => {
                if (key) {
                  setMonthSelected(Number(new Set(key).values().next().value))
                }
              }}
              className="w-44"
              classNames={{ label: "font-semibold" }}
              label="Meses"
              labelPlacement="outside"
              variant="bordered"
            >
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </Select>
            {/* <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              type="date"
              variant="bordered"
              labelPlacement="outside"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            /> */}

            <div className="w-full flex justify-end gap-5 mt-4">
              <Button
                className="px-10 "
                endContent={<PiMicrosoftExcelLogoBold size={20} />}
                onClick={() => exportAnnexes()}
                color="secondary"
              >
                Exportar anexo
              </Button>
              {/* <Button style={global_styles().thirdStyle} onClick={exportAnnexes}>
              Exportar anexo
            </Button> */}
              <Button
                className="px-10"
                endContent={<PiFileCsv size={20} />}
                onClick={() => exportAnnexesCSV()}
                color="primary"
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
                  <div className="loader"></div>
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
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Fecha de emisión del documento
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Clase de documento
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Tipo de comprobante
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Número de documento
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            NIT o NRC del proveedor
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Nombre del proveedor
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                          >
                            Iva
                          </th>
                          <th
                            style={{ width: '200px' }}
                            className="p-3 text-[9px] uppercase font-black text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
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
                    <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                      <img className="w-44 mt-10" src={NO_DATA} alt="" />
                      <p className="mt-5 dark:text-white text-gray-600 text-xl">
                        No se encontraron resultados
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AnexosCompras;
