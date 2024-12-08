import { IExcludedSubJects } from "@/types/excluded-subject.types";
import { IExcludedSubjects } from "@/types/excluded_subjects.types";


export interface IExcludedSubjectStore {
    contingence_excluded_subject: IExcludedSubjects[]
    onGetContingenceExcludedSubject: (id: number) => void;
    excluded_subjects_month: IExcludedSubJects[]
    getExcludedSubjectByMonth: (id: number, month: number) => void
}