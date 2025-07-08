
import { Avaliacao, Usuario, CurtidaAvaliacao } from '@prisma/client';
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
  updateBody: Partial<Pick<Avaliacao, 'nota' | 'comentario'>>,
  user: Usuario
) => {
  // a chave primária da avaliação que quer ser encontrada
  const avaliacaoId = { id_obra: idObra, id_usuario: user.id_usuario };

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: avaliacaoId }
  });

  if (!avaliacao) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Você não possui uma avaliação para esta obra.');
  }

  const updatedAvaliacao = await prisma.avaliacao.update({
    where: { id_obra_id_usuario: avaliacaoId },
    data: updateBody
  });

  return updatedAvaliacao;
};

// deleta uma avaliação
const deleteAvaliacao = async (idObra: number, user: Usuario) => {
  
  const avaliacaoId = { id_obra: idObra, id_usuario: user.id_usuario };

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: avaliacaoId }
  });

  if (!avaliacao) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Você não possui uma avaliação para esta obra.');
  }

  await prisma.avaliacao.delete({
    where: { id_obra_id_usuario: avaliacaoId }
  });
};

// adiciona uma curtida a uma avaliação
const likeAvaliacao = async (
  idObraAvaliada: number,
  idUsuarioAvaliador: number,
  userCurtidor: Usuario
): Promise<CurtidaAvaliacao> => {
  // verifica se a avaliação que vai ser curtida realmente existe
  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id_obra_id_usuario: { id_obra: idObraAvaliada, id_usuario: idUsuarioAvaliador } }
  });

  if (!avaliacao) {
    throw new ApiError(httpStatus.NOT_FOUND, 'A avaliação que você tentou curtir não existe.');
  }
  
  // verifica se o usuário já não curtiu esta avaliação antes
  const curtidaExistente = await prisma.curtidaAvaliacao.findUnique({
      where: {
          id_obra_avaliada_id_usuario_avaliador_id_usuario_curtidor: {
              id_obra_avaliada: idObraAvaliada,
              id_usuario_avaliador: idUsuarioAvaliador,
              id_usuario_curtidor: userCurtidor.id_usuario
          }
      }
  });

  if (curtidaExistente) {
      throw new ApiError(httpStatus.CONFLICT, 'Você já curtiu esta avaliação.');
  }

  // se tudo estiver certo, cria o registro da curtida no banco
  return prisma.curtidaAvaliacao.create({
    data: {
      id_obra_avaliada: idObraAvaliada,
      id_usuario_avaliador: idUsuarioAvaliador,
      id_usuario_curtidor: userCurtidor.id_usuario
    }
  });
};


// remove uma curtida de uma avaliação
const unlikeAvaliacao = async (
  idObraAvaliada: number,
  idUsuarioAvaliador: number,
  userCurtidor: Usuario
): Promise<void> => {
  // a chave primária da tabela curtida_avaliacao é composta por três campos.
  const likeId = {
    id_obra_avaliada: idObraAvaliada,
    id_usuario_avaliador: idUsuarioAvaliador,
    id_usuario_curtidor: userCurtidor.id_usuario
  };

  // verifica se a curtida que será removida realmente existe.
  const curtidaExistente = await prisma.curtidaAvaliacao.findUnique({
    where: { id_obra_avaliada_id_usuario_avaliador_id_usuario_curtidor: likeId }
  });

  if (!curtidaExistente) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Você não curtiu esta avaliação para poder descurtir.');
  }

  // remove a curtida do banco de dados.
  await prisma.curtidaAvaliacao.delete({
    where: { id_obra_avaliada_id_usuario_avaliador_id_usuario_curtidor: likeId }
  });
};


// calcula a média das avaliações de uma obra, separada por normais e criticos
const getMediasByObraId = async (idObra: number) => {
  // calcula média das notas por críticos
  const mediaCriticos = await prisma.avaliacao.aggregate({
    _avg: {
      nota: true,
    },
    where: {
      id_obra: idObra,
      usuario: {
        tipo_usuario: 'CRITICO',
      },
    },
  });

  // calcula média das notas por usuários normais
  const mediaNormais = await prisma.avaliacao.aggregate({
    _avg: {
      nota: true,
    },
    where: {
      id_obra: idObra,
      usuario: {
        tipo_usuario: 'NORMAL',
      },
    },
  });

  return {
    media_normais: mediaNormais._avg.nota || 0,   // retorna a média ou 0 se nula
    media_criticos: mediaCriticos._avg.nota || 0, // retorna a média ou 0
  };
};

// retorna os elementos
export default {
  createAvaliacao,
  getAvaliacoesByObraId,
  updateAvaliacao,
  deleteAvaliacao,
  likeAvaliacao,
  unlikeAvaliacao,
  getMediasByObraId
};