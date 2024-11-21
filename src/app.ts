import cors from 'cors';
import express, { Application } from 'express';
import { CarRoute } from './app/modules/car/car.route';

const app: Application = express();

// PARSERS
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api/cars', CarRoute);

export default app;
