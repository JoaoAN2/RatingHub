import httpStatus from "http-status";
import pick from "../../utils/pick";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import episodioService from "./episodio.service";

type EpisodioPKType = {
  id_serie: number;
  temporada: number;
  numero_episodio: number;
};

const createEpisodio = catchAsync(async (req, res) => {
  const { titulo, sinopse, lancamento, id_serie, temporada, numero_episodio } = req.body;
  const episodio = await episodioService.createEpisodio({
    titulo,
    sinopse,
    lancamento,
    id_serie,
    temporada,
    numero_episodio
  });

  res.status(httpStatus.CREATED).send(episodio);
});

const getEpisodios = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["numero_episodio", "temporada", "id_serie", "titulo"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortType"]);
  const result = await episodioService.queryEpisodios(filter, options);
  res.send(result);
});

const getEpisodio = catchAsync(async (req, res) => {
  const episodioPK: EpisodioPKType = {
    id_serie: parseInt(req.params.id_serie),
    temporada: parseInt(req.params.temporada),
    numero_episodio: parseInt(req.params.numero_episodio),
  };

  const episodio = await episodioService.getEpisodioById(episodioPK);
  if (!episodio) {
    throw new ApiError(httpStatus.NOT_FOUND, "Episodio não encontrada");
  }
  res.send(episodio);
});

const updateEpisodio = catchAsync(async (req, res) => {
  const episodioPK: EpisodioPKType = {
    id_serie: parseInt(req.params.id_serie),
    temporada: parseInt(req.params.temporada),
    numero_episodio: parseInt(req.params.numero_episodio),
  };

  const episodio = await episodioService.updateEpisodioById(episodioPK, req.body);
  res.send(episodio);
});

const deleteEpisodio = catchAsync(async (req, res) => {
  const episodioPK: EpisodioPKType = {
    id_serie: parseInt(req.params.id_serie),
    temporada: parseInt(req.params.temporada),
    numero_episodio: parseInt(req.params.numero_episodio),
  };

  await episodioService.deleteEpisodioById(episodioPK);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createEpisodio,
  getEpisodios,
  getEpisodio,
  updateEpisodio,
  deleteEpisodio,
};
