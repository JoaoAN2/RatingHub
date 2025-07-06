import httpStatus from "http-status";
import pick from "../../utils/pick";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import filmeService from "./filme.service";

type IdFranquiaEdicaoType = {
  id_franquia: number;
  edicao: number;
};

const createFilme = catchAsync(async (req, res) => {
  const { titulo, sinopse, lancamento, id_franquia, edicao } = req.body;
  const filme = await filmeService.createFilme({
    titulo,
    sinopse,
    lancamento,
    id_franquia,
    edicao,
  });

  res.status(httpStatus.CREATED).send(filme);
});

const getFilmes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["titulo", "id_franquia"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortType"]);
  const result = await filmeService.queryFilmes(filter, options);
  res.send(result);
});

const getFilme = catchAsync(async (req, res) => {
  const filmePK: IdFranquiaEdicaoType = {
    id_franquia: req.params.idFranquia,
    edicao: req.params.edicao,
  };

  const filme = await filmeService.getFilmeById(filmePK);
  if (!filme) {
    throw new ApiError(httpStatus.NOT_FOUND, "Filme não encontrada");
  }
  res.send(filme);
});

const updateFilme = catchAsync(async (req, res) => {
  const filmePK: IdFranquiaEdicaoType = {
    id_franquia: req.params.idFranquia,
    edicao: req.params.edicao,
  };

  const filme = await filmeService.updateFilmeById(filmePK, req.body);
  res.send(filme);
});

const deleteFilme = catchAsync(async (req, res) => {
  const filmePK: IdFranquiaEdicaoType = {
    id_franquia: req.params.idFranquia,
    edicao: req.params.edicao,
  };

  await filmeService.deleteFilmeById(filmePK);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createFilme,
  getFilmes,
  getFilme,
  updateFilme,
  deleteFilme,
};
