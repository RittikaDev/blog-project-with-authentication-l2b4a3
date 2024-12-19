import { Router } from 'express';
import { blogRoute } from '../modules/blog/blog.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/blogs',
    route: blogRoute,
  },
  {
    path: '/admin',
    route: blogRoute,
  },
  {
    path: '/admin/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
