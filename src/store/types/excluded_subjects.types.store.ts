import { IExcludedSubjects } from "@/types/excluded_subjects.types";

export interface IExcludedSubjectStore {
    contingence_excluded_subject: IExcludedSubjects[]
    excluded_subjects_month: IExcludedSubjects[]
    onGetContingenceExcludedSubject: (id: number) => void;
    getExcludedSubjectByMonth: (id: number, month: number, year: number) => void
}