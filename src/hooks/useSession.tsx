import React, { useState } from 'react';

import { get_token, is_authenticate, return_seller_mode, get_rolId, get_contingence, save_contingence } from '../storage/localStorage';

interface SessionContextI {
  token: string;
  isAuth: boolean;
  mode: string;
  rolId: number;
  setMode: (mode: string) => void;
  setToken: (token: string) => void;
  setIsAuth: (isAuth: boolean) => void;
  setRolId: (rolId: number) => void;
  contingence: boolean
  setContingence: (contingence: boolean) => void
}
interface Props {
  children: React.ReactNode;
}

export const SessionContext = React.createContext<SessionContextI>({
  token: get_token() ?? '',
  mode: return_seller_mode() ?? '',
  isAuth: is_authenticate(),
  rolId: get_rolId() ?? 0,
  setMode() { },
  setToken: () => { },
  setIsAuth: () => { },
  setRolId: () => { },
  contingence: get_contingence(),
  setContingence: () => { },
});

export default function SessionProvider({ children }: Props) {
  const [token, setToken] = useState(get_token() ?? '');
  const [isAuth, setIsAuth] = useState(is_authenticate());
  const [mode, setMode] = useState(return_seller_mode() ?? '');
  const [rolId, setRolId] = useState(get_rolId() ?? 0);
  const [contingence, setContingence] = useState(get_contingence())

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken: (token) => setToken(token),
        isAuth,
        setIsAuth,
        mode: mode,
        rolId,
        setRolId(rolId) {
          setRolId(rolId);
        },
        setMode(mode) {
          setMode(mode);
        },
        contingence,
        setContingence(contingence) {
          save_contingence(contingence)
          setContingence(contingence)
        }
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
