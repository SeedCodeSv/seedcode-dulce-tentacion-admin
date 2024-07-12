import { useEffect, useMemo } from 'react';
import { connect } from 'socket.io-client';
import { WS_URL } from '../utils/constants';
import { toast } from 'sonner';
import { salesReportStore } from '@/store/reports/sales_report.store';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductReportStore } from '@/store/reports/branch_product.store';
// import MP3 from "../assets/tienes_un_mensaje.mp3"

function SocketContext() {
  const socket = useMemo(() => {
    return connect(WS_URL, {
      transports: ['websocket'],
    });
  }, []);

  const { user } = useAuthStore();
  const {
    getSalesCount,
    getSalesByYearAndMonth,
    getSalesTableDay,
    getSalesByDay,
    getSalesByBranchAndMonth,
  } = salesReportStore();
  const { getMostProductMostSelled } = useBranchProductReportStore();
  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('new-sale-admin', () => {
      getSalesCount();
      getSalesTableDay(user?.correlative.branch.transmitterId ?? 0);
      getSalesByBranchAndMonth(user?.correlative.branch.transmitterId ?? 0);
      getSalesByDay(user?.correlative.branch.transmitterId ?? 0);
      getMostProductMostSelled(user?.correlative.branch.transmitterId ?? 0);
      getSalesByYearAndMonth(user?.correlative.branch.transmitterId ?? 0);
      // new Audio(MP3).play();
      toast.success('Nueva venta registrada', {
        duration: 3000,
        icon: '👏',
        position: 'top-right',
      });
    });

    return () => {
      socket.off('connect');
      socket.off('new-sale-admin');
    };
  }, [socket]);

  return <></>;
}

export default SocketContext;
