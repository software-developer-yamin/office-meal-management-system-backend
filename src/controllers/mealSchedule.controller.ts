import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { mealScheduleService } from '../services';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';

const createMealSchedule = catchAsync(async (req, res) => {
  const mealSchedule = await mealScheduleService.createMealSchedule(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(mealSchedule);
});

const getMealSchedules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['mealId', 'userId', 'startDate', 'endDate']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);
  const result = await mealScheduleService.queryMealSchedules(filter, options);
  res.send(result);
});

const getMealSchedule = catchAsync(async (req, res) => {
  const mealSchedule = await mealScheduleService.getMealScheduleById(
    parseInt(req.params.scheduleId)
  );
  if (!mealSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meal schedule not found');
  }
  res.send(mealSchedule);
});

const updateMealSchedule = catchAsync(async (req, res) => {
  const mealSchedule = await mealScheduleService.updateMealScheduleById(
    parseInt(req.params.scheduleId),
    req.body
  );
  res.send(mealSchedule);
});

const deleteMealSchedule = catchAsync(async (req, res) => {
  await mealScheduleService.deleteMealScheduleById(parseInt(req.params.scheduleId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createMealSchedule,
  getMealSchedules,
  getMealSchedule,
  updateMealSchedule,
  deleteMealSchedule
};
