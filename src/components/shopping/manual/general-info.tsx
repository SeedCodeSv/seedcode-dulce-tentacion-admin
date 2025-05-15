import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react';
import { useFormikContext } from 'formik';
import { MessageCircleQuestion } from 'lucide-react';
import { useMemo } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { GeneralInfoProps } from '@/types/shopping.types';
import { useSupplierStore } from '@/store/supplier.store';
import { useBranchesStore } from '@/store/branches.store';
import {
  ClassDocumentCode,
  ClassDocuments,
  ClassDocumentValue,
  ClassificationCode,
  Classifications,
  ClassificationValue,
  OperationTypeCode,
  OperationTypes,
  OperationTypeValue,
  SectorCode,
  Sectors,
  SectorValue,
  TypeCostSpentCode,
  TypeCostSpents,
  TypeCostSpentValue,
} from '@/enums/shopping.enum';

interface ShoppingPayload {
  operationTypeCode: OperationTypeCode;
  operationTypeValue: OperationTypeValue;
  classificationCode: ClassificationCode;
  classificationValue: ClassificationValue;
  sectorCode: SectorCode;
  sectorValue: SectorValue;
  typeCostSpentCode: TypeCostSpentCode;
  typeCostSpentValue: TypeCostSpentValue;
  classDocumentCode: ClassDocumentCode;
  classDocumentValue: ClassDocumentValue;
  tipoDte: string;
  typeSale: string;
  declarationDate: string;
  fecEmi: string;
  branchId: number;
  numeroControl: string;
}

function GeneralInfo({
  tipoDte,
  setTipoDte,
  correlative,
  nrc,
  setNrc,
  includePerception,
  setIncludePerception,
  supplierSelected,
  setSupplierSelected,
  setSearchNRC,
  setBranchName,
}: GeneralInfoProps) {
  const formik = useFormikContext<ShoppingPayload>();

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);
  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['03', '06', '05'].includes(item.codigo));
  }, []);

  const { branch_list } = useBranchesStore();

  const { supplier_pagination } = useSupplierStore();

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full flex flex-col md:flex-row gap-5">
          <Input
            className="w-full md:w-44"
            classNames={{ label: 'font-semibold' }}
            label="Registro"
            labelPlacement="outside"
            placeholder="EJ:000"
            value={nrc}
            variant="bordered"
            onChange={(e) => setNrc(e.currentTarget.value)}
          />
          <Autocomplete
            classNames={{ base: 'font-semibold' }}
            label="Nombre de proveedor"
            labelPlacement="outside"
            placeholder="Selecciona el proveedor"
            selectedKey={`${supplierSelected?.id ?? undefined}`}
            variant="bordered"
            onInputChange={(text) => setSearchNRC(text)}
            onSelectionChange={(key) => {
              if (key) {
                const id = Number(new Set([key]).values().next().value);
                const fnd = supplier_pagination.suppliers.find((spp) => spp.id === id);

                if (fnd) {
                  setSupplierSelected(fnd);
                  setNrc(fnd?.nrc);
                } else setSupplierSelected(undefined);
              } else setSupplierSelected(undefined);
            }}
          >
            {supplier_pagination.suppliers.map((supp) => (
              <AutocompleteItem key={supp.id}
               className='dark:text-white'
               textValue={supp.nombre}>
                {supp.nombre}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-5">
          <Input
            className="w-full md:w-44"
            classNames={{ label: 'font-semibold' }}
            label="Tipo"
            labelPlacement="outside"
            placeholder="EJ:01"
            value={tipoDte}
            variant="bordered"
            onChange={(e) => {
              formik.setFieldValue('tipoDte', e.currentTarget.value);
              setTipoDte(e.currentTarget.value);
            }}
          />
          <Select
            classNames={{ label: 'font-semibold' }}
            label="Nombre comprobante"
            labelPlacement="outside"
            placeholder="Selecciona el tipo de documento"
            selectedKeys={formik.values.tipoDte !== '' ? [formik.values.tipoDte] : undefined}
            variant="bordered"
            onSelectionChange={(key) => {
              const value = new Set(key).values().next().value as string;

              if (value) {
                formik.setFieldValue('tipoDte', value);
                setTipoDte(value);
              } else {
                formik.setFieldValue('tipoDte', '');
                setTipoDte('');
              }
            }}
          >
            {filteredTipoDoc.map((item) => (
              <SelectItem key={item.codigo} 
              className='dark:text-white'
              textValue={item.valores}
              >
                {item.valores}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
        <div>
          <Select
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={
              formik.values.branchId > 0 ? [`${formik.values.branchId}`] : undefined
            }
            errorMessage={formik.errors.branchId}
            isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
            label="Sucursal"
            labelPlacement="outside"
            placeholder="Selecciona la sucursal"
            variant="bordered"
            onBlur={formik.handleBlur('branchId')}
            onSelectionChange={(key) => {
              if (key) {
                const branchId = Number(key.anchorKey);

                const branch = branch_list.find((item) => item.id === branchId);

                if (branch) {
                  formik.setFieldValue('branchId', branchId);
                  setBranchName(branch.name);
                }
              }
            }}
          >
            {branch_list.map((item) => (
              <SelectItem key={item.id}
               className='dark:text-white'
               textValue={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            classNames={{ label: 'font-semibold' }}
            defaultSelectedKeys={
              formik.values.typeSale !== '' ? [`${formik.values.typeSale}`] : undefined
            }
            errorMessage={formik.errors.typeSale}
            isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
            label="Tipo"
            labelPlacement="outside"
            placeholder="Selecciona el tipo"
            variant="bordered"
            onBlur={formik.handleBlur('typeSale')}
            onSelectionChange={(key) => {
              const value = new Set(key).values().next().value;

              key ? formik.setFieldValue('typeSale', value) : formik.setFieldValue('typeSale', '');
            }}
          >
            <SelectItem key={'interna'}
             className='dark:text-white'
             textValue="Interna">
              Interna
            </SelectItem>
            <SelectItem key={'internacion'}
             className='dark:text-white'
             textValue="Internación">
              Internación
            </SelectItem>
            <SelectItem key={'importacion'} 
            className='dark:text-white'
            textValue="Importación">
              Importación
            </SelectItem>
          </Select>
        </div>
        <Input
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.numeroControl}
          isInvalid={!!formik.touched.numeroControl && !!formik.errors.numeroControl}
          label={
            <div className="flex gap-5">
              <p>Numero de control</p>
              <Tooltip
                content={
                  <div className="w-44 dark:text-white">
                    <span>
                      <span className="font-semibold">Consejo:</span> En caso de ser un DTE ingrese
                      el numero de control del documento con guiones
                    </span>
                  </div>
                }
              >
                <MessageCircleQuestion size={20} />
              </Tooltip>
            </div>
          }
          labelPlacement="outside"
          placeholder="EJ: 101"
          value={formik.values.numeroControl}
          variant="bordered"
          onBlur={formik.handleBlur('numeroControl')}
          onChange={formik.handleChange('numeroControl')}
        />
        <Select
          className="w-full"
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.classDocumentCode}
          isInvalid={!!formik.touched.classDocumentCode && !!formik.errors.classDocumentCode}
          label={
            <div className="flex gap-5">
              <p>clase del documento</p>
              <Tooltip
                content={
                  <div className="w-44 ">
                    <span>
                      <span className="font-semibold">Consejo:</span> En caso de ser un DTE
                      seleccione la opcion {ClassDocumentCode.DOCUMENTO_TRIBUTARIO_ELECTRONICO}.{' '}
                      {ClassDocumentValue.DOCUMENTO_TRIBUTARIO_ELECTRONICO}
                    </span>
                  </div>
                }
              >
                <MessageCircleQuestion size={20} />
              </Tooltip>
            </div>
          }
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          selectedKeys={
            String(formik.values.classDocumentCode) !== ''
              ? [`${formik.values.classDocumentCode}`]
              : undefined
          }
          variant="bordered"
          onBlur={formik.handleBlur('classDocumentCode')}
          onSelectionChange={(key) => {
            if (key) {
              const value = new Set(key).values().next().value;
              const code = ClassDocuments.find((item) => item.code === value);

              if (code) {
                formik.setFieldValue('classDocumentCode', code.code);
                formik.setFieldValue('classDocumentValue', code.value);
              } else {
                formik.setFieldValue('classDocumentCode', '');
                formik.setFieldValue('classDocumentValue', '');
              }
            } else {
              formik.setFieldValue('classDocumentCode', '');
              formik.setFieldValue('classDocumentValue', '');
            }
          }}
        >
          {ClassDocuments.map((item) => (
            <SelectItem key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.operationTypeCode}
          isInvalid={!!formik.touched.operationTypeCode && !!formik.errors.operationTypeCode}
          label="Tipo de operación"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          selectedKeys={
            String(formik.values.operationTypeCode) !== ''
              ? [`${formik.values.operationTypeCode}`]
              : undefined
          }
          variant="bordered"
          onBlur={formik.handleBlur('operationTypeCode')}
          onSelectionChange={(key) => {
            if (key) {
              const value = new Set(key).values().next().value;
              const code = OperationTypes.find((item) => item.code === value);

              if (code) {
                formik.setFieldValue('operationTypeCode', code.code);
                formik.setFieldValue('operationTypeValue', code.value);
              } else {
                formik.setFieldValue('operationTypeCode', '');
                formik.setFieldValue('operationTypeValue', '');
              }
            } else {
              formik.setFieldValue('operationTypeCode', '');
            }
          }}
        >
          {OperationTypes.map((item) => (
            <SelectItem key={item.code} 
             className='dark:text-white'
            textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.classificationCode}
          isInvalid={!!formik.touched.classificationCode && !!formik.errors.classificationCode}
          label="Clasificación"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          selectedKeys={
            String(formik.values.classificationCode) !== ''
              ? [`${formik.values.classificationCode}`]
              : undefined
          }
          variant="bordered"
          onBlur={formik.handleBlur('classificationCode')}
          onSelectionChange={(key) => {
            if (key) {
              const value = new Set(key).values().next().value;
              const code = Classifications.find((item) => item.code === value);

              if (code) {
                formik.setFieldValue('classificationCode', code.code);
                formik.setFieldValue('classificationValue', code.value);
              } else {
                formik.setFieldValue('classificationCode', '');
                formik.setFieldValue('classificationValue', '');
              }
            } else {
              formik.setFieldValue('classificationCode', '');
            }
          }}
        >
          {Classifications.map((item) => (
            <SelectItem key={item.code} 
             className='dark:text-white'
            textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.sectorCode}
          isInvalid={!!formik.touched.sectorCode && !!formik.errors.sectorCode}
          label="Sector"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          selectedKeys={
            String(formik.values.sectorCode) !== '' ? [`${formik.values.sectorCode}`] : undefined
          }
          variant="bordered"
          onBlur={formik.handleBlur('sectorCode')}
          onSelectionChange={(key) => {
            if (key) {
              const value = new Set(key).values().next().value;
              const code = Sectors.find((item) => item.code === value);

              if (code) {
                formik.setFieldValue('sectorCode', code.code);
                formik.setFieldValue('sectorValue', code.value);
              } else {
                formik.setFieldValue('sectorCode', '');
                formik.setFieldValue('sectorValue', '');
              }
            } else {
              formik.setFieldValue('sectorCode', '');
            }
          }}
        >
          {Sectors.map((item) => (
            <SelectItem key={item.code}
             className='dark:text-white'
             textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.typeCostSpentCode}
          isInvalid={!!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode}
          label="Tipo de costo/gasto"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          selectedKeys={
            String(formik.values.typeCostSpentCode) !== ''
              ? [`${formik.values.typeCostSpentCode}`]
              : undefined
          }
          variant="bordered"
          onBlur={formik.handleBlur('typeCostSpentCode')}
          onSelectionChange={(key) => {
            if (key) {
              const value = new Set(key).values().next().value;
              const code = TypeCostSpents.find((item) => item.code === value);

              if (code) {
                formik.setFieldValue('typeCostSpentCode', code.code);
                formik.setFieldValue('typeCostSpentValue', code.value);
              } else {
                formik.setFieldValue('typeCostSpentCode', '');
                formik.setFieldValue('typeCostSpentValue', '');
              }
            } else {
              formik.setFieldValue('typeCostSpentCode', '');
            }
          }}
        >
          {TypeCostSpents.map((item) => (
            <SelectItem key={item.code}
             className='dark:text-white'
             textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <div>
          <Input
            readOnly
            classNames={{ label: 'font-semibold' }}
            label="CORRELATIVO"
            labelPlacement="outside"
            placeholder="EJ: 001"
            type="number"
            value={correlative.toString()}
            variant="bordered"
          />
        </div>
        <Input
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.fecEmi}
          isInvalid={!!formik.touched.fecEmi && !!formik.errors.fecEmi}
          label="Fecha del documento"
          labelPlacement="outside"
          type="date"
          value={formik.values.fecEmi}
          variant="bordered"
          onBlur={formik.handleBlur('fecEmi')}
          onChange={formik.handleChange('fecEmi')}
        />
        <Input
          classNames={{ label: 'font-semibold' }}
          errorMessage={formik.errors.declarationDate}
          isInvalid={!!formik.touched.declarationDate && !!formik.errors.declarationDate}
          label="Fecha de declaración"
          labelPlacement="outside"
          type="date"
          value={formik.values.declarationDate}
          variant="bordered"
          onBlur={formik.handleBlur('declarationDate')}
          onChange={formik.handleChange('declarationDate')}
        />

        <div className="flex  items-end">
          <Checkbox
            checked={includePerception}
            size="lg"
            onValueChange={(val) => setIncludePerception(val)}
          >
            ¿Incluye percepción?
          </Checkbox>
        </div>
      </div>
    </>
  );
}

export default GeneralInfo;
