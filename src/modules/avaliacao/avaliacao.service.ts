
import { Avaliacao, Usuario } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import obraService from '../obra/obra.service'; 

/**
 * Cria uma nova avaliação para uma obra.
 * @param data Os dados da avaliação.
 * @param user O usuário que está fazendo a avaliação.
 * @returns A avaliação criada.
 */
const createAvaliacao = async (
  data: Omit<Avaliacao, 'id_usuario' | 'data_hora_avaliacao' | 'id_obra_avaliada' | 'id_usuario_avaliador' >,
  user: Usuario
): Promise<Avaliacao> => {
    
  // verifica se a obra que está sendo avaliada realmente existe
  const obra = await obraService.getObraById(data.id_obra);
  if (!obra) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Obra não encontrada');
  }

  // verifica se tal usuário já não avaliou esta obra antes
  const avaliacaoExistente = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: { id_obra: data.id_obra, id_usuario: user.id_usuario } }
  });

  if (avaliacaoExistente) {
    throw new ApiError(httpStatus.CONFLICT, 'Você já avaliou esta obra.');
  }

  // Se tudo estiver certo, cria a avaliação no banco de dados
  return prisma.avaliacao.create({
    data: {
      id_obra: data.id_obra,
      nota: data.nota,
      comentario: data.comentario,
      id_usuario: user.id_usuario // pega ID do usuário que está logado
    }
  });
};

export default {
  createAvaliacao
};