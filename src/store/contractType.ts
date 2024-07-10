import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import { IContractTypeStore } from './types/contratType.store';
import {
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

  getPaginatedContractType: (page: number, limit: number, name: string) => {
    set({ loading_contract_type: true, limit_filter: limit });
    get_contract_type(page, limit, name)
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
  postContractType(name) {
    create_contract_type({ name })
      .then(() => {
        get().getPaginatedContractType(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchContratType(name, id) {
    update_contract_type({ name }, id)
      .then(() => {
        get().getPaginatedContractType(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.success);
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
}));
