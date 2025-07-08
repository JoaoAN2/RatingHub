import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import { filmeService } from "../filme";
import { avaliacaoService } from "../avaliacao";
import { serieService } from "../serie";
import { episodioService } from "../episodio";

const getFilme = catchAsync(async (req, res) => {
  const { idFranquia, edicao } = req.params;
  const filme = await filmeService.getFilmeById({
    id_franquia: idFranquia,
    edicao,
  });

  if (!filme) {
    throw new ApiError(httpStatus.NOT_FOUND, "Filme não encontrado");
  }

  const medias = await avaliacaoService.getMediasByObraId(filme.id_obra);

  res.send({ ...filme, medias });
});

const getSerie = catchAsync(async (req, res) => {
  const { idSerie } = req.params;
  const serie = await serieService.getSerieById(idSerie);

  if (!serie) {
    throw new ApiError(httpStatus.NOT_FOUND, "Série não encontrada");
  }

  const medias = await avaliacaoService.getMediasByObraId(serie.id_obra);

  res.send({ ...serie, medias });
});

const getEpisodio = catchAsync(async (req, res) => {
  const { id_serie, temporada, numero_episodio } = req.params;
  const episodio = await episodioService.getEpisodioById({
    id_serie: id_serie,
    temporada: parseInt(temporada),
    numero_episodio: parseInt(numero_episodio),
  });

  if (!episodio) {
    throw new ApiError(httpStatus.NOT_FOUND, "Episódio não encontrado");
  }

  const medias = await avaliacaoService.getMediasByObraId(episodio.id_obra);
  
  res.send({ ...episodio, medias });
});

export default {
  getFilme,
  getSerie,
  getEpisodio
};
