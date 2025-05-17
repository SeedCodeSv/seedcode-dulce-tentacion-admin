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
  customerId,
  handleDownload,
  receivingBranchId,
  closeModal
}: IPropSaveShippingNote) => {
  setCurrentState(steps[3].title);
  generate_a_shipping_note({
    pointOfSaleId: pointOfSaleId,
    employeeId: employeeId,
    sello: true,
    customerId: customerId,
    dte: json_url,
    receivingBranchId,
  })
    .then((res) => {
      if (res.data.ok) {
        toast.success('Nota de envío creada con éxito', { position: 'top-right' });
        OnClearProductSelectedAll();
        closeModal()
        window.location.reload();
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
