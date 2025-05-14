import {SeedcodeCatalogosMhService} from "seedcode-catalogos-mh"


const services = new SeedcodeCatalogosMhService();

export const formatNameByCode =  (code: string) => {
    const listUnitMeasure = services.get014UnidadDeMedida();

    const find = listUnitMeasure.find((item) => item.codigo === code);

    return find ? find.valores : '-';
};