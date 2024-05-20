import { useContext, useState } from "react";
import BUSINESS from "../assets/bussines.jpg";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../hooks/useTheme";
import LOGO from "../assets/fac3.png";
import * as yup from "yup";
import { IAuthPayload } from "../types/auth.types";
import { Formik } from "formik";
import { useAuthStore } from "../store/auth.store";
import { SessionContext } from "../hooks/useSession";
import { redirect } from "react-router";

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const { postLogin } = useAuthStore();

  const { theme } = useContext(ThemeContext);
  const { setToken, setIsAuth, setRolId } = useContext(SessionContext);

  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required("El usuario es requerido"),
    password: yup.string().required("La contraseña es requerida"),
  });

  const handleSubmit = (values: IAuthPayload) => {
    postLogin(values).then((response) => {
      if (response?.ok) {
        setRolId(response?.user?.roleId);
        setIsAuth(true);
        setToken(response.token);
        redirect("/");
      } else {
        setIsAuth(false);
        setToken("");
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
      <div className="text-3xl flex w-[80vw] h-[90vh] border shadow bg-white p-5 rounded-2xl">
        <div
          className="hidden md:flex md:w-[50%] xl:w-[60%] h-full bg-cover bg-center rounded-2xl shadow"
          style={{ backgroundImage: `url(${BUSINESS})` }}
        ></div>
        <div className="w-[100%] md:w-[50%] xl:w-[40%] px-10 h-full flex flex-col justify-center bg-white">
          <img src={LOGO} alt="" className="w-80" />
          <p className="text-xl lg:text-2xl xl:text-3xl">Bienvenido</p>
          <p className="text-xl lg:text-2xl xl:text-3xl">
            Inicia sesión con tus credenciales
          </p>
          <Formik
            initialValues={initialValues}
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
                <div className="flex flex-col mt-16">
                  <Input
                    classNames={{ label: "text-sm font-semibold" }}
                    variant="bordered"
                    size="lg"
                    label="Usuario"
                    value={values.userName}
                    onChange={handleChange("userName")}
                    onBlur={handleBlur("userName")}
                    labelPlacement="outside"
                    placeholder="Ingresa tu usuario"
                  />
                  {errors.userName && touched.userName && (
                    <p className="text-red-500 text-sm font-semibold">
                      {errors.userName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-10">
                  <Input
                    classNames={{ label: "text-sm font-semibold" }}
                    variant="bordered"
                    size="lg"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder="Ingresa tu contraseña"
                    type={showPassword ? "text" : "password"}
                    endContent={
                      showPassword ? (
                        <EyeOff
                          className="cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <Eye
                          className="cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )
                    }
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm font-semibold">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                  className={" mt-10 w-full font-semibold"}
                  size="lg"
                  onClick={() => handleSubmit()}
                >
                  Iniciar Sesión
                </Button>
              </>
            )}
          </Formik>

          {/* <p className="mt-5 text-sm">¿Olvidaste tu contraseña?</p> */}
        </div>
      </div>
    </div>
  );
}

export default Auth;
