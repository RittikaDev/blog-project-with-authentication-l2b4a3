import { Request, Response } from 'express';

import { orderValidationSchema } from './order.validation';
import { OrderService } from './order.service';

import { z } from 'zod';

const createOrder = async (req: Request, res: Response) => {
  try {
    // VALIDATION USING ZOD
    const zodOrderData = orderValidationSchema.parse(req.body);

    const order = await OrderService.createOrder(zodOrderData);

    res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: order,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const errorMsg = err.errors.map((error) => ({
        path: error.path.join('.'),
        errorMessage: error.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMsg,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the order',
        error: (err as Error).message || 'Unknown error',
      });
    }
  }
};

const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await OrderService.calculateTotalRevenue();

    // console.log(totalRevenue);

    if (totalRevenue === 0) {
      res.status(200).json({
        success: true,
        message: 'Revenue is 0, no sales recorded.',
        data: {
          totalRevenue: totalRevenue,
        },
      });
    } else
      res.status(200).json({
        success: true,
        message: 'Revenue calculated successfully',
        data: {
          totalRevenue: totalRevenue,
        },
      });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const errorMsg = err.errors.map((error) => ({
        path: error.path.join('.'),
        errorMessage: error.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMsg,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred while calculating the total revenue',
        error: (err as Error).message || 'Unknown error',
      });
    }
  }
};

export const OrderController = {
  createOrder,
  getRevenue,
};
