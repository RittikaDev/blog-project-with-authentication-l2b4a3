import express from 'express';
import { blogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidationSchema } from './blog.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(BlogValidationSchema.CreateblogValidationSchema),
  blogController.createblog,
);
router.get('/revenue', blogController.getRevenue);

export const blogRoute = router;
