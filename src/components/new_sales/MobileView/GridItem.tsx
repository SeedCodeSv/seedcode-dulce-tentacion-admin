import classNames from "classnames";
import { BranchProduct } from "../../../types/branch_products.types";
import { ClipboardList, DollarSign, ShoppingBag } from "lucide-react";
import { ListItem } from "./ListItem";

export const GridItem = ({
    product,
    layout,
  }: {
    product: BranchProduct;
    layout: "grid" | "list";
  }) => {
    return (
      <>
        {layout === "grid" ? (
          <div
            className={classNames(
              "w-full shadow-sm dark:border border-gray-600 hover:shadow-lg p-8 rounded-2xl"
            )}
            key={product.id}
          >
            <div className="flex w-full gap-2">
              <ShoppingBag
                className="dark:text-gray-400 text-[#274c77]"
                size={33}
              />
              {product.product.name}
            </div>
            <div className="flex w-full gap-2 mt-3">
              <DollarSign
                className="dark:text-gray-400 text-[#274c77]"
                size={33}
              />
              {product.price}
            </div>
            <div className="flex w-full gap-2 mt-3">
              <ClipboardList
                className="dark:text-gray-400 text-[#274c77]"
                size={33}
              />
              {product.product.categoryProduct.name}
            </div>
          </div>
        ) : (
          <>
            <ListItem product={product} />
          </>
        )}
      </>
    );
  };