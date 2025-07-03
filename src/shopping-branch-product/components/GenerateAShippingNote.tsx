import { useContext, useEffect } from 'react';
import { toast } from 'sonner';

import { IPropCustomer } from '../types/notes_of_remision.types';
import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { generateJsonNoteRemision } from '../types/format_of_the_json_for_sending_a_referral';
import { firmarNotaDeEnvio } from '../service/dte_shipping_note.service';
import { singInvoiceContingence04 } from '../types/contingence_actions';

import { steps } from './process/types/process.types';
import { HandleSendToMhShippingNote } from './data_process/HandleSendToMhShippingNote';

import { PayloadMH } from '@/types/DTE/DTE.types';
import { useTransmitterStore } from '@/store/transmitter.store';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { ambiente } from '@/utils/constants';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useAuthStore } from '@/store/auth.store';
import { SessionContext } from '@/hooks/useSession';




function GenerateAShippingNote(props: IPropCustomer) {
  const {
    customer,
    employee,
    pointOfSaleId,
    employeeReceptor,
    observation,
    branch,
    branchLlegada,
    socket,
    branchIssuingId,
  } = props;

  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCorrelativesByBranch } = useCorrelativesDteStore();
  const { user } = useAuthStore()
  const { contingence } = useContext(SessionContext)
  const handleReload = () => { }

  useEffect(() => {
    gettransmitter();
  }, []);
  const { product_selected, OnClearProductSelectedAll, orderId } = useShippingBranchProductBranch();
  const generateJson = async () => {
    props.onOpenChange();
    props.setTitleString('');
    props.setErrors([]);
    props.setCurrentStep(steps[0].title);
    const correlatives = await getCorrelativesByBranch(Number(branch?.id), 'NRE');
    const generatedJson = generateJsonNoteRemision(
      employee,
      { ...transmitter },
      correlatives!,
      product_selected,
      branch,
      observation,
      false,
      0,
      employeeReceptor
    );

    try {
      firmarNotaDeEnvio(generatedJson)
        .then((res) => {
          if (res.data.body) {
            const firma = res.data.body;

            const data_send: PayloadMH = {
              ambiente: ambiente,
              idEnvio: 1,
              version: 3,
              tipoDte: '04',
              documento: res.data.body,
            };

            if (res.data.body && generatedJson) {
              HandleSendToMhShippingNote({
                orderId,
                user,
                data_send,
                json: generatedJson,
                firma,
                receivingBranchId: branchLlegada?.id,
                receivingEmployeeId: employeeReceptor?.id,
                OnClearProductSelectedAll,
                closeModal() {
                  props.onOpenChange();
                },

                setCurrentState(step) {
                  props.setCurrentStep(step);
                },

                setErrors: (error) => {
                  props.setErrors(error);
                },
                setTitleMessage: (title) => {
                  props.setTitleString(title);
                },
                pointOfSaleId,
                customerId: customer?.id,
                employeeId: employee?.id,
                socket: socket,
                branchIssuingId: branchIssuingId,
                transmitter,
                correlatives,

              });
            } else {
              props.setTitleString('Error al firmar el documento 222');
              props.setErrors(['Error al firmar el documento 222']);
            }
          } else {
            props.setTitleString('Error al firmar el documento 3333');
            props.setErrors(['Error al firmar el documento 333333']);
          }
        })
        .catch(() => {
          props.setTitleString('Error al firmar el documento 44444');
          props.setErrors(['Error al firmar el documento 44444']);



        });
    } catch (error) {
    }
  }
  const handleContingence = async () => {
    const correlatives = await getCorrelativesByBranch(Number(branch?.id), 'NRE');

    if (!correlatives) {
      toast('No se realizo el proceso')

      return
    }
    if (!correlatives) {
      toast.error('Error al obtener correlativos', {
        description: 'No se encontraron los correlativos solicitados'
      })

      return
    }


    singInvoiceContingence04(
      employee,
      { ...transmitter },
      correlatives!,
      product_selected,
      branch,
      observation,
      0,
      socket,
      pointOfSaleId,
      employee?.id ?? 0,
      branchLlegada?.id ?? 0,
      user?.branchId ?? 0,
      handleReload,
      employeeReceptor!
    )

  }

  return (
    <div>
      <ButtonUi
        className="w-full px-10"
        isDisabled={pointOfSaleId === 0}
        theme={Colors.Success}
        onPress={() => {
          if (contingence) {
            handleContingence()
          } else {
            generateJson()
          }
        }}
      >
        Guardar
      </ButtonUi>
    </div>
  );
}

export default GenerateAShippingNote;
