import React, { useState } from "react";
import { get_token, is_authenticate } from "../storage/localStorage";

interface SessionContextI {
  token: string;
  isAuth: boolean;
  setToken: (token: string) => void;
  setIsAuth: (isAuth: boolean) => void;
}

interface Props {
  children: React.ReactNode;
}

export const SessionContext = React.createContext<SessionContextI>({
  token: get_token() ?? "",
  isAuth: is_authenticate(),
  setToken: () => {},
  setIsAuth: () => {},
});

export default function SessionProvider({ children }: Props) {
  const [token, setToken] = useState(get_token() ?? "");
  const [isAuth, setIsAuth] = useState(is_authenticate());

  return (
    <SessionContext.Provider
      value={{ token, setToken: (token) => setToken(token), isAuth, setIsAuth }}
    >
      {children}
    </SessionContext.Provider>
  );
}
