export interface IGetUserById {
    id: number
    nombre: string
    nombreComercial: string
    nrc: string
    nit: string
    tipoDocumento: string
    numDocumento: string
    codActividad: string
    descActividad: string
    bienTitulo: string
    telefono: string
    correo: string
    isActive: boolean
    esContribuyente: boolean
    branch: Branch
    direccion: Direccion
    direccionId: number
    branchId: number
  }
  
  export interface Branch {
    id: number
    name: string
    address: string
    phone: string
    isActive: boolean
    transmitterId: number
  }
  
  export interface Direccion {
    id: number
    departamento: string
    nombreDepartamento: string
    municipio: string
    nombreMunicipio: string
    complemento: string
    active: boolean
  }
  