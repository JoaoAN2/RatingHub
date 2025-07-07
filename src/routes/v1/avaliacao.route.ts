import express from "express";
import auth from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import {
  avaliacaoController,
  avaliacaoValidation,
} from "../../modules/avaliacao"; // importado de um unico lugar para evitar inconsistências

const router = express.Router();

router.route("/").post(
  auth("NORMAL", "CRITICO"), // Apenas usuários logados (NORMAL ou CRITICO) podem postar
  validate(avaliacaoValidation.createAvaliacao),
  avaliacaoController.createAvaliacao
);

router // lê todas as avaliações de uma obra específica
  .route("/obra/:idObra")
  .get(
    validate(avaliacaoValidation.getAvaliacoes),
    avaliacaoController.getAvaliacoesByObraId
  );

router // atualiza e deleta avaliação especifica >> rota identifica avaliação pela combinação de obra e usuário
  .route("/obra/:idObra/usuario/:idUsuario")
  .patch(
    auth("NORMAL", "CRITICO"), // autenticação necessaria
    validate(avaliacaoValidation.updateAvaliacao),
    avaliacaoController.updateAvaliacao
  )
  .delete(
    auth("NORMAL", "CRITICO"), // autenticação necessaria
    validate(avaliacaoValidation.deleteAvaliacao),
    avaliacaoController.deleteAvaliacao
  );

router // curte uma avaliação
  .route("/curtir")
  .post(
    auth("NORMAL", "CRITICO"), // Precisa estar logado para curtir
    validate(avaliacaoValidation.likeAvaliacao),
    avaliacaoController.likeAvaliacao
  );

export default router;
