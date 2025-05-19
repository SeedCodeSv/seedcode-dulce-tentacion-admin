import KardexComponent from '@/components/reporters/kardex/KardexComponent';
import Layout from '@/layout/Layout';
import { useViewsStore } from '@/store/views.store';

export default function KardexPage() {
   const { actions } = useViewsStore();
    const categoriasView = actions.find((view) => view.view.name === 'Kardex');
    const actionView = categoriasView?.actions?.name || [];
  
  return (
    <Layout title="Kardex">
      <KardexComponent actions={actionView}/>
    </Layout>
  );
}
