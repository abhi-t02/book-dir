import { NextFunction, Request, Response } from "express";
import Book from "../models/book.model";

/**
 *
 * @param req none
 * @param res books []
 * @param next error
 * @description To get all books
 */
export async function getAllBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req title, author, genre, publicationYear
 * @param res book
 * @param next error
 * @description To create new Book
 */
export async function addBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, author, genre, publicationYear } = req.body;

    const book = new Book({
      title,
      author,
      genre,
      publicationYear,
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}
