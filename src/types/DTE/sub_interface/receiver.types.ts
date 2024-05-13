export interface Direccion {
    departamento: string;
    municipio: string;
    complemento: string;
  }
export interface Receptor {
    nit: string;
    nrc: string;
    nombre: string;
    codActividad: string;
    descActividad: string;
    nombreComercial: string;
    direccion: Direccion;
    telefono: string;
    correo: string;
  }