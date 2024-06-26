import { IAuthPayload, IAuthResponse, User } from '../../types/auth.types';

export interface IAuthStore {
  token: string;
  isAuth: boolean;
  user: User | undefined;
  postLogin: (payload: IAuthPayload) => Promise<IAuthResponse | null>;
  makeLogout: () => void;
  OnLoginMH: (id: number, token: string) => Promise<void>;
}
