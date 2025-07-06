import Joi from 'joi';

const createSerie = {
  body: Joi.object().keys({
    titulo: Joi.string().max(255).required(),
    sinopse: Joi.string().required(),
    lancamento: Joi.date().required(),
  })
};

const getSeries = {
  query: Joi.object().keys({
    titulo: Joi.string(),
    id_franquia: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getSerie = {
  params: Joi.object().keys({
    idSerie: Joi.number().integer().required(),
  })
};

const updateSerie = {
  params: Joi.object().keys({
    idSerie: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      titulo: Joi.string().max(255),
      sinopse: Joi.string(),
      lancamento: Joi.date()
    })
    .min(1)
};

const deleteSerie = {
  params: Joi.object().keys({
    idSerie: Joi.number().integer().required(),
  })
};

export default {
  createSerie,
  getSeries,
  getSerie,
  updateSerie,
  deleteSerie
};
