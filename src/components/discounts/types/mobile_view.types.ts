import { GroupedPromotions } from '../../../types/promotions.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  actions: string[];
  openEditModal: (promotion: GroupedPromotions) => void;
}

export interface GridProps {
  promotion: GroupedPromotions;
  layout: 'grid' | 'list';
  actions: string[];
  openEditModal: (promotion: GroupedPromotions) => void;
}
