import { NextFunction, Request, Response } from "express";
import Book from "../models/book.model";

const genreOptions = [
  "Action",
  "Fiction",
  "Comedy",
  "Adventure",
  "Education",
  "Romance",
];

/**
 *
 * @param req none
 * @param res books []
 * @param next error
 * @description To get all books
 *
 * @todo ADD sorting feature
 */
export async function getAllBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number.parseInt(<string>req.query.page) - 1 || 0;
    const limit = Number.parseInt(<string>req.query.limit) || 5;
    const search = req.query.search || "";
    const sort = <string>req.query.sort || "title";
    const sortBy = req.query.sortBy || "asc";
    let genre: string | string[] = <string>req.query.genre || "All";
    const sortOpt: any = {};

    sortOpt[sort] = sortBy;
    genre = genre === "All" ? [...genreOptions] : genre.split(",");

    const books = await Book.find({ title: { $regex: search, $options: "i" } })
      .where("genre")
      .in([...genre])
      .sort(sortOpt)
      .skip(page * limit)
      .limit(limit);

    const total = await Book.countDocuments({
      genre: { $in: [...genre] },
      title: { $regex: search, $options: "i" },
    });

    res.json({
      total,
      page: page + 1,
      limit,
      genres: genreOptions,
      books,
    });
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

/**
 *
 * @param req params: id
 * @param res book object
 * @param next error 500
 * @description To get single book by params id
 */
export async function getBookById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new Error("No book found");
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req params id
 * @param res No Content
 * @param next error
 * @description To delete book by id
 * @async
 * @param id
 */
export async function deleteBookById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await Book.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @description To update book model
 * @async
 */
export async function updateBookById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateAllowed = ["author", "title", "genre", "publicationYear"];
  const updateBody = Object.keys(req.body);

  const isUpdateAllowed = updateBody.every((update) =>
    updateAllowed.includes(update)
  );
  try {
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for following fields.");
    }

    const book = await Book.findById(req.params.id)!;
    if (!book) {
      throw new Error("No Book Found.");
    }

    updateBody.forEach((update) => {
      (book as any)[update] = req.body[update];
    });

    await book?.save();

    res.json(book);
  } catch (err) {
    next(err);
  }
}
