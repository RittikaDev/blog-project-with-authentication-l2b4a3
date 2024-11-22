"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carValidationSchema = void 0;
const zod_1 = require("zod");
exports.carValidationSchema = zod_1.z.object({
    brand: zod_1.z.string().min(1, { message: 'Car Brand is required.' }),
    model: zod_1.z.string().min(1, { message: 'Car Model is required.' }),
    year: zod_1.z
        .number()
        .int()
        .gte(1886, { message: 'Year must be 1886 or later.' }) // SINCE CARS WERE INVEMTED IN 1886, CHECK LINK => https://www.thoughtco.com/who-invented-the-car-4059932#:~:text=On%20January%2029%2C%201886%2C%20Benz,manufacturer%20of%20automobiles%20by%201900.
        .lte(new Date().getFullYear(), {
        message: 'Year cannot be in the future.',
    }),
    price: zod_1.z
        .number()
        .positive({ message: 'Car Price must be a positive number.' }),
    category: zod_1.z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
        required_error: 'Car Category is required.',
    }),
    description: zod_1.z.string().min(1, { message: 'Car Description is required.' }),
    quantity: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Car Quantity cannot be negative.' }),
    inStock: zod_1.z.boolean({ required_error: 'InStock field is required.' }),
});
