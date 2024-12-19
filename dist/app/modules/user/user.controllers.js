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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_services_1 = require("./user.services");
const config_1 = __importDefault(require("../../config"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const user = yield user_services_1.userServices.createUserIntoDB(userData);
    const responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User registered successfully',
        statusCode: http_status_codes_1.default.CREATED,
        data: responseData,
    });
}));
// login user
const signInUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.userSignIntoDB(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Login successful',
        data: {
            token: `${accessToken}`,
        },
    });
}));
// refresh Token
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_services_1.userServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Access token retrived successfully',
        data: result,
    });
}));
// ADMIN PARTS
const blockAUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req);
    const { id } = req.params;
    yield user_services_1.userServices.blockUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User blocked successfully',
    });
}));
exports.UserControllers = {
    createUser,
    signInUser,
    refreshToken,
    blockAUser,
};
