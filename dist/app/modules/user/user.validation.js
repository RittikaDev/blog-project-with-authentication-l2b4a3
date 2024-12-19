"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
// DEFINING THE TUser SCHEMA WITH CUSTOM ERROR MESSAGE
const CreateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        email: zod_1.z
            .string()
            .email({ message: 'Invalid email address' })
            .nonempty({ message: 'Email is required' }),
        password: zod_1.z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' })
            .nonempty({ message: 'Password is required' }),
        role: zod_1.z.enum(['admin', 'user']).optional().default('user'),
        isBlocked: zod_1.z.boolean().optional().default(false),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: ' Password is required' }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refresh token is required',
        }),
    }),
});
exports.UserValidations = {
    CreateUserValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
};
