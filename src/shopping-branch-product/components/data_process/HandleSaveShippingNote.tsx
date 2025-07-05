import { toast } from 'sonner';

import { steps } from '../process/types/process.types';

import { IPropSaveShippingNote } from './types/handle_save_shipping_note';

import { generate_a_shipping_note } from '@/shopping-branch-product/service/generate_a_shipping_note.service';

export const HandleSaveShippingNote = ({
  json_url,
  OnClearProductSelectedAll,
  setCurrentState,
  pointOfSaleId,
  employeeId,
  handleDownload,
  receivingBranchId,
  closeModal,
  socket,
  branchIssuingId,
  orderId,
}: IPropSaveShippingNote) => {
  setCurrentState(steps[3].title);
  generate_a_shipping_note({
    orderId: orderId,
    pointOfSaleId: pointOfSaleId,
    employeeId: employeeId,
    sello: true,
    dte: json_url,
    receivingBranchId,
  })
    .then((res) => {
      if (res.data.ok) {
        const targetSucursalId = receivingBranchId ?? 0

        toast.success('Nota de envío creada con éxito', { position: 'top-right' });
        socket.emit('new-referal-note-find-client', {
          targetSucursalId,
          note: {
            descripcion: "Enviado desde la sucursal" + branchIssuingId,
            fecha: new Date().toISOString(),
          }
        })
        OnClearProductSelectedAll();
        closeModal()
        sessionStorage.setItem('lastShippingNote', JSON.stringify(res.data.note));
        window.open('/pdf-preview', '_blank');

        if(orderId === 0){
          window.location.reload();
        }
        else{
          window.location.href = '/order-products'
        }
      } else {
        toast.error('Error al crear la nota de envió');
        handleDownload();
      }
    })
    .catch(() => {
      toast.error('Error al crear la nota de envió');
      handleDownload();
    });

  return <div />;
};
