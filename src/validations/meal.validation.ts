// src/validations/meal.validation.ts

import Joi from 'joi';
import { DayOfWeek } from '@prisma/client';

const createMeal = {
  body: Joi.object().keys({
    dayOfWeek: Joi.string()
      .valid(...Object.values(DayOfWeek))
      .required(),
    itemIds: Joi.array().items(Joi.number().integer()).min(3).required()
  })
};

const getMeals = {
  query: Joi.object().keys({
    name: Joi.string(),
    dayOfWeek: Joi.string().valid(...Object.values(DayOfWeek)),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getMeal = {
  params: Joi.object().keys({
    mealId: Joi.number().integer().required()
  })
};

const updateMeal = {
  params: Joi.object().keys({
    mealId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      dayOfWeek: Joi.string().valid(...Object.values(DayOfWeek)),
      itemIds: Joi.array().items(Joi.number().integer()).min(3)
    })
    .min(1)
};

const deleteMeal = {
  params: Joi.object().keys({
    mealId: Joi.number().integer().required()
  })
};

export default {
  createMeal,
  getMeals,
  getMeal,
  updateMeal,
  deleteMeal
};
