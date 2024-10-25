import { IExcludedSubjects } from "@/types/excluded_subjects.types";


export interface IExcludedSubjectStore {
    contingence_excluded_subject: IExcludedSubjects[]
    onGetContingenceExcludedSubject: (id: number) => void;
}