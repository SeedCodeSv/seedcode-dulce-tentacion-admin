import { Button, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { useMenuStore } from "@/store/menu.store";
import { Colors } from "@/types/themes.types";
import ButtonUi from "@/themes/ui/button-ui";
import useThemeColors from "@/themes/use-theme-colors";

interface Props {
    branchProductId: number;
    branchId: number
    productName: string
    reload: () => void
}

const DeletePopUp = ({ branchProductId, branchId, productName, reload }: Props) => {
    const deleteDisclosure = useDisclosure();
    const { DeleteMenu, getMenuByBranchProduct, menu } = useMenuStore()
    const [view, setView] = useState<'button' | ''>('button')

    useEffect(() => {
        getMenuByBranchProduct(branchProductId, branchId)
    }, [branchProductId, branchId])

    useEffect(() => {
        if (!menu && view === 'button') {
            setView('')
        }
    }, [branchProductId, view])

    const handleDelete = () => {
        if (menu) {
            DeleteMenu(menu.id, branchId).then((res) => {
                if (res) {
                    toast.success('Se elimino correctamente');
                    deleteDisclosure.onClose();
                    reload()
                } else {
                    toast.error('No se logro realizar la peticion');
                }
            });
        } else {
            toast.error('No hay menu a eliminar');

        }
    };

    const style = useThemeColors({ name: Colors.Error });

    return (
        <>
            {view === 'button' && (
                <Popover
                    className="border border-white rounded-2xl"
                    {...deleteDisclosure}
                    showArrow
                    backdrop="blur"
                >
                    <PopoverTrigger>
                        <Button
                            isIconOnly
                            style={style}

                        >
                            <Trash />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="flex flex-col items-center justify-center w-full p-5">
                            <p className="font-semibold text-gray-600 dark:text-white">Eliminar Menu {productName.length ?? 'N/A'}</p>
                            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
                                ¿Estas seguro de eliminar este registro?
                            </p>
                            <div className="flex justify-center mt-4 gap-5">
                                <ButtonUi
                                    className="border border-white"
                                    theme={Colors.Default}
                                    onPress={deleteDisclosure.onClose}
                                >
                                    No, cancelar
                                </ButtonUi>
                                <ButtonUi theme={Colors.Error} onPress={() => handleDelete()}>
                                    Si, eliminar
                                </ButtonUi>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

        </>
    );
};


export default DeletePopUp