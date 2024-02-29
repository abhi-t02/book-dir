import { Router } from "express";

import userRouter from "./user.route";
import bookRouter from "./book.route";

const router = Router();
const baseUrl = `/api/v1`;

router.use(`${baseUrl}/users`, userRouter);
router.use(`${baseUrl}/books`, bookRouter);

export default router;
