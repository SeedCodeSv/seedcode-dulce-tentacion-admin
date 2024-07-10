import { statusEmployee } from '../../../../types/statusEmployee.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  deletePopover: ({ statusEmployees }: { statusEmployees: statusEmployee }) => JSX.Element;
  handleEdit: (statusEmployees: statusEmployee) => void;
  actions: string[];
  // handleActive: (id: number) => void;
}

export interface GridProps {
  statusEmployees: statusEmployee;
  layout: 'grid' | 'list';
  deletePopover: ({ statusEmployees }: { statusEmployees: statusEmployee }) => JSX.Element;
  handleEdit: (statusEmployees: statusEmployee) => void;
  actions: string[];
  // handleActive: (id: number) => void;
}
