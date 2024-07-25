// src/services/mealSchedule.service.ts

import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

type MealScheduleWithRelations = Prisma.MealScheduleGetPayload<{
  include: {
    meal: {
      include: {
        mealItems: {
          include: {
            item: true;
          };
        };
      };
    };
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

/**
 * Check if a meal exists
 * @param {number} mealId
 * @throws {ApiError}
 */
const checkMealExists = async (mealId: number): Promise<void> => {
  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  }
};

/**
 * Check if a user exists
 * @param {number} userId
 * @throws {ApiError}
 */
const checkUserExists = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

/**
 * Check for overlapping schedules
 * @param {number} mealId
 * @param {number} userId
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {number} [excludeId] - ID to exclude from the check (used for updates)
 * @throws {ApiError}
 */
const checkOverlappingSchedules = async (
  mealId: number,
  userId: number,
  startDate: Date,
  endDate: Date,
  excludeId?: number
): Promise<void> => {
  const overlappingSchedule = await prisma.mealSchedule.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      mealId,
      userId,
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
};

/**
 * Create a meal schedule
 * @param {number} mealId
 * @param {number} userId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<MealScheduleWithRelations>}
 */
const createMealSchedule = async (
  userId: number,
  scheduleBody: { mealId: number; startDate: Date; endDate: Date }
): Promise<MealScheduleWithRelations> => {
  const { mealId, startDate, endDate } = scheduleBody;
  await checkMealExists(mealId);
  await checkUserExists(userId);
  await checkOverlappingSchedules(mealId, userId, startDate, endDate);

  return prisma.mealSchedule.create({
    data: {
      mealId,
      userId,
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
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Query for meal schedules
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<MealScheduleWithRelations[]>}
 */
const queryMealSchedules = async (
  filter: Prisma.MealScheduleWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<MealScheduleWithRelations[]> => {
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
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Get meal schedule by id
 * @param {number} id
 * @returns {Promise<MealScheduleWithRelations | null>}
 */
const getMealScheduleById = async (id: number): Promise<MealScheduleWithRelations | null> => {
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
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Update meal schedule by id
 * @param {number} id
 * @param {Object} updateBody
 * @returns {Promise<MealScheduleWithRelations>}
 */
const updateMealScheduleById = async (
  id: number,
  updateBody: {
    mealId?: number;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<MealScheduleWithRelations> => {
  const mealSchedule = await getMealScheduleById(id);
  if (!mealSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal schedule not found');
  }

  if (updateBody.mealId) {
    await checkMealExists(updateBody.mealId);
  }

  if (updateBody.userId) {
    await checkUserExists(updateBody.userId);
  }

  const mealId = updateBody.mealId || mealSchedule.mealId;
  const userId = updateBody.userId || mealSchedule.userId;
  const startDate = updateBody.startDate || mealSchedule.startDate;
  const endDate = updateBody.endDate || mealSchedule.endDate;

  await checkOverlappingSchedules(mealId, userId, startDate, endDate, id);

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
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Delete meal schedule by id
 * @param {number} id
 * @returns {Promise<MealScheduleWithRelations>}
 */
const deleteMealScheduleById = async (id: number): Promise<MealScheduleWithRelations> => {
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
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
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
