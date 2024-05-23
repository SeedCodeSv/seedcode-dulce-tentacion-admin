import {
  Card,
  Image,
  Button,
  Input,
  CardBody,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';
//   import Layout from "@renderer/components/global/Layout";
import { useContext, useEffect, useState } from 'react';
import OneDollar from '../../../assets/dollars/1.jpg';
import FiveDollar from '../../../assets/dollars/5.png';
import ThenDollar from '../../../assets/dollars/10.png';
import TwentyDollar from '../../../assets/dollars/20.jpg';
import FiftyDollar from '../../../assets/dollars/50.png';
import OneHundredDollar from '../../../assets/dollars/100.png';

import OneCent from '../../../assets/cents/01.png';
import FiveCent from '../../../assets/cents/5.png';
import TenCent from '../../../assets/cents/10.png';
import TwentyFiveCent from '../../../assets/cents/25.png';
import OneHundredCent from '../../../assets/cents/1.png';
import { ICloseBox } from '../../../types/box.types';
import { useBoxStore } from '../../../store/Boxes.store';
import { close_box } from '../../../services/Boxes.service';
import { toast } from 'sonner';
import { IGetBox } from '../../../types/box.types';
import { useNavigate } from 'react-router';
import { ThemeContext } from '../../../hooks/useTheme';
import { get_box } from '../../../storage/localStorage';
function Box() {
  const [idBox, setIdBox] = useState(0);
  useEffect(() => {
    const box = get_box();
    setIdBox(Number(box));
    console.log(box);
  }, []);
  const { theme } = useContext(ThemeContext);

  const [boxValues, setBoxValues] = useState<ICloseBox>({
    oneDollar: 0,
    twoDollars: 0,
    fiveDollars: 0,
    tenDollars: 0,
    twentyDollars: 0,
    fiftyDollars: 0,
    hundredDollars: 0,
    oneCents: 0,
    fiveCents: 0,
    tenCents: 0,
    twentyFiveCents: 0,
    fiftyCents: 0,
    oneDollarCents: 0,
    state: 'false',
  });

  const { has_current_box, current_box, OnRemoveBox } = useBoxStore();
  const [boxPreview, setBoxpreview] = useState<IGetBox>();

  const popover = useDisclosure();
  console.log(current_box, has_current_box, idBox);
  const preview_box = () => {
    close_box(boxValues, idBox)
      .then(({ data }) => {
        if (data.ok) {
          setBoxpreview(data);
        } else {
          setBoxpreview(undefined);
          toast.error('No se pudo cerrar la caja');
        }
      })
      .catch(() => {
        setBoxpreview(undefined);
        toast.error('No se pudo cerrar la caja');
      });
  };

  const navigate = useNavigate();

  const completeBox = () => {
    popover.onClose();
    close_box({ ...boxValues, state: 'true' }, idBox)
      .then(({ data }) => {
        if (data.ok) {
          OnRemoveBox(), toast.success('Caja cerrada');
          navigate('/');
        } else {
          toast.error('No se pudo cerrar la caja');
        }
      })
      .catch(() => {
        toast.error('No se pudo cerrar la caja');
      });
  };

  return (
    <>
      <div className="w-full h-full p-6 py-10 pt-14 flex flex-row">
        <div className="w-full h-full">
          <div className="grid w-full h-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 2xl:grid-cols-6 place-items-center">
            <Card className="w-full py-4 max-h-64">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image alt="Card background" className="object-cover" src={OneDollar} />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de 1"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      oneDollar: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image alt="Card background" className="object-cover w-full" src={FiveDollar} />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de $5"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      fiveDollars: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image alt="Card background" className="object-cover w-full" src={ThenDollar} />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de $10"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      tenDollars: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image alt="Card background" className="object-cover w-full" src={TwentyDollar} />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de $20"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      twentyDollars: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image alt="Card background" className="object-cover w-full" src={FiftyDollar} />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de $50"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      fiftyDollars: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full"
                  src={OneHundredDollar}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Billetes de $100"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      hundredDollars: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full max-h-32"
                  src={OneCent}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Monedas de $0.01"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      oneCents: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full max-h-32"
                  src={FiveCent}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Monedas de $0.05"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      fiveCents: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full max-h-32"
                  src={TenCent}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Monedas de $0.10"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      tenCents: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full max-h-32"
                  src={TwentyFiveCent}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Monedas de $0.25"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      twentyFiveCents: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            <Card className="w-full py-4">
              <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                <Image
                  alt="Card background"
                  className="object-cover w-full max-h-32"
                  src={OneHundredCent}
                />
                <Input
                  variant="bordered"
                  className="mt-2"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  label="Monedas de $1"
                  placeholder="0"
                  size="sm"
                  onChange={(e) => {
                    setBoxValues({
                      ...boxValues,
                      oneDollarCents: parseInt(e.target.value),
                    });
                  }}
                  type="number"
                />
              </CardBody>
            </Card>
            {boxPreview && (
              <>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">Monto inicial de la caja</p>
                    <p className="font-semibold text-coffee-green">${boxPreview.boxStart}</p>
                  </CardBody>
                </Card>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">Gastos</p>
                    <p className="font-semibold text-red-600">
                      ${boxPreview.totalExpenses.toFixed(2)}
                    </p>
                  </CardBody>
                </Card>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">Total en ventas</p>
                    <p className="font-semibold text-coffee-green">
                      ${boxPreview.totalSales.toFixed(2)}
                    </p>
                  </CardBody>
                </Card>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">{boxPreview.cost < 0 ? 'Faltante' : 'Excedente'}</p>
                    <p
                      className={
                        (boxPreview.cost < 0 ? 'text-red-600' : 'text-coffee-green') +
                        ' font-semibold'
                      }
                    >
                      ${boxPreview.cost.toFixed(2)}
                    </p>
                  </CardBody>
                </Card>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">Total de dinero</p>
                    <p className="font-semibold text-coffee-green">
                      ${boxPreview.totalMoney.toFixed(2)}
                    </p>
                  </CardBody>
                </Card>
                <Card className="w-full py-4 max-h-64">
                  <CardBody className="flex flex-col items-center justify-center py-2 overflow-visible">
                    <p className="text-center">Total en caja</p>
                    <p className="font-semibold text-coffee-green">
                      ${boxPreview.totalBox.toFixed(2)}
                    </p>
                  </CardBody>
                </Card>
              </>
            )}
            <div>
              {boxPreview ? (
                <>
                  <Popover backdrop="blur" isOpen={popover.isOpen}>
                    <PopoverTrigger>
                      <Button
                        className="w-full text-white bg-coffee-brown"
                        onClick={() => popover.onOpen()}
                        style={{
                          backgroundColor: theme.colors.third,
                        }}
                      >
                        Cerrar Caja
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="p-4 w-72">
                        <Button
                          onClick={() => {
                            popover.onClose();
                            preview_box();
                          }}
                          style={{
                            backgroundColor: theme.colors.third,
                          }}
                          className="w-full mt-3 text-white bg-coffee-brown"
                        >
                          Verificar nuevamente
                        </Button>
                        <Button
                          onClick={completeBox}
                          className="w-full mt-3 text-white bg-coffee-green"
                          style={{
                            backgroundColor: theme.colors.third,
                          }}
                        >
                          Completar de caja
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Button
                  onPress={preview_box}
                  className="w-full text-white bg-coffee-brown"
                  style={{
                    backgroundColor: theme.colors.third,
                  }}
                >
                  Cerrar caja
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Box;
