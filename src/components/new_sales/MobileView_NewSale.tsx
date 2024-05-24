import { useEffect } from "react";
import { useBranchProductStore } from "../../store/branch_product.store";
import { return_branch_id } from "../../storage/localStorage";
import { DataView } from "primereact/dataview";
import { GridItem } from "./MobileView/GridItem";

interface Props {
  layout: "grid" | "list";
}

function MobileView_NewSale({ layout }: Props) {
  const {
    pagination_branch_products,
    getPaginatedBranchProducts,
  } = useBranchProductStore();

  useEffect(() => {
    getPaginatedBranchProducts(Number(return_branch_id()));
  }, []);

  return (
    <div className="w-full pb-10">
      <DataView
        value={pagination_branch_products.branchProducts}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(item) => <GridItem product={item} layout={layout} />}
        emptyMessage="No se encontraron resultados"
      />
    </div>
  );
}

export default MobileView_NewSale;