"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    car: { type: mongoose_1.Types.ObjectId, ref: 'Car', required: true }, // REFERENCE TO THE CAR COLLECTION
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 }, // TOTAL PRICE = price * quantity
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
