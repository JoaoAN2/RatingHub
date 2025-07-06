import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import obraRoute from './obra.route';
import franquiaRoute from './franquia.route';
import filmeRoute from './filme.route';
import serieRoute from './serie.route';
import episodioRoute from './episodio.route';

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
  },
  {
    path: '/series',
    route: serieRoute
  },
  {
    path: '/episodios',
    route: episodioRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
