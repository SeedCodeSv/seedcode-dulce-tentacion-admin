export const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getUnitLabel = (unitCode: string) => {
  const unitMap: Record<string, string> = {
    '59': 'Unidad',
    '36': 'Kg',
    '38': 'Unidades'
  };
  
  return unitMap[unitCode] || unitCode;
};