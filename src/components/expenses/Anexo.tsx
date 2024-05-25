import { ReactElement, useEffect, useRef, useState } from 'react';
import { IGetExpense } from '../../types/expenses.types';
import { Button } from '@nextui-org/react';
import { Document, Page } from 'react-pdf';
import { Download, Minus, Plus, Printer, X } from 'lucide-react';
import { useExpenseStore } from '../../store/expenses.store';

interface Props {
  expenses: IGetExpense;
  clear: () => void;
}
function Anexo(props: Props): ReactElement {
  const { description, id } = props.expenses;
  const { get_expenses_attachment, expense_attachments } = useExpenseStore();
  const expenseAttachment =
    expense_attachments && expense_attachments.find((attachment) => attachment.id === id);
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
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scale, setScale] = useState(1.0);
  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };
  useEffect(() => {
    if (pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]!.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pageNumber]);

  const downloadPdf = () => {
    window.open(attachmentPath, '_blank');
  };

  const renderAttachmentContent = (): JSX.Element => {
    if (attachmentPath) {
      const fileExtension = attachmentPath.split('?')[0].split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf') {
        return (
          <>
            <div className="details-item p-2">
              <label className="details-label font-semibold">Archivo:</label>
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
            </div>
            {pdfViewerOpen && (
              <>
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                  <div className="absolute top-6 right-6 flex items-end justify-end ">
                    <button
                      className="px-2 py-1 rounded  bg-red-500 hover:bg-red-600"
                      onClick={() => setPdfViewerOpen(false)}
                    >
                      <X className="text-white" />
                    </button>
                  </div>
                  <div className="relative w-4/5 h-4/5 bg-white rounded shadow-lg flex overflow-hidden">
                    <div className="w-4/5 flex flex-col overflow-hidden">
                      <div className="flex justify-between  bg-gray-800 text-white p-2">
                        <span className="px-2 py-1">
                          Página {pageNumber} de {numPages}
                        </span>
                        <button className="px-2 py-1 rounded hover:bg-gray-700" onClick={zoomIn}>
                          <Plus />
                        </button>
                        <button className="px-2 py-1 rounded hover:bg-gray-700" onClick={zoomOut}>
                          <Minus />
                        </button>
                        <div>
                          <button
                            className="px-2 py-1 rounded  hover:bg-red-600"
                            onClick={() => downloadPdf()}
                          >
                            <Download />
                          </button>
                          <button className="px-2 py-1 rounded  hover:bg-red-600">
                            <Printer />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto">
                        <Document file={attachmentPath} onLoadSuccess={onDocumentLoadSuccess}>
                          {Array.from(new Array(numPages), (_el, index) => (
                            <div
                              key={`page_${index + 1}`}
                              className="my-2 flex justify-center"
                              ref={(el) => (pageRefs.current[index] = el)}
                            >
                              <Page pageNumber={index + 1} scale={scale} />
                            </div>
                          ))}
                        </Document>
                      </div>
                    </div>
                    {/* Columna derecha para las miniaturas */}
                    <div className="w-1/5 bg-gray-100 overflow-y-auto">
                      {Array.from(new Array(numPages), (_el, index) => (
                        <div
                          key={`thumbnail_${index + 1}`}
                          className={`m-2 border rounded cursor-pointer ${pageNumber === index + 1 ? 'border-blue-500' : ''}`}
                          onClick={() => setPageNumber(index + 1)}
                        >
                          <Document file={attachmentPath}>
                            <Page
                              pageNumber={index + 1}
                              width={100}
                              renderMode="canvas"
                              customTextRenderer={({ str, itemIndex }) => {
                                // Solo mostrar la primera mitad del texto
                                if (itemIndex < str.length / 2) return str[itemIndex];
                                return '';
                              }}
                            />
                          </Document>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
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

export default Anexo;
