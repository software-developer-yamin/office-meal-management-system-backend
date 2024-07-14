// src/routes/v1/meal.route.ts

import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { mealValidation } from '../../validations';
import { mealController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageMeals'), validate(mealValidation.createMeal), mealController.createMeal)
  .get(auth('getMeals'), validate(mealValidation.getMeals), mealController.getMeals);

router
  .route('/:mealId')
  .get(auth('getMeals'), validate(mealValidation.getMeal), mealController.getMeal)
  .patch(auth('manageMeals'), validate(mealValidation.updateMeal), mealController.updateMeal)
  .delete(auth('manageMeals'), validate(mealValidation.deleteMeal), mealController.deleteMeal);

export default router;
