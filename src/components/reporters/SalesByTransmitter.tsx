import { useState } from 'react';

import { Input } from "@heroui/react";
import { fechaActualString } from '../../utils/dates';

function SalesByTransmitter() {
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);

  return (
    <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
      <p className="pb-4 text-lg font-semibold dark:text-white">Ventas</p>
      <div className="grid grid-cols-2 gap-2 py-2">
        <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
        <label className="text-sm font-semibold dark:text-white">Fecha final</label>
        <Input
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
          className="w-full"
          type="date"
        />
        <Input
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
          className="w-full"
          type="date"
        />
      </div>
    </div>
  );
}
export default SalesByTransmitter;
