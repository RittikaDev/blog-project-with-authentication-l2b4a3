"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router.get('/', blog_controller_1.blogController.getAllBlogs);
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(blog_validation_1.BlogValidationSchema.CreateblogValidationSchema), blog_controller_1.blogController.createblog);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(blog_validation_1.BlogValidationSchema.updateblogValidationSchema), blog_controller_1.blogController.updateBlog);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(blog_validation_1.BlogValidationSchema.updateblogValidationSchema), blog_controller_1.blogController.deleteABlog);
router.delete('/blogs/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(blog_validation_1.BlogValidationSchema.updateblogValidationSchema), blog_controller_1.blogController.deleteABlog);
exports.blogRoute = router;
