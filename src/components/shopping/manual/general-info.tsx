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
import { useBranchesStore } from '@/store/branches.store';
import { useSupplierStore } from '@/store/supplier.store';
import { GeneralInfoProps } from '@/types/shopping.types';
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import { useFormikContext } from 'formik';
import { MessageCircleQuestion } from 'lucide-react';
import { useMemo } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

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
            label="Registro"
            labelPlacement="outside"
            variant="bordered"
            placeholder="EJ:000"
            classNames={{ label: 'font-semibold' }}
            className="w-full md:w-44"
            value={nrc}
            onChange={(e) => setNrc(e.currentTarget.value)}
          />
          <Autocomplete
            label="Nombre de proveedor"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Selecciona el proveedor"
            selectedKey={`${supplierSelected?.id ?? undefined}`}
            classNames={{ base: 'font-semibold' }}
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
              <AutocompleteItem key={supp.id} textValue={supp.nombre}>{supp.nombre}</AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-5">
          <Input
            label="Tipo"
            labelPlacement="outside"
            variant="bordered"
            placeholder="EJ:01"
            classNames={{ label: 'font-semibold' }}
            className="w-full md:w-44"
            value={tipoDte}
            onChange={(e) => {
              formik.setFieldValue('tipoDte', e.currentTarget.value);
              setTipoDte(e.currentTarget.value);
            }}
          />
          <Select
            label="Nombre comprobante"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Selecciona el tipo de documento"
            selectedKeys={formik.values.tipoDte !== '' ? [formik.values.tipoDte] : undefined}
            classNames={{ label: 'font-semibold' }}
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
              <SelectItem value={item.codigo} key={item.codigo} textValue={item.valores}>
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
            variant="bordered"
            label="Sucursal"
            placeholder="Selecciona la sucursal"
            labelPlacement="outside"
            defaultSelectedKeys={
              formik.values.branchId > 0 ? [`${formik.values.branchId}`] : undefined
            }
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
            onBlur={formik.handleBlur('branchId')}
            isInvalid={!!formik.touched.branchId && !!formik.errors.branchId}
            errorMessage={formik.errors.branchId}
          >
            {branch_list.map((item) => (
              <SelectItem value={item.id} key={item.id} textValue={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div>
          <Select
            classNames={{ label: 'font-semibold' }}
            variant="bordered"
            label="Tipo"
            placeholder="Selecciona el tipo"
            labelPlacement="outside"
            defaultSelectedKeys={
              formik.values.typeSale !== '' ? [`${formik.values.typeSale}`] : undefined
            }
            onSelectionChange={(key) => {
              const value = new Set(key).values().next().value;
              key ? formik.setFieldValue('typeSale', value) : formik.setFieldValue('typeSale', '');
            }}
            onBlur={formik.handleBlur('typeSale')}
            isInvalid={!!formik.touched.typeSale && !!formik.errors.typeSale}
            errorMessage={formik.errors.typeSale}
          >
            <SelectItem key={'interna'} value="interna" textValue="Interna">
              Interna
            </SelectItem>
            <SelectItem key={'internacion'} value="internacion" textValue="Internación">
              Internación
            </SelectItem>
            <SelectItem key={'importacion'} value="importacion" textValue="Importación">
              Importación
            </SelectItem>
          </Select>
        </div>
        <Input
          classNames={{ label: 'font-semibold' }}
          placeholder="EJ: 101"
          variant="bordered"
          value={formik.values.numeroControl}
          onChange={formik.handleChange('numeroControl')}
          onBlur={formik.handleBlur('numeroControl')}
          label={
            <div className="flex gap-5">
              <p>Numero de control</p>
              <Tooltip
                content={
                  <div className="w-44 ">
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
          isInvalid={!!formik.touched.numeroControl && !!formik.errors.numeroControl}
          errorMessage={formik.errors.numeroControl}
        />
        <Select
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
          selectedKeys={
            String(formik.values.classDocumentCode) !== ''
              ? [`${formik.values.classDocumentCode}`]
              : undefined
          }
          classNames={{ label: 'font-semibold' }}
          className="w-full"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
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
          isInvalid={!!formik.touched.classDocumentCode && !!formik.errors.classDocumentCode}
          errorMessage={formik.errors.classDocumentCode}
        >
          {ClassDocuments.map((item) => (
            <SelectItem value={item.code} key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
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
          selectedKeys={
            String(formik.values.operationTypeCode) !== ''
              ? [`${formik.values.operationTypeCode}`]
              : undefined
          }
          classNames={{ label: 'font-semibold' }}
          className="w-full"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          label="Tipo de operación"
          isInvalid={!!formik.touched.operationTypeCode && !!formik.errors.operationTypeCode}
          errorMessage={formik.errors.operationTypeCode}
        >
          {OperationTypes.map((item) => (
            <SelectItem value={item.code} key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          classNames={{ label: 'font-semibold' }}
          className="w-full"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          label="Clasificación"
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
          selectedKeys={
            String(formik.values.classificationCode) !== ''
              ? [`${formik.values.classificationCode}`]
              : undefined
          }
          onBlur={formik.handleBlur('classificationCode')}
          isInvalid={!!formik.touched.classificationCode && !!formik.errors.classificationCode}
          errorMessage={formik.errors.classificationCode}
        >
          {Classifications.map((item) => (
            <SelectItem value={item.code} key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          classNames={{ label: 'font-semibold' }}
          className="w-full"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          label="Sector"
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
          selectedKeys={
            String(formik.values.sectorCode) !== '' ? [`${formik.values.sectorCode}`] : undefined
          }
          onBlur={formik.handleBlur('sectorCode')}
          isInvalid={!!formik.touched.sectorCode && !!formik.errors.sectorCode}
          errorMessage={formik.errors.sectorCode}
        >
          {Sectors.map((item) => (
            <SelectItem value={item.code} key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <Select
          classNames={{ label: 'font-semibold' }}
          className="w-full"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Selecciona una opción"
          label="Tipo de costo/gasto"
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
          selectedKeys={
            String(formik.values.typeCostSpentCode) !== ''
              ? [`${formik.values.typeCostSpentCode}`]
              : undefined
          }
          onBlur={formik.handleBlur('typeCostSpentCode')}
          isInvalid={!!formik.touched.typeCostSpentCode && !!formik.errors.typeCostSpentCode}
          errorMessage={formik.errors.typeCostSpentCode}
        >
          {TypeCostSpents.map((item) => (
            <SelectItem value={item.code} key={item.code} textValue={item.value}>
              {item.value}
            </SelectItem>
          ))}
        </Select>
        <div>
          <Input
            label="CORRELATIVO"
            labelPlacement="outside"
            readOnly
            value={correlative.toString()}
            placeholder="EJ: 001"
            variant="bordered"
            classNames={{ label: 'font-semibold' }}
            type="number"
          />
        </div>
        <Input
          classNames={{ label: 'font-semibold' }}
          variant="bordered"
          type="date"
          label="Fecha del documento"
          value={formik.values.fecEmi}
          onChange={formik.handleChange('fecEmi')}
          onBlur={formik.handleBlur('fecEmi')}
          labelPlacement="outside"
          isInvalid={!!formik.touched.fecEmi && !!formik.errors.fecEmi}
          errorMessage={formik.errors.fecEmi}
        />
        <Input
          classNames={{ label: 'font-semibold' }}
          variant="bordered"
          type="date"
          label="Fecha de declaración"
          value={formik.values.declarationDate}
          onChange={formik.handleChange('declarationDate')}
          onBlur={formik.handleBlur('declarationDate')}
          labelPlacement="outside"
          isInvalid={!!formik.touched.declarationDate && !!formik.errors.declarationDate}
          errorMessage={formik.errors.declarationDate}
        />

        <div className="flex  items-end">
          <Checkbox
            checked={includePerception}
            onValueChange={(val) => setIncludePerception(val)}
            size="lg"
          >
            ¿Incluye percepción?
          </Checkbox>
        </div>
      </div>
    </>
  );
}

export default GeneralInfo;
