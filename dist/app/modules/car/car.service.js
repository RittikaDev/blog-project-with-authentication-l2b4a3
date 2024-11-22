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
exports.CarService = void 0;
const car_validation_1 = require("./car.validation");
const car_model_1 = require("./car.model");
const createCarIntoDB = (car) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.create(car);
    return result;
});
const getAllCarsFromDB = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const query = searchTerm
        ? {
            $or: [
                { brand: { $regex: searchTerm, $options: 'i' } },
                { model: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
            ],
        }
        : {};
    const result = yield car_model_1.CarModel.find(query);
    return result;
});
const getSingleCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.findOne({ _id: id }); // SEARCHING BY THE MONGODB _ID
    // console.log(result);
    return result;
});
const updateACarIntoDB = (carId, updateCarData) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedCarData = car_validation_1.carValidationSchema.partial().parse(updateCarData);
    // Update the car in the database
    const result = yield car_model_1.CarModel.findByIdAndUpdate({ _id: carId }, parsedCarData, { new: true, runValidators: true });
    return result;
});
const deleteACarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.deleteOne({ _id: id });
    return result;
});
exports.CarService = {
    createCarIntoDB,
    getAllCarsFromDB,
    getSingleCarFromDB,
    updateACarIntoDB,
    deleteACarFromDB,
};
