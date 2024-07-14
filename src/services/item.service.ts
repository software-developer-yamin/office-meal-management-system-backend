// src/services/item.service.ts

import { Item, Prisma, FoodCategory } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Get item by name
 * @param {string} name
 * @returns {Promise<Item | null>}
 */
const getItemByName = async (name: string): Promise<Item | null> => {
  return prisma.item.findUnique({ where: { name } });
};

/**
 * Create an item
 * @param {Object} itemBody
 * @returns {Promise<Item>}
 */
const createItem = async (name: string, category: FoodCategory): Promise<Item> => {
  if (await getItemByName(name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item name already taken');
  }
  return prisma.item.create({
    data: {
      name,
      category
    }
  });
};

/**
 * Query for items
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Item[]>}
 */
const queryItems = async (
  filter: Prisma.ItemWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }
): Promise<Item[]> => {
  const { limit = 10, page = 1, sortBy, sortType = 'asc' } = options;
  return prisma.item.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
};

/**
 * Get item by id
 * @param {number} id
 * @returns {Promise<Item | null>}
 */
const getItemById = async (id: number): Promise<Item | null> => {
  return prisma.item.findUnique({ where: { id } });
};

/**
 * Update item by id
 * @param {number} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 */
const updateItemById = async (
  itemId: number,
  updateBody: Prisma.ItemUpdateInput
): Promise<Item> => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  if (updateBody.name !== item.name && (await getItemByName(updateBody.name as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item name already taken');
  }
  return prisma.item.update({
    where: { id: item.id },
    data: updateBody
  });
};

/**
 * Delete item by id
 * @param {number} itemId
 * @returns {Promise<Item>}
 */
const deleteItemById = async (itemId: number): Promise<Item> => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  await prisma.item.delete({ where: { id: item.id } });
  return item;
};

export default {
  createItem,
  queryItems,
  getItemById,
  getItemByName,
  updateItemById,
  deleteItemById
};
