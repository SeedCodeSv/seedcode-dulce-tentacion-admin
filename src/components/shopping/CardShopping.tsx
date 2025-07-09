import { Button, Card, CardBody, CardHeader, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
// eslint-disable-next-line import/order
import { Pen, Trash } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';

import { useNavigate } from 'react-router';


import { IMobileShopping } from '../products/types/mobile-view.types';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useShoppingStore } from '@/store/shopping.store';
import useThemeColors from '@/themes/use-theme-colors';


function CardShopping({
    handleVerify,
    // modalConfirm,
    onDeleteConfirm
}: IMobileShopping) {
    const navigate = useNavigate()
    const style = useThemeColors({ name: Colors.Error });

    const {
        shoppingList,

    } = useShoppingStore()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
            {shoppingList.map((prd, index) => (
                <Card key={index}>
                    <CardHeader>{prd?.id}-{prd?.branch?.name}</CardHeader>
                    <CardBody>
                        <p>
                            <span className="font-semibold">No. de control:</span>
                            {prd.controlNumber}
                        </p>

                        <p>
                            <span className="font-semibold">Cod. generación:</span>
                            {prd.generationCode}
                        </p>

                        <p className='flex gap-2 mt-2'>
                            <span className="font-semibold">Fecha/Hora emisió:</span>
                            {prd.fecEmi}-{prd.horEmi}
                        </p>
                    </CardBody>
                    <CardHeader className="flex justify-between">

                        <ButtonUi
                            isIconOnly
                            theme={Colors.Success}
                            onPress={() =>
                                navigate(`/edit-shopping/${prd.id}/${prd.controlNumber}`)
                            }
                        >
                            <Pen />
                        </ButtonUi>
                        {prd.generationCode !== 'N/A' && (
                            <>
                                <ButtonUi
                                    isIconOnly
                                    theme={Colors.Error}
                                    onPress={() => {
                                        handleVerify(prd.id)
                                    }}
                                >
                                    <Trash />
                                </ButtonUi>
                            </>
                        )}
                        {prd.generationCode === 'N/A' && (
                            <Popover className="border border-white rounded-xl">
                                <PopoverTrigger>
                                    <Button isIconOnly style={style}>
                                        <Trash />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="p-4">
                                        <p className="text-sm font-normal text-gray-600">
                                            ¿Deseas eliminar el registro {prd.controlNumber}?
                                        </p>
                                        <div className="flex justify-center mt-4">
                                            <ButtonUi
                                                className="mr-2"
                                                theme={Colors.Error}
                                                onPress={() => onDeleteConfirm(prd.id)}
                                            >
                                                Sí, eliminar
                                            </ButtonUi>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

export default CardShopping;
