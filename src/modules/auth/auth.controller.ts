import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import authService from './auth.service';
import { userService } from '../usuario';
import { tokenService } from '../token';
import exclude from '../../utils/exclude';
import { Usuario } from '@prisma/client';

const register = catchAsync(async (req, res) => {
  const { email, password, fullName, role } = req.body;
  const user = await userService.createUser(email, password, fullName, role);
  const userWithoutPassword = exclude(user, ['senha']);
  const tokens = await tokenService.generateAuthTokens({ id: user.id_usuario });
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const tokens = await tokenService.generateAuthTokens({ id: user.id_usuario });
  res.send({ user, tokens });
});


export default {
  register,
  login
};
