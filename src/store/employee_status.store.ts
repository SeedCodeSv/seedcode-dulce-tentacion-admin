import { get_employee_status } from './../services/employee_status.service';
import { create } from "zustand";
import { IEmployeeStatusStore } from "./types/employee_status.store.types";

export const useEmployeeStatusStore = create<IEmployeeStatusStore>((set) => ({
    employee_status: [],
    GetEmployeeStatus() {
        get_employee_status()
        .then(({ data }) => set({ employee_status: data.employeeStatus }))
            .catch(() => {
                set({ employee_status: [] });
            });
    },

}))