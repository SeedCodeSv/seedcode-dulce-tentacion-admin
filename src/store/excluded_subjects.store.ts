import { create } from "zustand";
import { IExcludedSubjectStore } from "./types/excluded_subjects.types.store";
import { get_contingence_excluded_subject } from "@/services/excluded_subject.service";

export const useExcludedSubjectStore = create<IExcludedSubjectStore>((set) => ({
    contingence_excluded_subject: [],
    onGetContingenceExcludedSubject(id) {
        get_contingence_excluded_subject(id)
            .then((res) => {
                set({ contingence_excluded_subject: res.data.excludedSubject });
            })
            .catch(() => {
                set({ contingence_excluded_subject: []})
            })
    },
}))