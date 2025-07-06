import httpStatus from "http-status";
import userService from "../usuario/user.service";
import ApiError from "../../utils/ApiError";
import { Usuario } from "@prisma/client";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import exclude from "../../utils/exclude";

const login = async (
  email: string,
  password: string
): Promise<Omit<Usuario, "senha">> => {
  const user = await userService.getUserByEmail(email, ["id_usuario", "email", "nome_usuario", "tipo_usuario", "senha"]);
  if (!user || !(await isPasswordMatch(password, user.senha as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email ou senha inválidos");
  }

  return exclude(user, ["senha"]);
};

export default {
  login,
  isPasswordMatch,
  encryptPassword,
};
