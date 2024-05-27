import { create } from "zustand";
import { ISupplierStore } from "./types/supplier_store.types";
import { add_supplier } from "../services/supplier.service";
import { toast } from "sonner";
import { messages } from "../utils/constants";

export const useSupplierStore = create<ISupplierStore>((set) => ({
    onPostSupplier(payload) {
        add_supplier(payload).then(({data})=>{
            if(data.ok){
                toast.success(messages.success);
            }
        })
    },
}))