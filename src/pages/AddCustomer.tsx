import { Tab, Tabs } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@heroui/react';
import { Helmet } from 'react-helmet-async';

import AddClientContributor from '../components/clients/AddClientContributor';
import AddClientNormal from '../components/clients/AddClientNormal';

import { useCustomerStore } from '@/store/customers.store';
import GlobalLoading from '@/components/global/GlobalLoading';
import DivGlobal from '@/themes/ui/div-global';

function AddCustomer() {
  const [selected, setSelected] = useState<string | undefined>('normal');
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (type != '0') {
      setSelected(String(type));
    } else {
      setSelected(undefined);
    }
  }, []);

  const { loading_save } = useCustomerStore();

  return (
    <>
      <Helmet>
        <title>Nuevo cliente</title>
      </Helmet>
      <GlobalLoading show={loading_save} />
      <DivGlobal>
        <div className="w-full">
          <Button className="bg-transparent" onPress={() => navigate('/clients')}>
            <ArrowLeft />
            <p className="">Regresar</p>
          </Button>
          <Tabs
            className="flex justify-center mt-3 md:mt-0"
            color="secondary"
            selectedKey={selected}
            variant="bordered"
          >
            <Tab key="normal" title="Consumidor final">
              <div className="mt-2">
                <AddClientNormal />
              </div>
            </Tab>
            <Tab key="tribute" title="Cliente contribuyente">
              <div className="mt-2">
                <AddClientContributor />
              </div>
            </Tab>
          </Tabs>
        </div>
      </DivGlobal>
    </>
  );
}

export default AddCustomer;
