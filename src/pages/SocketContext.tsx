import { useEffect, useMemo } from 'react';
import { connect } from 'socket.io-client';
import { toast } from 'sonner';
import { NotebookIcon } from 'lucide-react';

import { WS_URL } from '../utils/constants';

import { salesReportStore } from '@/store/reports/sales_report.store';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductReportStore } from '@/store/reports/branch_product.store';
// import MP3 from "../assets/tienes_un_mensaje.mp3"

function SocketContext() {
  const { user } = useAuthStore()
  const branchId = user?.branchId ?? 0
  const socket = useMemo(() => {
    return connect(WS_URL, {
      transports: ['websocket'],
      query: {
        branchId: branchId.toString()
      }
    });
  }, [branchId]);

  const {
    getSalesCount,
    getSalesByYearAndMonth,
    getSalesTableDay,
    getSalesByDay,
    getSalesByBranchAndMonth,
    getSalesTableDayDetails,
  } = salesReportStore();
  const { getMostProductMostSelled } = useBranchProductReportStore();

  useEffect(() => {
    socket.on('connect', () => {

    });

    socket.on('new-sale-admin', () => {
      getSalesCount();
      getSalesTableDay(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
      getSalesByBranchAndMonth(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
      getSalesByDay(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
      getMostProductMostSelled(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
      getSalesByYearAndMonth(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
      getSalesTableDayDetails(
        user?.pointOfSale?.branch.transmitterId ?? 0
      );
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
  }, [socket, user]);

  useEffect(() => {
    const handleReferal = () => {
      toast.success('Nueva nota de remision registrada', {
        duration: 3000,
        icon: <NotebookIcon color={'#1E90FF'} size={14} />,
        position: 'top-right'
      });
    };

    socket.on('new-referal-note-admin', handleReferal);

    return () => {
      socket.off('new-referal-note-admin', handleReferal);
    };
  }, [socket]);

  useEffect(() => {
    const handleReferal = (note: any) => {
      toast.success(`Nueva nota recibida: ${note.descripcion}`, {
        duration: 3000,
        icon: <NotebookIcon color={'#1E90FF'} size={14} />,
        position: 'top-right'
      });

    };

    socket.on('new-referal-note-find-admin', handleReferal);

    return () => {
      socket.off('new-referal-note-find-admin', handleReferal);
    };
  }, [socket]);


  return <></>;
}

export default SocketContext;
