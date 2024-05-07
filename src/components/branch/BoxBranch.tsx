import { Button, Input } from "@nextui-org/react";
import { global_styles } from "../../styles/global.styles";
import * as yup from "yup";
import { Formik } from "formik";
import { Branches } from "../../types/branches.types";
import { useBoxStore } from "../../store/Boxes.store";
import { IBoxPayload } from "../../types/box.types";
import { useEffect, useState } from "react";
import { verify_box } from "../../services/Boxes.service";
import { BoxIcon } from "lucide-react";
import {post_box} from "../../storage/localStorage";

interface Props {
  closeModal: () => void;
  branch?: Branches | undefined;
  setBranch: React.Dispatch<React.SetStateAction<Branches | undefined>>;
}

function AddBranch(props: Props) {
  const validationSchema = yup.object().shape({
    start: yup.string().required("El monto inicial es requerido"),
  });

  const { postBox } = useBoxStore();

  const handleSubmit = (values: IBoxPayload) => {
    if (props.branch) {
      const payload: IBoxPayload = {
        start: values.start,
        branchId: props.branch.id,
      };
      postBox(payload);
    }
    props.setBranch(undefined);
    props.closeModal();
  };
  const [visible, setVisible] = useState(false);
  const [idBox, setIdBox] = useState(0);
const handleActivate = () => {
  post_box(idBox.toString())
  props.closeModal();
}
  useEffect(() => {
    (async () => {
      verify_box(Number(props.branch?.id)).then(({ data }) => {
        if (data.box) {
          setVisible(true);
          setIdBox(data.box.id)
        } else {
          setVisible(false);
        }
      });
    })();
  }, [props.branch]);
  return (
    <div>
      {visible ? (
        <>
          <div className=" justify-center items-center">
            <div className=" text-center text-xl font-semibold mb-2">
              Esta sucursal cuenta con una caja activa
            </div>
            <div className=" text-center text-sm font-semibold">
              Puedes cerrar la caja y activar una nueva o puedes usar usar la
              caja activa
            </div>
            <BoxIcon size={45} className=" justify-center items-center" />
          </div>
          <div className="flex justify-between gap-5 mt-5">
            <Button
              size="lg"
              onClick={() => setVisible(false)}
            >
              Métodos de cierre
            </Button>
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
                <div className=" w-52 mt-4">
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
  );
}

export default AddBranch;
