
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
  await avaliacaoService.deleteAvaliacao(Number(req.params.idObra), user);
  res.status(httpStatus.NO_CONTENT).send();
});


// controller para curtir uma avaliação
const likeAvaliacao = catchAsync(async (req, res) => {
  const userCurtidor = req.user;
  if (!userCurtidor) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para curtir.');
  }

  const { id_obra_avaliada, id_usuario_avaliador } = req.body;

  const curtida = await avaliacaoService.likeAvaliacao(id_obra_avaliada, id_usuario_avaliador, userCurtidor);
  res.status(httpStatus.CREATED).send(curtida);
});

// controller para descurtir uma avaliação
const unlikeAvaliacao = catchAsync(async (req, res) => {
  const userCurtidor = req.user;
  if (!userCurtidor) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para descurtir.');
  }
  const { id_obra_avaliada, id_usuario_avaliador } = req.body;
  await avaliacaoService.unlikeAvaliacao(id_obra_avaliada, id_usuario_avaliador, userCurtidor);
  res.status(httpStatus.NO_CONTENT).send(); // Sucesso sem conteúdo
});

export default {
  createAvaliacao,
  getAvaliacoesByObraId,
  updateAvaliacao,
  deleteAvaliacao,
  likeAvaliacao,
  unlikeAvaliacao
};