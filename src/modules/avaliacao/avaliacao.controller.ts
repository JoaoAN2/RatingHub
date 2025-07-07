
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import avaliacaoService from './avaliacao.service';
import ApiError from '../../utils/ApiError'; 


// controller para criar avaliação
const createAvaliacao = catchAsync(async (req, res) => {
  
  const user = req.user;

  // se o usuário não estiver presente, retorna erro.
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para realizar esta ação.');
  }

  const avaliacao = await avaliacaoService.createAvaliacao(req.body, user);
  res.status(httpStatus.CREATED).send(avaliacao);
});

// controller para buscar avaliações de uma obra
const getAvaliacoesByObraId = catchAsync(async (req, res) => {
  const avaliacoes = await avaliacaoService.getAvaliacoesByObraId(Number(req.params.idObra));
  res.send(avaliacoes);
});

// controller para atualizar uma avaliação
const updateAvaliacao = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para realizar esta ação.');
  }
  const avaliacao = await avaliacaoService.updateAvaliacao(
    Number(req.params.idObra),
    Number(req.params.idUsuario),
    req.body,
    user
  );
  res.send(avaliacao);
});

// controller para deletar uma avaliação
const deleteAvaliacao = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para realizar esta ação.');
  }
  await avaliacaoService.deleteAvaliacao(Number(req.params.idObra), Number(req.params.idUsuario), user);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createAvaliacao,
  getAvaliacoesByObraId,
  updateAvaliacao,
  deleteAvaliacao
};