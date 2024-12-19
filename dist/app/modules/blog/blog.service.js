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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_model_1 = require("./blog.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("../user/user.constant");
const createBlogIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.BlogModel.create(payload);
    const populatedBlog = yield blog_model_1.BlogModel.findById(blog._id)
        .populate('author', ' -createdAt -updatedAt')
        .select('-isPublished -createdAt -updatedAt');
    return populatedBlog;
});
const updateBlogIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { author } = payload, remainingServiceData = __rest(payload, ["author"]);
    // console.log(payload);
    const isBlogExists = yield blog_model_1.BlogModel.findById(id);
    if (!isBlogExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This blog is not found');
    }
    // console.log(isBlogExists.author, author);
    if (isBlogExists.author !== author)
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to update this blog');
    const modifiedUpdateData = Object.assign({}, remainingServiceData);
    const result = yield blog_model_1.BlogModel.findByIdAndUpdate(id, modifiedUpdateData, {
        new: true,
        runValidators: true,
    })
        .populate('author', ' -createdAt -updatedAt')
        .select('-isPublished -createdAt -updatedAt');
    return result;
});
const deleteABlogFromDB = (id, userID, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogExists = yield blog_model_1.BlogModel.findById(id);
    if (!isBlogExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This blog is not found');
    }
    if (userRole == user_constant_1.USER_ROLE.user && isBlogExists.author !== userID)
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to delete this blog');
    const result = yield blog_model_1.BlogModel.deleteOne({ _id: id });
    return result;
});
const getAllBlogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(blog_model_1.BlogModel.find()
        .populate('author', '-__v -createdAt -updatedAt')
        .select('-isPublished -createdAt -updatedAt'), query);
    const blogQuery = queryBuilder
        .search(['title', 'content'])
        .filter()
        .sort()
        .paginate();
    const result = yield blogQuery.modelQuery;
    return result;
});
exports.BlogService = {
    createBlogIntoDB,
    updateBlogIntoDB,
    deleteABlogFromDB,
    getAllBlogs,
};
