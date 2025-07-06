import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { userValidation, userController } from '../../modules/usuario';

const router = express.Router();

router
  .route('/')
  .post(auth('NORMAL', 'GESTOR', 'CRITICO'), validate(userValidation.createUser), userController.createUser)
  .get(auth('NORMAL', 'GESTOR', 'CRITICO'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('NORMAL', 'GESTOR', 'CRITICO'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('GESTOR'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('GESTOR'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
