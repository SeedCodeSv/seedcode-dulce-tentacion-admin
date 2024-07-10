import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import Layout from "../../layout/Layout";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { formatDate } from "../../utils/dates";

function VentasPorProducto() {
  const service = new SeedcodeCatalogosMhService();
  const typeSales = service.get017FormaDePago();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [typePayment, setTypePayment] = useState("01");

  return (
    <Layout title="Ventas por Producto">
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="grid w-full grid-cols-3 gap-5">
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
        </div>
      </div>
    </Layout>
  );
}

export default VentasPorProducto;
