import { NextFunction, RequestHandler, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { authRequest } from "../types/request.type";
import User from "../models/user.model";

interface jwtPayLoad extends JwtPayload {
  id: string;
}

export const authToken = async function (
  req: authRequest,
  _: Response,
  next: NextFunction
) {
  try {
    let isValidToken = false;
    const token = req.header("Authorization")?.replace("Bearer", "").trim()!;
    if (!token) {
      throw new Error("Token Required.");
    }
    const { id } = <jwtPayLoad>verify(token, <string>process.env.JWT_KEY);

    const user = await User.findById(id);

    if (!user) {
      throw new Error("No user exists.");
    }

    user?.tokens.forEach((tokenData) => {
      if (tokenData.token === token) {
        isValidToken = true;
      }
    });

    if (!isValidToken) {
      throw new Error("Token expired.");
    }

    req.id = id;
    next();
  } catch (err) {
    next(err);
  }
};
