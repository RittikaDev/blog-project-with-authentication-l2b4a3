"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRoute = void 0;
const express_1 = __importDefault(require("express"));
const car_controller_1 = require("./car.controller");
const router = express_1.default.Router();
router.post('/', car_controller_1.CarController.createACar);
router.get('/', car_controller_1.CarController.getAllCars);
router.get('/:carId', car_controller_1.CarController.getSingleCar);
router.put('/:carId', car_controller_1.CarController.updateACar);
router.delete('/:carId', car_controller_1.CarController.deleteACar);
exports.CarRoute = router;
