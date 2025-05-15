import { Dispatch, SetStateAction, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AlignRight } from 'lucide-react';
import { Button, useDisclosure } from '@heroui/react';

import ModalGlobal from '../global/ModalGlobal';
import EmptyTable from '../global/EmptyTable';

import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { return_branch_id } from '@/storage/localStorage';
import { Customer } from '@/types/customers.types';
import { useBranchProductStore } from '@/store/branch_product.store';
import { useCustomerStore } from '@/store/customers.store';
import { useAuthStore } from '@/store/auth.store';
import { useReferalNote } from '@/store/referal-notes';
import { NRE_DteJson } from '@/types/svf_dte/nre.types';

interface Props {
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
}

const GenerateSaleByNote = ({ setCustomer }: Props) => {
  const { onAddProductsByList } = useBranchProductStore();
  const { onGetReferalNotes, referalNotes } = useReferalNote();
  const { getCustomersList, customer_list } = useCustomerStore();

  const { user } = useAuthStore();

  useEffect(() => {
    user?.transmitterId &&
      onGetReferalNotes(user?.transmitterId, 1, 10, '2025-03-01', '2025-03-31');
  }, []);


  const modalNotes = useDisclosure();

  const handleGetJsonData = async (dte: string) => {
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: dte,
      })
    );
    const json = await axios.get<NRE_DteJson>(url, { responseType: 'json' });

    if (!json || !json.data) {
      toast.error('Ocurrió un error al obtener la información');

      return;
    }
    const branchId = Number(return_branch_id());

    if (!branchId || branchId === 0) {
      toast.error('Ocurrió un error al obtener la sucursal');

      return;
    }

    getCustomersList();
    try {
      if (json && json.data.cuerpoDocumento.length > 0) {
        const data = json.data.cuerpoDocumento.map((item) => {
          return {
            numItem: item.numItem,
            tipoItem: item.tipoItem,
            numeroDocumento: item.numeroDocumento,
            cantidad: item.cantidad,
            codigo: item.codigo,
            codTributo: item.codTributo,
            uniMedida: item.uniMedida,
            descripcion: item.descripcion,
            precioUni: item.precioUni,
            montoDescu: item.montoDescu,
            ventaNoSuj: item.ventaNoSuj,
            ventaExenta: item.ventaExenta,
            ventaGravada: item.ventaGravada,
            tributos: item.tributos,
            psv: 0,
            noGravado: 0,
            ivaItem: 0,
          };
        });

        try {
          onAddProductsByList(branchId, data);
          toast.success('Se agregaron los productos a la lista de venta');
          modalNotes.onClose();
          const customer = customer_list.find(
            (item) => item.numDocumento === json.data.receptor.numDocumento
          );

          if (customer) {
            setCustomer(customer);
          } else {
            toast.warning('Seleccione un cliente');
          }
        } catch (error) {
          toast.error('Error al agregar los productos a la lista de venta');
        }
      } else {
        toast.error('No se encontraron productos');

        return;
      }
    } catch (error) {
      toast.error('Error al agregar los productos a la lista de venta');
    }
  };

  return (
    <>
      <Button
        className="bg-blue-600 text-white"
        color="primary"
        endContent={<AlignRight />}
        onPress={modalNotes.onOpen}
      >
        Notas de Remision
      </Button>
      <ModalGlobal
        isOpen={modalNotes.isOpen}
        size="xl"
        title="Notas de Remision"
        onClose={modalNotes.onClose}
      >
        <div>
          <table className="min-w-full bg-white border-collapse">
            <thead className="sticky top-0 z-10 text-white border border-gray-600 bg-gray-800">
              <tr>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">N°</th>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">Cliente </th>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">Fecha</th>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">Hora</th>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">Total</th>
                <th className="px-4 text-[10px] whitespace-nowrap py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              {referalNotes.length === 0 && (
                <tr className="">
                  <td className="px-4 py-3 text-xs text-left" colSpan={6}>
                    <EmptyTable />
                  </td>
                </tr>
              )}
              {referalNotes.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-xs text-left">{index + 1}</td>
                  <td className="px-4 py-3 text-xs text-left">
                    {item.customer?.nombre ?? item.employee?.fullName}
                  </td>
                  <td className="px-4 py-3 text-xs text-left">{item.fecEmi}</td>
                  <td className="px-4 py-3 text-xs text-left">{item.horEmi}</td>
                  <td className="px-4 py-3 text-xs text-left">{item.totalPagar}</td>
                  <td className="px-4 py-3 text-xs text-left">
                    <Button
                      className="hover:scale-90 transition-all duration-200 ease-in-out bg-blue-600 text-white"
                      onClick={() => handleGetJsonData(item.pathJson)}
                    >
                      Procesar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModalGlobal>
    </>
  );
};

export default GenerateSaleByNote;
