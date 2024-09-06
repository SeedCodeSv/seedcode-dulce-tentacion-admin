import { useEffect } from 'react';
import { useSalesInvalidation } from '../store/sales_invalidations.store';
import Logo from '../../../assets/MADNESS.png';
function DetailSale({ id }: { id: number }) {
  const { OnGetDetails, sale } = useSalesInvalidation();
  useEffect(() => {
    OnGetDetails(id);
  }, [id]);
  return (
    <div className="max-w-md mx-auto  p-6 bg-white dark:bg-transparent shadow-lg rounded-lg border-4 border-white ">
      <div className="text-center mb-6">
        <img src={Logo} alt="Madness" className="w-52 mx-auto mb-4" />
        <p className="text-sm text-blue-600">Ropa Americana ° Marcas ° Estilos </p>
      </div>
      <div className="text-center bg-red-600 text-white rounded-md p-3 mb-6 shadow-md">
        <p className="text-sm">Fecha: {sale.fecEmi}</p>
        <p className="text-sm">Ticket #: {sale.numeroControl}</p>
      </div>

      <div className="mb-6">
        {sale.details?.map?.((detail) => (
          <div
            key={detail.id}
            className="flex justify-between py-3 border-b border-gray-300 dark:border-gray-700"
          >
            <div>
              <p className="font-medium text-blue-600">{detail.branchProduct.product.name}</p>
              <p className="text-sm text-black dark:text-white">Cantidad: {detail.cantidadItem}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">${detail.totalItem}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-600 text-white rounded-md p-4 shadow-md mb-6">
        <div className="flex justify-between py-2">
          <span className="font-medium">Subtotal:</span>
          <span>${sale.subTotal}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium">IVA:</span>
          <span>${sale.totalIva}</span>
        </div>
        <div className="flex justify-between py-2 font-bold text-lg">
          <span>Total:</span>
          <span>${sale.totalPagar}</span>
        </div>
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-black dark:text-white">Gracias por su compra</p>
        <p className="text-sm text-black dark:text-white">Visítenos nuevamente</p>
      </div>
    </div>
  );
}
export default DetailSale;
