import { Request, Response } from 'express';

import { CarService } from './car.service';
import { carValidationSchema } from './car.validation';

import { z } from 'zod';

type ValidationErrorDetail = {
  message: string;
  name: string;
  properties: {
    message: string;
    path: string;
  };
};

const createACar = async (req: Request, res: Response) => {
  try {
    const { car: carData } = req.body;

    // VALIDATION USING ZOD
    const zodParsedCarData = carValidationSchema.parse(carData);

    const result = await CarService.createCarIntoDB(zodParsedCarData);

    res.status(200).json({
      message: 'Car created successfully',
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      // Create detailed error message for Zod validation errors
      const errorDetails = err.errors.reduce(
        (acc, error) => {
          acc[error.path.join('.')] = {
            message: error.message,
            name: 'ValidatorError',
            properties: {
              message: error.message,
              path: error.path.join('.'),
            },
          };
          return acc;
        },
        {} as Record<string, ValidationErrorDetail>,
      );

      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: 'ValidationError',
          errors: errorDetails,
        },
        stack: err.stack || null,
      });
    } else {
      res.status(500).json({
        message: 'Car could not be created!',
        success: false,
        error: {
          name: err instanceof Error ? err.name : 'UnknownError',
          message:
            err instanceof Error ? err.message : 'An unknown error occurred',
        },
        stack: err instanceof Error ? err.stack : null,
      });
    }
  }
};

const getAllCars = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const result = await CarService.getAllCarsFromDB(searchTerm as string);

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Cars retreived successfully!',
        data: result,
      });
    } else
      res.status(404).json({
        success: false,
        message: 'No cars found.',
        data: null,
      });
  } catch (err: unknown) {
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
    } else {
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
};

const getSingleCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const result = await CarService.getSingleCarFromDB(carId);

    if (result != null) {
      res.status(200).json({
        success: true,
        message: 'Single car retreived successfully!',
        data: result,
      });
    } else
      res.status(404).json({
        success: false,
        message: 'No cars found.',
        data: null,
      });
  } catch (err: unknown) {
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
    } else {
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
};

const updateACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const { price, quantity } = req.body;

    if (!price && !quantity) {
      res.status(400).json({
        success: false,
        message:
          'At least one field (price or quantity) is required for update',
      });
    }

    const updateCarData = { price, quantity };

    const result = await CarService.updateACarIntoDB(carId, updateCarData);

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: result,
    });
  } catch (err: unknown) {
    // console.error('Error occurred:', err);

    if (err instanceof z.ZodError) {
      const errorMsg = err.errors.map((error) => ({
        path: error.path.join('.'),
        errorMessage: error.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMsg,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the car',
        error: (err as Error).message || 'Unknown error',
      });
    }
  }
};

const deleteACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const result = await CarService.deleteACarFromDB(carId);
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully!',
      data: result,
    });
  } catch (err: unknown) {
    // console.error('Error occurred:', err);

    if (err instanceof z.ZodError) {
      const errorMsg = err.errors.map((error) => ({
        path: error.path.join('.'),
        errorMessage: error.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMsg,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the car',
        error: (err as Error).message || 'Unknown error',
      });
    }
  }
};

export const CarController = {
  createACar,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteACar,
};
