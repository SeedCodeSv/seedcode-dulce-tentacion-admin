import { ArrowDown01, ArrowUp01, BadgeDollarSign, HelpCircle, NotebookIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import ContingenceFC_CCF from './contingence/ContingenceFC_CFF';
import ContingenceND from './contingence/ContingenceND';
import ContingenceNC from './contingence/ContingenceNC';
import ContingenceFSE from './contingence/ContingenceFSE';
import ContingenceNRE from './contingence/ContingenceNRE';

import { useEmployeeStore } from '@/store/employee.store';
// import Layout from '@/layout/Layout';
import DivGlobal from '@/themes/ui/div-global';
import useWindowSize from '@/hooks/useWindowSize';

function ContingenceSection() {
  const { getEmployeesList } = useEmployeeStore();

  useEffect(() => {
    getEmployeesList();
  }, []);
  const { windowSize } = useWindowSize()

  const [activeTab, setActiveTab] = useState<'ventas' | 'nd' | 'nc' | 'fse' | 'nre'>('ventas');

  const buttonStyle = (key: string) =>
    `flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium ${activeTab === key
      ? 'bg-blue-500 text-white'
      : 'bg-white text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <>
      <DivGlobal>
        {/* <Tabs aria-label="Options" className="px-2 grid lg:grid-cols-1 gap-4" color="primary">
          <Tab
            key="contingence"
            className="px-4"
            title={
              <div className="flex items-center space-x-2">
                <BadgeDollarSign />
                <span className="font-semibold">VENTAS (FC - CCF)</span>
              </div>
            }
          >
            <ContingenceFC_CCF />
          </Tab>
          <Tab
            key="contingence-nd"
            className="px-4"
            title={
              <div className="flex items-center space-x-2">
                <ArrowUp01 />
                <span className="font-semibold">NOTAS DE DÉBITO</span>
              </div>
            }
          >
            <ContingenceND />
          </Tab>
          <Tab
            key="contingence-nc"
            className="px-4 text-sm"
            title={
              <div className="flex items-center space-x-2">
                <ArrowDown01 />
                <span className="font-semibold">NOTAS DE CRÉDITO</span>
              </div>
            }
          >
            <ContingenceNC />
          </Tab>
          <Tab
            key="contingence-fse"
            className="px-4 text-sm"
            title={
              <div className="flex items-center space-x-2">
                <HelpCircle />
                <span className="font-semibold">SUJETO EXCLUIDO</span>
              </div>
            }
          >
            <ContingenceFSE />
          </Tab>
          <Tab
            key="NRE"
            className="px-8"
            title={
              <div className="flex items-center space-x-2">
                <NotebookIcon />
                <span className="font-semibold"> NOTAS REMISON</span>
              </div>
            }
          >
            <ContingenceNRE />
          </Tab>
        </Tabs> */}
        <div className="w-full space-y-6">
          <div className={`${windowSize.width < 768 ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-4 grid-cols-5'}`}>
            <button className={buttonStyle('ventas')} onClick={() => setActiveTab('ventas')}>
              <BadgeDollarSign />
              VENTAS (FC - CCF)
            </button>
            <button className={buttonStyle('nd')} onClick={() => setActiveTab('nd')}>
              <ArrowUp01 />
              NOTAS DE DÉBITO
            </button>
            <button className={buttonStyle('nc')} onClick={() => setActiveTab('nc')}>
              <ArrowDown01 />
              NOTAS DE CRÉDITO
            </button>
            <button className={buttonStyle('fse')} onClick={() => setActiveTab('fse')}>
              <HelpCircle />
              SUJETO EXCLUIDO
            </button>
            <button className={buttonStyle('nre')} onClick={() => setActiveTab('nre')}>
              <NotebookIcon />
              NOTAS REMISIÓN
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'ventas' && <ContingenceFC_CCF />}
            {activeTab === 'nd' && <ContingenceND />}
            {activeTab === 'nc' && <ContingenceNC />}
            {activeTab === 'fse' && <ContingenceFSE />}
            {activeTab === 'nre' && <ContingenceNRE />}
          </div>
        </div>
      </DivGlobal>
    </>
  );
}
export default ContingenceSection;
