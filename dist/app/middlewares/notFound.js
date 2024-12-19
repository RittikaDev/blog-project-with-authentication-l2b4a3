"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notFound = (req, res) => {
    const message = 'Route Not Found';
    res.status(http_status_codes_1.default.NOT_FOUND).json({
        success: false,
        statusCode: http_status_codes_1.default.NOT_FOUND,
        message,
    });
};
exports.default = notFound;
