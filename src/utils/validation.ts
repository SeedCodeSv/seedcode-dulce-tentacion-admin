import { Supplier } from "@/types/supplier.types";

export const validateReceptor = (data: Supplier): boolean => {
    const errors: string[] = [];

    // Validar NIT
    if (!/^([0-9]{14}|[0-9]{9})$/.test(data.nit)) {
        errors.push("El NIT debe tener 9 o 14 dígitos numéricos.");
    }

    // Validar NRC
    if (!/^[0-9]{1,8}$/.test(data.nrc)) {
        errors.push("El NRC debe tener entre 1 y 8 dígitos numéricos.");
    }

    // Validar nombre
    if (typeof data.nombre !== "string" || data.nombre.length < 1 || data.nombre.length > 250) {
        errors.push("El nombre debe tener entre 1 y 250 caracteres.");
    }

    // Validar código de actividad económica
    if (!/^[0-9]{2,6}$/.test(data.codActividad)) {
        errors.push("El código de actividad debe tener entre 2 y 6 dígitos numéricos.");
    }

    // Validar descripción de la actividad económica
    if (typeof data.descActividad !== "string" || data.descActividad.length < 1 || data.descActividad.length > 150) {
        errors.push("La descripción de la actividad debe tener entre 1 y 150 caracteres.");
    }

    // Validar nombre comercial
    if (
        data.nombreComercial !== null &&
        (typeof data.nombreComercial !== "string" ||
            data.nombreComercial.length < 1 ||
            data.nombreComercial.length > 150)
    ) {
        errors.push("El nombre comercial debe ser nulo o tener entre 1 y 150 caracteres.");
    }

    // Validar dirección
    if (!data.direccion) {
        errors.push("La dirección es obligatoria.");
    } else {
        const { departamento, municipio, complemento } = data.direccion;

        // Validar departamento
        if (!departamento || !/^0[1-9]|1[0-4]$/.test(departamento)) {
            errors.push("El departamento debe ser un valor entre 01 y 14.");
        }

        // Validar municipio
        if (!municipio || !/^[0-9]{2}$/.test(municipio)) {
            errors.push("El municipio debe tener 2 dígitos numéricos.");
        }

        // Validar complemento
        if ((typeof complemento !== "string" || complemento.length < 1 || complemento.length > 200)) {
            errors.push("El complemento de la dirección debe tener entre 1 y 200 caracteres.");
        }
    }

    // Validar teléfono
    if (
        data.telefono !== null &&
        (typeof data.telefono !== "string" ||
            data.telefono.length < 8 ||
            data.telefono.length > 30)
    ) {
        errors.push("El teléfono debe ser nulo o tener entre 8 y 30 caracteres.");
    }

    // Validar correo
    if (
        typeof data.correo !== "string" ||
        data.correo.length > 100 ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.correo)
    ) {
        errors.push("El correo debe ser válido y tener un máximo de 100 caracteres.");
    }

    if (errors.length > 0) {
        throw new Error(errors.join("; "));
    }

    return true;
};