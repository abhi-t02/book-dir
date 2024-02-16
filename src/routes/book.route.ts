import { Router } from "express";

import { addBook, getAllBooks } from "../controller/book.controller";

const router = Router();

router.route("/").get(getAllBooks).post(addBook);

export default router;
