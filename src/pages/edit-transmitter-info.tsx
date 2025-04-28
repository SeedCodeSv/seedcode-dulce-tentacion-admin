import { Tab, Tabs } from "@heroui/react"

import GeneralData from '@/components/edit-transmitter/GeneralData'
import Layout from '@/layout/Layout'

function EditTransmitterInfo() {
    return (
        <Layout title='Editar informacion de transmisor'>
            <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
                <div className="w-full h-full border border-white p-5 overflow-y-auto  bg-white shadow rounded-xl dark:bg-gray-900">
                    <div className="flex w-full flex-col">
                        <Tabs aria-label="Options">
                            {/* <Tab key="transmitter" title="Datos generales">
                                <div className='h-full'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </div>
                            </Tab> */}
                            <Tab key="fiscal" title="Datos fiscales y paramtros">
                               <GeneralData />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default EditTransmitterInfo