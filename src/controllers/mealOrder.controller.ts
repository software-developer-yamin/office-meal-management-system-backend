import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { mealOrderService } from '../services';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';

const createMealOrder = catchAsync(async (req, res) => {
  const mealOrder = await mealOrderService.createMealOrder(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(mealOrder);
});

const getMealOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'mealId', 'date', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mealOrderService.queryMealOrders(filter, options);
  res.send(result);
});

const getMealOrder = catchAsync(async (req, res) => {
  const mealOrder = await mealOrderService.getMealOrderById(parseInt(req.params.mealOrderId));
  if (!mealOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal order not found');
  }
  res.send(mealOrder);
});

const updateMealOrder = catchAsync(async (req, res) => {
  const mealOrder = await mealOrderService.updateMealOrderById(
    parseInt(req.params.mealOrderId),
    req.body
  );
  res.send(mealOrder);
});

const deleteMealOrder = catchAsync(async (req, res) => {
  await mealOrderService.deleteMealOrderById(parseInt(req.params.mealOrderId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createMealOrder,
  getMealOrders,
  getMealOrder,
  updateMealOrder,
  deleteMealOrder
};
