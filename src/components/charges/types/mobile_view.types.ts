import { ICharge } from './../../../types/charges.types';

export interface MobileViewProps {
    layout: 'grid' | 'list';
    deletePopover: ({ charges }: { charges: ICharge }) => JSX.Element;
    handleEdit: (charges: ICharge) => void;
    actions: string[];
    handleActive: (id: number) => void;
}

export interface GridProps {
    charges: ICharge,
    layout: "grid" | "list",
    deletePopover: ({ charges }: { charges: ICharge }) => JSX.Element,
    handleEdit: (charges: ICharge) => void,
    actions: string[],
    handleActive: (id: number) => void
}