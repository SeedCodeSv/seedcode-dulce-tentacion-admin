import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { toast } from 'sonner';
import saveAs from 'file-saver';

import { steps } from '../process/types/process.types';

import { IPropHadleUploadFile } from './types/IPropHadleUploadFile';
import { HandleSaveShippingNote } from './HandleSaveShippingNote';

import { s3Client } from '@/plugins/s3';
import { SPACES_BUCKET } from '@/utils/constants';
import { generateUrlJson } from '@/shopping-branch-product/types/format_of_the_json_for_sending_a_referral';



export const HandleUploadFile = async ({
  json,
  firma,
  respuestaMH,
  OnClearProductSelectedAll,
  setCurrentState,
  closeModal,
  pointOfSaleId,
  customerId,
  employeeId,
  receivingBranchId,
  receivingEmployeeId,
    socket,
  branchIssuingId,
  orderId
}: IPropHadleUploadFile) => {
  setCurrentState(steps[2].title);

  const json_url = generateUrlJson(
    json.dteJson.emisor.nombre,
    json.dteJson.identificacion.codigoGeneracion,
    'json',
    '04',
    json.dteJson.identificacion.fecEmi
  );

  const firmado = {
    ...json.dteJson,
    respuestaMH,
    firma,
  };

  const JSON_DTE = JSON.stringify(firmado, null, 2);
  const json_blob = new Blob([JSON_DTE], { type: 'application/json' });

  const arrayBuffer = await json_blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const uploadParams: PutObjectCommandInput = {
    Bucket: SPACES_BUCKET,
    Key: json_url,
    Body: uint8Array,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));

    HandleSaveShippingNote({
      orderId,
      json_url,
      OnClearProductSelectedAll,
      closeModal,
      setCurrentState,
      handleDownload: () =>
        saveAs(json_blob, `${json.dteJson.identificacion.codigoGeneracion}.json`),
      pointOfSaleId,
      customerId: customerId ?? 0,
      employeeId: employeeId ?? 0,
      receivingBranchId: receivingBranchId ?? 0,
      receivingEmployeeId: receivingEmployeeId ?? 0,
        socket:socket,
  branchIssuingId:branchIssuingId
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      saveAs(json_blob, `${json.dteJson.identificacion.codigoGeneracion}.json`);
      toast.error(error.message, { position: 'top-right' });
    } else {
      toast.error('An unknown error occurred', { position: 'top-right' });
    }
  }
};
