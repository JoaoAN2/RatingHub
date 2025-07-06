import Joi from 'joi';

export const password: Joi.CustomValidator<string> = (value, helpers) => {
  if (value.length < 8) {
    return helpers.error('Senha deve ter pelo menos 8 caracteres');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error('Senha deve conter pelo menos um número e uma letra');
  }
  return value;
};
