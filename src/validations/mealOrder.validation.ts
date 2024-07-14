import Joi from 'joi';
import { OrderStatus } from '@prisma/client';

const createMealOrder = {
  body: Joi.object().keys({
    mealId: Joi.number().integer().required(),
    date: Joi.date().iso().required()
  })
};

const getMealOrders = {
  query: Joi.object().keys({
    userId: Joi.number().integer(),
    mealId: Joi.number().integer(),
    date: Joi.date().iso(),
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getMealOrder = {
  params: Joi.object().keys({
    mealOrderId: Joi.number().integer().required()
  })
};

const updateMealOrder = {
  params: Joi.object().keys({
    mealOrderId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      mealId: Joi.number().integer(),
      date: Joi.date().iso(),
      status: Joi.string().valid(...Object.values(OrderStatus))
    })
    .min(1)
};

const deleteMealOrder = {
  params: Joi.object().keys({
    mealOrderId: Joi.number().integer().required()
  })
};

export default {
  createMealOrder,
  getMealOrders,
  getMealOrder,
  updateMealOrder,
  deleteMealOrder
};
