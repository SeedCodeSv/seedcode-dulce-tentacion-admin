import Layout from "../layout/Layout";
import { pdf } from "@react-pdf/renderer";
import CreditoFiscalTMP from "./invoices/Template2/CFC";
import { Button } from "@nextui-org/react";

function Test() {

  const handleDownloadPDF = async () => {
    const blob = await pdf(<CreditoFiscalTMP />).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Test">
      <div className="w-full h-full p-5 bg-gray-100 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <Button onClick={handleDownloadPDF}>Limpiar</Button>
        </div>
      </div>
    </Layout>
  );
}

export default Test;
