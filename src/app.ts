import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import httpStatus from 'http-status';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import logger from './config/logger';
import config from './config/config';

const app = express();

// Morgan HTTP request logging
if (config.env !== 'test') {
  const morganFormat = config.env === 'development' ? 'dev' : 'combined';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        },
      },
    })
  );
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.use('/v1', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
