import { create } from 'zustand';
import { IEmployeeStore } from './types/employee.store';
import {
  activate_employee,
  delete_employee,
  get_employee_list,
  get_employees_paginated,
  patch_employee,
  save_employee,
} from '../services/employess.service';
import { toast } from 'sonner';
import { messages } from '../utils/constants';

export const useEmployeeStore = create<IEmployeeStore>((set, get) => ({
  employee_paginated: {
    employees: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  employee_list: [],
  loading_employees: false,
  saveEmployeesPaginated(employee_paginated) {
    set({ employee_paginated });
  },
  getEmployeesPaginated(page, limit, firstName,firstLastName, branch, phone, active = 1) {
    set({ loading_employees: true });
    get_employees_paginated(page, limit, firstName,firstLastName, branch, phone, active)
      .then(({ data }) => set({ employee_paginated: data, loading_employees: false }))
      .catch(() => {
        set({
          loading_employees: false,
          employee_paginated: {
            employees: [],
            total: 0,
            totalPag: 0,
            currentPag: 0,
            nextPag: 0,
            prevPag: 0,
            status: 404,
            ok: false,
          },
        });
      });
  },
  postEmployee(payload) {
    return save_employee(payload)
      .then(({ data }) => {
        get().getEmployeesPaginated(1, 5, '', '','', '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  patchEmployee(payload, id) {
    return patch_employee(payload, id)
      .then(({ data }) => {
        get().getEmployeesPaginated(1, 5, '', '','', '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  deleteEmployee(id) {
    return delete_employee(id)
      .then(({ data }) => {
        get().getEmployeesPaginated(1, 5, '', '','', '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.error(messages.error);
        return false;
      });
  },
  getEmployeesList() {
    get_employee_list()
      .then(({ data }) => {
        set((state) => ({ ...state, employee_list: data.employees }));
      })
      .catch(() => {
        set((state) => ({ ...state, employee_list: [] }));
      });
  },
  activateEmployee(id) {
    return activate_employee(id)
      .then(() => {
        toast.success('Se activo el empleado');
      })
      .catch(() => {
        toast.error('Error al activar el empleado');
      });
  },
}));
