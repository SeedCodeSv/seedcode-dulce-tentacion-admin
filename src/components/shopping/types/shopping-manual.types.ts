import { Items } from "@/pages/contablilidad/types/types"
import { Dispatch, SetStateAction } from "react"

export interface ResumeShoppingProps {
    afecta: string,
    handleChangeAfecta: (e: string) => void
    exenta: string,
    handleChangeExenta: (e: string) => void
    totalIva: string
    $1perception: number
    total: string
    handleChangeTotal: (e: string) => void
}

export interface AccountItemProps {
    items: Items[];
    setItems: Dispatch<SetStateAction<Items[]>>;
    index: number;
    selectedIndex: number | null;
    setSelectedIndex: Dispatch<SetStateAction<number | null>>;
    openCatalogModal: (index: number) => void;
    onClose: () => void;
    branchName: string;
    $debe: number;
    $haber: number;
    $total: number;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    date: string;
    setDate: Dispatch<SetStateAction<string>>;
    selectedType: number;
    setSelectedType: Dispatch<SetStateAction<number>>;
}

export interface CodCuentaProps {
    items: Items[];
    setItems: Dispatch<SetStateAction<Items[]>>;
    index: number;
    openCatalogModal: (index: number) => void;
    onClose: () => void;
}