import { Model, ObjectId, Schema, model } from "mongoose";
import { isEmail } from "validator";
import { hash } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  tokens: [{ token: string }];
  resetToken: String;
}

interface IUserMethods {
  generateAuthToken(): Promise<string>;
  generateResetToken(): Promise<string>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  getCredentialsForResetToken(
    resetToken: string,
    password: string
  ): Promise<IUser>;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (email: string) {
          return isEmail(email, {});
        },
        message: "Email validation failed.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    resetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// json data to show
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  // delete userObj.tokens;
  delete userObj.createdAt;
  delete userObj.updatedAt;

  return userObj;
};

// generating token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  // token limit check - only 2 token in same time
  if (user.tokens.length >= 2) {
    user.tokens.pop();
  }

  const token = sign({ id: user._id }, <string>process.env.JWT_KEY, {
    expiresIn: 60 * 60 * 8,
  });

  user.tokens.push({ token });
  await user.save();

  return token;
};

// generate reset token
UserSchema.methods.generateResetToken = async function () {
  const user = this;

  const resetToken = sign({ id: user._id }, <string>process.env.JWT_KEY, {
    expiresIn: 60 * 10,
  });

  user.resetToken = resetToken;
  await user.save();
  return resetToken;
};

// reseting password
UserSchema.statics.getCredentialsForResetToken = async function (
  resetToken: string,
  confirmPassword: string
) {
  const { id } = <JwtPayload>verify(resetToken, <string>process.env.JWT_KEY);

  const user = (await User.findById(id))!;

  user.password = confirmPassword;
  (user as any).tokens = [];
  user.resetToken = "";
  await user.save();
  return user;
};

// Hashing password before saving to db
UserSchema.pre("save", async function (next) {
  try {
    const user = this;

    if (user.isModified("password")) {
      user.password = await hash(user.password, 10);
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
