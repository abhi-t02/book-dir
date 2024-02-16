import { Model, ObjectId, Schema, model } from "mongoose";

// Book model property
interface IBook {
  _id: ObjectId;
  title: string;
  author: string;
  genre: string;
  publicationYear: Date;
}

// For Book model methods
interface IBookMethods {}

interface BookModel extends Model<IBook, {}, IBookMethods> {}

const BookSchema = new Schema<IBook, BookModel, IBookMethods>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  publicationYear: {
    type: Date,
    required: true,
  },
});

BookSchema.methods.toJSON = function () {
  const book = this;
  const bookObj = book.toObject();

  return bookObj;
};

const Book = model<IBook, BookModel>("Book", BookSchema);

export default Book;
