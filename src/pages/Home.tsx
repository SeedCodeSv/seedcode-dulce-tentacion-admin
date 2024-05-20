import { useEffect } from "react";
import Layout from "../layout/Layout";
import { salesReportStore } from "../store/reports/sales_report.store";
import { useAuthStore } from "../store/auth.store";
function Home() {
  const { getSalesByBranchAndMonth, sales_branch_month } = salesReportStore();

  const {user} = useAuthStore()

  useEffect(() => {
    getSalesByBranchAndMonth(user?.employee.branch.transmitterId ?? 0);
  }, []);


  return (
    <Layout title="Home">
      <div className="w-full h-full">
        <div className="w-full grid grid-cols-3">
          <div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
