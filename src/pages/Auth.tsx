import { useContext, useState } from 'react';
import BUSINESS from '../assets/bussines.jpg';
import { Button, Input } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import { ThemeContext } from '../hooks/useTheme';
import LOGO from '../assets/fac3.png';
import * as yup from 'yup';
import { IAuthPayload } from '../types/auth.types';
import { Formik } from 'formik';
import { useAuthStore } from '../store/auth.store';
import { SessionContext } from '../hooks/useSession';
import { delete_seller_mode } from '../storage/localStorage';

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const { postLogin } = useAuthStore();

  const { theme } = useContext(ThemeContext);
  const { setToken, setIsAuth, setRolId } = useContext(SessionContext);

  const initialValues = {
    userName: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida'),
  });

  const handleSubmit = (values: IAuthPayload) => {
    postLogin(values).then((response) => {
      if (response?.ok) {
        setRolId(response?.user?.roleId);
        setIsAuth(true);
        setToken(response.token);
      } else {
        setIsAuth(false);
        delete_seller_mode();
        setToken('');
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-screen h-auto lg:h-screen xl:h-screen sm:h-screen mb:h-screen bg-gray-50 dark:bg-gray-700 py-10 lg:py-0 xl:py-0 sm:py-0 mb:py-0">
      <div className="text-3xl flex w-[80vw] h-[80vh] xl:h-[90vh] lg:h-[90vh] mb:h-[90vh] sm:h-[90vh] border shadow bg-white dark:bg-gray-800 p-1 mb:p-5 sm:p-5 lg:p-5 xl:p-5 rounded-2xl dark:border-gray-700">
        <div
          className="hidden md:flex md:w-[50%] xl:w-[60%] h-full bg-cover bg-center rounded-2xl shadow"
          style={{ backgroundImage: `url(${BUSINESS})` }}
        ></div>
        <div className="w-[100%] md:w-[50%] xl:w-[40%] px-5 mb:px-10 sm:px-10 xl:px-10 h-full flex flex-col justify-center bg-white dark:bg-gray-800">
          <img src={LOGO} alt="" className="w-80" />
          <p className="text-lg lg:text-lg xl:text-xl 2xl:text-2xl dark:text-white ">Bienvenido</p>
          <p className="text-lg lg:text-lg xl:text-xl 2xl:text-2xl dark:text-white">
            Inicia sesión con tus credenciales
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
              <>
                <div className="flex flex-col mt-5 md:mt-10 xl:mt1-16">
                  <Input
                    classNames={{ label: 'text-sm font-semibold' }}
                    variant="bordered"
                    label="Usuario"
                    value={values.userName}
                    onChange={handleChange('userName')}
                    onBlur={handleBlur('userName')}
                    labelPlacement="outside"
                    type='text'
                    placeholder="Ingresa tu usuario"
                    className="dark:text-white"
                  />
                  {errors.userName && touched.userName && (
                    <p className="text-red-500 text-sm font-semibold">{errors.userName}</p>
                  )}
                </div>
                <div className="flex flex-col mt-10">
                  <Input
                    classNames={{ label: 'text-sm font-semibold' }}
                    variant="bordered"
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder="Ingresa tu contraseña"
                    className="dark:text-white"
                    type={showPassword ? 'text' : 'password'}
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
                    <p className="text-red-500 text-sm font-semibold">{errors.password}</p>
                  )}
                </div>

                <Button
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                  className={' mt-10 w-full font-semibold'}
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
