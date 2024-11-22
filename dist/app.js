"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const car_route_1 = require("./app/modules/car/car.route");
const order_route_1 = require("./app/modules/order/order.route");
const app = (0, express_1.default)();
// PARSERS
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// ROUTES
app.use('/api/cars', car_route_1.CarRoute);
app.use('/api/orders', order_route_1.OrderRoute);
app.get('/', (req, res) => {
    res.send('Welcome to Car Store api server!');
});
exports.default = app;
