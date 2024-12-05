import Layout from '@/layout/Layout';
import { useParams } from 'react-router';
import Annulation05 from './anulaciones/Annulation05';
import Annulation06 from './anulaciones/Annulation06';

function Annulation() {
  const params = useParams<{ id: string; tipoDte: string }>();
  return (
    <Layout
      title={(() => {
        switch (params!.tipoDte) {
          case '06':
            return 'Anulación de Nota de Débito';
          case '05':
            return 'Anulación de Nota de Crédito';
          //   case '01':
          //     return 'Anulación de Factura';
          default:
            return 'Anulación de Factura';
        }
      })()}
    >
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800 dark:text-white">
        <div className="w-full h-full p-3 mt-2 custom-scrollbar overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <>
            {(() => {
              switch (params!.tipoDte) {
                case '06':
                  return <Annulation06 id={params.id ?? ''} />;
                case '05':
                  return <Annulation05 id={params.id ?? ''} />;
                // case '01':
                //   return <Invalidation01 id={params.id ?? ''} />;
                default:
                  return 'Anulación de Factura';
              }
            })()}
          </>
        </div>
      </div>
    </Layout>
  );
}
export default Annulation;
