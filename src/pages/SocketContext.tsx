import { useEffect, useMemo } from 'react';
import { connect } from 'socket.io-client';
import { toast } from 'sonner';
import { NotebookIcon } from 'lucide-react';

import { WS_URL } from '../utils/constants';

import { salesReportStore } from '@/store/reports/sales_report.store';
import { useAuthStore } from '@/store/auth.store';
import { useBranchProductReportStore } from '@/store/reports/branch_product.store';
import { useReferalNote, useReferalNoteStore } from '@/store/referal-notes';
import { formatDate } from '@/utils/dates';
import { ReferalNote } from '@/types/referal-note.types';

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
    // const handleNoteContingence = (note: any) => {
    //   if (Number(note.targetSucursalId) === user?.branchId) return;

    //   const setHasNewNotification = useReferalNote.getState().setHasNewNotification

    //   setHasNewNotification(true)
    //   getReferalNoteByBranch(user?.branchId ?? 0, 1, 5, false)
    //   onGetReferalNotes(Number(user?.transmitterId), 1, 5, formatDate(), formatDate(), '', Number(user?.branchId))
    //   setTimeout(() => {
    //     setHasNewNotification(false)
    //   }, 3000)
    // };


    socket.on('new-referal-note-admin', handleReferal);
    socket.on('new-referal-note-find-admin', handleReferalNote);
    // socket.on('processed-contingence-note-admin', handleContingence)

    return () => {
      socket.off('new-referal-note-admin', handleReferal);
      socket.off('new-referal-note-find-admin', handleReferalNote);
      // socket.on('processed-contingence-note-admin', handleContingence)

    };
  }, [socket, user?.branchId]);

  useEffect(() => {
    const handleContingence = (note: any) => {
      toast.warning(`${note.descripcion} - ${note.fecha}`)
      const newNotification = {
        ...note,
        descripcion: note?.descripcion ?? "N/A",
        time
          : Date.now()
      };

      getReferalNoteByBranch(user?.branchId ?? 0, 1, 5, false)
      onGetReferalNotes(Number(user?.transmitterId), 1, 5, formatDate(), formatDate(), '', Number(user?.branchId))
      const previous = useReferalNoteStore.getState().OTHERS_NOTIFICATIONS;

      useReferalNoteStore.getState().saveOthersNotifications([...previous, newNotification]);
    }

    socket.on('processed-contingence-note-admin', handleContingence)

    return () => {
      socket.off('processed-contingence-note-admin', handleContingence)
    }
  }, [socket, user])

  useEffect(() => {
    const handleAnulation = (note: any) => {
      toast.warning(`${note.descripcion} - ${note.fecha}`)
      const newNotification = {
        ...note,
        data: note.data as ReferalNote,
        timestamp: Date.now()
      };

      const previous = useReferalNoteStore.getState().INVALIDATIONS_NOTIFICATIONS;

      useReferalNoteStore.getState().saveNotifications([...previous, newNotification]);
    }

    socket.on('new-invalidate-note-find-admin', handleAnulation)

    return () => {
      socket.off('new-invalidate-note-find-admin', handleAnulation)
    }
  }, [socket, user])


  return <></>;
}

export default SocketContext;
