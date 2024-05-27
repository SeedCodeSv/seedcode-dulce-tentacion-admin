import ModalGlobal from "../global/ModalGlobal";
import AddNormalSupplier from "./AddNormalSupplier";
import AddTributeSupplier from "./AddTributeSupplier";
import { useState } from "react";
import { Supplier } from "../../types/supplier.types";
import { useDisclosure } from "@nextui-org/react";

function ListSuppliers() {
  const [typeClient, setTypeClient] = useState("normal");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  
  const modalSupplier = useDisclosure()

  return (
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent"></div>
      <ModalGlobal
        title={
          selectedSupplier
            ? selectedTitle !== ""
              ? selectedTitle
              : "Editar proveedor"
            : "Nuevo proveedor"
        }
        onClose={modalSupplier.onClose}
        isOpen={modalSupplier.isOpen}
        size={
          typeClient === "contribuyente"
            ? "w-full md:w-[600px] lg:w-[800px] xl:w-[1000px]"
            : "w-full md:w-[500px] lg:w-[700px] xl:w-[800px]"
        }
      >
        {typeClient === "normal" ? (
          <AddNormalSupplier closeModal={() => {}} />
        ) : (
          <AddTributeSupplier closeModal={() => {}} />
        )}
      </ModalGlobal>
    </div>
  );
}

export default ListSuppliers;
