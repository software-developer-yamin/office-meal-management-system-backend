// src/controllers/item.controller.ts

import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { itemService } from '../services';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';

const createItem = catchAsync(async (req, res) => {
  const { name, category } = req.body;
  const item = await itemService.createItem(name, category);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await itemService.queryItems(filter, options);
  res.send(result);
});

const getItem = catchAsync(async (req, res) => {
  const item = await itemService.getItemById(parseInt(req.params.itemId));
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
  const item = await itemService.updateItemById(parseInt(req.params.itemId), req.body);
  res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
  await itemService.deleteItemById(parseInt(req.params.itemId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
};
