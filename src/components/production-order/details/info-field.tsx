import React from 'react';

type InfoFieldProps = {
  label: string;
  value: string | number | React.ReactNode;
};

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div className="mb-4">
      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-200/70">{label}</p>
      <p className="text-sm lg:text-base font-medium">{value}</p>
    </div>
  );
};

export default InfoField;