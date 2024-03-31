import { jwtDecode } from "jwt-decode"

export const set_token = (token: string) => {
    localStorage.setItem('token', token)
}

export const get_token = () => {
    return localStorage.getItem('token')
}

export const is_expired_token = () => {
    const token = get_token()
    console.log(token)
    if (token) {
        const { exp } = jwtDecode(token)
        if (exp && exp < Date.now() / 1000) {
            return true
        }
    }
    return false
}

export const is_authenticate = ()=>{
    return  !!get_token() && !is_expired_token()
}