import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@heroui/react';
import { Helmet } from 'react-helmet-async';

import AddClientContributor from '../components/clients/AddClientContributor';
import AddClientNormal from '../components/clients/AddClientNormal';

import GlobalLoading from '@/components/global/GlobalLoading';
import DivGlobal from '@/themes/ui/div-global';
import { useCustomerStore } from '@/store/customers.store';

function AddCustomer() {
  const [selected, setSelected] = useState<'normal' | 'tribute'>('normal');
  const { type } = useParams();
  const navigate = useNavigate();
  const { loading_save } = useCustomerStore();

  useEffect(() => {
    if (type && type !== '0') {
    }
  }, [type]);

  return (
    <>
      <Helmet>
        <title>Nuevo cliente</title>
      </Helmet>
      <GlobalLoading show={loading_save} />
      <DivGlobal>
        <div className="w-full">
          <Button className="bg-transparent mb-4" onPress={() => navigate('/clients')}>
            <ArrowLeft />
            <p>Regresar</p>
          </Button>

          {/* Botones que reemplazan los Tabs */}
          <div className="flex justify-center gap-4 mt-3 mb-6">
            <Button
              color="secondary"
              variant={selected === 'normal' ? 'solid' : 'bordered'}
              onPress={() => setSelected('normal')}
            >
              Consumidor final
            </Button>
            <Button
              color="secondary"
              variant={selected === 'tribute' ? 'solid' : 'bordered'}
              onPress={() => setSelected('tribute')}
            >
              Cliente contribuyente
            </Button>
          </div>

          {/* Contenido dinámico */}
          <div className="mt-2">
            {selected === 'normal' && <AddClientNormal />}
            {selected === 'tribute' && <AddClientContributor />}
          </div>
        </div>
      </DivGlobal>
    </>
  );
}

export default AddCustomer;
