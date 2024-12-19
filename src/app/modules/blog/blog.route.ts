import express from 'express';
import { blogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidationSchema } from './blog.validation';

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(BlogValidationSchema.CreateblogValidationSchema),
  blogController.createblog,
);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(BlogValidationSchema.updateblogValidationSchema),
  blogController.updateBlog,
);
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(BlogValidationSchema.updateblogValidationSchema),
  blogController.deleteABlog,
);
router.delete(
  '/blogs/:id',
  auth(USER_ROLE.admin),
  validateRequest(BlogValidationSchema.updateblogValidationSchema),
  blogController.deleteABlog,
);

export const blogRoute = router;
