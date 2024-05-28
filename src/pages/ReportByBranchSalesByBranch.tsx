import Layout from '../layout/Layout';
import ReportSalesByBranch from '../components/reporters/ReportByBranchSales';

function ReportByBranchSalesByBranch() {
  return (
    <div>
      <Layout title="Ventas por sucursales">
        <ReportSalesByBranch></ReportSalesByBranch>
      </Layout>
    </div>
  );
}

export default ReportByBranchSalesByBranch;
