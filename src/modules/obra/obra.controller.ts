import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import obraService from './obra.service';

const createObra = catchAsync(async (req, res) => {
  const { titulo, sinopse, lancamento, tipo_obra } = req.body;
  const obra = await obraService.createObra({
    titulo,
    sinopse,
    lancamento,
    tipo_obra
  });

  res.status(httpStatus.CREATED).send(obra);
});

const getObras = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['titulo', 'tipo_obra']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'sortType']);
  const result = await obraService.queryObras(filter, options);
  res.send(result);
});

const getObra = catchAsync(async (req, res) => {
  const obra = await obraService.getObraById(req.params.idObra);
  if (!obra) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Obra não encontrada');
  }
  res.send(obra);
});

const updateObra = catchAsync(async (req, res) => {
  const obra = await obraService.updateObraById(req.params.idObra, req.body);
  res.send(obra);
});

const deleteObra = catchAsync(async (req, res) => {
  await obraService.deleteObraById(req.params.idObra);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createObra,
  getObras,
  getObra,
  updateObra,
  deleteObra
};
