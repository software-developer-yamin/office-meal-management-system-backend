// src/validations/item.validation.ts

import Joi from 'joi';
import { FoodCategory } from '@prisma/client';

const createItem = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string()
      .valid(...Object.values(FoodCategory))
      .required()
  })
};

const getItems = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string().valid(...Object.values(FoodCategory)),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.number().integer().required()
  })
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      category: Joi.string().valid(...Object.values(FoodCategory))
    })
    .min(1)
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.number().integer().required()
  })
};

export default {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
};
