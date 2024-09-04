import Layout from '../layout/Layout';
import { Tab, Tabs } from '@nextui-org/react';
import AddClientNormal from '../components/clients/AddClientNormal';
import AddClientContributor from '../components/clients/AddClientContributor';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { useCustomerStore } from '@/store/customers.store';
import GlobalLoading from '@/components/global/GlobalLoading';

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
    <Layout title={type == '0' ? 'Agregar cliente' : 'Actualizar cliente'}>
      <>
        <GlobalLoading show={loading_save} />
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 mt-3 overflow-y-auto custom-scrollbar bg-white shadow rounded-xl dark:bg-gray-900">
            <Button onClick={() => navigate('/clients')} className="bg-transparent">
              <ArrowLeft />
              <p className="">Regresar</p>
            </Button>
            <Tabs
              selectedKey={selected}
              variant="bordered"
              color="secondary"
              className="flex justify-center mt-3 md:mt-0"
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
            {/* <Tabs
              selectedKey={selected}
              variant="bordered"
              color="secondary"
              className="flex justify-center mt-3 md:mt-0"
              onSelectionChange={(key) => setSelected(String(key))} // Convertimos 'key' a string
            >
              {selected === 'normal' && (
                <Tab key="normal" title="Consumidor final">
                  <div className="mt-2">
                    <AddClientNormal />
                  </div>
                </Tab>
              )}
              {selected === 'tribute' && (
                <Tab key="tribute" title="Cliente contribuyente">
                  <div className="mt-2">
                    <AddClientContributor />
                  </div>
                </Tab>
              )}
            </Tabs> */}
          </div>
        </div>
      </>
    </Layout>
  );
}

export default AddCustomer;
