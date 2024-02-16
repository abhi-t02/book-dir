import { Router } from "express";

import {
  addBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../controller/book.controller";

const router = Router();

router.route("/").get(getAllBooks).post(addBook);

router
  .route("/:id")
  .get(getBookById)
  .delete(deleteBookById)
  .patch(updateBookById);

export default router;
