/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import httpStatus from 'http-status-codes';

import { TUser, TUserAuth } from './user.interface';
import { User } from './user.model';

import AppError from '../../errors/AppError';
import config from '../../config';
import { createToken, verifyToken } from './userAuth.utils';

// eslint-disable-next-line no-undef
export interface IUserDocument extends TUser, Document {}
const createUserIntoDB = async (payload: TUser) => {
  const isUserExits = await User.findOne({ email: payload.email });
  if (isUserExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'User with this email id exists');
  }

  try {
    const userData: Partial<TUser> = payload;

    userData.password = payload.password || (config.default_password as string);

    const newUser = await User.create(userData);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a new user');
    }

    return newUser;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a user');
  }
};

//user Login

const userSignIntoDB = async (payload: TUserAuth) => {
  const user = await User.isUserExistByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not registered');
  }

  if (typeof payload.password !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide a password');
  }

  if (
    !(await User.isPasswordMatched(payload.password, user?.password as string))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  // SENT USER DATA WITHOUT PASSWORD
  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail, iat } = decoded;

  const user = await User.isUserExistByEmail(userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user is not register');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const userServices = {
  createUserIntoDB,
  userSignIntoDB,
  refreshToken,
};
