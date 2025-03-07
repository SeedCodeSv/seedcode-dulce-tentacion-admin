import { Button } from "@heroui/react";
import { DataView } from 'primereact/dataview';
import { useUsersStore } from '../../store/users.store';
import { classNames } from 'primereact/utils';
import {
  EditIcon,
  User as IUser,
  Key,
  RefreshCcw,
  ShieldCheck,
  Lock,
  // SquareUserRound,
} from 'lucide-react';
import { global_styles } from '../../styles/global.styles';
import { GridProps, IMobileViewProps } from './types/mobile-view.types';
import TooltipGlobal from '../global/TooltipGlobal';
import { DeletePopUp } from './ListUsers';

function MobileView(props: IMobileViewProps) {
  const { users_paginated } = useUsersStore();
  const { layout, deletePopover, openEditModal, openKeyModal, actions, handleActivate } = props;

  return (
    <div className="w-full pb-10">
      <DataView
        value={users_paginated.users}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              'w-full grid dark:bg-transparent pb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5',
          }),
        }}
        color="surface"
        itemTemplate={(user) => (
          <GridItem
            user={user}
            layout={layout}
            deletePopover={deletePopover}
            openEditModal={openEditModal}
            openKeyModal={openKeyModal}
            actions={actions}
            handleActivate={handleActivate}
          />
        )}
        emptyMessage="No users found"
      />
    </div>
  );
}
const GridItem = (props: GridProps) => {
  const { layout, user, deletePopover, openEditModal, openKeyModal, actions, handleActivate } =
    props;
  return (
    <>
      {layout === 'grid' ? (
        <div
          className={classNames(
            'w-full border dark:border-white shadow flex flex-col justify-between hover:shadow-lg p-5 dark:border dark:border-gray-600 rounded-2xl'
          )}
          key={user.id}
        >
          <div>
            <div className="flex w-full gap-2">
              <IUser className="text-blue-500 dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">{user.userName}</p>
            </div>

            <div className="flex w-full gap-2 mt-3">
              <ShieldCheck className="text-blue-500 dark:text-blue-300" size={20} />
              <p className="w-full dark:text-white">{user.role.name}</p>
            </div>
          </div>
          <div className="flex justify-between mt-5 w-ful">
            {user.active && actions.includes('Editar') ? (
              <TooltipGlobal text="Editar">
                <Button
                  className="border border-white"
                  onClick={() => {
                    openEditModal(user);
                  }}
                  isIconOnly
                  style={global_styles().secondaryStyle}
                >
                  <EditIcon className="dark:text-white" size={20} />
                </Button>
              </TooltipGlobal>
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().secondaryStyle}
                className="flex font-semibold border border-white  cursor-not-allowed"
                isIconOnly
              >
                <Lock />
              </Button>
            )}
            {user.active && actions.includes('Cambiar Contraseña') ? (
              <TooltipGlobal text="Cambiar contraseña">
                <Button
                  className="border border-white"
                  onClick={() => {
                    openKeyModal(user);
                  }}
                  isIconOnly
                  style={global_styles().warningStyles}
                >
                  <Key className="dark:text-white" size={20} />
                </Button>
              </TooltipGlobal>
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().warningStyles}
                className="flex font-semibold border border-white  cursor-not-allowed"
                isIconOnly
              >
                <Lock />
              </Button>
            )}

            {user.active && actions.includes('Eliminar') ? (
              <>
                <DeletePopUp user={user} />
              </>
            ) : (
              <Button
                type="button"
                disabled
                style={global_styles().dangerStyles}
                className="flex font-semibold border border-white  cursor-not-allowed"
                isIconOnly
              >
                <Lock />
              </Button>
            )}
            {!user.active && (
              <>
                {actions.includes('Activar') ? (
                  <TooltipGlobal text="Activar">
                    <Button
                      onClick={() => handleActivate(user.id)}
                      isIconOnly
                      style={global_styles().thirdStyle}
                    >
                      <RefreshCcw />
                    </Button>
                  </TooltipGlobal>
                ) : (
                  <Button
                    type="button"
                    disabled
                    style={global_styles().thirdStyle}
                    className="flex font-semibold border border-white  cursor-not-allowed"
                    isIconOnly
                  >
                    <Lock />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ListItem
          user={user}
          layout="list"
          openEditModal={openEditModal}
          deletePopover={deletePopover}
          openKeyModal={openKeyModal}
          actions={actions}
          handleActivate={handleActivate}
        />
      )}
    </>
  );
};

const ListItem = (props: GridProps) => {
  const { user, openEditModal, openKeyModal, actions, handleActivate } = props;
  return (
    <>
      <div className="flex w-full border dark:border-white col-span-1 p-5 border shadow rounded-2xl ">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <IUser className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{user.userName}</p>
          </div>

          <div className="flex items-center w-full gap-2 mt-3">
            <ShieldCheck className="text-blue-500 dark:text-blue-300" size={20} />
            <p className="w-full dark:text-white">{user.role.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-4">
          {user.active && actions.includes('Editar') ? (
            <TooltipGlobal text="Editar">
              <Button
                className="border border-white"
                onClick={() => {
                  openEditModal(user);
                }}
                isIconOnly
                style={global_styles().secondaryStyle}
              >
                <EditIcon className="dark:text-white" size={20} />
              </Button>
            </TooltipGlobal>
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().secondaryStyle}
              className="flex font-semibold border border-white  cursor-not-allowed"
              isIconOnly
            >
              <Lock />
            </Button>
          )}
          {user.active && actions.includes('Cambiar Contraseña') ? (
            <TooltipGlobal text="Cambiar contraseña">
              <Button
                className="border border-white"
                onClick={() => {
                  openKeyModal(user);
                }}
                isIconOnly
                style={global_styles().warningStyles}
              >
                <Key className="dark:text-white" size={20} />
              </Button>
            </TooltipGlobal>
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().warningStyles}
              className="flex font-semibold border border-white  cursor-not-allowed"
              isIconOnly
            >
              <Lock />
            </Button>
          )}

          {user.active && actions.includes('Eliminar') ? (
            <>
              <DeletePopUp user={user} />
            </>
          ) : (
            <Button
              type="button"
              disabled
              style={global_styles().dangerStyles}
              className="flex font-semibold border border-white  cursor-not-allowed"
              isIconOnly
            >
              <Lock />
            </Button>
          )}
          {!user.active && (
            <>
              {actions.includes('Activar') ? (
                <TooltipGlobal text="Activar">
                  <Button
                    onClick={() => handleActivate(user.id)}
                    isIconOnly
                    style={global_styles().thirdStyle}
                  >
                    <RefreshCcw />
                  </Button>
                </TooltipGlobal>
              ) : (
                <Button
                  type="button"
                  disabled
                  style={global_styles().thirdStyle}
                  className="flex font-semibold border border-white  cursor-not-allowed"
                  isIconOnly
                >
                  <Lock />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileView;
