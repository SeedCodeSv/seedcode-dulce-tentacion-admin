import { useEffect, useMemo, useState } from "react";
import { connect } from "socket.io-client";

import { WS_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/auth.store";

export const useSocket = () => {
    const {user} =useAuthStore()
  const branchId = user?.branchId ?? 0
  const socket = useMemo(
    () =>
      connect(WS_URL, {
        transports: ["websocket"],
        query: {
          branchId: branchId.toString(),
        },
      }),
    [branchId]
  );

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {

    if (!isConnected) {
      socket.on("connect", () => {
        setIsConnected(true);
      });}

    return () => {
      socket.off("connect")
    };
  }, [socket]);

  return { socket };
};
