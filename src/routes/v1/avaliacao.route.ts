

import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { avaliacaoController, avaliacaoValidation } from '../../modules/avaliacao'; // importado de um unico lugar para evitar inconsistências

const router = express.Router();

router
  .route('/')
  .post(
    auth('NORMAL', 'CRITICO'), // Apenas usuários logados (NORMAL ou CRITICO) podem postar
    validate(avaliacaoValidation.createAvaliacao),
    avaliacaoController.createAvaliacao
  );


router // lê todas as avaliações de uma obra específica
  .route('/obra/:idObra')
  .get(validate(avaliacaoValidation.getAvaliacoes), avaliacaoController.getAvaliacoesByObraId);


router  // rotas para ler, atualizar e deletar avaliações de obra >> ação na avaliação do usuário que está logado
  .route('/obra/:idObra')
  .get( // ler todas as avaliações (público)
    validate(avaliacaoValidation.getAvaliacoes),
    avaliacaoController.getAvaliacoesByObraId
  )
  .patch( // atualizar a própria avaliação >> precisa de login
    auth('NORMAL', 'CRITICO'),
    validate(avaliacaoValidation.updateAvaliacao),
    avaliacaoController.updateAvaliacao
  )
  .delete( // deleta a própria avaliação >> precisa de login
    auth('NORMAL', 'CRITICO'),
    validate(avaliacaoValidation.deleteAvaliacao),
    avaliacaoController.deleteAvaliacao
  );


router    // curte uma avaliação
  .route('/curtir')
  .post(
    auth('NORMAL', 'CRITICO'), // Precisa estar logado para curtir
    validate(avaliacaoValidation.likeAvaliacao),
    avaliacaoController.likeAvaliacao
  )
  .delete( // remover a curtida
    auth('NORMAL', 'CRITICO'),
    validate(avaliacaoValidation.unlikeAvaliacao),
    avaliacaoController.unlikeAvaliacao
  );

export default router;