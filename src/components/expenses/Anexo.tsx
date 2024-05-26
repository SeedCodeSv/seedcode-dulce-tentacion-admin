import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Download, Minus, Plus, Printer, X } from 'lucide-react';
import { useExpenseStore } from '../../store/expenses.store';

interface Props {

  pdfViewerOpen: boolean;
  onClose: () => void
  id : number
}
function AnexoPdf(props: Props) {
  const { get_expenses_attachment, expense_attachments } = useExpenseStore();
  const expenseAttachment =
    expense_attachments && expense_attachments.find((attachment) => attachment.id === props.id);
  const attachmentPath = expenseAttachment?.expenseAttachment.path;
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    if(props.id > 0) {
      get_expenses_attachment(props.id);
    }
    
  },[])
 
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
  return (
    <>
      {props.pdfViewerOpen === true ? (
        <>
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="absolute top-6 right-6 flex items-end justify-end ">
              <button
                className="px-2 py-1 rounded  bg-red-500 hover:bg-red-600"
                onClick={() => props.onClose()}
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
      ) : null}
    </>
  );
}

export default AnexoPdf;
