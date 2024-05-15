import { jwtDecode } from "jwt-decode";
import { UserLogin } from "../types/auth.types";
export const set_token = (token: string) => {
  localStorage.setItem("token", token);
};

export const get_token = () => {
  return localStorage.getItem("token");
};

export const is_expired_token = () => {
  const token = get_token();
  if (token) {
    const { exp } = jwtDecode(token);
    if (exp) {
      return exp * 1000 < Date.now();
    } else {
      return true;
    }
  }
  return true;
};

export const is_authenticate = () => {
  const token = get_token();
  if (token) {
    if (is_expired_token()) return false;
    return true;
  }

  return false;
};

export const save_user = (user: UserLogin) => {
  return localStorage.setItem("user", JSON.stringify(user));
};

export const get_user = () => {
  const user = localStorage.getItem("user");

  if (user) {
    return JSON.parse(user) as UserLogin;
  }

  return undefined;
};

export const delete_token = () => {
  localStorage.removeItem("token");
};

export const delete_user = () => {
  localStorage.removeItem("user");
};
export const post_box = (box: string) => {
  localStorage.setItem("box", box);
};
export const get_box = () => {
  return localStorage.getItem("box");
};
export const delete_box = () => {
  localStorage.removeItem("box");
}
export const save_mh_token = (token: string) => {
  return localStorage.setItem("mh_token", token)
}
export const return_mh_token = () => {
  return localStorage.getItem("mh_token")
}
export const delete_mh_token = () => {
  return localStorage.removeItem("mh_token")
}

export const save_branch_id = (branch_id: string) => {
  return localStorage.setItem("branch_id", branch_id)
}
export const return_branch_id = () => {
  return localStorage.getItem("branch_id")
}
export const delete_branch_id = () => {
  return localStorage.removeItem("branch_id")
}
export const save_seller_mode = (mode: string) => {
  localStorage.setItem("seller_mode", mode)
}
export const return_seller_mode = () => {
  return localStorage.getItem("seller_mode")
}
export const delete_seller_mode = () => {
  return localStorage.removeItem("seller_mode")
}