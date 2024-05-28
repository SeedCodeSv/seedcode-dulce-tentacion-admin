import { useEffect } from 'react';
import { Download, Minus, Plus, X } from 'lucide-react';
import { useExpenseStore } from '../../store/expenses.store';
interface Props {
    pdfViewerOpen: boolean;
    onClose: () => void
    id: number
}
function AnexoImg(props: Props) {
    const { get_expenses_attachment, expense_attachments } = useExpenseStore();
    const expenseAttachment = expense_attachments && expense_attachments.find((attachment) => attachment.id === props.id);
    const attachmentPath = expenseAttachment?.attachments[0]?.path

    useEffect(() => {
        if (props.id > 0) {
            get_expenses_attachment(props.id);
        }

    }, [])
    const zoomPlus = () => {

        if (document.getElementById("image")?.clientWidth) {
            document.getElementById("image")!.style.width = (document.getElementById("image")!.clientWidth + 100) + 'px';
        }
    }
    const zoomMinus = () => {

        if (document.getElementById("image")?.clientWidth) {
            document.getElementById("image")!.style.width = (document.getElementById("image")!.clientWidth - 100) + 'px';
        }
    }
    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = attachmentPath || '';
        link.download = 'attachment.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            <div className="w-full flex flex-col overflow-hidden">
                                <div className="flex justify-between  bg-gray-800 text-white p-2">
                                    <span className="px-2 py-1">
                                        Imagen de gasto
                                    </span>
                                    <button onClick={zoomPlus} className="px-2 py-1 rounded hover:bg-gray-700" >
                                        <Plus />
                                    </button>
                                    <button onClick={zoomMinus} className="px-2 py-1 rounded hover:bg-gray-700" >
                                        <Minus />
                                    </button>
                                    <div>
                                        <button
                                            onClick={downloadImage}
                                            className="px-2 py-1 rounded  hover:bg-red-600"
                                        >
                                            <Download />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex  justify-center items-center w-full h-full  overflow-y-auto">
                                    <img id="image" src={attachmentPath}></img>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default AnexoImg;
