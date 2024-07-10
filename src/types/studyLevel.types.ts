export interface IGetStudyLevelPaginated {
    ok: boolean
    studyLevels: StudyLevel[]
    total: number
    totalPag: number
    currentPag: number
    nextPag: number
    prevPag: number
    status: number
  }
  
  export interface StudyLevel {
    id: number
    name: string
    description: string
    isActive: boolean
  }
  