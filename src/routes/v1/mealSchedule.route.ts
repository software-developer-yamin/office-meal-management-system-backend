import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { mealScheduleValidation } from '../../validations';
import { mealScheduleController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageMealSchedules'),
    validate(mealScheduleValidation.createMealSchedule),
    mealScheduleController.createMealSchedule
  )
  .get(
    auth('getMealSchedules'),
    validate(mealScheduleValidation.getMealSchedules),
    mealScheduleController.getMealSchedules
  );

router
  .route('/:scheduleId')
  .get(
    auth('getMealSchedules'),
    validate(mealScheduleValidation.getMealSchedule),
    mealScheduleController.getMealSchedule
  )
  .patch(
    auth('manageMealSchedules'),
    validate(mealScheduleValidation.updateMealSchedule),
    mealScheduleController.updateMealSchedule
  )
  .delete(
    auth('manageMealSchedules'),
    validate(mealScheduleValidation.deleteMealSchedule),
    mealScheduleController.deleteMealSchedule
  );

export default router;
