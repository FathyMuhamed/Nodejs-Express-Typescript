import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import errorMiddleware from './middleware/error.middleware';
import config from './config';

const PORT = config.port || 3000;

const app = express();
//middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use(
  RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many Request from this ip, please try again after an hour',
  })
);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'post',
    data: req.body,
  });
});

app.use(errorMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message:
      'Ohh you are lost, read the Api documentation to find your way back home',
  });
});

app.listen(PORT, () => {
  console.log(`I am live in ${PORT} 🚀`);
});

export default app;
