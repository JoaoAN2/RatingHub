import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import obraRoute from './obra.route';
import franquiaRoute from './franquia.route';
import filmeRoute from './filme.route';

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
    path: '/obras',
    route: obraRoute
  },
  {
    path: '/franquias',
    route: franquiaRoute
  },
  {
    path: '/filmes',
    route: filmeRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
