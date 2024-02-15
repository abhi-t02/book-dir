import { NextFunction, Request, Response } from "express";
import { compare } from "bcrypt";

import { authRequest } from "../types/request.type";
import User, { IUser } from "../models/user.model";

/**
 *
 * @param req authRequest contains id
 * @param res response
 * @param next for error handling and middleware
 * For getting User Profile
 */
export async function getUserProfile(
  req: authRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findOne({ _id: req.id });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req username, email, password
 * @param res userInfo, token
 * @param next error
 */
export async function userSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password } = req.body;
    const user = await new User({
      username,
      email,
      password,
    }).save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req email, password
 * @param res token
 * @param next error
 */
export async function userLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User does not exists.");
    }

    if (!(await compare(password, user.password))) {
      throw new Error("User credential are wrong.");
    }

    const token = await user.generateAuthToken();

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req username, email
 * @param res updated userinfo
 * @param next error
 */
export async function userProfileUpdate(
  req: authRequest,
  res: Response,
  next: NextFunction
) {
  const allowedUpdate = ["email", "username"];
  const bodyData: string[] = Object.keys(req.body);
  const isValidUpdate = bodyData.every((update) =>
    allowedUpdate.includes(update)
  );
  try {
    if (!isValidUpdate) {
      throw new Error("Update is not allowed.");
    }
    const user = (await User.findById(req.id))!;
    bodyData.forEach((data) => {
      (user as any)[data] = <IUser>req.body[data];
    });
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req id
 * @param res ok
 * @param next error
 */
export async function userLogOut(
  req: authRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authtoken = req
      .header("Authorization")
      ?.replace("Bearer", "")
      .trim()!;
    const user = (await User.findById(req.id))!;
    (user as any).tokens = user.tokens.filter((token) => {
      return token.token !== authtoken;
    });
    await user.save();
    res.send();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req token
 * @param res ok
 * @param next error
 */
export async function userLogoutAll(
  req: authRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (await User.findOne({ _id: req.id }))!;
    (user as any).tokens = [];
    await user?.save();
    res.send();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req token
 * @param res No Content
 * @param next error
 */
export async function getDeleteUserProfile(
  req: authRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await User.deleteOne({ _id: req.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req email
 * @param res ok
 * @param next error
 *
 * @description sending reset passwrod link into user emails
 */
export async function resetUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User Email does not exists.");
    }

    // send email
    const resetToken = await user.generateResetToken();
    res.send({ resetToken });
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req resetToken, password
 * @param res ok
 * @param next error
 */
export async function resetUserPasswordConfirmation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { resetToken, confirmPassword } = req.body;

    const user = await User.getCredentialsForResetToken(
      resetToken,
      confirmPassword
    );
    res.send();
  } catch (err) {
    next(err);
  }
}
