import { IGetStudyLevelPaginated } from '@/types/studyLevel.types';

export interface IStudyLevelStore {
  paginated_study_level: IGetStudyLevelPaginated;
  loading_study_level: boolean;
  limit_filter: number;
  getPaginatedStudyLevel: (page: number, limit: number, name: string, isActive?: number) => void;
  postStudyLevel: (name: string, description: string) => void;
  patchStudyLevel: (name: string, id: number, description: string) => void;
  deleteStudyLevel: (id: number) => Promise<boolean>;
  activateStudyLevel: (id: number) => Promise<void>;
}
