import { Router } from "express";

import {
  addBook,
  getAllBooks,
  getBookById,
} from "../controller/book.controller";

const router = Router();

router.route("/").get(getAllBooks).post(addBook);

router.route("/:id").get(getBookById);

export default router;
