import express from "express";
import validate from "../../middlewares/validate";
import { postController } from "../../modules/post";
import { filmeValidation } from "../../modules/filme";
import { serieValidation } from "../../modules/serie";
import { episodioValidation } from "../../modules/episodio";

const router = express.Router();

router.get(
  "/filme/:idFranquia/:edicao",
  validate(filmeValidation.getFilme),
  postController.getFilme
);

router.get(
  "/serie/:idSerie",
  validate(serieValidation.getSerie),
  postController.getSerie
);

router.get(
  "/episodio/:id_serie/:temporada/:numero_episodio",
  validate(episodioValidation.getEpisodio),
  postController.getEpisodio
);

export default router;
