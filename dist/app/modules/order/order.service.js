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
exports.blogService = exports.calculateTotalRevenue = void 0;
const car_model_1 = require("../car/car.model");
const blog_model_1 = require("./blog.model");
const createblog = (blogData) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECKING IF CAR EXISTS
    const car = yield car_model_1.CarModel.findById(blogData.car);
    if (!car)
        throw new Error('Car not found');
    if (car.quantity < blogData.quantity) {
        throw new Error('Insufficient stock available');
    }
    // REDUCING THE CAR QUANTITY EACH TIME AN blog IS PLACED
    car.quantity -= blogData.quantity;
    // IF quantity = 0 THEN, inStock WILL BE false
    if (car.quantity === 0)
        car.inStock = false;
    yield car.save(); // SAVE CAR
    const newblog = new blog_model_1.blogModel({
        email: blogData.email,
        car: blogData.car,
        quantity: blogData.quantity,
        totalPrice: blogData.totalPrice,
    });
    yield newblog.save(); // SAVE blog
    return newblog;
});
const calculateTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    // MongoDB AGGREGATION PIPELINE
    const revenueData = yield blog_model_1.blogModel.aggregate([
        {
            $lookup: {
                from: 'cars', // REFERENCE TO 'CARS' COLLECTION
                localField: 'car', // FIELD OF THE blog COLLECTION THAT IS REFERENCING THE CAR COLLECTION
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
exports.blogService = {
    createblog,
    calculateTotalRevenue: exports.calculateTotalRevenue,
};
