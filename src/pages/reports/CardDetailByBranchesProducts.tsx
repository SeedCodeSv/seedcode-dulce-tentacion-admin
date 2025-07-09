import { Card, CardBody, CardHeader } from '@heroui/react';


import { useProductsOrdersReportStore } from '@/store/reports/productsSelled_report.store';
import useWindowSize from '@/hooks/useWindowSize';

function CardDetailByBranchesProducts({

}: {}) {
    const { windowSize } = useWindowSize()
    const { products_selled_by_branches } = useProductsOrdersReportStore();
    const branchNames = Object.keys(products_selled_by_branches.branchTotals || {}).filter(key => key !== 'totalGeneral');


    return (
        <div className={`${windowSize.width < 768 ? 'gap-4 mt-3 overflow-y-auto p-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2'} `}>
            {products_selled_by_branches.data.map((prd, index) => (
                <Card key={index} className="border shadow-md mb-2">
                    <CardHeader>
                        <h3 className="text-lg font-bold text-gray-800">{prd.productName}</h3>
                    </CardHeader>
                    <CardBody>
                        {branchNames.map(branch => (
                            <p key={branch} className="text-sm mb-1">
                                <span className="font-semibold">{branch}:</span> {Number(prd[branch] ?? 0)}
                            </p>
                        ))}
                        <hr className="my-2" />
                        <p className="text-blue-700 font-semibold">
                            Total general: {Number(prd.totalGeneral)}
                        </p>
                    </CardBody>
                </Card>
            ))}

            <Card className="border shadow-md bg-gray-100">
                <CardHeader>
                    <h3 className="text-lg font-bold text-gray-700">Totales</h3>
                </CardHeader>
                <CardBody>
                    {branchNames.map(branch => (
                        <p key={branch} className="text-sm mb-1">
                            <span className="font-semibold">{branch}:</span> {Number(products_selled_by_branches.branchTotals[branch] ?? 0)}
                        </p>
                    ))}
                    <hr className="my-2" />
                    <p className="text-blue-700 font-semibold">
                        Total general: {Number(products_selled_by_branches.branchTotals.totalGeneral ?? 0)}
                    </p>
                </CardBody>
            </Card>
        </div>

        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
        //     {products_selled_by_branches.data.map((prd, index) => (
        //         <Card key={0}>
        //             {/* <CardHeader>{prd.name}</CardHeader> */}
        //             <CardBody>
        //                 {/* <p>
        //                     <span className="font-semibold">SUCURSAL CENTRO:</span>
        //                     {prd.code}
        //                 </p>
        //                 <p>
        //                     <span className="font-semibold">SUCURSAL ISSS:</span>
        //                     {prd.productName}
        //                 </p>
        //                 <p>
        //                     <span className="font-semibold">SUCURSAL NAHUIZALCO:</span>
        //                     {prd.productName}
        //                 </p> */}
        //                 <p>
        //                     <span className="font-semibold">Total general:</span>
        //                     {/* {prd.} */}
        //                 </p>
        //             </CardBody>

        //         </Card>
        //     ))}
        // </div>
    );
}

export default CardDetailByBranchesProducts;
