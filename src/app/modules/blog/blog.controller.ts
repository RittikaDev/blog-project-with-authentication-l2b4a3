import { Request, RequestHandler, Response } from 'express';

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
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Blog created successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const userFromToken = req.user;

  if (!userFromToken || !userFromToken.userEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing.');
  }

  const user = await User.findOne({ email: userFromToken.userEmail });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found.');

  // console.log(user);

  const toUpdateBlog = {
    ...updateData,
    author: user._id,
  };

  const result = await BlogService.updateBlogIntoDB(id, toUpdateBlog);
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
  // console.log(req.params);

  const requestedUser = req.user;

  if (!requestedUser || !requestedUser.userEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing.');
  }

  const user = await User.findOne({ email: requestedUser.userEmail });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found.');

  const result = await BlogService.deleteABlogFromDB(id, user._id, user.role);

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

const getAllBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlogs(req.query);

  if (result.length > 0)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blogs fetched successfully',
      data: result,
    });
  else
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No blogs found',
      data: [],
    });
});

export const blogController = {
  createblog,
  updateBlog,
  deleteABlog,
  getAllBlogs,
};
