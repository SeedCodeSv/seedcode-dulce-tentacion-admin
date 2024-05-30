import { GroupedAction } from '../../../types/actions.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  actions: string[];
}

export interface GridProps {
  action: GroupedAction;
  layout: 'grid' | 'list';
  actions: string[];
}
