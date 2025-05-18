import { findOne, ThemeData, ThemePayload } from '../../types/themes.types';

import { IPagination } from '@/types/global.types';

export interface ThemeStore {
  themes: ThemeData[];
  pagination_themes: IPagination;
  findOne: findOne;
  getPaginatedThemes: (page?: number, limit?: number) => void;
  postTheme: (payload: ThemePayload) => void;
  GetTemeByTransmiter: (id: number) => void;
  deleteTheme: (id: number) => Promise<boolean>;
  getThemefindOne: (id: number) => void;
}
