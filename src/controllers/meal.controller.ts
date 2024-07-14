// src/controllers/meal.controller.ts

import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { mealService } from '../services';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';

const createMeal = catchAsync(async (req, res) => {
  const { dayOfWeek, itemIds } = req.body;
  const meal = await mealService.createMeal(dayOfWeek, itemIds);
  res.status(httpStatus.CREATED).send(meal);
});

const getMeals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'dayOfWeek']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mealService.queryMeals(filter, options);
  res.send(result);
});

const getMeal = catchAsync(async (req, res) => {
  const meal = await mealService.getMealById(parseInt(req.params.mealId));
  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  }
  res.send(meal);
});

const updateMeal = catchAsync(async (req, res) => {
  const meal = await mealService.updateMealById(parseInt(req.params.mealId), req.body);
  res.send(meal);
});

const deleteMeal = catchAsync(async (req, res) => {
  await mealService.deleteMealById(parseInt(req.params.mealId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createMeal,
  getMeals,
  getMeal,
  updateMeal,
  deleteMeal
};
