// src/validations/mealSchedule.validation.ts

import Joi from 'joi';

const createMealSchedule = {
  body: Joi.object().keys({
    mealId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
  })
};

const getMealSchedules = {
  query: Joi.object().keys({
    mealId: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getMealSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.number().integer().required()
  })
};

const updateMealSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      mealId: Joi.number().integer(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso().min(Joi.ref('startDate'))
    })
    .min(1)
};

const deleteMealSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.number().integer().required()
  })
};

export default {
  createMealSchedule,
  getMealSchedules,
  getMealSchedule,
  updateMealSchedule,
  deleteMealSchedule
};
