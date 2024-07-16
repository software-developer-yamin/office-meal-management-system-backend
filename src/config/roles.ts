import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: [
    'getUsers',
    'manageUsers',
    'getItems',
    'manageItems',
    'getMeals',
    'manageMeals',
    'manageMealOrders',
    'getMealOrders',
    'manageMealSchedules',
    'getMealSchedules'
  ]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
