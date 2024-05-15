import React, { useState } from "react";
import {
  get_token,
  is_authenticate,
  return_seller_mode,
} from "../storage/localStorage";

interface SessionContextI {
  token: string;
  isAuth: boolean;
  mode: string;
  setMode: (mode: string) => void;
  setToken: (token: string) => void;
  setIsAuth: (isAuth: boolean) => void;
}
interface Props {
  children: React.ReactNode;
}

export const SessionContext = React.createContext<SessionContextI>({
  token: get_token() ?? "",
  mode: return_seller_mode() ?? "",
  isAuth: is_authenticate(),
  setMode() {},
  setToken: () => {},
  setIsAuth: () => {},
});

export default function SessionProvider({ children }: Props) {
  const [token, setToken] = useState(get_token() ?? "");
  const [isAuth, setIsAuth] = useState(is_authenticate());
  const [mode, setMode] = useState(return_seller_mode() ?? "");

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken: (token) => setToken(token),
        isAuth,
        setIsAuth,
        mode: mode,
        setMode(mode) {
          setMode(mode);
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
