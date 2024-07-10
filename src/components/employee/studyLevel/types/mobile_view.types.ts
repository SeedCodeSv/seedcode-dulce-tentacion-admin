import { StudyLevel } from '@/types/studyLevel.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  deletePopover: ({ studyLevel }: { studyLevel: StudyLevel }) => JSX.Element;
  handleEdit: (studyLevel: StudyLevel) => void;
  actions: string[];
  handleActive: (id: number) => void;
}

export interface GridProps {
    studyLevel: StudyLevel;
  layout: 'grid' | 'list';
  deletePopover: ({ studyLevel }: { studyLevel: StudyLevel }) => JSX.Element;
  handleEdit: (studyLevel: StudyLevel) => void;
  actions: string[];
  handleActive: (id: number) => void;
}
