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
exports.OrderController = void 0;
const order_validation_1 = require("./order.validation");
const order_service_1 = require("./order.service");
const zod_1 = require("zod");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // VALIDATION USING ZOD
        const zodOrderData = order_validation_1.orderValidationSchema.parse(req.body);
        const order = yield order_service_1.OrderService.createOrder(zodOrderData);
        res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: order,
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
                message: 'An error occurred while creating the order',
                error: err.message || 'Unknown error',
            });
        }
    }
});
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield order_service_1.OrderService.calculateTotalRevenue();
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
exports.OrderController = {
    createOrder,
    getRevenue,
};
