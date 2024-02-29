import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import morganMiddleware from "./middleware/logger.middleware";
import appRouter from "./routes";

import CustomError from "./types/error.types";

const app = express();
dotenv.config();

// CORS configuration and headers configuration
app.use(cors());
app.use(helmet());

// middlewares
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// logger
app.use(morganMiddleware);

// Routes
app.use(appRouter);

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
