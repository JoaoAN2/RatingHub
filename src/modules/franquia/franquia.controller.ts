import httpStatus from "http-status";
import pick from "../../utils/pick";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import franquiaService from "./franquia.service";

const createFranquia = catchAsync(async (req, res) => {
  const { nome } = req.body;
  const franquia = await franquiaService.createFranquia({ nome });

  res.status(httpStatus.CREATED).send(franquia);
});

const getFranquias = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["nome"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortType"]);
  const result = await franquiaService.queryFranquias(filter, options);
  res.send(result);
});

const getFranquia = catchAsync(async (req, res) => {
  const franquia = await franquiaService.getFranquiaById(req.params.idFranquia);
  if (!franquia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Franquia não encontrada");
  }
  res.send(franquia);
});

const updateFranquia = catchAsync(async (req, res) => {
  const franquia = await franquiaService.updateFranquiaById(
    req.params.idFranquia,
    req.body
  );
  res.send(franquia);
});

const deleteFranquia = catchAsync(async (req, res) => {
  await franquiaService.deleteFranquiaById(req.params.idFranquia);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createFranquia,
  getFranquias,
  getFranquia,
  updateFranquia,
  deleteFranquia,
};
