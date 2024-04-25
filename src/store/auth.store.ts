import { create } from "zustand";
import { IAuthStore } from "./types/auth_store.types";
import {
    get_token, get_user, is_authenticate, set_token, save_user,
    delete_user,
    delete_token
} from "../storage/localStorage";
import { post_login } from "../services/auth.service";
import { toast } from "sonner";

export const useAuthStore = create<IAuthStore>((set) => ({
    token: get_token() ?? "",
    isAuth: is_authenticate(),
    user: get_user(),
    postLogin: async (payload) => {
        return await post_login(payload).then(({ data }) => {
            if (data.ok) {
                set_token(data.token)
                save_user(data.user)
                toast.success("Bienvenido")
            }else{
                toast.error("Datos incorrectos")
            }
            return data
        }).catch(() => {
            delete_token()
            delete_user()
            toast.error("Datos incorrectos")
            return null
        })
    },
    makeLogout: () => set((state) => ({
        ...state,
        token: "",
        isAuth: false
    }))
}))