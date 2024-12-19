import express from 'express';
import { UserControllers } from './user.controllers';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

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

// ADMIN
router.patch('/:id/block', auth(USER_ROLE.admin), UserControllers.blockAUser);

export const UserRoutes = router;
