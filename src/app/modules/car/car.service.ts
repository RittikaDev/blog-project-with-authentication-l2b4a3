import { carValidationSchema } from './car.validation';
import { ICar } from './car.interface';
import { CarModel } from './car.model';
import { z } from 'zod';

const createCarIntoDB = async (car: ICar) => {
  const result = await CarModel.create(car);
  return result;
};

const getAllCarsFromDB = async (searchTerm: string) => {
  const query = searchTerm
    ? {
        $or: [
          { brand: { $regex: searchTerm, $options: 'i' } },
          { model: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ],
      }
    : {};

  const result = await CarModel.find(query);
  return result;
};

const getSingleCarFromDB = async (id: string) => {
  const result = await CarModel.findOne({ _id: id }); // SEARCHING BY THE MONGODB _ID
  // console.log(result);
  return result;
};

const updateACarIntoDB = async (
  carId: string,
  updateCarData: Partial<ICar>,
) => {
  const parsedCarData = carValidationSchema.partial().parse(updateCarData);

  // Update the car in the database
  const result = await CarModel.findByIdAndUpdate(
    { _id: carId },
    parsedCarData,
    { new: true, runValidators: true },
  );
  return result;
};

const deleteACarFromDB = async (id: string) => {
  const result = await CarModel.deleteOne({ _id: id });
  return result;
};

export const CarService = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateACarIntoDB,
  deleteACarFromDB,
};
