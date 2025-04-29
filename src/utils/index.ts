import { KeyboardEvent } from 'react';

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

export const preventLetters = (e: KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
  const value = (e.target as HTMLInputElement).value;
  const key = e.key;

  if (
    !/[\d.]/.test(key) &&
    key !== 'Backspace' &&
    key !== 'Delete' &&
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight'
  ) {
    e.preventDefault();
  }

  if (key === '.' && value.includes('.')) {
    e.preventDefault();
  }
};
