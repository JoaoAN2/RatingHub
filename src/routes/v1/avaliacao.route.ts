

import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

// importado de um unico lugar para evitar inconsistências
import { avaliacaoController, avaliacaoValidation } from '../../modules/avaliacao';

const router = express.Router();

router
  .route('/')
  .post(
    auth('NORMAL', 'CRITICO'), // Apenas usuários logados (NORMAL ou CRITICO) podem postar
    validate(avaliacaoValidation.createAvaliacao),
    avaliacaoController.createAvaliacao
  );

export default router;