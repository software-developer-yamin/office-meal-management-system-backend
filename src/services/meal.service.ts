// src/services/meal.service.ts

import { Meal, Prisma, DayOfWeek, Item } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

// Define a type that includes the mealItems relation
type MealWithItems = Meal & {
  mealItems: {
    item: Item;
  }[];
};

/**
 * Create a meal
 * @param {Object} mealBody
 * @returns {Promise<MealWithItems>}
 */
const createMeal = async (dayOfWeek: DayOfWeek, itemIds: number[]): Promise<MealWithItems> => {
  const items = await prisma.item.findMany({ where: { id: { in: itemIds } } });
  if (!validateMealConstraints(items)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Meal does not meet required constraints');
  }

  return prisma.meal.create({
    data: {
      dayOfWeek,
      mealItems: {
        create: itemIds.map((itemId) => ({ itemId }))
      }
    },
    include: {
      mealItems: {
        include: {
          item: true
        }
      }
    }
  });
};

/**
 * Query for meals
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<MealWithItems[]>}
 */
const queryMeals = async (
  filter: Prisma.MealWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<MealWithItems[]> => {
  const { limit = 10, page = 1, sortBy, sortType = 'asc' } = options;
  return prisma.meal.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    include: {
      mealItems: {
        include: {
          item: true
        }
      }
    }
  });
};

/**
 * Get meal by id
 * @param {number} id
 * @returns {Promise<MealWithItems | null>}
 */
const getMealById = async (id: number): Promise<MealWithItems | null> => {
  return prisma.meal.findUnique({
    where: { id },
    include: {
      mealItems: {
        include: {
          item: true
        }
      }
    }
  });
};

/**
 * Update meal by id
 * @param {number} mealId
 * @param {Object} updateBody
 * @returns {Promise<MealWithItems>}
 */
const updateMealById = async (
  mealId: number,
  updateBody: {
    name?: string;
    dayOfWeek?: DayOfWeek;
    itemIds?: number[];
  }
): Promise<MealWithItems> => {
  const meal = await getMealById(mealId);
  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  }

  let itemsToValidate = meal.mealItems.map((mi) => mi.item);
  if (updateBody.itemIds) {
    itemsToValidate = await prisma.item.findMany({ where: { id: { in: updateBody.itemIds } } });
  }

  if (!validateMealConstraints(itemsToValidate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Updated meal does not meet required constraints');
  }

  return prisma.meal.update({
    where: { id: meal.id },
    data: {
      dayOfWeek: updateBody.dayOfWeek,
      mealItems: updateBody.itemIds
        ? {
            deleteMany: {},
            create: updateBody.itemIds.map((itemId) => ({ itemId }))
          }
        : undefined
    },
    include: {
      mealItems: {
        include: {
          item: true
        }
      }
    }
  });
};

/**
 * Delete meal by id
 * @param {number} mealId
 * @returns {Promise<MealWithItems>}
 */
const deleteMealById = async (mealId: number): Promise<MealWithItems> => {
  const meal = await getMealById(mealId);
  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  }
  return prisma.meal.delete({
    where: { id: meal.id },
    include: {
      mealItems: {
        include: {
          item: true
        }
      }
    }
  });
};

/**
 * Validate meal constraints
 * @param {Item[]} items
 * @returns {boolean}
 */
const validateMealConstraints = (items: Item[]): boolean => {
  const hasRice = items.some(
    (item) => item.category === 'STARCH' && item.name.toLowerCase().includes('rice')
  );
  const proteinCount = items.filter((item) => item.category === 'PROTEIN').length;
  return items.length >= 3 && hasRice && proteinCount <= 1;
};

export default {
  createMeal,
  queryMeals,
  getMealById,
  updateMealById,
  deleteMealById
};
