import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { episodioValidation, episodioController } from '../../modules/episodio';

const router = express.Router();

router
  .route('/')
  .post(auth('GESTOR'), validate(episodioValidation.createEpisodio), episodioController.createEpisodio)
  .get(validate(episodioValidation.getEpisodios), episodioController.getEpisodios);

router
  .route('/:id_serie/:temporada/:numero_episodio')
  .get(validate(episodioValidation.getEpisodio), episodioController.getEpisodio)
  .patch(auth('GESTOR'), validate(episodioValidation.updateEpisodio), episodioController.updateEpisodio)
  .delete(auth('GESTOR'), validate(episodioValidation.deleteEpisodio), episodioController.deleteEpisodio);

export default router;
