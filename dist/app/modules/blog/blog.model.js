"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false, // Exclude __v field
});
exports.BlogModel = (0, mongoose_1.model)('blog', blogSchema);
