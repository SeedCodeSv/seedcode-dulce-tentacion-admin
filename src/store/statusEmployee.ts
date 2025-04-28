import { create } from 'zustand';
import { toast } from 'sonner';

import { messages } from '../utils/constants';
import {
  activate_status_employee,
  create_status_employee,
  delete_status_employee,
  get_status_employee,
  update_status_employee,
} from '../services/statusEmployee.service';

import { IStatusEmployeeStore } from './types/statusEmployee.store';

export const useStatusEmployeeStore = create<IStatusEmployeeStore>((set, get) => ({
  paginated_status_employee: {
    employeeStatus: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_status_employee: false,
  limit_filter: 5,

  getPaginatedStatusEmployee: (page: number, limit: number, name: string, isActive = 1) => {
    set({ loading_status_employee: true, limit_filter: limit });
    get_status_employee(page, limit, name, isActive)
      .then((statusEmployees) =>
        set({ paginated_status_employee: statusEmployees.data, loading_status_employee: false })
      )
      .catch(() => {
        set({
          loading_status_employee: false,
          paginated_status_employee: {
            employeeStatus: [],
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
  postStatusEmployee(name) {
    create_status_employee({ name })
      .then(() => {
        get().getPaginatedStatusEmployee(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchStatusEmployee(name, id) {
    update_status_employee({ name }, id)
      .then(() => {
        get().getPaginatedStatusEmployee(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.success);
      });
  },
  deleteStatuEmployee: async (id) => {
    return await delete_status_employee(id)
      .then(({ data }) => {
        get().getPaginatedStatusEmployee(1, get().limit_filter, '');
        toast.success(messages.success);

        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);

        return false;
      });
  },

  activateStatusEmployee(id) {
    return activate_status_employee(id)
      .then(() => {
        toast.success('Se activo el registro');
      })
      .catch(() => {
        toast.error('Error al activar la registro');
      });
  },


}));
