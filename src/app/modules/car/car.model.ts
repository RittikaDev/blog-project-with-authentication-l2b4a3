import { Schema, model } from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new Schema<ICar>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  {
    timestamps: true, // TO AUTOMATICALLY CREATE createdAt AND updatedAt FIELDS
    versionKey: false, // Exclude __v field
  },
);

export const CarModel = model<ICar>('Car', carSchema);
