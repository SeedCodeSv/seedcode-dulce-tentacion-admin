import React, { useState } from "react";
import { get_token, is_authenticate, is_expired_token } from "../storage/localStorage";

interface SessionContext {
  token: string;
  isAuth: boolean;
  setToken: (token: string) => void;
  setIsAuth: (isAuth: boolean) => void;
}

interface Props {
  children: React.ReactNode;
}

export const ThemeContext = React.createContext<SessionContext>({
  token: "",
  isAuth: false,
  setToken: () => {},
  setIsAuth: () => {},
});

export default function SessionProvider({ children }: Props) {
  const [token, setToken] = useState(get_token() ?? "");
  const [isAuth, setIsAuth] = useState(is_authenticate());

  return (
    <ThemeContext.Provider
      value={{ token, setToken: (token) => setToken(token), isAuth, setIsAuth }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
