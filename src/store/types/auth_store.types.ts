import { IAuthPayload } from "../../types/auth.types"

export interface IAuthStore {
    token: string
    isAuth: boolean
    postLogin: (payload: IAuthPayload) => Promise<boolean>
    makeLogout: () => void
}