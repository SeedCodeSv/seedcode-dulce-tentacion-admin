
import { ReactElement, useEffect, useState } from "react";
import { IGetExpense } from "../../types/expenses.types";
import { Button } from "@nextui-org/react";
import { Document, Page } from 'react-pdf';
import { X } from "lucide-react";
import { useExpenseStore } from "../../store/expenses.store";

interface Props {
  expenses: IGetExpense;
  clear: () => void;
}
function Anexo(props: Props): ReactElement {
  const { description, id } = props.expenses;
  const { get_expenses_attachment, expense_attachments } = useExpenseStore();
  const expenseAttachment = expense_attachments && expense_attachments.find((attachment) => attachment.id === id);
  const attachmentPath = expenseAttachment?.expenseAttachment.path;
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    get_expenses_attachment(id);
  }, [id]);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const renderAttachmentContent = (): JSX.Element => {
    if (attachmentPath) {
      const fileExtension = attachmentPath.split('?')[0].split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf') {
        return (
          <>
            <div className="details-item p-2">
              <label className="details-label font-semibold">Archivo:</label>
              <object data={attachmentPath} type="application/pdf" width="100%" height="500px">
                <p>
                  <Button
                    color="danger"
                    className="bg-blue-500"
                    isIconOnly
                    aria-label="Abrir PDF"
                    onClick={() => setPdfViewerOpen(true)}
                  >
                    pdf
                  </Button>
                </p>
              </object>
            </div>
            {pdfViewerOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                <div className="relative max-w-[80vw] w-auto h-full">
                  <div className="bg-white max-w-[80vw] max-h-[90vh] overflow-y-auto">
                    <Document
                      file={attachmentPath}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>
                  <div className="p-4 flex justify-between">
                    <button
                      className="text-white bg-blue-500 px-4 py-2 rounded text-sm hover:text-gray-300"
                      onClick={previousPage}
                      disabled={pageNumber <= 1}
                    >
                      Página Anterior
                    </button>
                    <button
                      className="text-white bg-blue-500 px-4 py-2 rounded text-sm hover:text-gray-300"
                      onClick={nextPage}
                      disabled={pageNumber >= numPages}
                    >
                      Página Siguiente
                    </button>
                    <button
                      className="text-white bg-red-500 px-4 py-2 rounded text-sm hover:text-gray-300"
                      onClick={() => setPdfViewerOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      } else if (fileExtension && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        return (
          <div className="details-item p-2">
            <label className="details-label font-semibold">Anexo:</label>
            <img src={attachmentPath} alt="Attachment" className="w-full h-auto" />
          </div>
        );
      }
    }

    return (
      <div className="details-item p-2">
        <label className="details-label font-semibold">Anexo:</label>
        <p>No disponible</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end mt-[-20px]">
        <X size={20} onClick={() => props.clear()} />
      </div>
      <div className="details-container">
        <div className="details-content grid grid-cols-1 p-2">
          <div className="details-item">
            <label className="details-label font-semibold">Descripción:</label>
            <p>{description}</p>
          </div>
        </div>
        {renderAttachmentContent()}
      </div>
    </div>
  );
}

export default Anexo
