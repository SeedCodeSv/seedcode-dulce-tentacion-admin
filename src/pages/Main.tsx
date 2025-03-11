import { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { SessionContext } from '../hooks/useSession';
import Auth from './Auth';
import SocketContext from './SocketContext';
function Main() {
  const { isAuth } = useContext(SessionContext);
  return (
    <>
      {isAuth ? (
        <>
          <SocketContext />
          <RouterProvider router={router()} />
        </>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default Main;
