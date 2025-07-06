import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { Usuario, PapelUsuarioEnum } from '@prisma/client';
import prisma from '../client';
import config from '../config/config';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: Usuario;
    }
  }
}

const verifyToken = async (token: string): Promise<Usuario> => {
  try {
    const payload = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload;

    console.log(payload);

    const userId = payload.sub as string;
    
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: parseInt(userId) }
    });
    
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token refers to user that no longer exists');
    }
    
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

const auth =
  (...requiredRoles: PapelUsuarioEnum[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }
      
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      const user = await verifyToken(token);
      
      req.user = user;
      
      if (requiredRoles.length > 0) {
        const userRole = user.tipo_usuario || PapelUsuarioEnum.NORMAL;
        
        if (!requiredRoles.includes(userRole)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions');
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
