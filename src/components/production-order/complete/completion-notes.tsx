import { Textarea } from '@heroui/react';
import React, { useState } from 'react';

interface CompletionNotesProps {
  onNotesChange: (notes: string) => void;
}

const CompletionNotes: React.FC<CompletionNotesProps> = ({ onNotesChange }) => {
  const [notes, setNotes] = useState<string>('');

  const handleNotesChange = (text: string) => {
    setNotes(text);
    onNotesChange(text);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Notas de Finalización</h2>
      <Textarea
      className='dark:text-white'
        placeholder="Ingrese notas sobre la finalización de la orden (opcional)"
        rows={4}
        value={notes}
        variant="bordered"
        onValueChange={handleNotesChange}
      />

      <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
        <h3 className="font-medium text-blue-800 dark:text-blue-50 mb-2">Sugerencias para las notas:</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-50 list-disc pl-5 space-y-1">
          <li>Incluir detalles sobre problemas encontrados durante la producción</li>
          <li>Documentar cambios en los materiales utilizados</li>
          <li>Registrar ajustes realizados en los procesos de producción</li>
          <li>Mencionar cualquier incidencia que haya afectado la calidad</li>
        </ul>
      </div>
    </div>
  );
};

export default CompletionNotes;
