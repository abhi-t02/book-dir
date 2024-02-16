import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import morganMiddleware from "./middleware/logger.middleware";
import { bookRouter, userRouter } from "./routes";

import CustomError from "./types/error.types";

const app = express();

// CORS configuration
app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(morganMiddleware);

// Routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// error handler
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res
      .status(err.status || 500)
      .json({ error: err.message, stack: err.stack });
  }
  next();
});

export default app;
