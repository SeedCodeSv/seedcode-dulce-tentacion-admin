// import React from "react";
import ModalGlobal from "../global/ModalGlobal";
import AddPurchaseOrders from "./AddPurchaseOrders";

// interface Props {
//   actions: string[];
// }
function ListPurchasesOrders() {
  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent"></div>
      <ModalGlobal
        isOpen={true}
        onClose={() => {}}
        title="List Purchases Orders"
        size="w-full md:w-[80%]"
      >
        <AddPurchaseOrders />
      </ModalGlobal>
    </div>
  );
}

export default ListPurchasesOrders;
