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
exports.OrderService = exports.calculateTotalRevenue = void 0;
const car_model_1 = require("../car/car.model");
const order_model_1 = require("./order.model");
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECKING IF CAR EXISTS
    const car = yield car_model_1.CarModel.findById(orderData.car);
    if (!car)
        throw new Error('Car not found');
    if (car.quantity < orderData.quantity) {
        throw new Error('Insufficient stock available');
    }
    // REDUCING THE CAR QUANTITY EACH TIME AN ORDER IS PLACED
    car.quantity -= orderData.quantity;
    // IF quantity = 0 THEN, inStock WILL BE false
    if (car.quantity === 0)
        car.inStock = false;
    yield car.save(); // SAVE CAR
    const newOrder = new order_model_1.OrderModel({
        email: orderData.email,
        car: orderData.car,
        quantity: orderData.quantity,
        totalPrice: orderData.totalPrice,
    });
    yield newOrder.save(); // SAVE ORDER
    return newOrder;
});
const calculateTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    // MongoDB AGGREGATION PIPELINE
    const revenueData = yield order_model_1.OrderModel.aggregate([
        {
            $lookup: {
                from: 'cars', // REFERENCE TO 'CARS' COLLECTION
                localField: 'car', // FIELD OF THE ORDER COLLECTION THAT IS REFERENCING THE CAR COLLECTION
                foreignField: '_id',
                as: 'carDetails',
            },
        },
        {
            $unwind: '$carDetails', // EXPECTING ONLY ONE MATCH, THAT'S WHY $unwind
        },
        {
            $match: {
                'carDetails.quantity': { $gt: 0 }, // CAR QUANTITY HAS TO BE MORE THAT 0
            },
        },
        {
            $project: {
                totalRevenue: {
                    $multiply: ['$quantity', '$carDetails.price'],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalRevenue' },
            },
        },
    ]);
    return revenueData[0] ? revenueData[0].totalRevenue : 0;
});
exports.calculateTotalRevenue = calculateTotalRevenue;
exports.OrderService = {
    createOrder,
    calculateTotalRevenue: exports.calculateTotalRevenue,
};
