
import { StudyLevel } from "../../types/study_level.types";

export interface IStudyLevelStore{
    study_level: StudyLevel[];
    GetStudyLevel: () => void;
}