import React from 'react';

type StatusBadgeProps = {
  status: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  switch (status.toLowerCase()) {
    case 'completada':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'en proceso':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'pendiente':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'cancelada':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'abierta':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;