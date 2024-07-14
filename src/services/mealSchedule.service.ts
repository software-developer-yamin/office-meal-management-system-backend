// src/services/mealSchedule.service.ts

import { MealSchedule, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a meal schedule
 * @param {number} mealId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<MealSchedule>}
 */
const createMealSchedule = async (
  mealId: number,
  startDate: Date,
  endDate: Date
): Promise<MealSchedule> => {
  // Check if meal exists
  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  }

  // Check for overlapping schedules
  const overlappingSchedule = await prisma.mealSchedule.findFirst({
    where: {
      mealId,
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } },
        { startDate: { gte: startDate, lte: endDate } },
        { endDate: { gte: startDate, lte: endDate } }
      ]
    }
  });

  if (overlappingSchedule) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Overlapping schedule exists');
  }

  return prisma.mealSchedule.create({
    data: {
      mealId,
      startDate,
      endDate
    },
    include: {
      meal: {
        include: {
          mealItems: {
            include: {
              item: true
            }
          }
        }
      }
    }
  });
};

/**
 * Query for meal schedules
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<MealSchedule[]>}
 */
const queryMealSchedules = async (
  filter: Prisma.MealScheduleWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<MealSchedule[]> => {
  const { limit = 10, page = 1, sortBy, sortType = 'asc' } = options;
  return prisma.mealSchedule.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    include: {
      meal: {
        include: {
          mealItems: {
            include: {
              item: true
            }
          }
        }
      }
    }
  });
};

/**
 * Get meal schedule by id
 * @param {number} id
 * @returns {Promise<MealSchedule | null>}
 */
const getMealScheduleById = async (id: number): Promise<MealSchedule | null> => {
  return prisma.mealSchedule.findUnique({
    where: { id },
    include: {
      meal: {
        include: {
          mealItems: {
            include: {
              item: true
            }
          }
        }
      }
    }
  });
};

/**
 * Update meal schedule by id
 * @param {number} id
 * @param {Object} updateBody
 * @returns {Promise<MealSchedule>}
 */
const updateMealScheduleById = async (
  id: number,
  updateBody: {
    mealId?: number;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<MealSchedule> => {
  const mealSchedule = await getMealScheduleById(id);
  if (!mealSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal schedule not found');
  }

  if (updateBody.mealId) {
    const meal = await prisma.meal.findUnique({ where: { id: updateBody.mealId } });
    if (!meal) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
    }
  }

  // Check for overlapping schedules
  if (updateBody.startDate || updateBody.endDate) {
    const overlappingSchedule = await prisma.mealSchedule.findFirst({
      where: {
        id: { not: id },
        mealId: updateBody.mealId || mealSchedule.mealId,
        OR: [
          {
            startDate: { lte: updateBody.endDate || mealSchedule.endDate },
            endDate: { gte: updateBody.startDate || mealSchedule.startDate }
          },
          {
            startDate: {
              gte: updateBody.startDate || mealSchedule.startDate,
              lte: updateBody.endDate || mealSchedule.endDate
            }
          },
          {
            endDate: {
              gte: updateBody.startDate || mealSchedule.startDate,
              lte: updateBody.endDate || mealSchedule.endDate
            }
          }
        ]
      }
    });

    if (overlappingSchedule) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Overlapping schedule exists');
    }
  }

  return prisma.mealSchedule.update({
    where: { id },
    data: updateBody,
    include: {
      meal: {
        include: {
          mealItems: {
            include: {
              item: true
            }
          }
        }
      }
    }
  });
};

/**
 * Delete meal schedule by id
 * @param {number} id
 * @returns {Promise<MealSchedule>}
 */
const deleteMealScheduleById = async (id: number): Promise<MealSchedule> => {
  const mealSchedule = await getMealScheduleById(id);
  if (!mealSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal schedule not found');
  }
  return prisma.mealSchedule.delete({
    where: { id },
    include: {
      meal: {
        include: {
          mealItems: {
            include: {
              item: true
            }
          }
        }
      }
    }
  });
};

export default {
  createMealSchedule,
  queryMealSchedules,
  getMealScheduleById,
  updateMealScheduleById,
  deleteMealScheduleById
};
