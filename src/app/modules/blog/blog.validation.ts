import { z } from 'zod';

const CreateblogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    author: z
      .string()
      .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), 'Invalid ObjectId format')
      .optional(),
    isPublished: z.boolean().optional(),
  }),
});

const updateblogValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const BlogValidationSchema = {
  CreateblogValidationSchema,
  updateblogValidationSchema,
};
