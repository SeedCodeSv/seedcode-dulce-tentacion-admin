import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import * as yup from "yup";
import { Formik } from "formik";
import { Branches } from "../../types/branches.types";
import { useBoxStore } from "../../store/Boxes.store";
import { IBoxPayload } from "../../types/box.types";
import { useContext, useEffect, useState } from "react";
import { verify_box } from "../../services/Boxes.service";
import { BoxIcon } from "lucide-react";
import { post_box, save_branch_id } from "../../storage/localStorage";
import ModalGlobal from "../global/ModalGlobal";
import CloseBox from "./box/CloseBox";
import { ThemeContext } from "../../hooks/useTheme";
import Branch from "../../pages/Branch";
interface Props {
  closeModal: () => void;
  branch?: Branches | undefined;
  setBranch: React.Dispatch<React.SetStateAction<Branches | undefined>>;
}

function AddBranch(props: Props) {
  const { theme } = useContext(ThemeContext);

  const modalCloseBox = useDisclosure();

  const validationSchema = yup.object().shape({
    start: yup.string().required("El monto inicial es requerido"),
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
    save_branch_id(props.branch?.id.toString()!);
  };
  const [visible, setVisible] = useState(false);
  const [idBox, setIdBox] = useState(0);
  const handleActivate = () => {
    post_box(idBox.toString());
    props.closeModal();
    save_branch_id(props.branch?.id.toString()!);
  };
  const handleCloseBoxId = () => {
    closeBox(idBox)
    props.closeModal();
    props.setBranch(undefined);
  }
  useEffect(() => {
    (async () => {
     if(props.branch){
      verify_box(Number(props.branch?.id)).then(({ data }) => {
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
      <div className="w-full">
        {visible ? (
          <>
            <div className=" justify-center items-center">
              <div className=" text-center text-xl font-semibold mb-2">
                Esta sucursal cuenta con una caja activa
              </div>
              <div className=" text-center text-sm">
                Puedes cerrar la caja y activar una nueva o puedes usar usar la
                caja activa
              </div>
              <div className="w-full flex justify-center py-5">
              <BoxIcon size={60} className=" justify-center items-center" />
              </div>
            </div>
            <div className="flex justify-between gap-5 mt-5">
              {/* <Button size="lg" onClick={() => modalCloseBox.onOpen()}>
                Métodos de cierre
              </Button> */}
              <Popover
                isOpen={isOpen}
                onClose={onClose}
                backdrop="blur"
                showArrow
              >
                <PopoverTrigger>
                  <Button
                    onClick={onOpen}
                    isIconOnly
                    style={{ width: 200, height: 50}}
                  >
                    Métodos de cierre
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-full p-5">
                    <p className="font-semibold text-gray-600 text-center">Cierres de cajas</p>
                    <p className="mt-3 text-center text-gray-600 w-72">
                      ¿Como quieres cerrar la caja?
                    </p>
                    <div className="mt-4">
                      <Button onClick={() => modalCloseBox.onOpen()}>Cierre contabilizado</Button>
                      <Button
                        onClick={() => handleCloseBoxId()}
                        className="ml-5"
                        style={{
                          backgroundColor: theme.colors.third,
                        }}
                      >
                        Solo cerrar caja
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                size="lg"
                className="font-semibold"
                style={global_styles().thirdStyle}
                onClick={handleActivate}
              >
                Usar caja activa
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className=" text-center text-xl font-semibold">Caja</div>
            <Formik
              initialValues={{
                start: 0,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <>
                  <div className="">
                    <div className="w-full pt-3 mb-4">
                      <Input
                        size="lg"
                        label="Monto inicial"
                        placeholder="Cantidad"
                        variant="bordered"
                        onChange={handleChange("start")}
                        onBlur={handleBlur("start")}
                        value={values.start.toString()}
                        classNames={{ label: "font-semibold" }}
                        labelPlacement="outside"
                      />
                      {errors.start && touched.start && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.start}
                        </span>
                      )}
                    </div>
                    <div>
                      <Button
                        type="submit"
                        onClick={() => handleSubmit()}
                        style={global_styles().thirdStyle}
                        className="w-full font-semibold"
                        size="lg"
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
      <ModalGlobal
        isOpen={modalCloseBox.isOpen}
        onClose={() => {
          modalCloseBox.onClose();
        }}
        title="Cierre de caja"
        size="w-full"
        isFull
      >
        <CloseBox />
      </ModalGlobal>
    </>
  );
}

export default AddBranch;
