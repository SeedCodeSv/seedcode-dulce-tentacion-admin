import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import { steps } from '../process/types/process.types';

import { IPropSendToMhShippingNote } from './types/handle_send_to_mh_shipping_note.types';
import { HandleUploadFile } from './HandleUploadFile';

import { SendMHFailed } from '@/types/transmitter.types';
import { send_to_mh } from '@/shopping-branch-product/service/dte_shipping_note.service';
import { return_mh_token } from '@/storage/localStorage';

export const HandleSendToMhShippingNote = ({
  data_send,
  json,
  firma,
  OnClearProductSelectedAll,
  setCurrentState,
  closeModal,
  pointOfSaleId,
  customerId,
  employeeId,
  setErrors,
  setTitleMessage,
  receivingBranchId,
  receivingEmployeeId,
  socket,
  branchIssuingId,
  orderId
}: IPropSendToMhShippingNote) => {
  setCurrentState(steps[1].title);

  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => {
    source.cancel('El tiempo de espera ha expirado');
  }, 25000);
  const token_mh = return_mh_token();

  if (!token_mh) {
    toast.error('Fallo al obtener las credenciales del Ministerio de Hacienda', {
      position: 'top-right',
    });

    return;
  }
  try {
    send_to_mh(data_send, token_mh!, source)
      .then(({ data }) => {
        const respuestaMH = data;

        HandleUploadFile({
          json,
          firma,
          respuestaMH,
          orderId,
          OnClearProductSelectedAll,
          closeModal() {
            closeModal();
          },
          setErrors: setErrors,
          setTitleMessage: setTitleMessage,

          setCurrentState(slep) {
            setCurrentState(slep);
          },
          pointOfSaleId,
          customerId,
          employeeId,
          receivingBranchId,
          receivingEmployeeId,
          socket: socket,
          branchIssuingId: branchIssuingId
        });
      })
      .catch(async (error: AxiosError<SendMHFailed>) => {
        clearTimeout(timeout);
        // const { nombre } = transmitter
        // const { numeroControl } = json.dteJson.identificacion

        if (axios.isCancel(error)) {
          setErrors(() => ['El tiempo de espera ha expirado']);
          setTitleMessage('El tiempo de espera ha expirado');
        }
        if (error.response?.data) {
          if (error && error.response && error.response.data && error.response.data.observaciones) {

            // const { descripcionMsg } = error.response.data

            // if (descripcionMsg === "[identificacion.numeroControl] YA EXISTE UN REGISTRO CON ESE VALOR") {
            //   await handleNumeroControlDuplicado(
            //     numeroControl,
            //     transmitter,
            //     branchIssuingId,
            //     token_mh,
            //     customerId!,
            //     receivingBranchId!,
            //     employeeId!,
            //     pointOfSaleId,
            //     user,
            //     json,
            //     correlatives,
            //     socket,
            //     setCurrentState,
            //     OnClearProductSelectedAll,
            //     closeModal
            //   )

            //   return
            // } else {
              setErrors(() => [
                ...(error.response!.data.observaciones.length > 0
                  ? error.response!.data.observaciones
                  : ['Error al enviar el documento']),
              ]);


              return;
            // }


            // setTitleMessage(error.response.data.descripcionMsg);
            // setErrors(() => [
            //   ...(error.response!.data.observaciones.length > 0
            //     ? error.response!.data.observaciones
            //     : ['Error al enviar el documento']),
            // ]);


            // return;
          } else {
            setTitleMessage('Error al enviar el documento');

          }
        } else {
          setTitleMessage('Error al enviar el documento ');
          setErrors(() => ['Error al enviar el documento ']);

        }
      });
  } catch (error) {
  }

  return <div />;
};
