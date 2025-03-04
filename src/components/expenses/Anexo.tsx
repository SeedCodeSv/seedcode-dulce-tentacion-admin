import { useContext, useEffect, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useExpenseStore } from '../../store/expenses.store';
import axios from 'axios';
import { ThemeContext } from '../../hooks/useTheme';
import { Button } from "@heroui/react";
import { toast } from 'sonner';

interface Props {
  pdfViewerOpen: boolean;
  onClose: () => void;
  id: number;
}

function AnexoPdf(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { get_expenses_attachment, expense_attachments } = useExpenseStore();
  const expenseAttachment = expense_attachments && expense_attachments.find((attachment) => attachment.id === props.id);
  const attachmentPath = expenseAttachment?.attachments[0]?.path;
  const [urlPDF, setUrlPDF] = useState<string>('');
  useEffect(() => {
    if (props.id > 0) {
      get_expenses_attachment(props.id);
    }
  }, [props.id, get_expenses_attachment]);

  useEffect(() => {
    const fetchPDF = async () => {
      if (attachmentPath) {
        try {
          const response = await axios.get(attachmentPath, { responseType: 'blob' });
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(blob);
          setUrlPDF(pdfUrl);
        } catch (error) {
          toast.warning("anexo no recivido")
        }
      }
    };
    fetchPDF();
  }, [attachmentPath]);

  return (
    <>
      {props.pdfViewerOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-white rounded shadow-lg flex overflow-hidden">
            {urlPDF !== '' ? (
              <div className="w-screen h-screen">
                <iframe src={urlPDF} className="w-screen h-screen" />
                <Button
                  style={{ backgroundColor: theme.colors.danger, }}
                  isIconOnly
                  onClick={() => {
                    props.onClose()
                    setUrlPDF('')
                  }}
                  className="fixed bottom-10 left-10"
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <LoaderCircle size={100} className=" animate-spin" />
                <p className="text-lg mt-4 font-semibold">Cargando...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AnexoPdf;
