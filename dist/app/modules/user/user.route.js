"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("./user.controllers");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidations.CreateUserValidationSchema), user_controllers_1.UserControllers.createUser);
router.post('/login', (0, validateRequest_1.default)(user_validation_1.UserValidations.loginValidationSchema), user_controllers_1.UserControllers.signInUser);
router.post('/refresh-token', (0, validateRequest_1.default)(user_validation_1.UserValidations.refreshTokenValidationSchema), user_controllers_1.UserControllers.refreshToken);
// ADMIN
router.patch('/:id/block', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controllers_1.UserControllers.blockAUser);
exports.UserRoutes = router;
