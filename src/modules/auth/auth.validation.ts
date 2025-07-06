import Joi from "joi";
import { PapelUsuarioEnum } from "@prisma/client";
import { password } from "../validations";

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().max(128).required(),
    password: Joi.string().max(512).required().custom(password),
    email: Joi.string().email().max(128).required(),
    role: Joi.string().valid(
      PapelUsuarioEnum.CRITICO,
      PapelUsuarioEnum.NORMAL,
      PapelUsuarioEnum.GESTOR
    ),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login
};
