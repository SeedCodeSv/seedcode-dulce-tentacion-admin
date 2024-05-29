// import React from 'react'
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { DollarSign, ScrollText, Search, Truck } from "lucide-react";
import {  useEffect, useState } from "react";
// import { ThemeContext } from "../../hooks/useTheme";
import { useBranchProductStore } from "../../store/branch_product.store";
import { Branches } from "../../types/branches.types";
import { useBranchesStore } from "../../store/branches.store";
import ModalGlobal from "../global/ModalGlobal";
import { useSupplierStore } from "../../store/supplier.store";
import { global_styles } from "../../styles/global.styles";

function AddPurchaseOrders() {
  const vaul = useDisclosure();
  const {
    getBranchProductOrders,
    branch_product_order,
    addProductCart
  } = useBranchProductStore();

  const { getSupplierList, supplier_list } = useSupplierStore();

  const { branch_list, getBranchesList } = useBranchesStore();

  const [branch, setBranch] = useState("");

  useEffect(() => {
    getBranchProductOrders(branch, "", "", "");
  }, [branch]);

  useEffect(() => {
    getBranchesList();
    getSupplierList();
  }, []);

  // const { context } = useContext(ThemeContext);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <p>Lista de productos</p>
      </div>
      <ModalGlobal
        isOpen={true}
        onClose={vaul.onClose}
        title="Agregar productos"
        size="w-full md:w-[80%]"
      >
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <Select
                label="Sucursal"
                value={branch}
                onSelectionChange={(e) => {
                  const setkeys = new Set((e as unknown) as string[]);
                  const keysArray = Array.from(setkeys);
                  if (keysArray.length > 0) {
                    setBranch(keysArray[0]);
                  }
                }}
                placeholder="Selecciona una sucursal"
                labelPlacement="outside"
                variant="bordered"
              >
                {branch_list.map((branch: Branches) => (
                  <SelectItem
                    className="dark:text-white"
                    key={branch.name}
                    value={branch.name}
                  >
                    {branch.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Autocomplete
                label="Proveedor"
                value={branch}
                onSelect={(e) => {
                  setBranch(e.currentTarget.value);
                }}
                placeholder="Selecciona una sucursal"
                labelPlacement="outside"
                variant="bordered"
              >
                {supplier_list.map((branch) => (
                  <AutocompleteItem
                    className="dark:text-white"
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div>
              <Input
                label="Nombre"
                placeholder="Escribe el nombre del producto"
                labelPlacement="outside"
                variant="bordered"
                startContent={<Search />}
                className="w-full dark:text-white"
              />
            </div>
          </div>
          <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branch_product_order.map((branch_product) => (
              <div
                key={branch_product.id}
                className="shadow border p-4 rounded-lg dark:border-gray-500"
              >
                <p className="font-semibold">{branch_product.product.name}</p>
                <p>Stock: {branch_product.stock}</p>
                <p className="mt-2 flex gap-3">
                  <Truck /> {branch_product.supplier.nombre}
                </p>
                <p className="mt-2 flex gap-3">
                  <ScrollText /> {branch_product.product.categoryProduct.name}
                </p>
                <p className="mt-2 flex gap-3">
                  <DollarSign /> ${branch_product.price}
                </p>
                <Button
                  className="px-10 mt-3"
                  style={global_styles().thirdStyle}
                  onPress={() => addProductCart(branch_product)}
                >
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ModalGlobal>
    </div>
  );
}

export default AddPurchaseOrders;
