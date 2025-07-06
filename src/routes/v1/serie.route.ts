import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { serieValidation, serieController } from '../../modules/serie';

const router = express.Router();

router
  .route('/')
  .post(auth('GESTOR'), validate(serieValidation.createSerie), serieController.createSerie)
  .get(validate(serieValidation.getSeries), serieController.getSeries);

router
  .route('/:idSerie')
  .get(validate(serieValidation.getSerie), serieController.getSerie)
  .patch(auth('GESTOR'), validate(serieValidation.updateSerie), serieController.updateSerie)
  .delete(auth('GESTOR'), validate(serieValidation.deleteSerie), serieController.deleteSerie);

export default router;
