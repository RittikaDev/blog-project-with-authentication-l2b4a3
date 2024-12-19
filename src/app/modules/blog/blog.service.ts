import { IBlog } from './blog.interface';
import { BlogModel } from './blog.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constant';

const createBlogIntoDB = async (payload: IBlog) => {
  const blog = await BlogModel.create(payload);

  const populatedBlog = await BlogModel.findById(blog._id)
    .populate('author', ' -createdAt -updatedAt')
    .select('-isPublished -createdAt -updatedAt');

  return populatedBlog;
};

const updateBlogIntoDB = async (id: string, payload: Partial<IBlog>) => {
  const { author, ...remainingServiceData } = payload;
  // console.log(payload);

  const isBlogExists = await BlogModel.findById(id);
  if (!isBlogExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog is not found');
  }
  // console.log(isBlogExists.author, author);

  if (isBlogExists.author !== author)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this blog',
    );

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingServiceData,
  };

  const result = await BlogModel.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  })
    .populate('author', ' -createdAt -updatedAt')
    .select('-isPublished -createdAt -updatedAt');

  return result;
};

const deleteABlogFromDB = async (
  id: string,
  userID: Types.ObjectId,
  userRole: string,
) => {
  const isBlogExists = await BlogModel.findById(id);
  if (!isBlogExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog is not found');
  }

  if (userRole == USER_ROLE.user && isBlogExists.author !== userID)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this blog',
    );

  const result = await BlogModel.deleteOne({ _id: id });
  return result;
};

const getAllBlogs = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    BlogModel.find()
      .populate('author', '-__v -createdAt -updatedAt')
      .select('-isPublished -createdAt -updatedAt'),
    query,
  );

  const blogQuery = queryBuilder
    .search(['title', 'content'])
    .filter()
    .sort()
    .paginate();

  const result = await blogQuery.modelQuery;
  return result;
};

export const BlogService = {
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteABlogFromDB,
  getAllBlogs,
};
