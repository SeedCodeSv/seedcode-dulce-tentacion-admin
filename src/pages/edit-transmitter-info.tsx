import { Tab, Tabs } from '@heroui/react';

import GeneralData from '@/components/edit-transmitter/GeneralData';
import DivGlobal from '@/themes/ui/div-global';

function EditTransmitterInfo() {
  return (
      <DivGlobal>
        <div className="w-full h-full border border-white p-5 overflow-y-auto  bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
              <Tab key="fiscal" title="Datos fiscales y parametros">
                <GeneralData />
              </Tab>
            </Tabs>
          </div>
        </div>
      </DivGlobal>
  );
}

export default EditTransmitterInfo;
