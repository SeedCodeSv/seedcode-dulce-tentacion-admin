import { IAuthPayload, IAuthResponse, UserLogin } from "../../types/auth.types"

export interface IAuthStore {
    token: string
    isAuth: boolean,
    user: UserLogin | undefined
    postLogin: (payload: IAuthPayload) => Promise<IAuthResponse | null>
    makeLogout: () => void
} 