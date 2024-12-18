/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model, CallbackError } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const UserSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      require: [true, 'name must be required'],
    },
    email: {
      type: String,
      require: [true, 'Email must be required'],
      unique: true,
    },
    password: {
      type: String,
      require: [true, 'password must be required'],
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Exclude __v field
  },
);

UserSchema.pre('save', async function (next) {
  const user = this as TUser;

  if (user?.password && typeof user.password === 'string') {
    try {
      const hashedPassword = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_round),
      );
      user.password = hashedPassword;
    } catch (err) {
      return next(err as CallbackError);
    }
  }

  // user?.password = await bcrypt.hash(
  //   user?.password,
  //   Number(config.BCRYPT_SALT_ROUNDS),
  // );
  next();
});

UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

UserSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', UserSchema);
