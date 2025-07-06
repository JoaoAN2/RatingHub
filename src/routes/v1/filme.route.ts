import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { filmeValidation, filmeController } from '../../modules/filme';

const router = express.Router();

router
  .route('/')
  .post(auth('GESTOR'), validate(filmeValidation.createFilme), filmeController.createFilme)
  .get(validate(filmeValidation.getFilmes), filmeController.getFilmes);

router
  .route('/:idFranquia/:edicao')
  .get(validate(filmeValidation.getFilme), filmeController.getFilme)
  .patch(auth('GESTOR'), validate(filmeValidation.updateFilme), filmeController.updateFilme)
  .delete(auth('GESTOR'), validate(filmeValidation.deleteFilme), filmeController.deleteFilme);

export default router;
