import httpStatus from "http-status";
import pick from "../../utils/pick";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import serieService from "./serie.service";

const createSerie = catchAsync(async (req, res) => {
  const { titulo, sinopse, lancamento } = req.body;
  const serie = await serieService.createSerie({
    titulo,
    sinopse,
    lancamento
  });

  res.status(httpStatus.CREATED).send(serie);
});

const getSeries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["titulo", "id_franquia"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortType"]);
  const result = await serieService.querySeries(filter, options);

  res.send(result);
});

const getSerie = catchAsync(async (req, res) => {
  const idSerie: number = parseInt(req.params.idSerie, 10);

  const serie = await serieService.getSerieById(idSerie);
  if (!serie) {
    throw new ApiError(httpStatus.NOT_FOUND, "Serie não encontrada");
  }

  res.send(serie);
});

const updateSerie = catchAsync(async (req, res) => {
  const idSerie: number = parseInt(req.params.idSerie, 10);
  const serie = await serieService.updateSerieById(idSerie, req.body);

  res.send(serie);
});

const deleteSerie = catchAsync(async (req, res) => {
  const idSerie: number = parseInt(req.params.idSerie, 10);

  await serieService.deleteSerieById(idSerie);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createSerie,
  getSeries,
  getSerie,
  updateSerie,
  deleteSerie,
};
