export interface StudyLevel {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
  }

  export interface IGetStudyLevel {
    ok: boolean;
    status: number;
    studyLevels: StudyLevel[];
  }