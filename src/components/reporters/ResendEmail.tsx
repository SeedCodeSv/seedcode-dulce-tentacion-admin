import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { Button } from '@heroui/react';

import { API_URL } from '@/utils/constants';
import { get_user } from '@/storage/localStorage';

interface Props {
  id: number;
  path: string;
  tipoDte: string;
  customerId: number;
  style?: boolean;
}

const ResendEmail = ({ id, path, tipoDte, style, customerId }: Props) => {
  const [loading, setLoading] = useState(false);
  const user = get_user();

  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await axios.post<{ ok: boolean; message: string }>(
        `${API_URL}/sales/resend-email/${id}?branchId=${user?.branchId}`,
        {
          path,
          tipoDte,
          customerId
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
    }
  };

  return (
    <>
      {style ? (
        <>
          {loading === true ? (
            <FaSpinner className="w-full h-5 flex justify-center animate-spin text-gray-400 dark:text-gray-700" />
          ) : (
            <Button className="bg-transparent"
              startContent={<Mail size={20} />} onPress={handleResend}>Reenviar Correo</Button>
          )}
        </>
      ) : (
        <>
          {loading === true ? (
            <FaSpinner className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-700" />
          ) : (
            <button onClick={handleResend}>Reenviar Correo</button>
          )}
        </>
      )}
    </>
  );
};

export default ResendEmail;
