import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Package,
  Receipt,
  User,
} from "lucide-react";
import { useEffect } from "react";

import { useDetailsSalesStore } from "@/store/detail-sales.store";
import { formatCurrency } from "@/utils/dte";

interface Props {
  id: number;
}

function DetailSales({ id }: Props) {
  const { getDetailSales, detailSales } = useDetailsSalesStore();

  useEffect(() => {
    getDetailSales(id);
  }, [id]);

  const paymentMethods = {
    "01": "Billetes y monedas",
    "02": "Tarjeta Débito",
    "03": "Tarjeta Crédito",
    "04": "Cheque",
    "05": "Transferencia - Depósito Bancario",
    "08": "Dinero electrónico",
    "09": "Monedero electrónico",
    "11": "Bitcoin",
    "12": "Otras Criptomonedas",
    "13": "Cuentas por pagar del receptor",
    "14": "Giro bancario",
    "99": "Otros (se debe indicar el medio de pago)",
  };

  const getPaymentMethodName = (code: string) => {
    return (
      paymentMethods[code as keyof typeof paymentMethods] || `Código ${code}`
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {detailSales && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Receipt className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Factura Electrónica
                  </h1>
                  <p className="text-gray-600">#{detailSales.numeroControl}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {detailSales.salesStatus.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">{detailSales.fecEmi}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Hora:</span>
                <span className="font-medium">{detailSales.horEmi}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Código:</span>
                <span className="font-mono text-xs">
                  {detailSales.codigoGeneracion}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Métodos de Pago
              </h2>
            </div>

            <div className="space-y-3">
              {detailSales.payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">
                        {payment.code}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getPaymentMethodName(payment.code)}
                      </p>
                      {payment.reference && (
                        <p className="text-sm text-gray-600">
                          Ref: {payment.reference}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(+payment.amount)}
                    </p>
                    {payment.period && (
                      <p className="text-sm text-gray-600">
                        Período: {payment.period}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Totals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumen de Totales
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(+detailSales.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Gravado:</span>
                  <span className="font-medium">
                    {formatCurrency(+detailSales.totalGravada)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Exento:</span>
                  <span className="font-medium">
                    {formatCurrency(+detailSales.totalExenta)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA:</span>
                  <span className="font-medium">
                    {formatCurrency(+detailSales.totalIva)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuentos:</span>
                  <span className="font-medium">
                    {formatCurrency(+detailSales.totalDescu)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total a Pagar:</span>
                    <span className="text-green-600">
                      {formatCurrency(+detailSales.totalPagar)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 italic">
                    {detailSales.totalLetras}
                  </p>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monto Recibido:</span>
                    <span className="font-medium">
                      {formatCurrency(+detailSales.amountReceived)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cambio:</span>
                    <span className="font-medium">
                      {formatCurrency(+detailSales.change)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información del Empleado
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {detailSales.employee.firstName}{" "}
                    {detailSales.employee.secondName}
                  </p>
                  <p className="font-medium text-gray-900">
                    {detailSales.employee.firstLastName}{" "}
                    {detailSales.employee.secondLastName}
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>DUI:</span>
                    <span className="font-medium">
                      {detailSales.employee.dui}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha de Ingreso:</span>
                    <span className="font-medium">
                      {detailSales.employee.dateOfEntry}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Información de Caja
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Punto de Venta:</span>
                      <span className="font-medium">
                        {detailSales.box.pointOfSale.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <span className="font-medium">
                        {detailSales.box.pointOfSale.description}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha Caja:</span>
                      <span className="font-medium">
                        {detailSales.box.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-900">
                      Código
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">
                      Producto
                    </th>
                    <th className="text-center py-3 px-2 font-medium text-gray-900">
                      Cantidad
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-gray-900">
                      Precio Unit.
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailSales.detailSales.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {item.branchProduct.product.code}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.branchProduct.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.branchProduct.product.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-medium">
                        {item.cantidadItem}
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {formatCurrency(+item.branchProduct.price)}
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {formatCurrency(+item.totalItem)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailSales;
