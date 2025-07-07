import Joi from 'joi';

// criar uma avaliação
const createAvaliacao = {
  body: Joi.object().keys({
    id_obra: Joi.number().integer().required(),
    nota: Joi.number().integer().min(0).max(100).required().messages({
      'number.min': 'A nota deve ser no mínimo 0',
      'number.max': 'A nota deve ser no máximo 100',
      'any.required': 'O campo nota é obrigatório'
    }),
    comentario: Joi.string().max(512).required().messages({
      'string.max': 'O comentário pode ter no máximo 512 caracteres',
      'any.required': 'O campo comentário é obrigatório'
    })
  })
};

// buscar avaliações de uma obra
const getAvaliacoes = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()
  })
};

// atualizar uma avaliação
const updateAvaliacao = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()   // valida apenas o idObra
  }),
  body: Joi.object()
    .keys({
      nota: Joi.number().integer().min(0).max(100),
      comentario: Joi.string().max(512)
    })
    .min(1)     // é exigido que pelo menos um dos campos (nota ou comentario) seja enviado
};

// deletar uma avaliação
const deleteAvaliacao = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()   // só valida idObra
  })
};


// para curtir uma avaliação
const likeAvaliacao = {
  body: Joi.object().keys({
    id_obra_avaliada: Joi.number().integer().required(),
    id_usuario_avaliador: Joi.number().integer().required()
  })
};

// remove curtida de avaliação
const unlikeAvaliacao = {
  body: Joi.object().keys({
    id_obra_avaliada: Joi.number().integer().required(),
    id_usuario_avaliador: Joi.number().integer().required()
  })
};

export default {
  createAvaliacao,
  getAvaliacoes,
  updateAvaliacao,
  deleteAvaliacao,
  likeAvaliacao,
  unlikeAvaliacao
};