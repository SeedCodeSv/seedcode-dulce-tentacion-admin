import { Tab, Tabs } from '@heroui/react';

import GeneralData from '@/components/edit-transmitter/GeneralData';
import Layout from '@/layout/Layout';

function EditTransmitterInfo() {
  return (
    <>
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto  bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
              <Tab key="fiscal" title="Datos fiscales y paramtros">
                <GeneralData />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTransmitterInfo;
