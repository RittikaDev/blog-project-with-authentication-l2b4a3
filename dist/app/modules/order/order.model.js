"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogModel = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    car: { type: mongoose_1.Types.ObjectId, ref: 'Car', required: true }, // REFERENCE TO THE CAR COLLECTION
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 }, // TOTAL PRICE = price * quantity
}, {
    timestamps: true,
    versionKey: false, // Exclude __v field
});
exports.blogModel = (0, mongoose_1.model)('blog', blogSchema);
