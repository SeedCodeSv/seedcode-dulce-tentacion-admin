import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { ProductionOrder } from "./types";


interface footerProps {
    order: ProductionOrder
}

export default function FooterDetailOrder({ order }: footerProps) {
    const [show, setShow] = useState(false)

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalle de Costos</h2>
                {show ? (
                    <ChevronUp
                        className="cursor-pointer transition-transform hover:scale-110 text-gray-500"
                        onClick={() => setShow(false)}
                    />
                ) : (
                    <ChevronDown
                        className="cursor-pointer transition-transform hover:scale-110 text-gray-500"
                        onClick={() => setShow(true)}
                    />
                )}
            </div>

            {show && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 text-gray-700 dark:text-gray-200">
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-semibold">Materia prima (MP)</span>
                        <p className="text-sm mt-1 font-medium">$ {order.costRawMaterial}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-semibold">Mano de obra directa (MOD)</span>
                        <p className="text-sm mt-1 font-medium">$ {order.costDirectLabor}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-semibold">Costo indirecto (CIF)</span>
                        <p className="text-sm mt-1 font-medium">$ {order.indirectManufacturingCost}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-semibold">Costo Primo</span>
                        <p className="text-sm mt-1 font-medium">$ {order.costPrime}</p>
                    </div>
                </div>
            )}
        </div>

    )
}