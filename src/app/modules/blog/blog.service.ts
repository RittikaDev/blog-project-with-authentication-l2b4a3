import { IBlog } from './blog.interface';
import { BlogModel } from './blog.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';

const createBlogIntoDB = async (payload: IBlog) => {
  // Create a new blog entry
  const blog = await BlogModel.create(payload);

  // Populate the 'author' field after creating the blog entry
  const populatedBlog = await BlogModel.findById(blog._id)
    .populate('author', ' -createdAt -updatedAt')
    .select('-isPublished -createdAt -updatedAt');

  return populatedBlog;
};

const updateBlogIntoDB = async (id: string, payload: Partial<IBlog>) => {
  const isServiceExists = await BlogModel.findById(id);
  if (!isServiceExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog is not found');
  }

  const { ...remainingServiceData } = payload;
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

const deleteABlogFromDB = async (id: string) => {
  const result = await BlogModel.deleteOne({ _id: id });
  return result;
};

export const BlogService = {
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteABlogFromDB,
};
