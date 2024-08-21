import { Theme } from '../../hooks/useTheme';
import { IPagination } from '../../types/global.types';
import { ThemePayload } from '../../types/themes.types';

export interface ThemeStore {
  themes: Theme[];
  paginatiom_themes: IPagination;
  getPaginatedThemes: (page?: number, limit?: number) => void;
  postTheme: (payload: ThemePayload) => void;
}
