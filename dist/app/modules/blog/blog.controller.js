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
exports.blogController = void 0;
// import { blogValidationSchema } from './blog.validation';
const blog_service_1 = require("./blog.service");
// import { z } from 'zod';
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const createblog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.user;
    // console.log(author);
    const blogData = req.body;
    if (!author || !author.userEmail) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User information is missing.');
    }
    const user = yield user_model_1.User.findOne({ email: author.userEmail });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found.');
    }
    // console.log(user);
    const blogPayload = {
        title: blogData.title,
        content: blogData.content,
        author: user._id,
        isPublished: true,
    };
    // Check if the title and content are provided
    if (!blogData.title || !blogData.content) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Title and content are required.');
    }
    const result = yield blog_service_1.BlogService.createBlogIntoDB(blogPayload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Blog created successfully',
        data: result,
    });
}));
const updateBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const userFromToken = req.user;
    if (!userFromToken || !userFromToken.userEmail) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User information is missing.');
    }
    const user = yield user_model_1.User.findOne({ email: userFromToken.userEmail });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found.');
    // console.log(user);
    const toUpdateBlog = Object.assign(Object.assign({}, updateData), { author: user._id });
    const result = yield blog_service_1.BlogService.updateBlogIntoDB(id, toUpdateBlog);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.NOT_FOUND,
            success: false,
            message: 'No Data Found',
            data: [],
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Blog updated successfully',
        data: result,
    });
}));
const deleteABlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // console.log(req.params);
    const requestedUser = req.user;
    if (!requestedUser || !requestedUser.userEmail) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User information is missing.');
    }
    const user = yield user_model_1.User.findOne({ email: requestedUser.userEmail });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found.');
    const result = yield blog_service_1.BlogService.deleteABlogFromDB(id, user._id, user.role);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.NOT_FOUND,
            success: false,
            message: 'No Data Found',
            data: [],
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Blog deleted successfully',
        statusCode: 200,
    });
}));
const getAllBlogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getAllBlogs(req.query);
    if (result.length > 0)
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: 'Blogs fetched successfully',
            data: result,
        });
    else
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: 'No blogs found',
            data: [],
        });
}));
exports.blogController = {
    createblog,
    updateBlog,
    deleteABlog,
    getAllBlogs,
};
