import Layout from "@/layout/Layout";
import { useEmployeeStore } from "@/store/employee.store";
import { Tab, Tabs } from "@nextui-org/react";
import { ArrowDown01, ArrowUp01, BadgeDollarSign, HelpCircle } from "lucide-react";
import { useEffect } from "react";
import ContingenceFC_CCF from "./contingence/ContingenceFC_CFF";
import ContingenceND from "./contingence/ContingenceND";
import ContingenceNC from "./contingence/ContingenceNC";
import ContingenceFSE from "./contingence/ContingenceFSE";

function ContingenceSection() {
    const { getEmployeesList } = useEmployeeStore();
    // const [modeSalesInvalid, setModeSalesInvalid] = useState<'show' | 'generate'>('show');
    // const [pathJson, setPathJson] = useState('');
    // const [selectedSale, setSelectedSale] = useState();

    useEffect(() => {
        getEmployeesList();
    }, []);

    return (
        <Layout title="Contingencia">
            <div className="w-full h-full p-4 lg:p-8 bg-gray-50 dark:bg-gray-800">
                <div className="w-full h-full p-3 mt-3 overflow-y-auto overflow-x-auto bg-white shadow rounded-xl dark:bg-gray-900">
                    <Tabs className="px-2" aria-label="Options" color="primary">
                        <Tab
                            key="contingence"
                            className="px-4"
                            title={
                                <div className="flex items-center space-x-2">
                                    <BadgeDollarSign/>
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
                                    <ArrowUp01/>
                                    <span className="font-semibold">NOTAS DE DÉBITO</span>
                                </div>
                            }
                        >
                            <ContingenceND/>
                        </Tab>
                        <Tab
                            key="contingence-nc"
                            className="px-4 text-sm"
                            title={
                                <div className="flex items-center space-x-2">
                                    <ArrowDown01/>
                                    <span className="font-semibold">NOTAS DE CRÉDITO</span>
                                </div>
                            }
                        >
                            <ContingenceNC/>
                        </Tab>
                        <Tab
                            key="contingence-fse"
                            className="px-4 text-sm"
                            title={
                                <div className="flex items-center space-x-2">
                                    <HelpCircle/>
                                    <span className="font-semibold">SUJETO EXCLUIDO</span>
                                </div>
                            }
                        >
                            <ContingenceFSE/>
                        </Tab>
                    </Tabs>
                </div>

            </div>
        </Layout>
    )
}
export default ContingenceSection;