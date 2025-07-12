import { ProductLossSource } from "@/utils/utils";
import {
  Undo2,
  Trash2,
  AlertCircle,
  PackageX,
  MoveRight,
  Activity,
  Info,
  ShieldAlert,
  Settings
} from "lucide-react";

const iconMap: Record<ProductLossSource, JSX.Element> = {
  [ProductLossSource.CANCELED_SALE]: <Trash2 className="text-red-500" size={18} />,
  [ProductLossSource.PRODUCTION_ORDER]: <Activity className="text-blue-500" size={18} />,
  [ProductLossSource.INVENTORY_ADJUSTMENT]: <Settings className="text-yellow-500" size={18} />,
  [ProductLossSource.INTERNAL_USE]: <ShieldAlert className="text-purple-500" size={18} />,
  [ProductLossSource.TRANSFER]: <MoveRight className="text-emerald-500" size={18} />,
  [ProductLossSource.EXPIRED]: <PackageX className="text-pink-500" size={18} />,
  [ProductLossSource.RETURN]: <Undo2 className="text-gray-500" size={18} />,
  [ProductLossSource.DEFAULT]: <Info className="text-slate-500" size={18} />,
};

const colorMap: Record<ProductLossSource, string> = {
  [ProductLossSource.CANCELED_SALE]: "bg-red-100 text-red-700",
  [ProductLossSource.PRODUCTION_ORDER]: "bg-blue-100 text-blue-700",
  [ProductLossSource.INVENTORY_ADJUSTMENT]: "bg-yellow-100 text-yellow-700",
  [ProductLossSource.INTERNAL_USE]: "bg-purple-100 text-purple-700",
  [ProductLossSource.TRANSFER]: "bg-emerald-100 text-emerald-700",
  [ProductLossSource.EXPIRED]: "bg-pink-100 text-pink-700",
  [ProductLossSource.RETURN]: "bg-gray-100 text-gray-700",
  [ProductLossSource.DEFAULT]: "bg-slate-100 text-slate-700",
};

export const RenderProductLossSource = ({ source }: { source: string }) => {
  const value = Object.values(ProductLossSource).includes(source as ProductLossSource)
    ? (source as ProductLossSource)
    : ProductLossSource.DEFAULT;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colorMap[value]}`}
    >
      {iconMap[value]}
      {value}
    </span>
  );
};
