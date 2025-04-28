import React, { useCallback, useState } from 'react';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  FileText,
  Music,
  Video,
  Package,
  Code,
} from 'lucide-react';
import { toast } from 'sonner';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Button, useDisclosure } from '@heroui/react';
import { useNavigate } from 'react-router';

import Layout from '@/layout/Layout';
import CustomLoading from '@/components/global/CustomLoading';
import { SVFE_DCL } from '@/types/svf_dte/dcl.types';
import { formatCurrency } from '@/utils/dte';
import { SPACES_BUCKET } from '@/utils/constants';
import ERROR from '@/assets/error.png';
import { useAuthStore } from '@/store/auth.store';
import { s3Client } from '@/plugins/s3';
import { save_settlement_document } from '@/services/settlement-document.service';
import HeadlessModal from '@/components/global/HeadlessModal';
import useGlobalStyles from '@/components/global/global.styles';
import AddTributeSupplier from '@/components/shopping/add-supplier';


interface FileStatus {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  content?: SVFE_DCL;
}

function getFileIcon(file: File) {
  const type = file.type.split('/')[0];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    return <Code className="w-5 h-5" />;
  }

  switch (type) {
    case 'image':
      return <ImageIcon className="w-5 h-5" />;
    case 'text':
      return <FileText className="w-5 h-5" />;
    case 'audio':
      return <Music className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatJSON(jsonString: string) {
  try {
    const obj = JSON.parse(jsonString) as SVFE_DCL;

    return obj;
  } catch (e) {
    return undefined;
  }
}

function AddSettlementDocument() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<FileStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const processFile = useCallback((files: FileList | null) => {
    if (!files) return;
    setError(null);

    if (files.length > 1) {
      setError('Please upload only one file at a time');

      return;
    }

    const file = files[0];

    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Please upload a JSON file');

      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = formatJSON(content);

      if (!result) {
        setError('Archivo no valido');

        return;
      }

      if (result.identificacion.tipoDte !== '09') {
        toast.error('Este documento no es de tipo DTE 09(Comprobante contable de liquidación)');
        setError('Este documento no es de tipo DTE 09(Comprobante contable de liquidación)');
        setFile(null);

        return;
      }

      setFile((prev) => (prev ? { ...prev, content: result } : null));
    };
    reader.readAsText(file);

    const newFileStatus: FileStatus = {
      file,
      progress: 0,
      status: 'pending',
    };

    setFile(newFileStatus);

    const simulateUpload = () => {
      setFile((prev) => {
        if (!prev) return null;
        const progress = prev.progress + 10;

        if (progress >= 100) {
          return { ...prev, progress: 100, status: 'success' };
        }

        return { ...prev, progress, status: 'uploading' };
      });
    };

    const interval = setInterval(simulateUpload, 500);

    setTimeout(() => clearInterval(interval), 5000);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFile(e.dataTransfer.files);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFile(e.target.files);
    },
    [processFile]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  const { user } = useAuthStore();

  const styles = useGlobalStyles();

  const [loadingSave, setLoadingSave] = useState(false);
  const providerModal = useDisclosure();
  const supplierModal = useDisclosure();

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!file) {
      toast.error('Por favor, cargue un archivo');

      return;
    }

    setLoadingSave(true);

    const transmitter = user?.correlative
      ? user.correlative.branch.transmitter.id
      : user?.pointOfSale?.branch.transmitter.id;

    const json_url =
      'CLIENTES/' +
      (user?.correlative
        ? user.correlative.branch.transmitter.nombre
        : user?.pointOfSale?.branch.transmitter.nombre) +
      `/${new Date().getFullYear()}/DOCUMENTOS_CONTABLES_DE_LIQUIDACION/${file.content?.identificacion.fecEmi}/${file.content?.identificacion.codigoGeneracion}.json`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: SPACES_BUCKET,
      Key: json_url,
      Body: file.file,
    };

    await s3Client
      .send(new PutObjectCommand(uploadParams))
      .then(() => {
        save_settlement_document({
          jsonPath: json_url,
          transmitterId: transmitter ?? 0,
        }).then((res) => {
          if (res.data.supplierError) {
            toast.error('No se encontró el proveedor');
            setLoadingSave(false);
            providerModal.onOpenChange();
          } else {
            toast.success('Se guardo el documento exitosamente');
            setLoadingSave(false);
            navigate('/settlement-document');
          }
        });
      })
      .catch(() => {
        toast.error('No se pudo subir el archivo');
        setLoadingSave(false);
      });
  };

  return (
    <Layout title="Agregar Documento Contable de liquidación">
      <div className=" w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <HeadlessModal
          isOpen={providerModal.isOpen}
          size="w-96"
          title="Proveedor no encontrado"
          onClose={() => providerModal.onOpenChange()}
        >
          <div className="w-full flex flex-col justify-center items-center">
            <img alt="" className="w-32" src={ERROR} />
            <p className="font-semibold pt-3">El proveedor no se encontró en los registros</p>
            <p className="font-semibold pb-3">¿Deseas registrarlo?</p>
            <div className="w-full grid grid-cols-2 gap-5">
              <Button style={styles.dangerStyles} onClick={() => providerModal.onOpenChange()}>
                Aceptar
              </Button>
              <Button style={styles.thirdStyle} onClick={() => supplierModal.onOpenChange()}>
                Registrar
              </Button>
            </div>
          </div>
        </HeadlessModal>
        <HeadlessModal
          isOpen={supplierModal.isOpen}
          size="w-full md:w-[600px] lg:w-[800px] xl:w-[1000px]"
          title="Registrar proveedor"
          onClose={() => supplierModal.onOpenChange()}
        >
          <AddTributeSupplier
            closeModal={() => {
              supplierModal.onOpenChange();
              providerModal.onOpenChange();
            }}
            setCode={() => {}}
            supplier={{
              nit: file?.content?.emisor.nit ?? '',
              tipoDocumento: '36',
              numDocumento: file?.content?.emisor.nit ?? '',
              nrc: file?.content?.emisor.nrc ?? '',
              nombre: file?.content?.emisor.nombre ?? '',
              telefono: file?.content?.emisor.telefono ?? '',
              correo: file?.content?.emisor.correo ?? '',
              nombreComercial: file?.content?.emisor.nombreComercial ?? '',
              codActividad: file?.content?.emisor.codActividad ?? '',
              descActividad: file?.content?.emisor.descActividad ?? '',
            }}
            supplier_direction={{
              municipio: file?.content?.emisor.direccion.municipio ?? '',
              departamento: file?.content?.emisor.direccion.departamento ?? '',
              complemento: file?.content?.emisor.direccion.complemento ?? '',
            }}
          />
        </HeadlessModal>
        <div className="w-full flex flex-col h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-800 mb-8 text-left">Cargar archivo JSON</h1>
          {!file ? (
            <div
              className={`relative h-full rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-2xl ${
                isDragging
                  ? 'ring-4 ring-blue-500 ring-opacity-50 scale-[1.02] bg-blue-50/90'
                  : 'ring-1 ring-gray-200 hover:ring-blue-200'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center transform scale-110 transition-transform">
                    <Upload className="w-24 h-24 mx-auto text-blue-500 animate-bounce" />
                    <h2 className="text-3xl font-bold text-blue-700 mt-4">Arrastra para subir</h2>
                  </div>
                </div>
              )}

              <div className="h-full flex flex-col items-center justify-center p-8">
                {!isDragging && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse opacity-20" />
                    <Upload
                      className={`w-24 h-24 mx-auto relative ${isDragging ? 'text-blue-200' : 'text-blue-500'} transition-colors duration-300`}
                    />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
                  Arrastra y suelta un archivo JSON
                </h2>
                <p className="text-gray-500 mb-2 text-lg">o</p>
                {!isDragging && (
                  <label className="group relative mb-4">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    <span className="relative px-8 py-4 bg-white rounded-lg inline-block font-semibold text-gray-700 hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:scale-[1.02] active:scale-95">
                      Selecciona un archivo
                      <input
                        accept=".json"
                        className="hidden"
                        type="file"
                        onChange={handleFileInput}
                      />
                    </span>
                  </label>
                )}
                {error && (
                  <div className="mt-4 text-red-500 bg-red-50 px-4 py-2 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex-shrink-0 ${
                        file.status === 'success'
                          ? 'text-green-500'
                          : file.status === 'error'
                            ? 'text-red-500'
                            : 'text-blue-500'
                      }`}
                    >
                      {getFileIcon(file.file)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{file.file.name}</h3>
                      <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                    </div>
                    {file.status === 'uploading' && (
                      <span className="text-sm text-blue-500">{file.progress}%</span>
                    )}
                    {file.status === 'success' && (
                      <span className="flex items-center text-sm text-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={removeFile}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {file && file.status === 'uploading' && (
            <div className="bg-white rounded-xl mt-3 h-full flex flex-col justify-center items-center shadow-lg p-4">
              <CustomLoading />
              <p className="text-base text-gray-500 mt-5">Subiendo archivo...</p>
            </div>
          )}
          {file && file.status === 'success' && (
            <>
              <div className="bg-white rounded-xl mt-3 h-full shadow-lg p-4 overflow-y-auto">
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <li>
                    <span className="font-semibold">Numero de control:</span>{' '}
                    {file.content?.identificacion.numeroControl ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Código de generación:</span>{' '}
                    {file.content?.identificacion.codigoGeneracion ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Sello de recepción:</span>{' '}
                    {file.content?.sello ?? file.content?.selloRecibido ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Fecha - hora:</span>{' '}
                    {file.content?.identificacion.fecEmi ?? ''} -{' '}
                    {file.content?.identificacion.horEmi ?? ''}
                  </li>
                </ul>
                <p className="text-xl font-semibold py-4 mt-6">Emisor:</p>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <li>
                    <span className="font-semibold">Nombre:</span>{' '}
                    {file.content?.emisor?.nombre ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Nombre comercial:</span>{' '}
                    {file.content?.emisor?.nombreComercial ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">NIT:</span> {file.content?.emisor?.nit ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">NRC:</span> {file.content?.emisor?.nrc ?? ''}
                  </li>
                </ul>
                <p className="text-xl font-semibold py-4 mt-6">Cuerpo del documento:</p>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <li>
                    <span className="font-semibold">Fecha liquidación inicio</span>{' '}
                    {file.content?.cuerpoDocumento.periodoLiquidacionFechaInicio ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Fecha liquidación fin:</span>{' '}
                    {file.content?.cuerpoDocumento.periodoLiquidacionFechaFin ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Código liquidación:</span>{' '}
                    {file.content?.cuerpoDocumento.codLiquidacion ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Valor operaciones:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.valorOperaciones ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Cantidad de documentos:</span>{' '}
                    {file.content?.cuerpoDocumento.cantidadDoc ?? ''}
                  </li>
                  <li>
                    <span className="font-semibold">Sub-total:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.subTotal ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Sub-total:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.subTotal ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Monto sujeto a percepción:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.montoSujetoPercepcion ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">IVA percibido:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.ivaPercibido ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Comisión:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.comision ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Porcentaje comisión:</span>{' '}
                    {file.content?.cuerpoDocumento.porcentComision ?? 0}%
                  </li>
                  <li>
                    <span className="font-semibold">IVA comisión:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.ivaComision ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Liquido a pagar:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.liquidoApagar ?? 0)}
                  </li>
                  <li>
                    <span className="font-semibold">Monto sin percepción:</span>{' '}
                    {formatCurrency(file.content?.cuerpoDocumento.montoSinPercepcion ?? 0)}
                  </li>
                  <li className="col-span-1 lg:col-span-2">
                    <span className="font-semibold">Total letras</span>{' '}
                    {file.content?.cuerpoDocumento.totalLetras ?? ''}
                  </li>
                </ul>
              </div>
              <div className="flex gap-5 w-full justify-end items-end mt-4">
                <Button
                  className="px-12"
                  isLoading={loadingSave}
                  style={styles.dangerStyles}
                  onClick={() => navigate('/settlement-document')}
                >
                  Cancelar
                </Button>
                <Button
                  className="px-12"
                  isLoading={loadingSave}
                  style={styles.thirdStyle}
                  onClick={handleSave}
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AddSettlementDocument;
