
import Layout from '../layout/Layout';
import ReportExpenseByBranch from '../components/reporters/ReportExpenseByBranch';

function ReportExpensesByBranchPage() {
  return (
    <div>
   
      <Layout title="Gastos por Sucursales">
        <ReportExpenseByBranch></ReportExpenseByBranch>
      </Layout>
    </div>
  );
}

export default ReportExpensesByBranchPage;