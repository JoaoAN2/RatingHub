
import Joi from 'joi';

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

export default {
  createAvaliacao
};