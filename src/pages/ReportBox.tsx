import ListBoxes from '@/components/report-box/ListBoxes';
import { useViewsStore } from '@/store/views.store';

function ReportBox() {
  const { actions } = useViewsStore();
  const reportBox = actions.find((view) => view.view.name === 'Reporte caja');
  const actionsView = reportBox?.actions?.name || [];

  return (
    <>
      <ListBoxes actions={actionsView} />
    </>
  );
}

export default ReportBox;
