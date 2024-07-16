import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { mealOrderValidation } from '../../validations';
import { mealOrderController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageMealOrders'),
    validate(mealOrderValidation.createMealOrder),
    mealOrderController.createMealOrder
  )
  .get(
    auth('getMealOrders'),
    validate(mealOrderValidation.getMealOrders),
    mealOrderController.getMealOrders
  );

router
  .route('/:mealOrderId')
  .get(
    auth('getMealOrders'),
    validate(mealOrderValidation.getMealOrder),
    mealOrderController.getMealOrder
  )
  .patch(
    auth('manageMealOrders'),
    validate(mealOrderValidation.updateMealOrder),
    mealOrderController.updateMealOrder
  )
  .delete(
    auth('manageMealOrders'),
    validate(mealOrderValidation.deleteMealOrder),
    mealOrderController.deleteMealOrder
  );

export default router;
