import { create } from "zustand";

import { get_study_levels } from "../services/study_level.service";

import { IStudyLevelStore } from "./types/study_level.store.types";

export const useStudyLevelStore = create<IStudyLevelStore>((set) => ({
    study_level: [],
    GetStudyLevel() {
        get_study_levels()
        .then(({ data }) => set({ study_level: data.studyLevels }))
            .catch(() => {
                set({ study_level: [] });
            });
    },

}))