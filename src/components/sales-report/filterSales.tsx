import { Input, Select, SelectItem } from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

import { ResponsiveFilterWrapper } from "../global/ResposiveFilters";

import { useBranchesStore } from "@/store/branches.store";
import { usePointOfSales } from "@/store/point-of-sales.store";
import { PointOfSale } from '@/types/point-of-sales.types';
import { formatDate } from "@/utils/dates";


interface FiltersProps {
  dateInitial: string;
  setDateInitial: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  branch: number;
  setBranch: Dispatch<SetStateAction<number>>;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  typeVoucher: string;
  setTypeVoucher: Dispatch<SetStateAction<string>>;
  pointOfSale: string;
  setPointOfSale: Dispatch<SetStateAction<string>>;
}

const Filters = (props: FiltersProps) => {
  const { branch_list, getBranchesList } = useBranchesStore();
  const { point_of_sales_list, getPointOfSalesList } = usePointOfSales();

  useEffect(() => {
    getBranchesList();
  }, []);

  const estadosV = [
    { label: 'TODOS', value: '' },
    { label: 'PROCESADO', value: 'PROCESADO' },
    { label: 'CONTINGENCIA', value: 'CONTINGENCIA' },
    { label: 'INVALIDADO', value: 'INVALIDADO' },
  ];

  const filteredPoints = useMemo(() => {
    if (point_of_sales_list.pointOfSales) {
      const pointOfSalesArray = Object.values(
        point_of_sales_list.pointOfSales
      ).flat() as Array<PointOfSale>;

      return pointOfSalesArray.filter((point) => point.typeVoucher === 'FE');
    }

    return [];
  }, [point_of_sales_list]);


  return (
    <ResponsiveFilterWrapper classButtonLg="w-1/3"
      classLg="w-full grid grid-cols-3 gap-5"
      withButton={false}
    >
      <Input
        className="z-0"
        classNames={{
          input: 'dark:text-white dark:border-gray-600',
          label: 'text-sm font-semibold dark:text-white',
        }}
        defaultValue={formatDate()}
        label="Fecha inicial"
        labelPlacement="outside"
        placeholder="Buscar por nombre..."
        type="date"
        value={props.dateInitial}
        variant="bordered"
        onChange={(e) => props.setDateInitial(e.target.value)}
      />
      <Input
        classNames={{
          input: 'dark:text-white dark:border-gray-600',
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Fecha final"
        labelPlacement="outside"
        placeholder="Buscar por nombre..."
        type="date"
        value={props.endDate}
        variant="bordered"
        onChange={(e) => props.setEndDate(e.target.value)}
      />
      <Select
        className="z-0"
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Sucursal"
        labelPlacement="outside"
        placeholder="Selecciona la sucursal"
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            const branchId = Number(new Set(key).values().next().value);

            props.setBranch(branchId);
            getPointOfSalesList(branchId);
          } else {
            props.setBranch(0);
            getPointOfSalesList(0);
          }
        }}
      >
        {branch_list.map((item) => (
          <SelectItem key={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Punto de venta"
        labelPlacement="outside"
        placeholder="Selecciona un punto de venta"
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            const pointOfSale = String(new Set(key).values().next().value);

            props.setPointOfSale(pointOfSale);
          } else {
            props.setPointOfSale('');
          }
        }}
      >
        {filteredPoints.map((item) => (
          <SelectItem key={item.code}>
            {item.code}
          </SelectItem>
        ))}
      </Select>
      <Select
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Tipo de comprobante"
        labelPlacement="outside"
        placeholder="Selecciona el tipo de comprobante"
        variant="bordered"
        onChange={(e) => props.setTypeVoucher(e.target.value)}
      >
         <SelectItem key="">
          Todos
        </SelectItem>
        <SelectItem key="01">
          FE - Factura Comercial
        </SelectItem>
        <SelectItem key="03">
          CCFE - Crédito Fiscal Electrónico
        </SelectItem>
      </Select>
      <Select
        className="dark:text-white"
        classNames={{
          label: 'text-sm font-semibold dark:text-white',
        }}
        label="Mostrar por estado"
        labelPlacement="outside"
        placeholder="Selecciona un estado"
        selectedKeys={[props.state.toString()]}
        value={props.state}
        variant="bordered"
        onChange={(e) => props.setState(e.target.value)}
      >
        {estadosV.map((e) => (
          <SelectItem key={e.value} className="dark:text-white">
            {e.label}
          </SelectItem>
        ))}
      </Select>
    </ResponsiveFilterWrapper>
  );
};

export default Filters
