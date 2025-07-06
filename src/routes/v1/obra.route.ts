import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { obraValidation, obraController } from '../../modules/obra';

const router = express.Router();

router
  .route('/')
  .post(auth('GESTOR'), validate(obraValidation.createObra), obraController.createObra)
  .get(validate(obraValidation.getObras), obraController.getObras);

router
  .route('/:idObra')
  .get(validate(obraValidation.getObra), obraController.getObra)
  .patch(auth('GESTOR'), validate(obraValidation.updateObra), obraController.updateObra)
  .delete(auth('GESTOR'), validate(obraValidation.deleteObra), obraController.deleteObra);

export default router;
