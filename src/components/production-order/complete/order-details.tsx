import React from 'react';

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="flex flex-col py-4 border-b border-gray-100">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

interface OrderDetailsProps {
  creationDate: string;
  employee: string;
  destinationBranch: string;
  receptionBranch: string;
  observations: string[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  creationDate,
  employee,
  destinationBranch,
  receptionBranch,
  observations,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <DetailItem label="Fecha de Creación" value={creationDate} />
        <DetailItem label="Empleado" value={employee} />
        <DetailItem label="Sucursal de Destino" value={destinationBranch} />
        <DetailItem label="Sucursal de Recepción" value={receptionBranch} />
        <div className="flex flex-col py-4 col-span-1 md:col-span-2 border-b border-gray-100">
          <span className="text-gray-500 text-sm">Observaciones</span>
        <ul className="list-disc pl-5 space-y-1">
          {observations.map((observation, index) => (
            <li key={index} className="text-gray-800 font-medium">
              {observation}
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
