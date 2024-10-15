export const generateURL = (
    name: string,
    generation: string,
    format: 'json' | 'pdf',
    typeDte: string,
    fecEmi: string
  ) => {
    return `CLIENTES/${
      name
    }/${new Date().getFullYear()}/VENTAS/${typeDte === '01' ? 'FACTURAS' : 'CREDITO_FISCAL'}/${fecEmi}/${generation}/${generation}.${format}`;
  };
  
  
  export const generateFSEURL = (
    name: string,
    generation: string,
    fecEmi: string
  ) => {
    return `CLIENTES/${
      name
    }/${new Date().getFullYear()}/SUJETOS_EXCLUIDOS/${fecEmi}/${generation}/${generation}.json`;
  };
  