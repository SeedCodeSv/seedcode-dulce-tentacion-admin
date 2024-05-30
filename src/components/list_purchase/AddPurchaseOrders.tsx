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
import {
  DollarSign,
  Plus,
  Printer,
  ScrollText,
  Search,
  Trash,
  Truck,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useBranchProductStore } from "../../store/branch_product.store";
import { Branches } from "../../types/branches.types";
import { useBranchesStore } from "../../store/branches.store";
import { useSupplierStore } from "../../store/supplier.store";
import { global_styles } from "../../styles/global.styles";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "../../hooks/useTheme";
import { formatCurrency } from "../../utils/dte";
import {
  IBranchProductOrderQuantity,
  Supplier,
} from "../../types/branch_products.types";
import { getElSalvadorDateTime } from "../../utils/dates";
import HeadlessModal from "../global/HeadlessModal";
import useEventListener, { TEventHandler } from "../../hooks/useEventListeners";
import { toast } from "sonner";

function AddPurchaseOrders() {
  const vaul = useDisclosure();
  const {
    getBranchProductOrders,
    branch_product_order,
    addProductOrder,
    updateQuantityOrders,
    deleteProductOrder,
    order_branch_products,
    orders_by_supplier,
    getProductByCodeOrders,
  } = useBranchProductStore();

  const { getSupplierList, supplier_list } = useSupplierStore();

  const { branch_list, getBranchesList } = useBranchesStore();

  const [branch, setBranch] = useState("");
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    getBranchProductOrders(branch, supplier, "", "");
  }, [branch, supplier]);

  useEffect(() => {
    getBranchesList();
    getSupplierList();
  }, []);

  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  interface SupplierProducts {
    supplier: Supplier;
    products: IBranchProductOrderQuantity[];
  }

  const handleSave = () => {
    const groupBySupplier = (
      items: IBranchProductOrderQuantity[]
    ): SupplierProducts[] => {
      const supplierMap = new Map<number, SupplierProducts>();

      items.forEach((item) => {
        if (!supplierMap.has(item.supplierId)) {
          supplierMap.set(item.supplierId, {
            supplier: item.supplier,
            products: [],
          });
        }
        supplierMap.get(item.supplierId)!.products.push(item);
      });

      return Array.from(supplierMap.values());
    };

    const groupedProducts = groupBySupplier(order_branch_products);

    if(groupedProducts){
      toast.success("Se guardaron los productos");
    }
  };

  const handlePrint = (
    products: IBranchProductOrderQuantity[],
    supplierName: string
  ) => {
    const total = products
      .map((p) => Number(p.price) * p.quantity)
      .reduce((a, b) => a + b, 0);

    const iframe = document.createElement("iframe");
    iframe.style.height = "0";
    iframe.style.visibility = "hidden";
    iframe.style.width = "0";
    iframe.setAttribute("srcdoc", "<html><body></body></html>");
    document.body.appendChild(iframe);
    iframe.contentWindow?.addEventListener("afterprint", () => {
      iframe.parentNode?.removeChild(iframe);
    });

    iframe.addEventListener("load", () => {
      const body = iframe.contentDocument?.body;

      if (!body) return;

      body.style.textAlign = "center";
      body.style.fontFamily = "Arial, sans-serif";

      const customContent = `
          <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 800px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
        }
        .details {
            margin-bottom: 20px;
            width: 100%;
            text-align: left;
        }
        .details div {
            margin-bottom: 5px;
        }
        .details span {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            text-align: right;
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 20px;
        }
          </style>
          <div class="container">
        <div class="header">
            <h1>Orden de Compra</h1>
        </div>
        <div class="details">
            <div><span>Fecha:</span> ${getElSalvadorDateTime().fecEmi}</div>
            <div><span>Hora:</span> ${getElSalvadorDateTime().horEmi}</div>
            <div><span>Proveedor:</span> ${supplierName}</div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Código</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
            ${products
              .map(
                (product) => `
                <tr>
                    <td>${product.product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.product.code}</td>
                    <td>${formatCurrency(
                      Number(product.price) * product.quantity
                    )}</td>
                </tr>
                `
              )
              .join("")}
            </tbody>
        </table>
        <div class="total">
            Total: ${formatCurrency(total)}
        </div>
    </div>
        `;
      const div = document.createElement("div");
      div.innerHTML = customContent;
      body.appendChild(div);

      iframe.contentWindow?.print();
    });
  };

  let barcode = "";
  let interval: NodeJS.Timeout | undefined;

  const handler = (evt: KeyboardEvent) => {
    if (interval) clearInterval(interval);
    if (evt.code === "Enter") {
      if (barcode) getProductByCodeOrders(branch, supplier, "", barcode);
      barcode = "";
      return;
    }
    if (evt.key !== "Shift") barcode += evt.key;
    interval = setInterval(() => (barcode = ""), 200000);
  };

  useEventListener("keydown", handler as TEventHandler);

  const cellEditor = (product: IBranchProductOrderQuantity) => {
    const product_finded = order_branch_products.find(
      (p) => p.id === product.id
    );

    return (
      <div className="w-full">
        <Input
          variant="bordered"
          color="primary"
          className="w-32"
          type="number"
          defaultValue={product_finded?.quantity.toString()}
          onChange={(e) =>
            updateQuantityOrders(product.id, Number(e.target.value))
          }
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-between">
        <div className="w-full flex justify-between">
          <p className="text-xl dark:text-white font-semibold">
            Lista de productos
          </p>
          <Button
            onClick={vaul.onOpen}
            isIconOnly
            style={global_styles().thirdStyle}
          >
            <Plus />
          </Button>
        </div>
        {orders_by_supplier.map((supplier, index) => (
          <div key={index} className="w-full">
            <p className="dark:text-white">
              Proveedor: {supplier.supplier.nombre}
            </p>
            <DataTable
              className="shadow mt-5"
              emptyMessage="No se encontraron resultados"
              value={supplier.products}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: "10px" }}
                field="id"
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="product.name"
                header="Nombre"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="quantity"
                header="Cantidad"
                editor={(options) => cellEditor(options.rowData)}
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="product.code"
                header="Código"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="price"
                header="Precio"
                body={(rowData) => formatCurrency(Number(rowData.price))}
              />
              <Column
                headerStyle={{ ...style, borderTopRightRadius: "10px" }}
                header="Acciones"
                body={(item) => (
                  <div className="flex w-full gap-5">
                    <Button
                      style={global_styles().dangerStyles}
                      isIconOnly
                      onClick={() => deleteProductOrder(item.id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                )}
              />
            </DataTable>
            <div className="w-full py-5 flex justify-start">
              <Button
                onClick={() =>
                  handlePrint(supplier.products, supplier.supplier.nombre)
                }
                style={global_styles().warningStyles}
              >
                <Printer />
              </Button>
            </div>
          </div>
        ))}

        <div className="w-full flex justify-end mt-4">
          <Button
            onClick={handleSave}
            style={global_styles().secondaryStyle}
            className="px-16"
          >
            Guardar
          </Button>
        </div>
      </div>
      <HeadlessModal
        isOpen={vaul.isOpen}
        onClose={vaul.onClose}
        title="Nueva orden de compra"
        size="w-screen h-screen md:h-auto md:w-[80vw]"
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
                className="w-full dark:text-white"
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
                  setSupplier(e.currentTarget.value);
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
          <div className="w-full flex justify-end py-5">
            <Button
              onClick={vaul.onClose}
              style={global_styles().secondaryStyle}
              className="px-10"
            >
              Aceptar
            </Button>
          </div>
          <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branch_product_order.map((branch_product) => (
              <div
                key={branch_product.id}
                className="shadow border p-4 rounded-lg dark:border-gray-500"
              >
                <p className="font-semibold dark:text-white">
                  {branch_product.product.name}
                </p>
                <p className="dark:text-white">Stock: {branch_product.stock}</p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <Truck /> {branch_product.supplier.nombre}
                </p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <ScrollText /> {branch_product.product.categoryProduct.name}
                </p>
                <p className="mt-2 flex gap-3 dark:text-white">
                  <DollarSign /> ${branch_product.price}
                </p>
                <Button
                  className="px-10 mt-3"
                  style={global_styles().thirdStyle}
                  onPress={() => addProductOrder(branch_product)}
                >
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </HeadlessModal>
    </div>
  );
}

export default AddPurchaseOrders;
