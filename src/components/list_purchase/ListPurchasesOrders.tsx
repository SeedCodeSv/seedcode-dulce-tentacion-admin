// import React from "react";
import { useDisclosure } from "@nextui-org/react";
import FullDialog from "../global/FullDialog";
import AddPurchaseOrders from "./AddPurchaseOrders";
import AddButton from "../global/AddButton";

// interface Props {
//   actions: string[];
// }
function ListPurchasesOrders() {
  const modalAdd = useDisclosure();
  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
        <div className="w-full flex justify-between">
          <p className="text-lg font-semibold dark:text-white">Listado de ordenes de compra</p>
          <AddButton onClick={modalAdd.onOpen} />
        </div>
      </div>
      <FullDialog
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Nueva orden de compra"
      >
        <AddPurchaseOrders />
      </FullDialog>
    </div>
  );
}

export default ListPurchasesOrders;
