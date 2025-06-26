import { create } from 'zustand';
import { toast } from 'sonner';

import {
  activate_employee,
  delete_employee,
  generate_code,
  get_birthday_employees,
  get_employee_by_branch,
  get_employee_list,
  get_employees_paginated,
  // get_list_employees,
  patch_employee,
  save_employee,
  verify_code,
} from '../services/employess.service';
import { messages } from '../utils/constants';

import { IEmployeeStore } from './types/employee.store';

import { get_user } from '@/storage/localStorage';

export const useEmployeeStore = create<IEmployeeStore>((set, get) => ({
  birthdays: [],
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
  employee_contingence_list: [],
  loading_employees: false,
  saveEmployeesPaginated(employee_paginated) {
    set({ employee_paginated });
  },
  getEmployeesPaginated(
    id,
    page,
    limit,
    firstName,
    firstLastName,
    branch,
    phone,
    codeEmployee,
    active = 1,
    startDate,
    endDate
  ) {
    set({ loading_employees: true });
    get_employees_paginated(
      id,
      page,
      limit,
      firstName,
      firstLastName,
      branch,
      phone,
      codeEmployee,
      active,
      startDate,
      endDate
    )
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
        const user = get_user();

        get().getEmployeesPaginated(
          user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          5,
          '',
          '',
          '',
          '',
          '',
          1,
          ``,
          ''
        );
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
        const user = get_user();

        get().getEmployeesPaginated(
          user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          5,
          '',
          '',
          '',
          '',
          '',
          1,
          '',
          ''
        );
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
        const user = get_user();

        get().getEmployeesPaginated(
          user?.pointOfSale?.branch.transmitterId ?? 0,
          1,
          5,
          '',
          '',
          '',
          '',
          '',
          1,
          '',
          ''
        );
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
  verifyCode(code) {
    return verify_code(code)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  OnGetBirthDays() {
    get_birthday_employees().then(({ data }) => {
      set({
        birthdays: data.birthdays,
      });
    });
  },
  getEmployeesByBranch(branchId) {
    get_employee_by_branch(branchId)
      .then(({ data }) => {
        set((state) => ({ ...state, employee_list: data.employees }))
      })
      .catch(() => {
        set((state) => ({ ...state, employee_list: [] }))
      })
  },
  async generateCode(id, time) {
    try {
      const data = await generate_code(id, time);

      if (data && data.data.ok) {
        toast.success(messages.success);

        return data.data.code;
      } else {
        toast.warning(messages.error);

        return null;
      }
    } catch (error) {
      toast.warning(messages.error);

      return null;
    }
  }

  // getListEmployees() {
  //   get_list_employees()
  //     .then(({ data }) => {
  //       set((state) => ({ ...state, employee_contingence_list: data.employees }));
  //     })
  //     .catch(() => {
  //       set((state) => ({ ...state, employee_contingence_list: [] }));
  //     });
  // },
}));
