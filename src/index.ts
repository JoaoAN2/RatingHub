import { Server } from 'http';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';

let server: Server;

prisma.$connect()
  .then(() => {
    logger.info('Connected to PostgreSQL');
    server = app.listen(config.port, () => {
      logger.info(`Servidor rodando na porta: ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Servidor fechado');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error('Erro inesperado:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido');
  if (server) {
    server.close();
  }
});
