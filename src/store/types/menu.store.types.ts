import { Menu, MenuDetail } from "@/types/menu.types";

export interface IUseMenuStore {
    menu: Menu,
    MenuDetails: MenuDetail[]
    getMenuByBranchProduct: (id: number, branchId: number) => void
    updateMenu: (id: number, branchId: number, payload: any) => Promise<boolean>
    DeleteMenu: (id: number, branchProductId: number) => Promise<boolean>
}