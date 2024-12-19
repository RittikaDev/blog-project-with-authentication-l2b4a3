import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import router from './app/routes';

import cookieParser from 'cookie-parser';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// PARSERS
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// ROUTES
app.use('/api/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Blog Project with Authentication api server!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
