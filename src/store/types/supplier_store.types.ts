import { PayloadSupplier } from "../../types/supplier.types";

export interface ISupplierStore{
    onPostSupplier: (payload:PayloadSupplier) => void
}