import { useEffect } from 'react';
import { Button } from '@heroui/react';

import { IPropCustomer } from '../types/notes_of_remision.types';
import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { generateJsonNoteRemision } from '../types/format_of_the_json_for_sending_a_referral';
import { firmarNotaDeEnvio } from '../service/dte_shipping_note.service';

import { steps } from './process/types/process.types';
import { HandleSendToMhShippingNote } from './data_process/HandleSendToMhShippingNote';

import { PayloadMH } from '@/types/DTE/DTE.types';
import { useTransmitterStore } from '@/store/transmitter.store';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { useAuthStore } from '@/store/auth.store';
import { ambiente } from '@/utils/constants';
import { global_styles } from '@/styles/global.styles';




function GenerateAShippingNote(props: IPropCustomer) {
  const {
    customer,
    employee,
    pointOfSaleId,
    employeeReceptor,
    observation,
    branch,
    branchLlegada,
    
  } = props;

  const { gettransmitter, transmitter } = useTransmitterStore();
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const { user } = useAuthStore();

  useEffect(() => {
    gettransmitter();
  }, []);
  const { product_selected, OnClearProductSelectedAll } = useShippingBranchProductBranch();
  const generateJson = async () => {
    props.onOpenChange();
    props.setTitleString('');
    props.setErrors([]);
    props.setCurrentStep(steps[0].title);
    const correlatives = await getCorrelativesByDte(Number(user?.id), 'NRE');
    const generatedJson = generateJsonNoteRemision(
      employee,
      { ...transmitter },
      correlatives!,
      product_selected,
      branch,
      observation,
      0,

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
  };

  return (
    <div>
      <Button
        className="w-full px-10"
        isDisabled={pointOfSaleId === 0}
        style={global_styles().darkStyle}
        variant="light"
        onClick={generateJson}
      >
        Guardar
      </Button>
    </div>
  );
}

export default GenerateAShippingNote;
