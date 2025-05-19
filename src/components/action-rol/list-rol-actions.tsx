import { Button, Card, Checkbox, Select, SelectItem, useDisclosure } from '@heroui/react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HiPrinter } from 'react-icons/hi2';
import { FaEdit, FaEye, FaRegFilePdf, FaTrash } from 'react-icons/fa';
import { BsDatabaseAdd } from 'react-icons/bs';
import { FaArrowsRotate } from 'react-icons/fa6';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import { IoBagCheck } from 'react-icons/io5';
import { Check, FileJson, Send, X } from 'lucide-react';
import { GrDocumentCsv } from 'react-icons/gr';
import { TiExportOutline } from 'react-icons/ti';
import { MdOutlineCake, MdOutlineCancelScheduleSend } from 'react-icons/md';
import { RiContractLine } from 'react-icons/ri';
import { LiaFileContractSolid } from 'react-icons/lia';

import GlobalLoading from '../global/GlobalLoading';
import useGlobalStyles from '../global/global.styles';
import HeadlessModal from '../global/HeadlessModal';
import permissionss from '../../actions.json';

import useColors from '@/themes/use-colors';
import { PermissionContext } from '@/hooks/usePermission';
import { useAuthStore } from '@/store/auth.store';
import { create_many_actions } from '@/services/role-actions.service';
import { ActionR } from '@/types/actions_rol.types';
import { create_action_by_view, create_view } from '@/services/actions.service';
import { useRolesStore } from '@/store/roles.store';
import { useActionsRolStore } from '@/store/role-actions.store';
import { save_role_actions } from '@/storage/localStorage';

function ListActionRol() {
  const { roles_list, getRolesList } = useRolesStore();

  const { user } = useAuthStore();
  const [roleSelected, setRoleSelected] = useState(Number(user?.roleId ?? 0));
  const styles = useGlobalStyles();

  const { setRoleActions } = useContext(PermissionContext);

  useEffect(() => {
    getRolesList();
  }, []);

  const { role_actions, getRoleActionsByRol, OnGetActionsByUserWithoutLoading } =
    useActionsRolStore();

  useEffect(() => {
    roleSelected > 0 && getRoleActionsByRol(roleSelected);
  }, [roleSelected]);

  const modalNewView = useDisclosure();

  useEffect(() => {
    role_actions && handleCreateViews();
  }, [role_actions]);

  const handleCreateViews = () => {
    const viewsToCreate = permissionss.view_actions.filter((viewAction) => {
      const existingView = role_actions?.roleActions.views.find(
        (v) => v.view.name === viewAction.view
      );

      if (!existingView) {
        return true; // La vista no existe, se debe crear
      }

      const actionsToCreate = viewAction.actions.filter(
        (action) =>
          !existingView.view.actions.some((existingAction) => existingAction.name === action)
      );

      if (actionsToCreate.length > 0) {
        viewAction.actions = actionsToCreate;

        return true; // Algunas acciones no existen, se deben crear
      }

      return false; // La vista y todas sus acciones ya existen
    });

    viewsToCreate.length > 0 && modalNewView.onOpen();
  };

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // setLoading(true);
    const viewsToCreate = permissionss.view_actions.filter((viewAction) => {
      const existingView = role_actions?.roleActions.views.find(
        (v) => v.view.name === viewAction.view
      );

      if (!existingView) {
        return true; // La vista no existe, se debe crear
      }

      const actionsToCreate = viewAction.actions.filter(
        (action) =>
          !existingView.view.actions.some((existingAction) => existingAction.name === action)
      );

      if (actionsToCreate.length > 0) {
        viewAction.actions = actionsToCreate;

        return true; // Algunas acciones no existen, se deben crear
      }

      return false; // La vista y todas sus acciones ya existen
    });

    if (viewsToCreate.length > 0) {
      const response = await create_view({
        views: viewsToCreate.map(({ view }) => ({
          name: view,
          type: 'Drawer',
        })),
      });

      if (response.data.ok === true && response.data.views) {
        await Promise.all(
          response.data.views.map(async (newView, index) => {
            const actions = viewsToCreate[index].actions;

            if (newView && newView.id) {
              try {
                await create_action_by_view({
                  viewId: newView.id,
                  names: actions.map((name) => ({ name })),
                });
              } catch (error) {
                toast.error('Error al crear las acciones');
              }
            } else {
              toast.error('Error al crear la vista');
            }
          })
        )
          .then(() => {
            toast.success('Todas las vistas y acciones se han creado correctamente');
            modalNewView.onClose();
            getRoleActionsByRol(roleSelected);
            setLoading(false);
          })
          .catch(() => {
            toast.error('Error al crear las acciones');
            modalNewView.onClose();
            setLoading(false);
          });
      }
    }
  };

  const renderItem = (name: string) => {
    if (name.toLocaleLowerCase().includes('agregar')) {
      return <BsDatabaseAdd size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('mostrar') || name.toLocaleLowerCase().includes('ver')) {
      return <FaEye size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('eliminar')) {
      return <FaTrash size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('editar')) {
      return <FaEdit size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('cambiar')) {
      return <FaArrowsRotate size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('excel')) {
      return <PiMicrosoftExcelLogo size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('pdf')) {
      return <FaRegFilePdf size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('json')) {
      return <FileJson size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('imprimir')) {
      return <HiPrinter size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('activar')) {
      return <IoBagCheck size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('reenviar correo')) {
      return <Send size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('csv')) {
      return <GrDocumentCsv size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('exportar')) {
      return <TiExportOutline size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('invalidar')) {
      return <MdOutlineCancelScheduleSend size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('cumpleaños')) {
      return <MdOutlineCake size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('contrato')) {
      return <RiContractLine size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('constancia')) {
      return <LiaFileContractSolid size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('cancelar')) {
      return <X size={20} style={colors.textColor} />;
    }
    if (name.toLocaleLowerCase().includes('completar')) {
      return <Check size={20} style={colors.textColor} />;
    }

    return <></>;
  };

  const handleSelectAction = (
    viewId: number,
    action: ActionR,
    actions: ActionR[],
    isSelected: boolean
  ) => {
    const viewsToCreate = actions.find((fnd) => fnd.name === 'Mostrar' && fnd.hasInRol);

    const actions_s: string[] = [];

    if (viewsToCreate) {
      actions_s.push(action.name);
    } else {
      actions_s.push(action.name);
      actions_s.push('Mostrar');
    }

    create_many_actions({
      rolId: roleSelected,
      viewId: viewId,
      actions: actions_s,
      hasDelete: isSelected,
    }).then(() => {
      getRoleActionsByRol(roleSelected);
      if (roleSelected === user?.roleId) {
        OnGetActionsByUserWithoutLoading(user.roleId).then((data) => {
          if (data) {
            save_role_actions(data);
            setRoleActions(data.roleActions);
          }
          setRoleSelected(roleSelected);
        });
      }
    });
  };

  const handleSelectionAll = (viewId: number, actions: ActionR[], isSelected: boolean) => {
    let views: string[] = [];

    if (!isSelected) {
      const actions_f = actions.filter((fnd) => !fnd.hasInRol);

      views = views.concat(actions_f.map((action) => action.name));
    } else {
      const actions_f = actions.filter((fnd) => fnd.hasInRol);

      views = views.concat(actions_f.map((action) => action.name));
    }

    create_many_actions({
      rolId: roleSelected,
      viewId: viewId,
      actions: views,
      hasDelete: isSelected,
    }).then(() => {
      toast.success('Acciones actualizadas con éxito');
      getRoleActionsByRol(roleSelected);
      if (roleSelected === user?.roleId) {
        OnGetActionsByUserWithoutLoading(user.roleId).then((data) => {
          if (data) {
            save_role_actions(data);
            setRoleActions(data.roleActions);
          }
          setRoleSelected(roleSelected);
        });
      }
    });
  };

  const colors = useColors();

  return (
    <>
      <GlobalLoading show={loading} />
      <HeadlessModal
        isOpen={modalNewView.isOpen}
        size="p-5 w-96"
        title="Nuevas acciones"
        onClose={modalNewView.onClose}
      >
        <div className="w-full flex flex-col dark:text-white">
          <p className="text-lg text-center mt-4">
            Se encontraron nuevas vistas y acciones disponibles
          </p>
          <Button
            className="w-full mt-6 font-semibold"
            style={styles.thirdStyle}
            onPress={handleSave}
          >
            Actualizar vistas
          </Button>
        </div>
      </HeadlessModal>
      <div >
          <div>
            <Select
              className="w-96 dark:text-white"
              classNames={{ label: 'font-semibold' }}
              label="Rol"
              labelPlacement="outside"
              placeholder="Selecciona el rol"
              selectedKeys={[roleSelected.toString()]}
              variant="bordered"
              onSelectionChange={(e) => {
                setRoleSelected(Number(new Set(e).values().next().value));
              }}
            >
              {roles_list.map((role) => (
                <SelectItem key={role.id} className="dark:text-white">
                  {role.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-full mt-5">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {role_actions &&
                role_actions.roleActions.views.map(({ view }, index) => (
                  <React.Fragment key={index}>
                    <Card className="w-full border dark:border-gray-700 rounded-3xl p-8">
                      <div className="w-full flex justify-between">
                        <p className="font-semibold text-lg" style={colors.textColor}>
                          {view.name}
                        </p>
                        <Checkbox
                          isSelected={view.actions.every((action) => action.hasInRol)}
                          size="lg"
                          onValueChange={(isSelected) =>
                            handleSelectionAll(view.id, view.actions, !isSelected)
                          }
                         />
                      </div>
                      <hr className="py-1 mt-2" />
                      <div className="flex flex-col gap-4">
                        {view.actions.map((action, index) => (
                          <div key={index} className="flex justify-between gap-2 items-center">
                            <p
                              className="flex justify-center items-center gap-4 font-semibold text-sm"
                              style={colors.textColor}
                            >
                              {renderItem(action.name)} {action.name}
                            </p>
                            <Checkbox
                              isSelected={action.hasInRol}
                              size="lg"
                              onValueChange={(isSelected) =>
                                handleSelectAction(view.id, action, view.actions, !isSelected)
                              }
                             />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
    </>
  );
}

export default ListActionRol;
