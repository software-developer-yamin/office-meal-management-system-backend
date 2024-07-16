import { MealOrder, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

const createMealOrder = async (
  userId: number,
  orderBody: { mealId: number; date: Date }
): Promise<MealOrder> => {
  const { mealId, date } = orderBody;

  // Check if the user already has an order for the given date
  const existingOrder = await prisma.mealOrder.findUnique({
    where: {
      userId_date: {
        userId,
        date
      }
    }
  });

  if (existingOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already has an order for this date');
  }

  return prisma.mealOrder.create({
    data: {
      userId,
      mealId,
      date
    }
  });
};

const queryMealOrders = async (
  filter: Prisma.MealOrderWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<MealOrder[]> => {
  const { limit = 10, page = 1, sortBy, sortType = 'asc' } = options;

  return prisma.mealOrder.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
};

const getMealOrderById = async (id: number): Promise<MealOrder | null> => {
  return prisma.mealOrder.findUnique({ where: { id } });
};

const updateMealOrderById = async (
  mealOrderId: number,
  updateBody: Prisma.MealOrderUpdateInput
): Promise<MealOrder> => {
  const mealOrder = await getMealOrderById(mealOrderId);
  if (!mealOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal order not found');
  }
  return prisma.mealOrder.update({
    where: { id: mealOrder.id },
    data: updateBody
  });
};

const deleteMealOrderById = async (mealOrderId: number): Promise<MealOrder> => {
  const mealOrder = await getMealOrderById(mealOrderId);
  if (!mealOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal order not found');
  }
  return prisma.mealOrder.delete({ where: { id: mealOrder.id } });
};

export default {
  createMealOrder,
  queryMealOrders,
  getMealOrderById,
  updateMealOrderById,
  deleteMealOrderById
};
