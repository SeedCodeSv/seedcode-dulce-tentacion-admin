import { jwtDecode } from 'jwt-decode';
import { User, UserLogin } from '../types/auth.types';
import { RoleViewAction } from '../types/actions_rol.types';
import { decryptData, encryptData } from '../plugins/crypto';
import { ITransmitter } from '@/types/transmitter.types';
export const set_token = (token: string) => {
  localStorage.setItem('_NTE', token);
};

export const get_token = () => {
  return localStorage.getItem('_NTE');
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

export const save_user = (user: User) => {
  return localStorage.setItem('_RSU', encryptData(user));
};

export const get_user = () => {
  const user = localStorage.getItem('_RSU');

  if (user) {
    const dec = decryptData(user);
    return dec as User;
  }

  return undefined;
};
export const get_rolId = () => {
  const user = localStorage.getItem('_RSU');
  if (user) {
    const dec = decryptData(user);
    const data = dec as UserLogin;
    return data.roleId;
  }
};
export const delete_token = () => {
  localStorage.removeItem('_NTE');
};

export const delete_user = () => {
  localStorage.removeItem('_RSU');
};
export const post_box = (box: string) => {
  localStorage.setItem('box', box);
};
export const get_box = () => {
  return localStorage.getItem('box');
};
export const delete_box = () => {
  localStorage.removeItem('box');
};
export const save_mh_token = (token: string) => {
  return localStorage.setItem('_MHT', token);
};
export const return_mh_token = () => {
  return localStorage.getItem('_MHT');
};
export const delete_mh_token = () => {
  return localStorage.removeItem('_MHT');
};

export const save_branch_id = (branch_id: string) => {
  return localStorage.setItem('branch_id', branch_id);
};
export const return_branch_id = () => {
  return localStorage.getItem('branch_id');
};
export const delete_branch_id = () => {
  return localStorage.removeItem('branch_id');
};

export const  delete_RVA = () => {
  return localStorage.removeItem('_RVA');
};

export const save_seller_mode = (mode: string) => {
  localStorage.setItem('seller_mode', mode);
};
export const return_seller_mode = () => {
  return localStorage.getItem('seller_mode');
};
export const delete_seller_mode = () => {
  return localStorage.removeItem('seller_mode');
};

export const get_personalization = () => {
  return JSON.parse(localStorage.getItem('personalization') || '{}') as {
    name: string;
    logo: string;
  };
};

export const get_return_action = (): RoleViewAction | undefined => {
  const rva = localStorage.getItem('_RVA');

  if (rva) {
    return decryptData(rva) as RoleViewAction;
  }
  return undefined;
};

export const save_transmitter = (transmitter: ITransmitter) => {
  return localStorage.setItem('$TOP', encryptData(transmitter));
}

export const get_transmitter_info = () => {
  const transmitter = localStorage.getItem('$TOP')
  if(transmitter){
    return decryptData(transmitter) as ITransmitter
  }
  return undefined
}