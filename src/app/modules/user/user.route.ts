import express from 'express';
import { UserControllers } from './user.controllers';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.CreateUserValidationSchema),
  UserControllers.createUser,
);

router.post(
  '/login',
  validateRequest(UserValidations.loginValidationSchema),
  UserControllers.signInUser,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidations.refreshTokenValidationSchema),
  UserControllers.refreshToken,
);

export const UserRoutes = router;

// import  express  from 'express';

// const router = express.Router()

// router.post('/',)

// export const UserRoutes = router;
