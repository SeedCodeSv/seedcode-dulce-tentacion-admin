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
    '34': 'Kg',
    '36': 'Lbs',
  };
  
  return unitMap[unitCode] || unitCode;
};