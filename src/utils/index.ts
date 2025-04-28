import { GroupedAction, RoleAction } from '../types/actions.types';

export const formatActionsRole = (actions_roles: RoleAction[]) => {
  const groupedActions: Record<string, GroupedAction> = {};

  actions_roles.forEach((roleActions) => {
    const role = roleActions.role.name;
    const viewName = roleActions.action.view.name;
    const actionName = roleActions.action.name;

    const key = `${role}_${viewName}`;

    if (!groupedActions[key]) {
      groupedActions[key] = {
        role,
        view: viewName,
        action: [],
      };
    }

    groupedActions[key].action.push(actionName);
  });

  const resultArray: GroupedAction[] = Object.values(groupedActions);

  return resultArray;
};
