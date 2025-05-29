import { useAuthStore } from "@/store/auth.store";
import { WS_URL } from "@/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { connect } from "socket.io-client";
import { toast } from "sonner";

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
        console.log(`🟢 Socket conectado con branchId=${branchId}`);
        setIsConnected(true);
      });}

    return () => {
      socket.off("connect")
    };
  }, [socket]);

  return { socket };
};
