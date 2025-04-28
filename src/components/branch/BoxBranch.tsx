import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@heroui/react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { BoxIcon } from 'lucide-react';

import { global_styles } from '../../styles/global.styles';
import { Branches } from '../../types/branches.types';
import { useBoxStore } from '../../store/Boxes.store';
import { IBoxPayload } from '../../types/box.types';
import { verify_box } from '../../services/Boxes.service';
import { post_box, save_branch_id } from '../../storage/localStorage';
import HeadlessModal from '../global/HeadlessModal';

import CloseBox from './box/CloseBox';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  closeModal: () => void;
  branch?: Branches | undefined;
  setBranch: React.Dispatch<React.SetStateAction<Branches | undefined>>;
}

function AddBranch(props: Props) {
  const modalCloseBox = useDisclosure();

  const validationSchema = yup.object().shape({
    start: yup.string().required('El monto inicial es requerido'),
  });

  const { postBox, closeBox } = useBoxStore();

  const handleSubmit = (values: IBoxPayload) => {
    if (props.branch) {
      const payload: IBoxPayload = {
        start: values.start,
        branchId: props.branch.id,
      };

      postBox(payload);
    }
    props.closeModal();
    props.setBranch(undefined);
    save_branch_id(props.branch!.id.toString()!);
  };
  const [visible, setVisible] = useState(false);
  const [idBox, setIdBox] = useState(0);
  const handleActivate = () => {
    post_box(idBox.toString());
    props.closeModal();
    save_branch_id(props.branch!.id.toString()!);
  };
  const handleCloseBoxId = () => {
    closeBox(idBox);
    props.closeModal();
    props.setBranch(undefined);
  };

  useEffect(() => {
    (async () => {
      if (props.branch) {
        await verify_box(Number(props.branch?.id)).then(({ data }) => {
          if (data.box) {
            setVisible(true);
            setIdBox(data.box.id);
          } else {
            setVisible(false);
          }
        });
      }
    })();
  }, [props.branch]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="w-full p-4">
        {visible ? (
          <>
            <div className=" justify-center items-center dark:text-white">
              <div className=" text-center text-xl font-semibold mb-2">
                Esta sucursal cuenta con una caja activa
              </div>
              <div className=" text-center text-sm">
                Puedes cerrar la caja y activar una nueva o puedes usar usar la caja activa
              </div>
              <div className="w-full flex justify-center py-5">
                <BoxIcon className=" justify-center items-center" size={60} />
              </div>
            </div>
            <div className="flex justify-between gap-5 mt-5">
              <Popover showArrow backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    style={{ width: 200, height: 50, ...global_styles().dangerStyles }}
                    onClick={onOpen}
                  >
                    Métodos de cierre
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-full p-5">
                    <p className="font-semibold dark:text-white text-center text-base">
                      Cierres de cajas
                    </p>
                    <p className="mt-3 text-center dark:text-white w-72">
                      ¿Como quieres cerrar la caja?
                    </p>
                    <div className="mt-4">
                      <ButtonUi theme={Colors.Success} onPress={() => modalCloseBox.onOpen()}>
                        Cierre contabilizado
                      </ButtonUi>
                      <ButtonUi
                        className="ml-5"
                        theme={Colors.Info}
                        onClick={() => handleCloseBoxId()}
                      >
                        Solo cerrar caja
                      </ButtonUi>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <ButtonUi className="font-semibold" theme={Colors.Secondary} onPress={handleActivate}>
                Usar caja activa
              </ButtonUi>
            </div>
          </>
        ) : (
          <>
            <div className=" text-center text-xl font-semibold dark:text-white">Caja</div>
            <Formik
              initialValues={{
                start: 0,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                <>
                  <div className="">
                    <div className="w-full pt-3 mb-4 dark:text-white">
                      <Input
                        classNames={{ label: 'font-semibold' }}
                        label="Monto inicial "
                        labelPlacement="outside"
                        placeholder="Cantidad"
                        value={values.start.toString()}
                        variant="bordered"
                        onBlur={handleBlur('start')}
                        onChange={handleChange('start')}
                      />
                      {errors.start && touched.start && (
                        <span className="text-sm font-semibold text-red-500">{errors.start}</span>
                      )}
                    </div>
                    <div>
                      <Button
                        className="w-full font-semibold"
                        style={global_styles().thirdStyle}
                        type="submit"
                        onClick={() => handleSubmit()}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </>
        )}
      </div>
      <HeadlessModal
        isOpen={modalCloseBox.isOpen}
        size="w-full"
        title="Cierre de caja"
        onClose={() => {
          modalCloseBox.onClose();
        }}
      >
        <CloseBox />
      </HeadlessModal>
    </>
  );
}

export default AddBranch;
