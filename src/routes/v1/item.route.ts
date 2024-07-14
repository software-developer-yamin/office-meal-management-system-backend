// src/routes/v1/item.route.ts

import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { itemValidation } from '../../validations';
import { itemController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageItems'), validate(itemValidation.createItem), itemController.createItem)
  .get(auth('getItems'), validate(itemValidation.getItems), itemController.getItems);

router
  .route('/:itemId')
  .get(auth('getItems'), validate(itemValidation.getItem), itemController.getItem)
  .patch(auth('manageItems'), validate(itemValidation.updateItem), itemController.updateItem)
  .delete(auth('manageItems'), validate(itemValidation.deleteItem), itemController.deleteItem);

export default router;
