import express from 'express';
import { CarController } from './car.controller';

const router = express.Router();

router.post('/', CarController.createACar);
router.get('/', CarController.getAllCars);
router.get('/:carId', CarController.getSingleCar);
router.put('/:carId', CarController.updateACar);
router.delete('/:carId', CarController.deleteACar);

export const CarRoute = router;
