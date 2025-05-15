export const steps = [
    {
        title: 'Firmando el archivo',
        description: 'Aplicando firma digital al documento',
    },
    {
        title: 'Validando en Hacienda',
        description: 'Verificando la información con el sistema de Hacienda',
    },
    {
        title: 'Subiendo los archivos al servidor',
        description: 'Procesando los datos al servidor',
    },
    {
        title: 'Guardando información',
        description: 'Almacenando los datos en el sistema',
    },
];

export interface IPropsSingningProcess {
    isOpen : boolean,
    onClose : () => void
    currentState: string,
    titleMessage: string,
    errors: string[]
}