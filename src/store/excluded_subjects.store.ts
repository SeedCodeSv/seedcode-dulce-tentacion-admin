import { create } from "zustand";
import { IExcludedSubjectStore } from "./types/excluded_subjects.types.store";
import { get_contingence_excluded_subject, get_excluded_subject_by_month } from "@/services/excluded_subject.service";

export const useExcludedSubjectStore = create<IExcludedSubjectStore>((set) => ({
    contingence_excluded_subject: [],
    excluded_subjects_month: [],
    onGetContingenceExcludedSubject(id) {
        get_contingence_excluded_subject(id)
            .then((res) => {
                set({ contingence_excluded_subject: res.data.excludedSubject });
            })
            .catch(() => {
                set({ contingence_excluded_subject: []})
            })
    },

    getExcludedSubjectByMonth(id, month) {
        get_excluded_subject_by_month(id, month)
          .then((res) => {
            set({
              excluded_subjects_month: res.data.excludedSubject
            })
          })
          .catch(() => {
            set({
              excluded_subjects_month: []
            })
          })
      },
}))