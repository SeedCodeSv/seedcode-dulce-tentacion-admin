import { useState } from 'react';
import { Input } from '@heroui/react';

import { fechaActualString } from '../../utils/dates';

function SalesByTransmitter() {
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);

  return (
    <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
      <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
      <div className="grid grid-cols-2 gap-2 py-2">
        <span className="text-sm font-semibold dark:text-white">Fecha inicial</span>
        <span className="text-sm font-semibold dark:text-white">Fecha final</span>
        <Input
          className="w-full"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          className="w-full"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}
export default SalesByTransmitter;
