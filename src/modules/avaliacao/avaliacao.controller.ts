
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import avaliacaoService from './avaliacao.service';
import ApiError from '../../utils/ApiError'; 

const createAvaliacao = catchAsync(async (req, res) => {
  
  const user = req.user;

  // se o usuário não estiver presente, retorna erro.
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'A autenticação é necessária para realizar esta ação.');
  }

  const avaliacao = await avaliacaoService.createAvaliacao(req.body, user);
  res.status(httpStatus.CREATED).send(avaliacao);
});

export default {
  createAvaliacao
};