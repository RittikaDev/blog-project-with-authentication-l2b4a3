"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const blog_validation_1 = require("./blog.validation");
const blog_service_1 = require("./blog.service");
const zod_1 = require("zod");
const createblog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // VALIDATION USING ZOD
        const zodblogData = blog_validation_1.blogValidationSchema.parse(req.body);
        const blog = yield blog_service_1.blogService.createblog(zodblogData);
        res.status(201).json({
            message: 'blog created successfully',
            status: true,
            data: blog,
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            const errorMsg = err.errors.map((error) => ({
                path: error.path.join('.'),
                errorMessage: error.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMsg,
            });
        }
        else if (err instanceof Error) {
            res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An unexpected error occurred',
            });
        }
    }
});
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield blog_service_1.blogService.calculateTotalRevenue();
        // console.log(totalRevenue);
        if (totalRevenue === 0) {
            res.status(200).json({
                message: 'Revenue is 0, no sales recorded.',
                status: true,
                data: {
                    totalRevenue: totalRevenue,
                },
            });
        }
        else
            res.status(200).json({
                message: 'Revenue calculated successfully',
                status: true,
                data: {
                    totalRevenue: totalRevenue,
                },
            });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            const errorMsg = err.errors.map((error) => ({
                path: error.path.join('.'),
                errorMessage: error.message,
            }));
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMsg,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while calculating the total revenue',
                error: err.message || 'Unknown error',
            });
        }
    }
});
exports.blogController = {
    createblog,
    getRevenue,
};
