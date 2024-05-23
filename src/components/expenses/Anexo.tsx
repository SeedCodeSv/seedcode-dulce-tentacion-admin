
import { useEffect, useState } from "react";
import DefaultImage from "../../assets/default.png";
import { show_anexo } from "../../services/expenses.service";

interface Props {
    expenseID: number
}
const Anexo = (props: Props) => {
    const [urls, setUrls] = useState<string[]>([]);
    useEffect(() => {
        async () => {
            const { data } = await show_anexo(props.expenseID);
            if (data.ok) {
                const imageUrls = data.expense
                    .filter((annex) => {
                        const url = annex.expense.toLowerCase();
                        return (
                            url.includes(".jpeg") ||
                            url.includes(".jpg") ||
                            url.includes(".png") ||
                            url.includes(".pdf")
                        );
                    })
                    .map((imageAnnex) => imageAnnex.expense);
                setUrls(imageUrls);
            }
        }
    }, [props.expenseID]);

    // const file = show_anexo(props.expenseID)


    return (
        <>
            <div className="pb-0 pt-6 px-4 flex-col items-center">

                {urls.length > 0 ? (
                    <div className="mx-auto max-w-full max-h-full">
                        {urls.map((url, index) => (
                            <div key={index} className=" h-auto">

                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className=" h-auto border border-black-300 rounded-lg shadow-md object-contain"
                                />

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className=" flex justify-center">No hay imagenes disponibles.</p>
                )}

                {/* <img
                    className="h-100 w-100 rounded-xl border-2  border-gray-200 items-center justify-center"
                    src={"."}
                    alt="File"
                /> */}
            </div>
        </>
    )
}

export default Anexo
