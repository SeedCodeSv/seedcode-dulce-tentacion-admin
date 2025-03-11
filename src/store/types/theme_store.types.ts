import { IPagination } from '../../types/global.types';
import { ThemePayload } from '../../types/themes.types';

export interface ThemeStore {
  themes: any[];
  paginatiom_themes: IPagination;
  getPaginatedThemes: (page?: number, limit?: number) => void;
  postTheme: (payload: ThemePayload) => void;
}
