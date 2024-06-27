import { useEffect, useMemo } from "react";
import { connect } from "socket.io-client";
import { WS_URL } from "../utils/constants";
import { toast } from "sonner";

function SocketContext() {
  const socket = useMemo(() => {
    return connect(WS_URL, {
      transports: ["websocket"],
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("new-sale-admin", () => {
      toast.success("Nueva venta registrada");
    });

    return () => {
      socket.off("connect");
      socket.off("new-sale-admin");
    };
  }, [socket]);

  return <></>;
}

export default SocketContext;
