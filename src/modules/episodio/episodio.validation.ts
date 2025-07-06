import Joi from "joi";

const episodioPK = {
  id_serie: Joi.number().integer().required(),
  temporada: Joi.number().integer().min(1).required(),
  numero_episodio: Joi.number().integer().min(1).required(),
};

// Episodio validations
const createEpisodio = {
  body: Joi.object().keys({
    titulo: Joi.string().max(255).required(),
    sinopse: Joi.string().required(),
    lancamento: Joi.date().required(),
    ...episodioPK,
  }),
};

const getEpisodios = {
  query: Joi.object().keys({
    titulo: Joi.string(),
    id_franquia: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEpisodio = {
  params: Joi.object().keys({
    ...episodioPK,
  }),
};

const updateEpisodio = {
  params: Joi.object().keys({
    ...episodioPK,
  }),
  body: Joi.object()
    .keys({
      titulo: Joi.string().max(255),
      sinopse: Joi.string(),
      lancamento: Joi.date(),
      id_serie: Joi.number().integer(),
      temporada: Joi.number().integer().min(1),
      numero_episodio: Joi.number().integer().min(1),
    })
    .min(1),
};

const deleteEpisodio = {
  params: Joi.object().keys({
    ...episodioPK
  }),
};

export default {
  createEpisodio,
  getEpisodios,
  getEpisodio,
  updateEpisodio,
  deleteEpisodio,
};
