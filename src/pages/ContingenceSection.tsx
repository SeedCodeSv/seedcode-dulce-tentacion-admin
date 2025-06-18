import { Tab, Tabs } from "@heroui/react";
import { ArrowDown01, ArrowUp01, BadgeDollarSign, HelpCircle, NotebookIcon } from "lucide-react";
import { useEffect } from "react";

import ContingenceFC_CCF from "./contingence/ContingenceFC_CFF";
import ContingenceND from "./contingence/ContingenceND";
import ContingenceNC from "./contingence/ContingenceNC";
import ContingenceFSE from "./contingence/ContingenceFSE";
import ContingenceNRE from "./contingence/ContingenceNRE";

import { useEmployeeStore } from "@/store/employee.store";
import Layout from "@/layout/Layout";
import DivGlobal from "@/themes/ui/div-global";

function ContingenceSection() {
    const { getEmployeesList } = useEmployeeStore();

    useEffect(() => {
        getEmployeesList();
    }, []);

    return (
        <Layout title="Contingencia">
            <DivGlobal>
                <Tabs
                    aria-label="Options"
                    className="px-2 grid lg:grid-cols-1 gap-4"
                    color="primary"
                >
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
                                <span className="font-semibold">  NOTAS REMISON</span>
                            </div>
                        }
                    >
                        <ContingenceNRE />
                    </Tab>
                </Tabs>
            </DivGlobal>
        </Layout>
    )
}
export default ContingenceSection;