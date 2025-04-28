import React, { useState } from 'react';

type Row = {
  numeroControl: string;
};

type Data = {
  rows: Row[];
};

type MissingBySerie = Record<string, number[]>;

export default function VerificadorCorrelativos() {
  const [missing, setMissing] = useState<MissingBySerie>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const json: Data = JSON.parse(text);

      const seriesMap: Record<string, number[]> = {};

      json.rows.forEach(({ numeroControl }) => {
        const match = numeroControl.match(/(P\d{3})-(\d{15})$/);

        if (!match) return;
        const [, serie, correlativo] = match;

        const num = parseInt(correlativo, 10);

        if (!seriesMap[serie]) seriesMap[serie] = [];
        seriesMap[serie].push(num);
      });

      const result: MissingBySerie = {};

      Object.entries(seriesMap).forEach(([serie, nums]) => {
        const sorted = [...new Set(nums)].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const missing = [];

        for (let i = min; i <= max; i++) {
          if (!sorted.includes(i)) missing.push(i);
        }
        result[serie] = missing;
      });

      setMissing(result);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <input accept=".json" className="mb-4" type="file" onChange={handleFile} />
      {Object.entries(missing).map(([serie, faltantes]) => (
        <div key={serie} className="mb-4">
          <h2 className="font-bold">{serie}</h2>
          {faltantes.length > 0 ? (
            <ul className="list-disc list-inside">
              {faltantes.slice(0, 20).map((n) => (
                <li key={n}>{n}</li>
              ))}
              {faltantes.length > 20 && <li>...y {faltantes.length - 20} más</li>}
            </ul>
          ) : (
            <p>Sin faltantes</p>
          )}
        </div>
      ))}
    </div>
  );
}
