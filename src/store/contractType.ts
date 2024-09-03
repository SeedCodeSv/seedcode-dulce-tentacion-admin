import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { IContractTypeStore } from './types/contratType.store';
import {
  activate_contract_type,
  create_contract_type,
  delete_contract_type,
  get_contract_type,
  update_contract_type,
} from '../services/typeContract.service';

export const useContractTypeStore = create<IContractTypeStore>((set, get) => ({
  paginated_contract_type: {
    contractTypes: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_contract_type: false,
  limit_filter: 5,

  getPaginatedContractType: (page: number, limit: number, name: string, isActive = 1) => {
    set({ loading_contract_type: true, limit_filter: limit });
    get_contract_type(page, limit, name, isActive)
      .then((statusEmployees) =>
        set({ paginated_contract_type: statusEmployees.data, loading_contract_type: false })
      )
      .catch(() => {
        set({
          loading_contract_type: false,
          paginated_contract_type: {
            contractTypes: [],
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
  postContractType(name: string): Promise<{ ok: boolean }> {
    return create_contract_type({ name })
      .then(() => {
        get().getPaginatedContractType(1, get().limit_filter, '');
        toast.success(messages.success);
        return { ok: true }; // Devuelve el objeto esperado
      })
      .catch(() => {
        toast.error(messages.error);
        return { ok: false }; // Devuelve el objeto esperado en caso de error
      });
  },

  patchContratType(name: string, id: number): Promise<{ ok: boolean }> {
    return update_contract_type({ name }, id)
      .then(() => {
        get().getPaginatedContractType(1, get().limit_filter, '');
        toast.success(messages.success);
        return { ok: true };
      })
      .catch(() => {
        toast.error(messages.success);
        return { ok: false };
      });
  },
  deleteContractType: async (id) => {
    return await delete_contract_type(id)
      .then(({ data }) => {
        get().getPaginatedContractType(1, get().limit_filter, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },

  activateContractType(id) {
    return activate_contract_type(id)
      .then(() => {
        toast.success('Se activo el registro');
      })
      .catch(() => {
        toast.error('Error al activar la registro');
      });
  },
}));
