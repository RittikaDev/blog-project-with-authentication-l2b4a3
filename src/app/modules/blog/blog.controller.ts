import { Request, Response } from 'express';

// import { blogValidationSchema } from './blog.validation';
import { BlogService } from './blog.service';

// import { z } from 'zod';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status-codes';

const createblog = catchAsync(async (req: Request, res: Response) => {
  const author = req.user;
  console.log(author);
  const { title, content } = req.body;

  const blog = await BlogService.createblog({ title, content }, author?._id);

  sendResponse(res, {
    success: true,
    message: 'Blog created successfully',
    statusCode: httpStatus.CREATED,
    data: blog,
  });
});

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const totalRevenue = await BlogService.calculateTotalRevenue();

  if (totalRevenue === 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: 'Revenue is 0, no sales recorded.',
      data: [],
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: 'Revenue calculated successfully',
      data: {
        totalRevenue: totalRevenue,
      },
    });
});

// ----------------------------- BEFORE -------------------------------------------
// const createblog = async (req: Request, res: Response) => {
//   try {
//     // VALIDATION USING ZOD
//     // const zodblogData = blogValidationSchema.CreateblogValidationSchema.parse(req.body);

//     const blog = await BlogService.createblog(req.body);

//     res.status(201).json({
//       message: 'blog created successfully',
//       status: true,
//       data: blog,
//     });
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
//         message: 'An unexpected error occurred',
//       });
//     }
//   }
// };

// const getRevenue = async (req: Request, res: Response) => {
//   try {
//     const totalRevenue = await BlogService.calculateTotalRevenue();

//     // console.log(totalRevenue);

//     if (totalRevenue === 0) {
//       res.status(200).json({
//         message: 'Revenue is 0, no sales recorded.',
//         status: true,
//         data: {
//           totalRevenue: totalRevenue,
//         },
//       });
//     } else
//       res.status(200).json({
//         message: 'Revenue calculated successfully',
//         status: true,
//         data: {
//           totalRevenue: totalRevenue,
//         },
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
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while calculating the total revenue',
//         error: (err as Error).message || 'Unknown error',
//       });
//     }
//   }
// };

export const blogController = {
  createblog,
  getRevenue,
};
