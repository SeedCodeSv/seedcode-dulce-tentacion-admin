import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { Mail, Search } from 'lucide-react';

import { get_customer_email } from '@/services/customers.service';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { CustomerInfo } from '@/types/customer.types';
import { Colors } from '@/types/themes.types';
import { API_URL } from '@/utils/constants';

interface Props {
  id: number;
  path: string;
  tipoDte: string;
  customerId: number
  onClose: () => void;
  style?: boolean;
}

const ResendEmail = ({ id, path, tipoDte, style = false, customerId, onClose }: Props) => {

  const [loading, setLoading] = useState(false);
  const [loadingCutomer, setLoadingCustomer] = useState(false)
  const {user} = useAuthStore()

  const [customer, setCustomer] = useState<CustomerInfo>()
  const modal = useDisclosure()

  const getCustomer = async () => {

    setLoadingCustomer(true)
    modal.onOpen()
    try {
      const res = await get_customer_email(customerId);

      setCustomer(res.data.customer);
      setLoadingCustomer(false)
    } catch {
      setLoadingCustomer(false)
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await axios.post<{ ok: boolean; message: string }>(
        `${API_URL}/sales/resend-email/${id}?branchId=${user?.branchId}`,
        {
          path,
          tipoDte,
          custInfo: customer
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok) {
        toast.success('Correo enviado exitosamente');
      }
    } catch (error) {
      toast.error('Error al enviar correo');
    } finally {
      setLoading(false);
      setCustomer(undefined)
      onClose()
      modal.onClose()
    }
  };



  return (
    <>
      {style ? (
        <>
          {loading === true || loadingCutomer === true ? (
            <FaSpinner className="w-full h-5 flex justify-center animate-spin text-gray-400 dark:text-gray-700" />
          ) : (
            <Button className="bg-transparent"
              startContent={<Mail size={20} />} onPress={getCustomer}>Reenviar Correo</Button>
          )}
        </>
      ) : (
        <>
          {loading === true || loadingCutomer === true ? (
            <FaSpinner className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-700" />
          ) : (
            <button className='w-full h-full flex items-start' onClick={getCustomer}>Reenviar Correo</button>
          )}
        </>
      )}
      <Modal isDismissable={false} isOpen={modal.isOpen}
      onClose={() => {
        modal.onClose();
        setCustomer(undefined)
        onClose()
      }}
      >
        <ModalContent>
          <ModalHeader>Confirmar correo</ModalHeader>
          <ModalBody>
            {!loadingCutomer && customer ? (
              <>
                <Input
                  isClearable
                  autoComplete="search"
                  className="w-full"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0'
                  }}
                  placeholder="Escribe el correo"
                  startContent={<Search />}
                  value={customer?.correo}
                  variant="bordered"
                  onChange={(e) => {
                    setCustomer({ ...customer, correo: e.target.value })
                  }}
                  onClear={() => setCustomer({ ...customer, correo: '' })}
                />
                <ButtonUi
                  isLoading={loading}
                  startContent={loading ? '' : <Mail size={20} />}
                  theme={Colors.Info}
                  onPress={handleResend}>Confirmar</ButtonUi>
              </>
            ) : (
              <FaSpinner className="w-5 h-5 animate-spin text-blue-400 dark:text-gray-700" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResendEmail;
