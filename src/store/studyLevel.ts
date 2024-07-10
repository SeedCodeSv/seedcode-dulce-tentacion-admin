import { create } from 'zustand';
import { toast } from 'sonner';
import { messages } from '../utils/constants';
import {
  activate_study_level,
  create_study_level,
  delete_study_level,
  get_study_level,
  update_study_level,
} from '@/services/studyLevel.service';
import { IStudyLevelStore } from './types/studyLevel.store';

export const useStatusStudyLevel = create<IStudyLevelStore>((set, get) => ({
  paginated_study_level: {
    studyLevels: [],
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
    status: 404,
    ok: false,
  },
  loading_study_level: false,
  limit_filter: 5,

  getPaginatedStudyLevel: (
    page: number,
    limit: number,
    name: string,

    isActive = 1
  ) => {
    set({ loading_study_level: true, limit_filter: limit });
    get_study_level(page, limit, name, isActive)
      .then((studylevels) =>
        set({ paginated_study_level: studylevels.data, loading_study_level: false })
      )
      .catch(() => {
        set({
          loading_study_level: false,
          paginated_study_level: {
            studyLevels: [],
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
  postStudyLevel(name, description) {
    create_study_level({ name, description })
      .then(() => {
        get().getPaginatedStudyLevel(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.error);
      });
  },
  patchStudyLevel(name, id, description) {
    update_study_level({ name, description }, id)
      .then(() => {
        get().getPaginatedStudyLevel(1, get().limit_filter, '');
        toast.success(messages.success);
      })
      .catch(() => {
        toast.error(messages.success);
      });
  },
  deleteStudyLevel: async (id) => {
    return await delete_study_level(id)
      .then(({ data }) => {
        get().getPaginatedStudyLevel(1, get().limit_filter, '');
        toast.success(messages.success);
        return data.ok;
      })
      .catch(() => {
        toast.warning(messages.error);
        return false;
      });
  },

  activateStudyLevel(id) {
    return activate_study_level(id)
      .then(() => {
        toast.success('Se activo el registro');
      })
      .catch(() => {
        toast.error('Error al activar la registro');
      });
  },
}));
