import { useEffect } from "react";
import { useBranchProductStore } from "../../store/branch_product.store";
import { return_branch_id } from "../../storage/localStorage";
import { DataView } from "primereact/dataview";
import { BranchProduct } from "../../types/branch_products.types";
import { classNames } from "primereact/utils";
import { ClipboardList, DollarSign, ShoppingBag } from "lucide-react";

interface Props {
    layout: "grid" | "list";
}

function MobileView_NewSale({ layout}: Props) {
    const {pagination_branch_products, getPaginatedBranchProducts} = useBranchProductStore();

    useEffect(() => {
        getPaginatedBranchProducts(Number(return_branch_id()),
    ); 
    }, [])

    return (
        <div className="w-full pb-10">
            <DataView
                value={pagination_branch_products.branchProducts}
                gutter
                layout={layout}
                pt={{grid: () => ({
                    className: 
                    "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-5 mt-5",
                })}}
                color="surface"
                itemTemplate={(item) => 
                    gridItem(item, layout)
                }
                emptyMessage="No se encontraron resultados"
            />
        </div>
    )

}


const gridItem = (
    product: BranchProduct,
    layout: "grid" | "list",
) => {
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
                    <ListItem product={product}/>
                </>
            )}
        </>
    )
};

const ListItem = ({
    product,
}: {
    product: BranchProduct;
}) => {
    return (
        <>
            <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
                <div className="w-full">
                <div className="flex items-center w-full gap-2">
                    <ShoppingBag
                        className="dark:text-gray-400 text-[#274c77]"
                        size={33}
                    />
                        {product.product.name}
                    </div>
                    <div className="flex items-center w-full gap-2 mt-3">
                        <DollarSign
                            className="dark:text-gray-400 text-[#274c77]"
                            size={33}
                        />
                        {product.price}
                    </div>
                    <div className="flex items-center w-full gap-2 mt-3">
                        <ClipboardList 
                            className="dark:text-gray-400 text-[#274c77]"
                            size={33}
                        />
                        {product.product.categoryProduct.name}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileView_NewSale;