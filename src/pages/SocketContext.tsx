import { useEffect, useMemo } from 'react';
import { connect } from 'socket.io-client';
import { toast } from 'sonner';
import { NotebookIcon } from 'lucide-react';

import { WS_URL } from '../utils/constants';

import { salesReportStore } from '@/store/reports/sales_report.store';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductReportStore } from '@/store/reports/branch_product.store';
import { useReferalNote } from '@/store/referal-notes';
import { formatDate } from '@/utils/dates';
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
  const { getReferalNoteByBranch, onGetReferalNotes } = useReferalNote()

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
      toast.success('Nueva nota de remisión registrada', {
        duration: 3000,
        icon: <NotebookIcon color={'#1E90FF'} size={14} />,
        position: 'top-right'
      });
    };

    const handleReferalNote = (note: any) => {
      if (Number(note.targetSucursalId) === user?.branchId) return;

      const setHasNewNotification = useReferalNote.getState().setHasNewNotification

      setHasNewNotification(true)
      getReferalNoteByBranch(user?.branchId ?? 0, 1, 5, false)
      onGetReferalNotes(Number(user?.transmitterId), 1, 5, formatDate(), formatDate(), '', Number(user?.branchId))
      setTimeout(() => {
        setHasNewNotification(false)
      }, 3000)
    };

    socket.on('new-referal-note-admin', handleReferal);
    socket.on('new-referal-note-find-admin', handleReferalNote);

    return () => {
      socket.off('new-referal-note-admin', handleReferal);
      socket.off('new-referal-note-find-admin', handleReferalNote);
    };
  }, [socket, user?.branchId]);

  return <></>;
}

export default SocketContext;
