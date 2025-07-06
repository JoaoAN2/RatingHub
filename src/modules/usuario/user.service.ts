import { PapelUsuarioEnum, Prisma, Usuario } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import { encryptPassword } from '../../utils/encryption';
import { IOptions, IPaginate } from '../../types/paginate';
import { paginate } from '../../utils/paginate';

const createUser = async (
  email: string,
  password: string,
  fullName: string,
  role: PapelUsuarioEnum = PapelUsuarioEnum.NORMAL,
): Promise<Usuario> => {
  const userValidateEmail = await getUserByEmail(email);
  if (userValidateEmail) throw new ApiError(httpStatus.BAD_REQUEST, 'Email já cadastrado');

  return prisma.usuario.create({
    data: {
      email,
      nome_usuario: fullName,
      senha: await encryptPassword(password),
      tipo_usuario: role,
    }
  });
};

const queryUsers = async (
  filter: Partial<Usuario>,
  options: IOptions,
  keys: (keyof Usuario)[] = [
    'id_usuario',
    'email',
    'nome_usuario',
    'tipo_usuario'
  ]
): Promise<IPaginate<Pick<Usuario, keyof Usuario>[]>> => {
  return await paginate(prisma.usuario, options, filter, keys);
};

const getUserById = async (
  id: string,
  keys: (keyof Usuario)[] = [
    'id_usuario',
    'email',
    'nome_usuario',
    'tipo_usuario'
  ]
): Promise<Pick<Usuario, keyof Usuario>> => {
  const findUniqueParams: any = {
    where: { id }
  };
  if (keys) findUniqueParams.select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {});
  const user = await prisma.usuario.findUnique(findUniqueParams);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');

  return user;
};

const getUserByEmail = async (
  email: string,
  keys: (keyof Usuario)[] = [
    'id_usuario',
    'email',
    'nome_usuario',
    'tipo_usuario'
  ]
): Promise<Pick<Usuario, keyof Usuario> | null> => {
  const findUniqueParams: any = {
    where: { email }
  };
  if (keys) findUniqueParams.select = keys.reduce((obj, k) => ({ ...obj, [k]: true }), {});
  const user = await prisma.usuario.findUnique(findUniqueParams);

  return user;
};

const updateUserById = async <Key extends keyof Usuario>(
  userId: string,
  updateBody: Prisma.UsuarioUpdateInput,
  keys: Key[] = ['id', 'email', 'username', 'role'] as Key[]
): Promise<Pick<Usuario, Key> | null> => {
  const user = await getUserById(userId, ['id_usuario', 'email']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usuário não encontrado');
  }
  if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email já está sendo utilizado');
  }
  const updatedUser = await prisma.usuario.update({
    where: { id_usuario: user.id_usuario },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<Usuario, Key> | null;
};

const deleteUserById = async (userId: string): Promise<Usuario> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.usuario.delete({ where: { id_usuario: user.id_usuario } });
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
