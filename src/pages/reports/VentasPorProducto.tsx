import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import Layout from "../../layout/Layout";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dates";
import GraphicProductCategory from "./Product/GraphicProductCategory";
import { salesReportStore } from "@/store/reports/sales_report.store";

function VentasPorProducto() {
  const service = new SeedcodeCatalogosMhService();
  const typeSales = service.get017FormaDePago();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState("");


  const {getGraphicForCategoryProductsForDates} = salesReportStore()

  useEffect(() => {
    getGraphicForCategoryProductsForDates(startDate, endDate, typePayment)
  }, [startDate, endDate, typePayment])


  return (
    <Layout title="Ventas por Producto">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid w-full gap-5 grdid-cols-1 md:grid-cols-3">
            <Input
              label="Fecha inicial"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              variant="bordered"
              className="w-full"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Fecha final"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              variant="bordered"
              className="w-full"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Select
              variant="bordered"
              label="Tipo de pago"
              placeholder="Selecciona el tipo de pago"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              className="w-full"
              value={typePayment}
              defaultSelectedKeys={typePayment}
              onSelectionChange={(key)=>{
                if(key){
                    const payment = new Set(key)
                    setTypePayment(payment.values().next().value)
                }
              }}
            >
              {typeSales.map((type) => (
                <SelectItem
                  key={type.codigo}
                  value={type.codigo}
                  className="dark:text-white"
                >
                  {type.valores}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-3"></div>
          <GraphicProductCategory startDate={startDate} endDate={endDate} branch="" />
        </div>
      </div>
    </Layout>
  );
}

export default VentasPorProducto;
