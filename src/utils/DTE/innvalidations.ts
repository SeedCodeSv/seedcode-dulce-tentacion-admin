import { getElSalvadorDateTime } from "../dates";

import { InvalidateNoteRemision, ReferalNote } from "@/types/referal-note.types";
import { Annulations } from "@/types/Innvalidations.types";
import { SVFE_InvalidacionDebito_SEND } from "@/types/svf_dte/InvalidationDebito";
import { SVFE_InvalidacionCredito_SEND } from "@/types/svf_dte/InvalidationCredito";

export function formatAnnulations(values: ReferalNote, selloInvalidation: string, employeeId: number, motivo: string, data_complet: InvalidateNoteRemision) {
    const annulations_data: Annulations = {
        codigoGeneracion: values.codigoGeneracion ?? "N/A",
        numeroControl: values.numeroControl ?? "N/A",
        selloRecibido: values.selloRecibido ?? "N/A",
        selloInvalidacion: selloInvalidation ?? 'N/A',
        employeeId: employeeId ?? 0,
        nombreSolicita: data_complet.nameApplicant ?? 'N/A',
        tipoDocumentoSolicita: data_complet.typeDocApplicant ?? 'N/A',
        numDocumentoSolicita: data_complet.docNumberApplicant ?? 'N/A',
        tipoDte: values.tipoDte ?? "N/A",
        tipoAnulacion: motivo ?? 'N/A',
        fecAnula: getElSalvadorDateTime().fecEmi,
        horAnula: getElSalvadorDateTime().horEmi,
        nombreResponsable: data_complet.nameResponsible ?? 'N/A',
        tipoDocumentoResponsable: data_complet.typeDocResponsible ?? 'N/A',
        numDocumentoResponsable: data_complet.docNumberResponsible ?? 'N/A',
    }

    return annulations_data
}

export function formatAnnulations06(values: SVFE_InvalidacionDebito_SEND, selloInvalidation: string, employeeId: number, motivo: string) {
    const annulations_data: Annulations = {
        codigoGeneracion: values.dteJson.documento?.codigoGeneracion ?? "N/A",
        numeroControl: values.dteJson.documento?.numeroControl ?? "N/A",
        selloRecibido: values.dteJson.documento?.selloRecibido ?? "N/A",
        selloInvalidacion: selloInvalidation ?? 'N/A',
        employeeId: employeeId ?? 0,
        nombreSolicita: values?.dteJson?.motivo?.nombreSolicita ?? 'N/A',
        tipoDocumentoSolicita: values?.dteJson?.motivo?.tipDocSolicita ?? 'N/A',
        numDocumentoSolicita: values?.dteJson?.motivo?.numDocSolicita ?? 'N/A',
        tipoDte: values?.dteJson?.documento.tipoDte ?? "N/A",
        tipoAnulacion: motivo ?? 'N/A',
        fecAnula: getElSalvadorDateTime().fecEmi,
        horAnula: getElSalvadorDateTime().horEmi,
        nombreResponsable: values?.dteJson?.motivo?.nombreResponsable ?? 'N/A',
        tipoDocumentoResponsable: values?.dteJson?.motivo?.tipDocResponsable ?? 'N/A',
        numDocumentoResponsable: values?.dteJson?.motivo?.numDocResponsable ?? 'N/A',
    }

    return annulations_data
}

export function formatAnnulations05(values: SVFE_InvalidacionCredito_SEND, selloInvalidation: string, employeeId: number, motivo: string) {
    const annulations_data: Annulations = {
        codigoGeneracion: values.dteJson.documento?.codigoGeneracion ?? "N/A",
        numeroControl: values.dteJson.documento?.numeroControl ?? "N/A",
        selloRecibido: values.dteJson.documento?.selloRecibido ?? "N/A",
        selloInvalidacion: selloInvalidation ?? 'N/A',
        employeeId: employeeId ?? 0,
        nombreSolicita: values?.dteJson?.motivo?.nombreSolicita ?? 'N/A',
        tipoDocumentoSolicita: values?.dteJson?.motivo?.tipDocSolicita ?? 'N/A',
        numDocumentoSolicita: values?.dteJson?.motivo?.numDocSolicita ?? 'N/A',
        tipoDte: values?.dteJson?.documento.tipoDte ?? "N/A",
        tipoAnulacion: motivo ?? 'N/A',
        fecAnula: getElSalvadorDateTime().fecEmi,
        horAnula: getElSalvadorDateTime().horEmi,
        nombreResponsable: values?.dteJson?.motivo?.nombreResponsable ?? 'N/A',
        tipoDocumentoResponsable: values?.dteJson?.motivo?.tipDocResponsable ?? 'N/A',
        numDocumentoResponsable: values?.dteJson?.motivo?.numDocResponsable ?? 'N/A',
    }

    return annulations_data
}

export function formatAnnulations01(values: SVFE_InvalidacionCredito_SEND, selloInvalidation: string, employeeId: number, motivo: string) {
    const annulations_data: Annulations = {
        codigoGeneracion: values.dteJson.documento?.codigoGeneracion ?? "N/A",
        numeroControl: values.dteJson.documento?.numeroControl ?? "N/A",
        selloRecibido: values.dteJson.documento?.selloRecibido ?? "N/A",
        selloInvalidacion: selloInvalidation ?? 'N/A',
        employeeId: employeeId ?? 0,
        nombreSolicita: values?.dteJson?.motivo?.nombreSolicita ?? 'N/A',
        tipoDocumentoSolicita: values?.dteJson?.motivo?.tipDocSolicita ?? 'N/A',
        numDocumentoSolicita: values?.dteJson?.motivo?.numDocSolicita ?? 'N/A',
        tipoDte: values?.dteJson?.documento.tipoDte ?? "N/A",
        tipoAnulacion: motivo ?? 'N/A',
        fecAnula: getElSalvadorDateTime().fecEmi,
        horAnula: getElSalvadorDateTime().horEmi,
        nombreResponsable: values?.dteJson?.motivo?.nombreResponsable ?? 'N/A',
        tipoDocumentoResponsable: values?.dteJson?.motivo?.tipDocResponsable ?? 'N/A',
        numDocumentoResponsable: values?.dteJson?.motivo?.numDocResponsable ?? 'N/A',
    }

    return annulations_data
}