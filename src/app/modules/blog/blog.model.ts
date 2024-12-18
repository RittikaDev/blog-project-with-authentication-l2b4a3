import { Schema, Types, model } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false, // Exclude __v field
  },
);

export const BlogModel = model<IBlog>('blog', blogSchema);
