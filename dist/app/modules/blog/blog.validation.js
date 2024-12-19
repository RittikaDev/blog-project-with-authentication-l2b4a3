"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidationSchema = void 0;
const zod_1 = require("zod");
const CreateblogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        content: zod_1.z.string().min(1, 'Content is required'),
        author: zod_1.z
            .string()
            .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), 'Invalid ObjectId format')
            .optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const updateblogValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
exports.BlogValidationSchema = {
    CreateblogValidationSchema,
    updateblogValidationSchema,
};
