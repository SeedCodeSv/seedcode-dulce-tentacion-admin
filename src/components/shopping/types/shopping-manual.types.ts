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
    isReadOnly: boolean
}

export interface CodCuentaProps {
    items: Items[];
    setItems: Dispatch<SetStateAction<Items[]>>;
    index: number;
    openCatalogModal: (index: number) => void;
    onClose: () => void;
}
interface PSuplier {
    nrc: string;
    nit: string;
    tipoDocumento: string;
    numDocumento: string;
    telefono: string;
    correo: string;
    nombre: string;
    nombreComercial: string;
    codActividad: string;
    descActividad: string;
}

export interface AddSupplierProps {
    closeModal: () => void;
    setCode: (code: string, description: string) => void;
    supplier?: PSuplier;
    supplier_direction?: {
        municipio: string;
        departamento: string;
        complemento: string;
    };
    id?: number;
}