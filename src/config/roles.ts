import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'getItems', 'manageItems', 'getMeals', 'manageMeals']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
