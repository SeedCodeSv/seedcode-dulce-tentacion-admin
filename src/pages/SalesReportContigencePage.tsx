import React from "react";
import SalesReportContigence from "../components/sales-report/SalesReportContigence";
import Layout from "../layout/Layout";

function SalesReportContigencePage() {
  return (
    <div>
      <Layout title="Reporte de ventas">
        <SalesReportContigence></SalesReportContigence>
      </Layout>
    </div>
  );
}

export default SalesReportContigencePage;
