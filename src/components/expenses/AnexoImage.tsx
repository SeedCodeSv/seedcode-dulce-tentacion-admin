import { useEffect, useState } from 'react';
import { LoaderCircle, Image, X } from 'lucide-react';
import { useExpenseStore } from '../../store/expenses.store';
import ModalGlobal from '../global/ModalGlobal';
import { Button } from "@heroui/react";
import { global_styles } from '../../styles/global.styles';

interface Props {
    pdfViewerOpen: boolean;
    onClose: () => void;
    id: number;
}

function AnexoImg(props: Props) {
    const { get_expenses_attachment, expense_attachments } = useExpenseStore();
    const [ImgView, setImgView] = useState<{ [key: number]: boolean }>({});
    const [loadingImg, setLoadingImg] = useState(true); 

    const expenseAttachment = expense_attachments && expense_attachments.find((attachment) => attachment.id === props.id);

    const attachmentPath = Array.isArray(expenseAttachment?.attachments)
        ? expenseAttachment.attachments.map((attachment) => ({
            path: attachment.path,
            ext: attachment.ext,
            id: attachment.id
        }))
        : [];

    useEffect(() => {
        const fetchData = async () => {
            if (props.id > 0) {
                await get_expenses_attachment(props.id);
                setLoadingImg(false);
            }
        };
        fetchData();
    }, [props.id, get_expenses_attachment]);

    // const zoomPlus = () => {

    //     if (document.getElementById("image")?.clientWidth) {
    //         document.getElementById("image")!.style.width = (document.getElementById("image")!.clientWidth + 100) + 'px';
    //     }
    // }
    // const zoomMinus = () => {

    //     if (document.getElementById("image")?.clientWidth) {
    //         document.getElementById("image")!.style.width = (document.getElementById("image")!.clientWidth - 100) + 'px';
    //     }
    // }
    // const downloadImage = () => {
    //     const link = document.createElement('a');
    //     link.href = attachmentPath[0].path;
    //     link.download = 'attachment.jpg';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const handleImageClose = (index: number) => {
        setImgView((prevState) => ({
            ...prevState,
            [index]: false
        }));
    }

    const openImageModal = (index: number) => {
        setImgView((prevState) => ({
            ...prevState,
            [index]: true
        }));
    }

    return (
        <>
            {props.pdfViewerOpen && (
                <>
                    {loadingImg ? (
                        <div className="w-full h-full flex flex-col justify-center items-center mt-4">
                            <LoaderCircle size={100} className="animate-spin dark:text-white" />
                            <p className="text-lg mt-4 font-semibold dark:text-white">...Cargando</p>
                        </div>
                    ) : (
                        <>
                            {attachmentPath.filter(
                                (attachment) =>
                                    attachment.ext === "png" ||
                                    attachment.ext === "jpg" ||
                                    attachment.ext === "jpeg" ||
                                    attachment.ext === "webp"
                            ).length > 0 && attachmentPath.length > 0 ? (
                                <div className="flex justify-center items-center m-4">
                                    <div className="flex justify-center">
                                        <div className="items-center justify-center grid grid-cols-3 gap-6">
                                            {attachmentPath.map((attachment, index) => {
                                                if (attachment.ext === "png" || attachment.ext === "jpg") {
                                                    return (
                                                        <div key={index}>
                                                            <Image
                                                                className="text-[#21618C] dark:text-white mt-4"
                                                                size={60}
                                                                onClick={() => openImageModal(index)}
                                                            />
                                                            {ImgView[index] && (
                                                                <ModalGlobal
                                                                    isOpen={ImgView[index]}
                                                                    onClose={() => handleImageClose(index)}
                                                                    title="Imagen Detalles"
                                                                    size="w-screen h-screen"
                                                                    isFull
                                                                >
                                                                    <div className="absolute z-[10] h-screen inset-0 bg-gray-50 dark:bg-gray-700">
                                                                        <Button
                                                                            style={global_styles().dangerStyles}
                                                                            isIconOnly
                                                                            onClick={() => handleImageClose(index)}
                                                                            className="flex fixed bottom-10 left-10 bg-red-600"
                                                                        >
                                                                            <X />
                                                                        </Button>
                                                                        <div className="flex  justify-center items-center w-full h-full  overflow-y-auto">
                                                                        <img src={attachment.path} className="w-full h-full" />
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </ModalGlobal>
                                                            )}
                                                        </div>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex justify-center items-center">
                                    <p>No hay información acerca de este archivo</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default AnexoImg;
