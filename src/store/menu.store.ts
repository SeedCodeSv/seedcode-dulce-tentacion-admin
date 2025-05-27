import { create } from "zustand";
import { toast } from "sonner";

import { IUseMenuStore } from "./types/menu.store.types";

import { Menu } from "@/types/menu.types";
import { delete_menu, get_menu_by_branchProduct, update_menu_details } from "@/services/menu.service";

export const useMenuStore = create<IUseMenuStore>((set) => ({
    menu: {} as Menu,
    MenuDetails: [],
    getMenuByBranchProduct(id, branchId) {
        return get_menu_by_branchProduct(id, branchId).then(({ data }) => {
            set({ menu: data.menu, MenuDetails: data.MenuDetails })
        }).catch(() => {
            set({
                menu: {} as Menu, MenuDetails: []
            })
        })
    },
    updateMenu(id, branchId, payload) {
        return update_menu_details(id, branchId, payload).then(() => {
            toast.success('Se actualizo con exito')

            return true
        }).catch(() => {
            toast.error('Ocurrio un error ')

            return false
        })

    },
    DeleteMenu(id, branchProductId) {
        return delete_menu(id, branchProductId).then(() => {
            return true
        }).catch(() => {
            return false
        })
    }
}))