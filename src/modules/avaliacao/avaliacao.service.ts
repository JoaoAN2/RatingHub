
import { Avaliacao, Usuario } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import obraService from '../obra/obra.service'; 


// cria uma nova avaliação para uma obra
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


// busca todas as avaliações de uma obra específica.
const getAvaliacoesByObraId = async (idObra: number) => {
  const avaliacoes = await prisma.avaliacao.findMany({
    where: { id_obra: idObra },
    include: {
      usuario: { // inclui nome do usuário que fez a avaliação
        select: {
          nome_usuario: true
        }
      },
      _count: { // conta quantas curtidas a avaliação tem
        select: {
          curtida_avaliacao: true
        }
      }
    },
    orderBy: {
      data_hora_avaliacao: 'desc'     // mostra as avaliacoes mais recentes primeiro
    }
  });
  return avaliacoes;
};


// atualiza uma avaliação existente.
const updateAvaliacao = async (
  idObra: number,
  idUsuario: number,
  updateBody: Partial<Pick<Avaliacao, 'nota' | 'comentario'>>,
  user: Usuario
) => {
  // verificação de autenticidade do usuário
  if (idUsuario !== user.id_usuario) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para editar a avaliação de outra pessoa.');
  }

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: { id_obra: idObra, id_usuario: idUsuario } }
  });

  if (!avaliacao) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Avaliação não encontrada.');
  }

  const updatedAvaliacao = await prisma.avaliacao.update({
    where: { id_obra_id_usuario: { id_obra: idObra, id_usuario: idUsuario } },
    data: updateBody
  });

  return updatedAvaliacao;
};


// deleta uma avaliação
const deleteAvaliacao = async (idObra: number, idUsuario: number, user: Usuario) => {
  // verificação de autenticidade de usuário
  if (idUsuario !== user.id_usuario) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Você não tem permissão para deletar a avaliação de outra pessoa.');
  }

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: { id_obra: idObra, id_usuario: idUsuario } }
  });

  if (!avaliacao) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Avaliação não encontrada.');
  }

  await prisma.avaliacao.delete({
    where: { id_obra_id_usuario: { id_obra: idObra, id_usuario: idUsuario } }
  });
};

// retorna os elementos
export default {
  createAvaliacao,
  getAvaliacoesByObraId,
  updateAvaliacao,
  deleteAvaliacao
};