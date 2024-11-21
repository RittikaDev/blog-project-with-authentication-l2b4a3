import { Schema, Types, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    email: { type: String, required: true },
    car: { type: Types.ObjectId, ref: 'Car', required: true }, // REFERENCE TO THE CAR COLLECTION
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 }, // TOTAL PRICE = price * quantity
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>('Order', orderSchema);
