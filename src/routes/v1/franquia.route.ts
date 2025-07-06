import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { franquiaValidation, franquiaController } from '../../modules/franquia';

const router = express.Router();

router
  .route('/')
  .post(auth('GESTOR'), validate(franquiaValidation.createFranquia), franquiaController.createFranquia)
  .get(validate(franquiaValidation.getFranquias), franquiaController.getFranquias);

router
  .route('/:idFranquia')
  .get(validate(franquiaValidation.getFranquia), franquiaController.getFranquia)
  .patch(auth('GESTOR'), validate(franquiaValidation.updateFranquia), franquiaController.updateFranquia)
  .delete(auth('GESTOR'), validate(franquiaValidation.deleteFranquia), franquiaController.deleteFranquia);

export default router;
