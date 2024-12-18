import { Request, Response } from 'express';

import { CarService } from './car.service';

import httpStatus from 'http-status-codes';

// import { CarValidationSchema } from './car.validation';

// import { z } from 'zod';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// type ValidationErrorDetail = {
//   message: string;
//   name: string;
//   properties: {
//     message: string;
//     path: string;
//   };
// };

const createACar = catchAsync(async (req: Request, res: Response) => {
  // VALIDATION USING ZOD
  // const zodParsedCarData =
  //   CarValidationSchema.createCarValidationSchema.parse(req.body);

  const result = await CarService.createCarIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car created successfully',
    data: result,
  });

  // res.status(200).json({
  //   message: 'Car created successfully',
  //   success: true,
  //   data: result,
  // });
});
//------------------------ BEFORE -----------------------------
// catch (err: unknown) {
//     if (err instanceof z.ZodError) {
//       // Create detailed error message for Zod validation errors
//       const errorDetails = err.errors.reduce(
//         (acc, error) => {
//           acc[error.path.join('.')] = {
//             message: error.message,
//             name: 'ValidatorError',
//             properties: {
//               message: error.message,
//               path: error.path.join('.'),
//             },
//           };
//           return acc;
//         },
//         {} as Record<string, ValidationErrorDetail>,
//       );

//       res.status(400).json({
//         message: 'Validation failed',
//         success: false,
//         error: {
//           name: 'ValidationError',
//           errors: errorDetails,
//         },
//         stack: err.stack || null,
//       });
//     } else {
//       res.status(500).json({
//         message: 'Car could not be created!',
//         success: false,
//         error: {
//           name: err instanceof Error ? err.name : 'UnknownError',
//           message:
//             err instanceof Error ? err.message : 'An unknown error occurred',
//         },
//         stack: err instanceof Error ? err.stack : null,
//       });
//     }
//   }
// };

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const result = await CarService.getAllCarsFromDB(searchTerm as string);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cars retrieved successfully',
      data: result,
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
});

const getSingleCar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarService.getSingleCarFromDB(carId);

  if (result != null) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car retrieved successfully',
      data: result,
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
});

const updateACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const updateData = req.body;

  // AT LEAST HAS TO BE PROVIDED
  if (Object.keys(updateData).length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'At least one field must be provided for update',
      data: [],
    });
    return;
  } else if (!updateData.price || !updateData.quantity) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Price and quantity must be provided',
      data: [],
    });
    return;
  }

  const result = await CarService.updateACarIntoDB(carId, updateData);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Car not found',
      data: [],
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car updated successfully',
      data: result,
    });
});

const deleteACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await CarService.deleteACarFromDB(carId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car deleted successfully',
    data: result,
  });
});

// ----------------------- BEFORE -----------------------------
// const getAllCars = async (req: Request, res: Response) => {
//   try {
//     const { searchTerm } = req.query;
//     const result = await CarService.getAllCarsFromDB(searchTerm as string);

//     if (result.length > 0) {
//       res.status(200).json({
//         message: 'Cars retrieved successfully',
//         status: true,
//         data: result,
//       });
//     } else
//       res.status(404).json({
//         success: false,
//         message: 'No cars found.',
//         data: null,
//       });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({
//         message: 'An error occurred while fetching cars',
//         success: false,
//         error: {
//           name: err.name,
//           message: err.message,
//           stack: err.stack,
//         },
//       });
//     } else {
//       res.status(500).json({
//         message: 'An unexpected error occurred',
//         success: false,
//         error: {
//           name: 'UnknownError',
//           message: 'An unknown error occurred',
//           stack: 'No stack trace available',
//         },
//       });
//     }
//   }
// };

// const getSingleCar = async (req: Request, res: Response) => {
//   try {
//     const { carId } = req.params;
//     const result = await CarService.getSingleCarFromDB(carId);

//     if (result != null) {
//       res.status(200).json({
//         message: 'Car retrieved successfully',
//         status: true,
//         data: result,
//       });
//     } else
//       res.status(404).json({
//         success: false,
//         message: 'No cars found.',
//         data: null,
//       });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(404).json({
//         success: false,
//         message: 'Car not found',
//       });
//     } else {
//       res.status(500).json({
//         message: 'An unexpected error occurred',
//         success: false,
//         error: {
//           name: 'UnknownError',
//           message: 'An unknown error occurred',
//           stack: 'No stack trace available',
//         },
//       });
//     }
//   }
// };

// const updateACar = async (req: Request, res: Response) => {
//   try {
//     const { carId } = req.params;
//     const updateData = req.body;

//     // AT LEAST HAS TO BE PROVIDED
//     if (Object.keys(updateData).length === 0) {
//       res.status(400).json({
//         success: false,
//         message: 'At least one field must be provided for update',
//       });
//       return;
//     } else if (!updateData.price || !updateData.quantity) {
//       res.status(400).json({
//         success: false,
//         message: 'Price and quantity must be provided',
//       });
//       return;
//     }

//     const result = await CarService.updateACarIntoDB(carId, updateData);

//     if (!result) {
//       res.status(404).json({
//         success: false,
//         message: 'Car not found',
//       });
//     } else
//       res.status(200).json({
//         message: 'Car updated successfully',
//         status: true,
//         data: result,
//       });
//   } catch (err: unknown) {
//     if (err instanceof z.ZodError) {
//       const errorMsg = err.errors.map((error) => ({
//         path: error.path.join('.'),
//         errorMessage: error.message,
//       }));

//       res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errorMsg,
//       });
//     } else if (err instanceof Error) {
//       res.status(404).json({
//         success: false,
//         message: 'Car not found',
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while updating the car',
//         error: (err as Error).message || 'Unknown error',
//       });
//     }
//   }
// };

// const deleteACar = async (req: Request, res: Response) => {
//   try {
//     const { carId } = req.params;
//     await CarService.deleteACarFromDB(carId);
//     res.status(200).json({
//       message: 'Car deleted successfully',
//       status: true,
//       data: {},
//     });
//   } catch (err: unknown) {
//     // console.error('Error occurred:', err);

//     if (err instanceof z.ZodError) {
//       const errorMsg = err.errors.map((error) => ({
//         path: error.path.join('.'),
//         errorMessage: error.message,
//       }));

//       res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errorMsg,
//       });
//     } else if (err instanceof Error) {
//       res.status(404).json({
//         success: false,
//         message: 'Car not found',
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while deleting the car',
//         error: (err as Error).message || 'Unknown error',
//       });
//     }
//   }
// };

export const CarController = {
  createACar,
  getAllCars,
  getSingleCar,
  updateACar,
  deleteACar,
};
