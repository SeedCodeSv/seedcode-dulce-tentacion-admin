import { get_correlative_shopping } from '@/services/shopping.service';
import { CreateShoppingDto } from '@/types/shopping.types';
import { API_URL } from '@/utils/constants';
import { formatDate } from '@/utils/dates';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import useGlobalStyles from '../global/global.styles';
import { useAuthStore } from '@/store/auth.store';
import { Supplier } from '@/types/supplier.types';
import { useSupplierStore } from '@/store/supplier.store';
import { convertCurrencyFormat, formatCurrencyWithout$ } from '@/utils/money';

function CreateShoppingManual() {
  const { getSupplierPagination, supplier_pagination } = useSupplierStore();
  const [nrc, setNrc] = useState('');
  const [supplierSelected, setSupplierSelected] = useState<Supplier>();
  const [searchNRC, setSearchNRC] = useState('');
  const [currentDate, setCurrentDate] = useState(formatDate());
  const { user } = useAuthStore();
  const styles = useGlobalStyles();
  const [total, setTotal] = useState('');
  const [afecta, setAfecta] = useState('');
  const [totalIva, setTotalIva] = useState('');
  const [typeShopping, setTypeShopping] = useState('interna');
  const [correlative, setCorrelative] = useState(0);
  const [numeroControl, setNumeroControl] = useState('');

  const handleChangeTotal = (e: string) => {
    const sanitizedValue = e.replace(/[^0-9.]/g, '');
    const total = Number(sanitizedValue);

    const iva = total / 1.13;
    setAfecta(iva.toFixed(2));
    setTotalIva((total - iva).toFixed(2));
    setTotal(sanitizedValue);
  };

  useEffect(() => {
    getSupplierPagination(1, 15, searchNRC, '', '', 1);
    get_correlative_shopping(Number(user?.correlative.branchId))
      .then(({ data }) => {
        setCorrelative(data.correlative + 1);
      })
      .catch(() => setCorrelative(0));
  }, []);

  useEffect(() => {
    if (nrc !== '') {
      const find = supplier_pagination.suppliers.find((supp) => supp.nrc === nrc);
      if (find) setSupplierSelected(find);
      else {
        setSupplierSelected(undefined);
      }
    }
  }, [nrc]);

  const services = new SeedcodeCatalogosMhService();
  const [tipoDte, setTipoDte] = useState('');
  const [tipoDocSelected, setTipoDocSelected] = useState<{ codigo: string; valores: string }>();

  const tiposDoc = services.get002TipoDeDocumento();

  const filteredTipoDoc = useMemo(() => {
    return tiposDoc.filter((item) => ['01', '03', '06', '05'].includes(item.codigo));
  }, []);

  useEffect(() => {
    if (tipoDte !== '') {
      const fnd = filteredTipoDoc.find((doc) => doc.codigo === tipoDte);
      if (fnd) {
        setTipoDocSelected({ codigo: fnd.codigo, valores: fnd.valores });
      } else setTipoDocSelected(undefined);
    }
  }, [tipoDte]);

  const navigate = useNavigate();

  const handleSave = () => {
    if (!supplierSelected) {
      toast.warning('Debes seleccionar el proveedor');
      return;
    }

    if (tipoDte === '') {
      toast.warning('Debes seleccionar el tipo de documento');
      return;
    }

    const values: CreateShoppingDto = {
      branchId: user?.correlative.branchId as number,
      supplierId: supplierSelected.id ?? 0,
      tipoDte: tipoDte,
      totalExenta: 0,
      totalGravada: Number(afecta),
      porcentajeDescuento: 0,
      totalDescu: 0,
      totalIva: Number(totalIva),
      subTotal: Number(afecta),
      montoTotalOperacion: Number(total),
      totalPagar: Number(total),
      totalLetras: convertCurrencyFormat(total),
      fecEmi: currentDate,

      correlative: correlative,
    };

    axios
      .post(API_URL + '/shoppings/create', values)
      .then(() => {
        toast.success('Compra guardada con éxito');
        navigate('/shopping');
      })
      .catch(() => {
        toast.error('Error al guardar la compra');
      });
  };

  const clearAllDataManual = () => {
    setNrc(''); // Limpiar los datos manuales
    setSupplierSelected(undefined); // Limpiar proveedor seleccionado
    setNumeroControl(''); // Limpiar número de control
    setAfecta('');
    setTotal('');
    setTotalIva('');
    setTipoDte(''); // Limpiar el campo de "Tipo"
    setTipoDocSelected(undefined); // Limpiar el campo de "Nombre comprobante"
  };

  return (
    <>
      <div className="w-full relative  top-5 flex justify-end right-5">
        {/* <X className="cursor-pointer" onClick={() => navigate('/shopping')} /> */}
        <X className="cursor-pointer" onClick={clearAllDataManual} />
      </div>
      <div className="w-full h-full overflow-y-auto p-5 md:p-10">
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
              selectedKey={`${supplierSelected?.id}`}
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
                <AutocompleteItem key={supp.id ?? 0}>
                  {supp.nombre + ' - ' + supp.nombreComercial}
                </AutocompleteItem>
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
              onChange={(e) => setTipoDte(e.currentTarget.value)}
            />
            <Select
              label="Nombre comprobante"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Selecciona el tipo de documento"
              selectedKeys={tipoDocSelected ? [`${tipoDocSelected?.codigo}`] : []}
              classNames={{ label: 'font-semibold' }}
              onSelectionChange={(key) => {
                if (key) {
                  const value = new Set(key).values().next().value;
                  const fnd = filteredTipoDoc.find((doc) => doc.codigo === value);
                  if (fnd) {
                    setTipoDocSelected({ codigo: fnd.codigo, valores: fnd.valores });
                    setTipoDte(fnd.codigo);
                  } else {
                    setTipoDte('');
                    setTipoDocSelected(undefined);
                  }
                } else {
                  setTipoDte('');
                  setTipoDocSelected(undefined);
                }
              }}
            >
              {filteredTipoDoc.map((item) => (
                <SelectItem value={item.codigo} key={item.codigo}>
                  {item.valores}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-3">
          <div>
            <Input
              classNames={{ label: 'font-semibold' }}
              variant="bordered"
              type="date"
              label="Fecha recibido"
              value={currentDate}
              onChange={({ currentTarget }) => setCurrentDate(currentTarget.value)}
              labelPlacement="outside"
            />
          </div>
          <div>
            <Select
              classNames={{ label: 'font-semibold' }}
              variant="bordered"
              label="Tipo"
              placeholder="Selecciona el tipo"
              labelPlacement="outside"
              defaultSelectedKeys={`${typeShopping === 'interna' ? '0' : '1'}`}
              onSelectionChange={(key) =>
                key
                  ? setTypeShopping((key as string) === '0' ? 'interna' : 'externa')
                  : setTypeShopping('')
              }
            >
              <SelectItem key={'0'} value="interna">
                Interna
              </SelectItem>
              <SelectItem key={'1'} value="externa">
                Externa
              </SelectItem>
            </Select>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          <Input
            classNames={{ label: 'font-semibold' }}
            placeholder="EJ: 101"
            variant="bordered"
            value={numeroControl}
            onChange={({ currentTarget }) => setNumeroControl(currentTarget.value)}
            label="Numero"
            labelPlacement="outside"
          />
        </div>
        <p className="py-5 text-xl font-semibold">Resumen</p>
        <div className="rounded border shadow dark:border-gray-700 p-5 md:p-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label="AFECTA"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                value={afecta}
                onChange={({ currentTarget }) => {
                  const sanitizedValue = currentTarget.value.replace(/[^0-9.]/g, '');
                  const IVA = Number(sanitizedValue) * 0.13;
                  setAfecta(sanitizedValue);
                  setTotalIva(formatCurrencyWithout$(IVA));
                  setTotal(formatCurrencyWithout$(Number(sanitizedValue) + IVA));
                }}
              />
            </div>
            <div>
              <Input
                label="IVA"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                readOnly
                classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                value={totalIva}
                onChange={({ currentTarget }) => {
                  const sanitizedValue = currentTarget.value.replace(/[^0-9.]/g, '');
                  setTotalIva(sanitizedValue);
                  setTotal(formatCurrencyWithout$(Number(sanitizedValue) + Number(afecta)));
                }}
              />
            </div>
            <div>
              <Input
                label="PERCEPCIÓN"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                classNames={{ label: 'font-semibold' }}
                startContent="$"
                type="number"
                step={0.01}
              />
            </div>
            <div>
              <Input
                label="SUBTOTAL"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                classNames={{ label: 'font-semibold' }}
                startContent="$"
                type="number"
                value={afecta}
                step={0.01}
              />
            </div>
            <div>
              <Input
                label="TOTAL"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                classNames={{ label: 'font-semibold', input: 'text-red-600 text-lg font-bold' }}
                startContent={<span className="text-red-600 font-bold text-lg">$</span>}
                value={total}
                onChange={({ currentTarget }) => handleChangeTotal(currentTarget.value)}
              />
            </div>
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
          </div>
        </div>
        <div className="w-full flex justify-end mt-4">
          <Button onClick={handleSave} className="px-16" style={styles.thirdStyle}>
            Guardar
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateShoppingManual;
