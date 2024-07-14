import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import itemRoute from './item.route';
import mealRoute from './meal.route';
import mealScheduleRoute from './mealSchedule.route';
import mealOrderRoute from './mealOrder.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/items',
    route: itemRoute
  },
  {
    path: '/meals',
    route: mealRoute
  },
  {
    path: '/meal-schedules',
    route: mealScheduleRoute
  },
  {
    path: '/meal-orders',
    route: mealOrderRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
