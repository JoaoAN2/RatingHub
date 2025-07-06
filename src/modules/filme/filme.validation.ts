import Joi from 'joi';

// Filme validations
const createFilme = {
  body: Joi.object().keys({
    titulo: Joi.string().max(255).required(),
    sinopse: Joi.string().required(),
    lancamento: Joi.date().required(),
    id_franquia: Joi.number().integer().required(),
    edicao: Joi.number().integer().min(1).required(),
  })
};

const getFilmes = {
  query: Joi.object().keys({
    titulo: Joi.string(),
    id_franquia: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getFilme = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required(),
    edicao: Joi.number().integer().min(1).required(),
  })
};

const updateFilme = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required(),
    edicao: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object()
    .keys({
      titulo: Joi.string().max(255),
      sinopse: Joi.string(),
      lancamento: Joi.date(),
      id_franquia: Joi.number().integer(),
      edicao: Joi.number().integer().min(1),
    })
    .min(1)
};

const deleteFilme = {
  params: Joi.object().keys({
    idFranquia: Joi.number().integer().required(),
    edicao: Joi.number().integer().min(1).required(),
  })
};

export default {
  createFilme,
  getFilmes,
  getFilme,
  updateFilme,
  deleteFilme
};
