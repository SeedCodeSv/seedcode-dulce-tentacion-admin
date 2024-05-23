import { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { router_seller } from '../router_seller';
import { SessionContext } from '../hooks/useSession';
import Auth from './Auth';
function Main() {
  const { isAuth, mode } = useContext(SessionContext);
  return (
    <>
      {isAuth ? (
        mode !== '' ? (
          <RouterProvider router={router_seller()} />
        ) : (
          <RouterProvider router={router()} />
        )
      ) : (
        <Auth />
      )}
    </>
  );
}

export default Main;
