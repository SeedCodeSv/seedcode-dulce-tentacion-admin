import { jwtDecode } from "jwt-decode"
import { UserLogin } from "../types/auth.types"

export const set_token = (token: string) => {
    localStorage.setItem('token', token)
}

export const get_token = () => {
    return localStorage.getItem('token')
}

export const is_expired_token = () => {
    const token = get_token()
    if (token) {
        const { exp } = jwtDecode(token)
        if (exp) {
            return exp * 1000 < Date.now()
        } else {
            return true
        }
    }
    return true
}

export const is_authenticate = () => {
    const token = get_token()
    if (token) {
        if (is_expired_token()) return false
        return true
    }

    return false
}

export const save_user = (user: UserLogin) => {
    return localStorage.setItem("user", JSON.stringify(user))
}

export const get_user = () => {
    const user = localStorage.getItem("user")

    if (user) {
        return JSON.parse(user) as UserLogin
    }

    return undefined
}

export const delete_token = () => {
    localStorage.removeItem("token")
}

export const delete_user = () => {
    localStorage.removeItem("user")
}