import { TiposObraEnum } from '@prisma/client';
import Joi from 'joi';

// Obra validations
const createObra = {
  body: Joi.object().keys({
    titulo: Joi.string().max(255).required(),
    sinopse: Joi.string().required(),
    lancamento: Joi.date().required(),
    tipo_obra: Joi.string().valid(
      TiposObraEnum.FILME,
      TiposObraEnum.SERIE,
      TiposObraEnum.EPISODIO
    ).required()
  })
};

const getObras = {
  query: Joi.object().keys({
    titulo: Joi.string(),
    tipo_obra: Joi.string().valid(
      TiposObraEnum.FILME,
      TiposObraEnum.SERIE,
      TiposObraEnum.EPISODIO
    ),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getObra = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()
  })
};

const updateObra = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()
  }),
  body: Joi.object()
    .keys({
      titulo: Joi.string().max(255),
      sinopse: Joi.string(),
      lancamento: Joi.date(),
      tipo_obra: Joi.string().valid(
        TiposObraEnum.FILME,
        TiposObraEnum.SERIE,
        TiposObraEnum.EPISODIO
      )
    })
    .min(1)
};

const deleteObra = {
  params: Joi.object().keys({
    idObra: Joi.number().integer().required()
  })
};

export default {
  createObra,
  getObras,
  getObra,
  updateObra,
  deleteObra
};
