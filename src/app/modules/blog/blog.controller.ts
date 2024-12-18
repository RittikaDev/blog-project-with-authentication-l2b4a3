import { Request, Response } from 'express';

// import { blogValidationSchema } from './blog.validation';
import { BlogService } from './blog.service';

// import { z } from 'zod';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const createblog = catchAsync(async (req: Request, res: Response) => {
  const author = req.user;
  // console.log(author);
  const blogData = req.body;

  if (!author || !author.userEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing.');
  }

  const user = await User.findOne({ email: author.userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }
  // console.log(user);

  const blogPayload = {
    title: blogData.title,
    content: blogData.content,
    author: user._id,
    isPublished: true,
  };

  // Check if the title and content are provided
  if (!blogData.title || !blogData.content) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Title and content are required.',
    );
  }

  const result = await BlogService.createBlogIntoDB(blogPayload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await BlogService.updateBlogIntoDB(id, updateData);
  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteABlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.params);
  const result = await BlogService.deleteABlogFromDB(id);

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    message: 'Blog deleted successfully',
    statusCode: 200,
  });
});

export const blogController = {
  createblog,
  updateBlog,
  deleteABlog,
};
