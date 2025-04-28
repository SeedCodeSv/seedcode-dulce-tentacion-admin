import { useContext, useState } from 'react';
import { Input } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import * as yup from 'yup';
import { Formik } from 'formik';

import LOGO from '../assets/fac3.png';
import { IAuthPayload } from '../types/auth.types';
import BUSINESS from '../assets/bussines.jpg';
import { useAuthStore } from '../store/auth.store';
import { SessionContext } from '../hooks/useSession';
import { delete_seller_mode } from '../storage/localStorage';

import { useViewsStore } from '@/store/views.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const { postLogin } = useAuthStore();
  const { setToken, setIsAuth, setRolId } = useContext(SessionContext);
  const initialValues = {
    userName: '',
    password: '',
  };
  const validationSchema = yup.object().shape({
    userName: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida'),
  });
  const { OnGetActionsByRol, OnGetViewasAction } = useViewsStore();

  const handleSubmit = (values: IAuthPayload) => {
    postLogin(values).then((response) => {
      if (response?.ok) {
        setRolId(response?.user?.roleId);
        setIsAuth(true);
        setToken(response.token);
        OnGetActionsByRol(response.user.roleId);
        OnGetViewasAction(1, 5, '');
      } else {
        setIsAuth(false);
        delete_seller_mode();
        setToken('');
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-screen h-auto lg:h-screen xl:h-screen sm:h-screen md:h-screen bg-gray-50 dark:bg-gray-700 py-10 lg:py-0 xl:py-0 sm:py-0 md:py-0">
      <div className="text-3xl flex w-[80vw] h-[80vh] xl:h-[90vh] lg:h-[90vh] mb:h-[90vh] sm:h-[90vh] border shadow bg-white dark:bg-gray-800 p-1 mb:p-5 sm:p-5 lg:p-5 xl:p-5 rounded-2xl dark:border-gray-700">
        <div
          className="hidden md:flex md:w-[50%] xl:w-[60%] h-full bg-cover bg-center rounded-2xl shadow"
          style={{ backgroundImage: `url(${BUSINESS})` }}
         />
        <div className="w-[100%] md:w-[50%] xl:w-[40%] px-5 mb:px-10 sm:px-10 xl:px-10 h-full flex flex-col justify-center bg-white dark:bg-gray-800">
          <img alt="" className="w-80" src={LOGO} />
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
                    className="dark:text-white"
                    classNames={{ label: 'text-sm font-semibold' }}
                    label="Usuario"
                    labelPlacement="outside"
                    placeholder="Ingresa tu usuario"
                    type="text"
                    value={values.userName}
                    variant="bordered"
                    onBlur={handleBlur('userName')}
                    onChange={handleChange('userName')}
                  />
                  {errors.userName && touched.userName && (
                    <p className="text-red-500 text-sm font-semibold">{errors.userName}</p>
                  )}
                </div>
                <div className="flex flex-col mt-10">
                  <Input
                    className="dark:text-white"
                    classNames={{ label: 'text-sm font-semibold' }}
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
                    label="Contraseña"
                    labelPlacement="outside"
                    placeholder="Ingresa tu contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    variant="bordered"
                    onBlur={handleBlur('password')}
                    onChange={handleChange('password')}
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm font-semibold">{errors.password}</p>
                  )}
                </div>

                <ButtonUi
                  className={' mt-10 w-full font-semibold'}
                  theme={Colors.Primary}
                  onPress={() => handleSubmit()}
                >
                  Iniciar Sesión
                </ButtonUi>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Auth;
