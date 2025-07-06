import Joi from 'joi';

// Franquia validations
const createFranquia = {
  body: Joi.object().keys({
    nome: Joi.string().max(255).required(),
  })
};

const getFranquias = {
  query: Joi.object().keys({
    nome: Joi.string().max(255),
    sortType: Joi.string().valid('asc', 'desc'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getFranquia = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required()
  })
};

const updateFranquia = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      nome: Joi.string().max(255),
    })
    .min(1)
};

const deleteFranquia = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required()
  })
};

export default {
  createFranquia,
  getFranquias,
  getFranquia,
  updateFranquia,
  deleteFranquia
};
