"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarController = void 0;
const car_service_1 = require("./car.service");
const car_validation_1 = require("./car.validation");
const zod_1 = require("zod");
const createACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { car: carData } = req.body;
        // VALIDATION USING ZOD
        const zodParsedCarData = car_validation_1.carValidationSchema.parse(carData);
        const result = yield car_service_1.CarService.createCarIntoDB(zodParsedCarData);
        res.status(200).json({
            message: 'Car created successfully',
            success: true,
            data: result,
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            // Create detailed error message for Zod validation errors
            const errorDetails = err.errors.reduce((acc, error) => {
                acc[error.path.join('.')] = {
                    message: error.message,
                    name: 'ValidatorError',
                    properties: {
                        message: error.message,
                        path: error.path.join('.'),
                    },
                };
                return acc;
            }, {});
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: {
                    name: 'ValidationError',
                    errors: errorDetails,
                },
                stack: err.stack || null,
            });
        }
        else {
            res.status(500).json({
                message: 'Car could not be created!',
                success: false,
                error: {
                    name: err instanceof Error ? err.name : 'UnknownError',
                    message: err instanceof Error ? err.message : 'An unknown error occurred',
                },
                stack: err instanceof Error ? err.stack : null,
            });
        }
    }
});
const getAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.query;
        const result = yield car_service_1.CarService.getAllCarsFromDB(searchTerm);
        if (result.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Cars retreived successfully!',
                data: result,
            });
        }
        else
            res.status(404).json({
                success: false,
                message: 'No cars found.',
                data: null,
            });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while fetching cars',
                success: false,
                error: {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                },
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred',
                success: false,
                error: {
                    name: 'UnknownError',
                    message: 'An unknown error occurred',
                    stack: 'No stack trace available',
                },
            });
        }
    }
});
const getSingleCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const result = yield car_service_1.CarService.getSingleCarFromDB(carId);
        if (result != null) {
            res.status(200).json({
                success: true,
                message: 'Single car retreived successfully!',
                data: result,
            });
        }
        else
            res.status(404).json({
                success: false,
                message: 'No cars found.',
                data: null,
            });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: 'An error occurred while fetching one single cars',
                success: false,
                error: {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                },
            });
        }
        else {
            res.status(500).json({
                message: 'An unexpected error occurred',
                success: false,
                error: {
                    name: 'UnknownError',
                    message: 'An unknown error occurred',
                    stack: 'No stack trace available',
                },
            });
        }
    }
});
const updateACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const updateData = req.body;
        // AT LEAST HAS TO BE PROVIDED
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update',
            });
        }
        const result = yield car_service_1.CarService.updateACarIntoDB(carId, updateData);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }
        else
            res.status(200).json({
                success: true,
                message: 'Car updated successfully',
                data: result,
            });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            const errorMsg = err.errors.map((error) => ({
                path: error.path.join('.'),
                errorMessage: error.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMsg,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the car',
                error: err.message || 'Unknown error',
            });
        }
    }
});
const deleteACar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const result = yield car_service_1.CarService.deleteACarFromDB(carId);
        res.status(200).json({
            success: true,
            message: 'Car deleted successfully!',
            data: result,
        });
    }
    catch (err) {
        // console.error('Error occurred:', err);
        if (err instanceof zod_1.z.ZodError) {
            const errorMsg = err.errors.map((error) => ({
                path: error.path.join('.'),
                errorMessage: error.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMsg,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the car',
                error: err.message || 'Unknown error',
            });
        }
    }
});
exports.CarController = {
    createACar,
    getAllCars,
    getSingleCar,
    updateACar,
    deleteACar,
};
